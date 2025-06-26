import { Request, Response, NextFunction } from "express";
import asyncHandler from "../Utils/Helpers/asyncHandler";
import { UserRequest } from "../Utils/Types/User";
import { RoleRequest } from "../Utils/Types/userRoles";

// Ensure user has required roles
export const roleGuard = (allowedTypes: string[]) => 
  asyncHandler(async (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.user_type) {
      return res.status(403).json({ message: "User not found or missing role type" });
    }

    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }

    next();
  });

// Example role guards for clarity
export const adminGuard = roleGuard(["admin"]);
export const recruiterGuard = roleGuard(["recruiter"]);
export const jobSeekerGuard = roleGuard(["job_seeker"]);
export const adminOrRecruiterGuard = roleGuard(["admin", "recruiter"]);
