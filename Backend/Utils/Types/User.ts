import { Request } from "express";
export enum UserType {
    JobSeeker = 'job_seeker',
    Recruiter = 'recruiter',
    Admin = 'admin'
}
export interface User {
    user_id: number;
    email?: string;
    password_hash?: string;
    user_type: string;
    created_at?: Date;
    last_login?: Date | null;
    is_verified?: boolean;
    profile_picture_url?: string;
}


export interface UserRequest extends Request {
    user?: User
}