import express from 'express'
import {Router} from 'express'
import { adminDashBoardComponents, getSkillsAndMatch, getUserSkills, recruiterDashBoardComponents } from '../Controllers/geminiAIController'
import { protect } from '../Middlewares/protect'
import { jobSeekerGuard } from '../Middlewares/RoleGuards'

const router = express.Router()

router.get("/geminiUsers",protect, getUserSkills)
router.post("/getSkillsAndMatch",protect, getSkillsAndMatch)
router.post("/recruiterDashBoard", protect, recruiterDashBoardComponents)
router.post("/adminGraphs", adminDashBoardComponents)


export default router