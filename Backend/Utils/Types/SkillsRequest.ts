import { Request } from 'express';
import { User } from '../../Models/User';

// Define the structure for the SkillsRequest
export interface SkillsRequest extends Request {
    user?: User
    userData?: {
        firstName: string;
        lastName: string;
        phone?: string;
        location?: string;
        bio?: string;
        linkedinUrl?: string;
        experienceLevel?: string;
        skills: {
            skillName: string;
            yearsExperience: number;
            aiCertified: boolean;
        }[];
        projects: {
            title: string;
            description?: string;
            skillsUsed?: string;
            projectUrl?: string;
            role?: string;
            teamSize?: number;
            isCurrent?: boolean;
        }[];
    };
}
