import { Router } from 'express';
import { createScheme, deleteScheme, getSchemes, updateScheme } from '../controllers/schemeController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const schemeRouter = Router();

schemeRouter.get('/', getSchemes);
schemeRouter.post('/', protect, restrictTo('admin'), requireFields('title', 'description', 'beneficiary_type'), createScheme);
schemeRouter.put('/:id', protect, restrictTo('admin'), updateScheme);
schemeRouter.delete('/:id', protect, restrictTo('admin'), deleteScheme);
