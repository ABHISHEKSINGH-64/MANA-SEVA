import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.post('/', protect, restrictTo('admin'), requireFields('name', 'slug', 'description'), createCategory);
categoryRouter.put('/:id', protect, restrictTo('admin'), updateCategory);
categoryRouter.delete('/:id', protect, restrictTo('admin'), deleteCategory);
