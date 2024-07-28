import express from 'express'
import Register from './Auth/Register.js'
import VerifyOTP from './Auth/VerifyOTP.js'
import ResendOTP from './Auth/ResendOTP.js'
import SetupProfile from './Auth/SetupProfile.js'
import Login from './Auth/Login.js'

const router = express.Router()

router.post('/auth/register', Register)
router.post('/auth/verify-otp', VerifyOTP)
router.post('/auth/resend-otp', ResendOTP)
router.post('/auth/setup-profile', SetupProfile)
router.post('/auth/login', Login)

export default router