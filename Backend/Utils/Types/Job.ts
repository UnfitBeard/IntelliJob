import { User, UserRequest } from "./User";
import { Request } from "express";
// From your original enum
export enum JobStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    DRAFT = 'draft'
}

// Base Job Type (for most purposes)
export interface JobType {
    job_id: number;
    company_id: number;
    recruiter_id?: number;
    title: string;
    description: string;
    location?: string;
    salary_range?: string;
    job_type?: string;
    posted_date: Date;
    expiration_date?: Date;
    status: JobStatus;
    experience_required?: string;
    skills?: string[];
    experience_level?: string;
    education?: string;
    min_salary?: number;
    max_salary?: number;

    company?: any; // Replace with CompanyType if defined
    recruiter?: any;
    applications?: any[];
}

// Extended type for requests that carry auth info
export interface JobRequest extends UserRequest {
    params: {
        id: string; // Ensures `req.params.id` always exists
    };
    job?: JobType
}
