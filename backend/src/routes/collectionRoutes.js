import { Router } from 'express';
import {
  createCollectionItem,
  deleteCollectionItem,
  listCollection,
  recentSearches,
  search,
  updateCollectionItem
} from '../controllers/collectionController.js';
import { optionalAuth, protect, restrictTo } from '../middleware/auth.js';

const adminCrud = (name) => {
  const router = Router();
  router.get('/', listCollection(name));
  router.post('/', protect, restrictTo('admin'), createCollectionItem(name));
  router.put('/:id', protect, restrictTo('admin'), updateCollectionItem(name));
  router.delete('/:id', protect, restrictTo('admin'), deleteCollectionItem(name));
  return router;
};

export const collectionRouters = {
  scholarships: adminCrud('scholarships'),
  loans: adminCrud('loans'),
  banks: adminCrud('banks'),
  hospitals: adminCrud('hospitals'),
  bloodBanks: adminCrud('bloodBanks'),
  jobs: adminCrud('jobs'),
  internships: adminCrud('internships'),
  utilities: adminCrud('utilities'),
  emergencyContacts: adminCrud('emergencyContacts'),
  notifications: adminCrud('notifications'),
  logos: adminCrud('logos')
};

export const searchRouter = Router();
searchRouter.get('/', optionalAuth, search);
searchRouter.get('/recent', protect, recentSearches);
