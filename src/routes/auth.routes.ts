import express from 'express'
import Register from './Auth/Register.js'
import VerifyOTP from './Auth/VerifyOTP.js'
import ResendOTP from './Auth/ResendOTP.js'
import SetupProfile from './Auth/SetupProfile.js'
import Login from './Auth/Login.js'
import LoginWithGoogle from './Auth/LoginWithGoogle.js'
import ForgotPassword from './Auth/ForgotPassword.js'
import ResetPasswordChecker from './Auth/ResetPasswordChecker.js'
import ResetPassword from './Auth/ResetPassword.js'

const router = express.Router()

router.post('/register', Register)
router.post('/verify-otp', VerifyOTP)
router.post('/resend-otp', ResendOTP)
router.post('/setup-profile', SetupProfile)
router.post('/login', Login)
router.post('/google', LoginWithGoogle)
router.post('/forgot-password', ForgotPassword)
router.post('/reset-password-checker', ResetPasswordChecker)
router.post('/reset-password', ResetPassword)

export default router