import express from 'express'
import Register from './Auth/Register.js'
import VerifyOTP from './Auth/VerifyOTP.js'
import ResendOTP from './Auth/ResendOTP.js'
import SetupProfile from './Auth/SetupProfile.js'
import Login from './Auth/Login.js'
import LoginWithGoogle from './Auth/LoginWithGoogle.js'

const router = express.Router()

router.post('/register', Register)
router.post('/verify-otp', VerifyOTP)
router.post('/resend-otp', ResendOTP)
router.post('/setup-profile', SetupProfile)
router.post('/login', Login)
router.post('/google', LoginWithGoogle)

export default router