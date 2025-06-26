import express from 'express'
import { Router } from "express";
import { deleteUser, editProfile, editRecruiterProfile, getAllUsers, getUserDataById, viewProfile, viewRecruiterProfile} from '../Controllers/userControllers';
import { protect } from '../Middlewares/protect';

const router = express.Router()

// router.get("/", getUsers)
router.patch("/jobSeeker", protect, editProfile)
router.patch("/Recruiter", editRecruiterProfile)
router.get("/getDataById", protect, getUserDataById)
router.post("/viewProfile", protect, viewProfile)
router.get("/RecruiterData", viewRecruiterProfile)
router.get("/allUsers", getAllUsers)
router.delete("/deleteUser/:id", deleteUser)

export default router