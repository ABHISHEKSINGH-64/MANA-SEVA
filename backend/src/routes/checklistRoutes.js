import { Router } from 'express';
import { getChecklist, saveChecklistItem } from '../controllers/checklistController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const checklistRouter = Router();

checklistRouter.use(protect);
checklistRouter.get('/', getChecklist);
checklistRouter.post('/', requireFields('serviceId', 'documentName'), saveChecklistItem);
