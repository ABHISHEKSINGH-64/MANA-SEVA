import { asyncHandler } from '../utils/asyncHandler.js';
import { FavoriteModel } from '../models/favoriteModel.js';

export const addFavorite = asyncHandler(async (req, res) => {
  const favorite = await FavoriteModel.add(req.user.id, req.body.serviceId);
  res.status(201).json({ favorite, message: 'Service saved to favorites' });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  await FavoriteModel.remove(req.user.id, req.params.serviceId);
  res.status(204).send();
});

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await FavoriteModel.findByUser(req.user.id);
  res.json({ favorites });
});
