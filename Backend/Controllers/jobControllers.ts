import { Job } from './../Models/Job';
import { Interview } from './../Models/Interview';
import express from 'express'
import { Request, Response, NextFunction } from 'express'
import asyncHandler from '../Utils/Helpers/asyncHandler'
import pool from '../db/db.config';
// middleware/upload.ts
import multer from 'multer';
import { error } from 'console';
import { AppDataSource } from '../db/dataSource';
import { Company } from '../Models/Company';
import { Application, ApplicationStatus } from '../Models/Application';
import { JobSeeker } from '../Models/JobSeeker';
import { JobRequest } from '../Utils/Types/Job';
import { SkillsRequest } from '../Utils/Types/SkillsRequest';
import { UserRequest } from '../Utils/Types/User';
import { User } from '../Models/User';

const storage = multer.memoryStorage(); // Store file directly in memory (no disk)


export const createJob = asyncHandler(async (req: JobRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ message: "Not Authorized" });
        return
    } const {
        company_id,
        recruiter_id,
        title,
        description,
        location,
        salary_range,
        job_type,
        expiration_date,
        experience_required,
        skills = null, // Default to null if not provided
        experience_level = null, // Default to null if not provided
        education = null, // Default to null if not provided
        min_salary = null, // Default to null if not provided
        max_salary = null, // Default to null if not provided
    } = req.body;

    const { user_id, user_type } = req.user;

    if (user_type !== 'recruiter' && user_type !== 'admin') {
        res.status(403).json({ message: "Access denied: Only Recruiters or Admins can create Jobs" });
        return
    }

    const company = await AppDataSource.getRepository(Company).findOneBy({ company_id });
    if (!company) {
        return res.status(400).json({ message: "Invalid company_id" });
    }


    const jobRepo = AppDataSource.getRepository(Job);

    const job = jobRepo.create({
        ...req.body,
        posted_date: new Date(),
        status: 'open', // or JobStatus.OPEN if using enum
        application_count: 0
    });

    try {
        const saved = await jobRepo.save(job);
        res.status(201).json({ message: "Job created", job: saved });
    } catch (err) {
        console.error("Error saving job:", err);
        res.status(500).json({ message: "Error saving job" });
    }
    return
});

export const applyToJobController = asyncHandler(async (req: JobRequest, res: Response, next: NextFunction) => {
    try {
        const { coverLetter, jobId } = req.body;

        const userType = req.user?.user_type
        const userID = req.user?.user_id

        if (userType === 'recruiter' || userType === 'admin') {
            res.status(403).json({ message: "Access denied: Only Job Seekers can apply to Jobs" });
            return
        }

        const jobRepo = AppDataSource.getRepository(Job);
        const seekerRepo = AppDataSource.getRepository(JobSeeker);
        const userRepo = AppDataSource.getRepository(User);

        const user = userRepo.findOne({ where: { user_id: userID } })
        const job = await jobRepo.findOne({ where: { job_id: jobId } });
        const jobSeeker = await seekerRepo.findOne({ where: { user: { user_id: userID } } });

        if (!job || !jobSeeker) {
            res.status(404).json({ message: 'Job or Job Seeker not found' });
            return
        }

        const applicationRepo = AppDataSource.getRepository(Application);

        // Create a new application instance
        const application = new Application();
        application.cover_letter = coverLetter;
        application.job = job;
        application.jobSeeker = jobSeeker;
        application.application_date = new Date();

        // Insert the application into the database
        await applicationRepo.save(application);

        return res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error('Error while submitting application:', error);
        return res.status(500).json({ message: 'An error occurred while submitting the application' });
    }
});

export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the repository for the Job entity
        const jobRepository = AppDataSource.getRepository(Job);

        // Fetch all jobs using TypeORM's find method
        const jobs = await jobRepository.find({
            relations: ['applications']
        });

        // Return the jobs in the response
        res.status(200).json({ jobs });
    } catch (error) {
        next(error);
    }
};

export const getJobById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(result.rows[0]);
        return
});

export const updateJob = asyncHandler(async (req: JobRequest, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const {
        title,
        company_id,
        description,
        salaryFrom,
        salaryTo,
        jobType,
        deadline,
        location,
        requiredSkills
    } = req.body;

        // Get the job repository
        const jobRepository = AppDataSource.getRepository(Job);

        // Find the job by its id (use `where` for TypeORM's findOne method)
        const job = await jobRepository.findOne({
            where: { job_id: id }  // Make sure job_id is the correct column name in your Job entity
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Update job fields
        job.title = title;
        job.company_id = company_id;
        job.description = description;
        job.min_salary = salaryFrom;
        job.max_salary = salaryTo;
        job.job_type = jobType;
        job.expiration_date = deadline;
        job.location = location;
        job.skills = requiredSkills.split(',').map((skill: string) => skill.trim());
        job.posted_date = new Date();  // Assuming you want to update the posted date to the current timestamp

        // Save the updated job to the database
        const updatedJob = await jobRepository.save(job);

        // Send the updated job as the response
        res.status(200).json({ message: "Updated Job", updatedJob });
        return
});

export const deleteJob = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Convert the `id` to a number
    const id = parseInt(req.params['id'], 10);

        // Get the job repository
        const jobRepository = AppDataSource.getRepository(Job);

        // Find the job by its job_id (ensure job_id is a number)
        const job = await jobRepository.findOne({
            where: { job_id: id }  // Ensure job_id is a number
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Delete the job
        await jobRepository.remove(job); // This will remove the job entity from the database

        // Send success response
        res.status(200).json({ message: 'Job deleted successfully' });
        return
});

export const scheduleInterview = asyncHandler(async (req: SkillsRequest, res: Response) => {
    try {
        const { job_id, interviewType, scheduledAt, candidate } = req.body;

        if (!job_id || !interviewType || !scheduledAt) {
            return res.status(400).json({ message: 'job_id, interviewType, and scheduledAt are required.' });
        }

        // Get jobSeeker using authenticated user ID
        const jobSeekerRepo = AppDataSource.getRepository(JobSeeker);
        const jobSeeker = await jobSeekerRepo.findOne({
            where: { first_name: candidate.name.split(' ')[0]},
        });

        if (!jobSeeker) {
            return res.status(404).json({ message: 'Job seeker not found.' });
        }

        //Application
        const appRepo = AppDataSource.getRepository(Application);
        const application = await appRepo.findOne({
            where: {
                job: { job_id: job_id },
                jobSeeker: { first_name: candidate.name.split(' ')[0]},
            },
            relations: ['job', 'jobSeeker', 'jobSeeker.user']
        });

        if (!application) {
            return res.status(404).json({ message: 'Job application not found for this user and job.' });
        }

        const interViewRepo = AppDataSource.getRepository(Interview);
        const interview = interViewRepo.create({
            application: application,
            interview_type: interviewType,
            date_time: new Date(scheduledAt),
            jobSeeker: jobSeeker
        });

        const savedInterview = await interViewRepo.save(interview);

        return res.status(201).json(savedInterview);
    } catch (error) {
        console.error('Error scheduling interview:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
