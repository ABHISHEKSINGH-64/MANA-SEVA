import { Router } from 'express';
import { changePassword, forgotPassword, login, me, register, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const authRouter = Router();

authRouter.post('/register', requireFields('name', 'email', 'password'), register);
authRouter.post('/login', requireFields('email', 'password'), login);
authRouter.post('/forgot-password', requireFields('email'), forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/me', protect, me);
authRouter.put('/profile', protect, updateProfile);
authRouter.put('/change-password', protect, changePassword);
authRouter.get('/profile', protect, me);
authRouter.post('/logout', (_req, res) => res.json({ message: 'Logged out successfully' }));
