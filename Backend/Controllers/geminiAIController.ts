import { AppDataSource } from './../db/dataSource';
import { Response } from 'express';
import asyncHandler from "../Utils/Helpers/asyncHandler";
import { JobRequest } from '../Utils/Types/Job';
import { JobSeeker } from '../Models/JobSeeker';
import { JobSeekerSkill } from '../Models/JobSeekerSkill';
import { Recruiter } from '../Models/Recruiter';
import { Application } from '../Models/Application';
import { SkillsRequest } from '../Utils/Types/SkillsRequest';
import { In } from 'typeorm';
import { Job } from '../Models/Job';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Fetching the user's skills
export const getUserSkills = asyncHandler(async (req: JobRequest, res: Response) => {
  try {
    // Get the logged-in user's ID from the JWT
    const userId = req.user?.user_id;  // Assuming user ID is in the JWT token

    // Fetch the JobSeeker record for this user
    const jobSeeker = await AppDataSource.getRepository(JobSeeker)
      .createQueryBuilder('jobSeeker')
      .leftJoinAndSelect('jobSeeker.skills', 'jobSeekerSkill') // Join the JobSeekerSkill table
      .leftJoinAndSelect('jobSeekerSkill.skill', 'skill') // Join the Skill table
      .where('jobSeeker.user_id = :userId', { userId })
      .getOne();

    if (!jobSeeker) {
      res.status(404).json({ message: 'Job seeker not found.' });
      return
    }

    // Extract skills from the jobSeekerSkills association
    const skills = jobSeeker.skills.map((jobSeekerSkill: JobSeekerSkill) => {
      return {
        skillId: jobSeekerSkill.skill.skill_id,
        skillName: jobSeekerSkill.skill.name,
        experienceLevel: jobSeekerSkill.experience_level,
        yearsExperience: jobSeekerSkill.years_experience,
        lastUsed: jobSeekerSkill.last_used,
        aiCertified: jobSeekerSkill.ai_certified,
        projectsCount: jobSeekerSkill.projects_count
      };
    });

    // Respond with the user's skills
    res.status(200).json({ skills });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: 'An error occurred while fetching the user skills.' });
  }
});

export const getSkillsAndMatch = asyncHandler(async (req, res) => {
  const { user, jobs } = req.body;

  // 1. Guard against missing inputs
  if (!user || !jobs) {
    return res.status(400).json({ error: 'Missing user or jobs payload' });
  }

  try {
    // 2. Build the prompt
    const prompt = `
  You are an intelligent job assistant. Based on the user profile and available jobs, perform two tasks:
  
  1. Analyze and return the top 5 job matches with a matchPercentage (0-100) appended to each.
  2. Generate skill gap radar chart data. Use these 5 skill labels: JavaScript, Angular, Node.js, Cloud, Communication.
     Format output like:
     {
       recommendedJobs: [...],
       skillGapChartData: {
         labels: [...],
         datasets: [
           { label: "Your Skills", data: [...] },
           { label: "Job Market Demand", data: [...] }
         ]
       }
     }
  
  User Profile:
  ${JSON.stringify(user, null, 2)}
  
  Available Jobs:
  ${JSON.stringify(jobs, null, 2)}
  `;

    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Log raw AI response
    console.log('🔥 Raw AI response:', text);

    // 5. Extract JSON between the first '{' and the last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end < 0) {
      throw new Error('No JSON object found in AI response');
    }
    const jsonString = text.slice(start, end + 1);

    // 6. Log extracted JSON
    console.log('🎯 Extracted JSON:', jsonString);

    // 7. Parse with its own try/catch
    let payload: any;
    try {
      payload = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('JSON Parsing Error:', parseErr);
      throw new Error('Invalid JSON from AI');
    }

    // 8. Return the valid payload
    return res.status(200).json(payload);

  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: 'Failed to generate AI-based match and chart' });
  }
});


export const recruiterDashBoardComponents = asyncHandler(async (req: SkillsRequest, res: Response) => {
  if (!req.user) {
    res.status(404).json("No User")
    return
  }

  const recruiterRepo = AppDataSource.getRepository(Recruiter);
  const applicationRepo = AppDataSource.getRepository(Application);

  // Find the recruiter with its user and company relations
  const recruiter = await recruiterRepo.findOne({
    where: { user: { user_id: req.user?.user_id } },
    relations: ['user', 'company', 'jobs',],
  });

  //Find Applications for the Recruiter
  // 2. Extract job IDs

  // 2. Extract IDs, defaulting to []
  const jobIds: number[] = recruiter?.jobs?.map(j => j.job_id) || [];

  // 3. If no jobs, short‑circuit
  if (jobIds.length === 0) {
    return [];  // or return no applications
  }

  // 4. Now In(...) always gets a number[]
  const applications = await applicationRepo.find({
    where: {
      job: {
        job_id: In(jobIds)
      }
    },
    relations: ['job', 'jobSeeker'] // whatever you need
  });

  if (!recruiter) {
    return res.status(404).json({ message: 'Recruiter not found' });
  }

  // Return the recruiter object directly (it already has the shape you showed)
  try {
    // Build data object from your query results
    const dashboardInputData = {
      recruiter,
      applications,
    };

    const prompt = `
You are an AI assistant helping analyze a recruiter's performance data for their dashboard.

Below is a JSON object containing real recruiter data including profile, job postings, and job applications. You must analyze this exact data — do not make up or mock anything.For the chart values use prediction analysis

\`\`\`json
${JSON.stringify(dashboardInputData, null, 2)}
\`\`\`

Now generate a structured JSON response with insights using this structure:

{
  "postedJobsProgress": number,                  
  "candidateTrend": number,                      
  "offerAcceptanceRate": number,                 
  "averageHireTime": number,                     
  "predictedHires": number,                      

  "candidateMatchData": {
    "labels": [month names],
    "datasets": [{
      "label": "Candidate Matches",
      "data": [numeric values],
      "backgroundColor": "rgba(35, 137, 218, 0.5)"
    }]
  },

  "hiringTrendsData": {
    "labels": [year values],
    "datasets": [{
      "label": "Hiring Trends",
      "data": [numeric values],
      "borderColor": "#ff5f6d",
      "fill": false
    }]
  },

  "topCandidateSkills": [string skills],

  "recruiter": {
    "name": string,
    "firstname": string,
    "lastname": string,
    "company": string,
    "avatar": string,
    "verified": boolean,
    "rating": number,
    "hires": number
  },

  "activeJobs": [{
    "id": number,
    "title": string,
    "description": string,
    "deadline": string,
    "completion": number,
    "status": string
  }]

    "JobApplications": [{
    "job_id": number,
    "candidate": {
      "name": string,
    },
    "jobTitle": string,
    "matchScore": number,
  }],
}

Use only the data provided above. Return a pure JSON response only — no extra text or explanations.
`;


    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Log raw AI response
    console.log('🔥 Raw AI response:', text);

    // 5. Extract JSON between the first '{' and the last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end < 0) {
      throw new Error('No JSON object found in AI response');
    }
    const jsonString = text.slice(start, end + 1);

    // 6. Log extracted JSON
    console.log('🎯 Extracted JSON:', jsonString);

    // 7. Parse with its own try/catch
    let payload: any;
    try {
      payload = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('JSON Parsing Error:', parseErr);
      throw new Error('Invalid JSON from AI');
    }

    // 8. Return the valid payload
    return res.status(200).json(payload);

  } catch (error) {
    console.error('Gemini Error:', error);
    return res.status(500).json({ error: 'Failed to generate AI-based match and chart' });
  }

})

export const adminDashBoardComponents = asyncHandler(async (req, res, next) => {
  try {
    // Get the repository for the Job entity
    const jobRepository = AppDataSource.getRepository(Job);

    // Fetch all jobs using TypeORM's find method
    const jobs = await jobRepository.find({
      relations: ['applications']
    });

    const jobsJson = JSON.stringify(jobs);

    const prompt = `
Analyze this jobs data comprehensively and generate four key analytics reports:

1. **Application Trends**:
- Weekly application patterns over the last month
- Predict next week's applications based on historical patterns

2. **Skill Demand Analysis**:
- Identify top 5 most demanded skills
- Calculate relative demand percentage for each skill

3. **Salary Distribution**:
- Categorize jobs into salary buckets: 
  - $80k-100k
  - $100k-120k 
  - $120k-150k
  - 150k+
- Count jobs in each category

4. **Anomaly Detection**:
- Identify jobs with abnormal application counts
- Calculate deviation from expected range
- Flag salary outliers


Input Data: ${jobsJson}  

Output JSON format:
{{
  "trends": {{
    "labels": ["Week 1", "Week 2", "Week 3", "Week 4", "Next Week"],
    "actual": [number, number, number, number],
    "predicted": [number, number, number, number, number]
  }},
  "skills": [
    {{ "name": "Skill 1", "demand": percentage }},
    {{ "name": "Skill 2", "demand": percentage }},
    ...
  ],
  "salaries": {{
    "80k-100k": count,
    "100k-120k": count,
    "120k-150k": count,
    "150k+": count
  }},
  "anomalies": [
    {{
      "job_id": number,
      "title": string,
      "type": "applications"|"salary",
      "expected": number,
      "actual": number,
      "deviation": percentage
    }},
    ...
  ]
}}

Guidelines:
- Use average salary ((min+max)/2) for salary categorization
- Consider 1.5x IQR as anomaly threshold
- Calculate demand percentages relative to total jobs
- Predict trends using linear regression
- Keep decimal precision at 2 places
`
 // 3. Call Gemini
 const result = await model.generateContent(prompt);
 const response = await result.response;
 const text = response.text();

 // 4. Log raw AI response
 console.log('🔥 Raw AI response:', text);

 // 5. Extract JSON between the first '{' and the last '}'
 const start = text.indexOf('{');
 const end = text.lastIndexOf('}');
 if (start < 0 || end < 0) {
   throw new Error('No JSON object found in AI response');
 }
 const jsonString = text.slice(start, end + 1);

 // 6. Log extracted JSON
 console.log('🎯 Extracted JSON:', jsonString);

 // 7. Parse with its own try/catch
 let payload: any;
 try {
   payload = JSON.parse(jsonString);
 } catch (parseErr) {
   console.error('JSON Parsing Error:', parseErr);
   throw new Error('Invalid JSON from AI');
 }

 // 8. Return the valid payload
 return res.status(200).json(payload);

} catch (error) {
 console.error('Gemini Error:', error);
 return res.status(500).json({ error: 'Failed to generate AI-based match and chart' });
}})