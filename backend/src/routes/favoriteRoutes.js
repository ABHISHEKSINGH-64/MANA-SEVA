import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

export const favoriteRouter = Router();

favoriteRouter.use(protect);
favoriteRouter.get('/', getFavorites);
favoriteRouter.post('/', requireFields('serviceId'), addFavorite);
favoriteRouter.delete('/:serviceId', removeFavorite);
