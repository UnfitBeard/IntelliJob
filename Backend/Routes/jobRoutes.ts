import express from 'express'
import {  applyToJobController, createJob, deleteJob, getAllJobs, scheduleInterview, updateJob } from '../Controllers/jobControllers'
import { protect } from '../Middlewares/protect';
import { adminGuard, adminOrRecruiterGuard, jobSeekerGuard, recruiterGuard } from '../Middlewares/RoleGuards';

const router = express.Router()

router.post("/addJobs", protect,adminOrRecruiterGuard, createJob)
router.post('/apply',protect, applyToJobController);
router.get("/getAllJobs", getAllJobs)
router.patch("/updateJob/:id",protect, updateJob)
router.delete("/deleteJob/:id", deleteJob)
router.post('/applications/schedule',protect, scheduleInterview);

export default router