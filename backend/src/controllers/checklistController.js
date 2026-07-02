import { asyncHandler } from '../utils/asyncHandler.js';
import { ChecklistModel } from '../models/checklistModel.js';

export const getChecklist = asyncHandler(async (req, res) => {
  const checklist = await ChecklistModel.findByUser(req.user.id);
  res.json({ checklist });
});

export const saveChecklistItem = asyncHandler(async (req, res) => {
  const item = await ChecklistModel.upsert(req.user.id, req.body);
  res.status(201).json({ item });
});
