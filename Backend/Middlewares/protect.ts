import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../Utils/Helpers/asyncHandler";
import { UserRequest } from "../Utils/Types/User";
import { AppDataSource } from "../db/dataSource";
import { User } from "../Models/User";

const userRepo = AppDataSource.getRepository(User)

export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    // Try to get token from authorization headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Try to get token from cookies (fallback)
    if (!token && req.cookies.access_token) {
        token = req.cookies.access_token;
    }

    // If no token is provided
    if (!token) {
        res.status(401).json({ message: "Not Authorized, no token" });
        return 
    }

    try {
        // Check if JWT_SECRET is defined in environment variables
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Verify the token and decode the user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { user_id: number, user_type: string };

        // Attach decoded user information to the request
        req.user = { user_id: decoded.user_id, user_type: decoded.user_type };

        // Get the user from the database using the decoded user_id
        const userQuery = await userRepo.findOne({ where: { user_id: decoded.user_id } });

        // If no user is found, return an error
        if (!userQuery) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the user to the request object for the next middleware or route handler
        req.user = userQuery;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
});
