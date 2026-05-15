import express from 'express'
import authController from '../../controllers/v1/auth.controllers.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { authLimiter, sensitiveTaskLimiter, googleAuthLimiter } from '../../middlewares/rateLimitng.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { forgetPasswordSchema, loginSchema, ragisterSchema, resetPasswordSchema,  verifyEmailOtpSchema } from '../../validations/auth.validation.js';

const authRouter = express.Router()

authRouter.post('/ragister', authLimiter, validate(ragisterSchema), authController.ragister);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.get('/getme', authMiddleware.verifyAccess, authController.getMe);
authRouter.get('/rotate-token', authController.tokenRotation);
authRouter.post('/logout', authMiddleware.verifyAccess, authController.logout);
authRouter.post('/logout-all-devices', authMiddleware.verifyAccess, authController.logoutFromAllDevices);
authRouter.post('/send-email-varification-otp', sensitiveTaskLimiter, authController.sendEmailVarificationOtp);
authRouter.post('/verify-email-otp', validate(verifyEmailOtpSchema), authController.verifyEmailOtp);
authRouter.post('/forget-password', validate(forgetPasswordSchema), sensitiveTaskLimiter, authController.forgetPassword);
authRouter.post('/reset-password/:resetPasswordToken', validate(resetPasswordSchema), authController.resetPassword);
authRouter.post('/google-sync', googleAuthLimiter, authController.googleAuthSync);

export default authRouter;