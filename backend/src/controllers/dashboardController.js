import { asyncHandler } from '../utils/asyncHandler.js';
import { ChecklistModel } from '../models/checklistModel.js';
import { FavoriteModel } from '../models/favoriteModel.js';
import { ServiceModel } from '../models/serviceModel.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [favorites, checklist, recentlyViewed] = await Promise.all([
    FavoriteModel.findByUser(req.user.id),
    ChecklistModel.findByUser(req.user.id),
    ServiceModel.recentlyViewed(req.user.id)
  ]);

  const completed = checklist.filter((item) => item.is_completed).length;
  res.json({
    stats: {
      favorites: favorites.length,
      checklistItems: checklist.length,
      checklistCompleted: completed,
      progress: checklist.length ? Math.round((completed / checklist.length) * 100) : 0
    },
    favorites,
    checklist,
    recentlyViewed
  });
});
