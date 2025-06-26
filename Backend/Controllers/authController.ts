import { config } from './../../SkillsMatch/src/app/app.config.server';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../Utils/Helpers/asyncHandler";
import bcrypt from 'bcryptjs';
import { generateToken } from '../Utils/Helpers/generateToken';
import { AppDataSource } from '../db/dataSource';
import { User } from '../Models/User';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { UserRequest } from '../Utils/Types/User';

dotenv.config()

const userRepository = AppDataSource.getRepository(User);

export const registration = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, user_type } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
        email,
        password_hash,
        user_type,
    });

    await userRepository.save(newUser);

    await generateToken(res, newUser.user_id, newUser.user_type);

    res.status(201).json({
        message: "User created successfully",
        user: {
            id: newUser.user_id,
            email: newUser.email,
            user_type: newUser.user_type
        }
    });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
        res.status(400).json({ message: "Incorrect Password or Username" });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        res.status(400).json({ message: "Incorrect Password or Username" });
        return;
    }

    await generateToken(res, user.user_id, user.user_type);

    res.status(200).json({
        message: "User Logged in successfully",
        user: {
            id: user.user_id,
            email: user.email,
            user_type: user.user_type
        }
    });
});

export const logout = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
    res.cookie("access_token", "", {
        httpOnly: true,
        secure: process.env['NODE_ENV'] !== "development", // Secure in production
        sameSite: "strict",
        expires: new Date(0) // 15 minutes
    });


     // Set Refresh Token as HTTP-Only Secure Cookie
     res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env['NODE_ENV'] !== "development",
        sameSite: "strict",
        expires: new Date(0) // 30 days
    });
    res.status(200).json({message: "User logged out successfully"})
})

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.sendStatus(401);
        return
    } 

    if (!(process.env['REFRESH_TOKEN_SECRET'] && process.env['JWT_SECRET'])) {
        res.status(201).json('No Token Variables Defines')
        return
    }
  
    try {
      const payload = jwt.verify(refreshToken, process.env['REFRESH_TOKEN_SECRET']);

      if (!payload || typeof payload !== 'object' || !('user_type' in payload)) {
        throw new Error('Invalid token payload or missing user_type');
      }

      const accessToken = jwt.sign({ user_id: payload.user_id, user_type: payload.user_type }, process.env['JWT_SECRET'], { expiresIn: "15m" });
  
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
  
      res.json({ accessToken });
  
    } catch (err) {
      return res.sendStatus(403); // Invalid refresh token
    }
  })

  // controllers/userController.ts
export const getMe = asyncHandler(async (req: UserRequest, res: Response) => {
    const token = req.cookies.access_token;
  
    if (!token || !process.env.JWT_SECRET) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      const user = await userRepository.findOne({ where: { user_id: decoded.user_id } });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return 
      }
  
      res.json({
        id: user.user_id,
        email: user.email,
        user_type: user.user_type
      });
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  });
  