import express from 'express'
import {Router} from 'express'
import { getMe, login, logout, refreshToken, registration } from '../Controllers/authController';

const router = express.Router();

router.post("/register", registration)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refreshToken", refreshToken)
router.get('/me', getMe);


export default router