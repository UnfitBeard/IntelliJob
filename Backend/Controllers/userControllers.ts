import express, { NextFunction, Request, Response } from 'express'
import pool from '../db/db.config';
import asyncHandler from '../Utils/Helpers/asyncHandler';
import { AppDataSource } from '../db/dataSource';
import { JobSeeker } from '../Models/JobSeeker';
import { JobSeekerSkill } from '../Models/JobSeekerSkill';
import { Project } from '../Models/Project';
import { Skill } from '../Models/Skill';
import { Recruiter } from '../Models/Recruiter';
import { Company } from '../Models/Company';
import { User } from '../Models/User';
import { SkillsRequest } from '../Utils/Types/SkillsRequest';
import { profile } from 'console';
import { UserRequest } from '../Utils/Types/User';
import { Application } from '../Models/Application';
import { In } from 'typeorm';


export const editProfile = asyncHandler(async (req: SkillsRequest, res: Response, next: NextFunction) => {
  const {
    firstName,
    lastName,
    experienceLevel,
    telephone,
    skills, // [{ skill: "Angular", experience: "Intermediate" }, ...]
    projects, // [{ projectName, projectDescription, projectLink, projectDate }, ...]
  } = req.body;

  const phone = req.body.phone || telephone;
  const linkedinUrl = req.body.linkedin || req.body.linkedinUrl;
  const bio = req.body.description || req.body.bio;
  const location = req.body.address?.location || req.body.location;
  const postalAddress = req.body.address?.postalAddress || req.body.postalAddress;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    // Insert or update JobSeeker
    let jobSeeker = await queryRunner.manager.findOne(JobSeeker, {
      where: { user: { user_id: req.user?.user_id } },
    });

    if (!jobSeeker) {
      jobSeeker = new JobSeeker();
      jobSeeker.phone = phone;
    }

    jobSeeker.first_name = firstName;
    jobSeeker.last_name = lastName;
    jobSeeker.location = location;
    jobSeeker.bio = bio?.slice(0, 1000); // Limit bio length
    jobSeeker.linkedin_url = linkedinUrl;
    jobSeeker.experience_level = experienceLevel;
    jobSeeker.postal_address = postalAddress;

    await queryRunner.manager.save(jobSeeker);

    // Handle skills
    for (const skill of skills || []) {
      const skillName = skill.skill;
      const experienceLevel = skill.experience;

      // Query the skill by name to get the correct skill_id
      let existingSkill = await queryRunner.manager.findOne(Skill, {
        where: { name: skillName },  // Find skill by name
      });

      if (!existingSkill) {
        // If the skill doesn't exist, create it
        existingSkill = new Skill();
        existingSkill.name = skillName;
        await queryRunner.manager.save(existingSkill);
      }

      // Now you can use existingSkill.skill_id as the correct skill ID
      const skillId = existingSkill.skill_id;

      // Check if JobSeekerSkill relationship already exists
      let jobSeekerSkill = await queryRunner.manager.findOne(JobSeekerSkill, {
        where: {
          job_seeker_id: jobSeeker.job_seeker_id,
          skill_id: skillId,
        },
      });

      if (!jobSeekerSkill) {
        // If no relationship exists, create one
        jobSeekerSkill = new JobSeekerSkill();
        jobSeekerSkill.job_seeker_id = jobSeeker.job_seeker_id;
        jobSeekerSkill.skill_id = skillId;
      }

      // Update the experience level for the skill
      jobSeekerSkill.experience_level = experienceLevel;
      await queryRunner.manager.save(jobSeekerSkill);
    }


    // Handle projects
    for (const project of projects || []) {
      const title = project.projectName;
      const description = project.projectDescription;
      const projectUrl = project.projectLink;
      const endDate = project.projectDate;

      let existingProject = await queryRunner.manager.findOne(Project, {
        where: {
          jobSeeker,
          title,
        },
      });

      if (!existingProject) {
        existingProject = new Project();
        existingProject.jobSeeker = jobSeeker;
        existingProject.title = title;
      }

      existingProject.description = description;
      existingProject.project_url = projectUrl;
      existingProject.end_date = endDate;

      await queryRunner.manager.save(existingProject);
    }

    await queryRunner.commitTransaction();
    res.status(201).json({ message: 'Profile updated successfully' });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  } finally {
    await queryRunner.release();
  }
});


export const editRecruiterProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    firstname,
    lastname,
    position,
    telephone,
    avatar,
    verified,
    rating,
    hires,
    hiring_volume,
    average_time_to_hire,
    specialization,
    user_id,
    company_id
  } = req.body;

  try {
    // Retrieve the recruiter repository
    const recruiterRepository = AppDataSource.getRepository(Recruiter);
    const userRepository = AppDataSource.getRepository(User);
    const companyRepository = AppDataSource.getRepository(Company);

    // Fetch the User and Company entities based on their IDs
    const user = await userRepository.findOne({ where: { user_id } });
    const company = await companyRepository.findOne({ where: { company_id } });

    if (!user || !company) {
      return res.status(400).json({
        message: 'User or Company not found'
      });
    }

    // Check if recruiter already exists by their recruiter_id
    let recruiter = await recruiterRepository.findOne({
      where: { recruiter_id: req.body.id } // Assuming `id` is the recruiter_id from the request
    });

    if (!recruiter) {
      // Create a new recruiter if it doesn't exist
      recruiter = new Recruiter();
    }

    // Set or update the recruiter details
    recruiter.user = user; // Set the User relation
    recruiter.company = company; // Set the Company relation
    recruiter.firstname = firstname;
    recruiter.lastname = lastname;
    recruiter.position = position;
    recruiter.phone = telephone;
    recruiter.avatar = avatar;
    recruiter.verified = verified;
    recruiter.rating = rating;
    recruiter.hires = hires;
    recruiter.hiring_volume = hiring_volume;
    recruiter.average_time_to_hire = average_time_to_hire;
    recruiter.specialization = specialization;

    // Save the recruiter (inserts or updates)
    const savedRecruiter = await recruiterRepository.save(recruiter);

    res.status(200).json({
      message: 'Recruiter upserted successfully',
      recruiter: savedRecruiter
    });

  } catch (err) {
    console.error('Error upserting recruiter:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export const getUserDataById = asyncHandler(async (req: SkillsRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id  // Get user_id from the middleware (e.g., from JWT token)

  if (!userId) {
    return res.status(400).json({ message: 'No user ID found in the request' });
  }

  try {
    // Get the user repository
    const userRepository = AppDataSource.getRepository(User);

    // Fetch the user by ID along with related JobSeeker, Projects, and Skills
    const user = await userRepository.findOne({
      where: { user_id: userId },
      relations: [
        'jobSeekers',
        'jobSeekers.skills',
        'jobSeekers.skills.skill', // 💥 this is the fix
        'jobSeekers.projects',
      ],
    });

    // If user is not found, return a 404 status
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the first job seeker (assuming there is only one job seeker per user)
    const jobSeeker = user.jobSeekers[0];

    // Format the data for Gemini API or response
    const jobSeekerData = {
      firstName: jobSeeker.first_name,
      lastName: jobSeeker.last_name,
      phone: jobSeeker.phone,
      location: jobSeeker.location,
      bio: jobSeeker.bio,
      linkedinUrl: jobSeeker.linkedin_url,
      experienceLevel: jobSeeker.experience_level,
      skills: jobSeeker.skills.map(skill => ({
        skillName: skill.skill.name,
        yearsExperience: skill.years_experience,
        aiCertified: skill.ai_certified,
      })),
      projects: jobSeeker.projects.map(project => ({
        title: project.title,
        description: project.description,
        skillsUsed: project.skills_used,
        projectUrl: project.project_url,
        role: project.role,
        teamSize: project.team_size,
        isCurrent: project.is_current,
      })),
    };

    // Return the formatted data as JSON response
    return res.json({ user: jobSeekerData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Pass error to the next middleware
    next(error);
  }
});

export const viewProfile = asyncHandler(async (req: SkillsRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id; // Assuming req.user.user_id is set by authentication middleware

  try {
    // Find the job seeker profile based on user_id
    const jobSeeker = await AppDataSource.getRepository(JobSeeker).findOne({
      where: { user: { user_id: userId } },
      relations: ['skills', 'projects'], // Load related skills and projects
    });

    if (!jobSeeker) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    // Fetch the job seeker skills with experience level
    const skills = await AppDataSource.getRepository(JobSeekerSkill)
      .createQueryBuilder('jsSkill')
      .leftJoinAndSelect('jsSkill.skill', 'skill')
      .where('jsSkill.job_seeker_id = :userId', { userId })
      .getMany();

    // Fetch the job seeker projects
    const projects = await AppDataSource.getRepository(Project)
      .find({
        where: { jobSeeker: { job_seeker_id: userId } },
      });

    // Prepare the response data
    const profileData = {
      firstName: jobSeeker.first_name,
      lastName: jobSeeker.last_name,
      bio: jobSeeker.bio,
      location: jobSeeker.location,
      linkedinUrl: jobSeeker.linkedin_url,
      experienceLevel: jobSeeker.experience_level,
      postalAddress: jobSeeker.postal_address,
      skills: jobSeeker.skills,
      projects: jobSeeker.projects,
    };

    // Return the profile data as a JSON response
    return res.status(200).json(profileData);
  } catch (error) {
    console.error('Error viewing profile:', error);
    return res.status(500).json({ message: 'Error viewing profile' });
  }
});

export const viewRecruiterProfile = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    // Parse recruiter_id from URL params
    // Get the recruiter repository
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
    res.status(200).json({
      message: 'Recruiter profile retrieved successfully',
      recruiter,
      applications
    });
  }
);

export const getAllUsers = asyncHandler(async (req: UserRequest, res: Response) => {
  const usersRepo = AppDataSource.getRepository(User);
  const allUsers = await usersRepo.find();

  console.log("Fetched users:", allUsers);

  res.status(200).json({ message: "All Users", allUsers });
});


export const deleteUser = asyncHandler(async (req, res) => {
  const id = parseInt(req.params['id'], 10)

  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({ where: { user_id: id } })

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await userRepo.remove(user)

  res.status(200).json({ message: 'User deleted successfully' });
  return
})