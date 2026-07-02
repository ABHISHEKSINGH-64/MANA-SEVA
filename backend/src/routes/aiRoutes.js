import { Router } from 'express';
import { chat, eligibility, recommend } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

export const aiRouter = Router();

aiRouter.post('/chat', optionalAuth, chat);
aiRouter.post('/eligibility', eligibility);
aiRouter.post('/recommend', recommend);
