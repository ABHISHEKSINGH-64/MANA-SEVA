import { Router } from 'express';
import {
  createService,
  deleteService,
  getRecentlyViewed,
  getService,
  getServices,
  updateService
} from '../controllers/serviceController.js';
import { optionalAuth, protect, restrictTo } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const serviceRouter = Router();

serviceRouter.get('/', getServices);
serviceRouter.get('/recently-viewed/me', protect, getRecentlyViewed);
serviceRouter.get('/:id', optionalAuth, getService);
serviceRouter.post('/', protect, restrictTo('admin'), requireFields('category_id', 'title', 'slug', 'short_description'), createService);
serviceRouter.put('/:id', protect, restrictTo('admin'), updateService);
serviceRouter.delete('/:id', protect, restrictTo('admin'), deleteService);
