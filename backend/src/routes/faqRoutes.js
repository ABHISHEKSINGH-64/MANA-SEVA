import { Router } from 'express';
import { createFaq, deleteFaq, getFaqs, updateFaq } from '../controllers/faqController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const faqRouter = Router();

faqRouter.get('/', getFaqs);
faqRouter.post('/', protect, restrictTo('admin'), requireFields('question', 'answer'), createFaq);
faqRouter.put('/:id', protect, restrictTo('admin'), updateFaq);
faqRouter.delete('/:id', protect, restrictTo('admin'), deleteFaq);
