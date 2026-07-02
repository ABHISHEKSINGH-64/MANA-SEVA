import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SchemeModel } from '../models/schemeModel.js';

export const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await SchemeModel.findAll(req.query);
  res.json({ schemes });
});

export const createScheme = asyncHandler(async (req, res) => {
  const scheme = await SchemeModel.create(req.body);
  res.status(201).json({ scheme });
});

export const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await SchemeModel.update(req.params.id, req.body);
  if (!scheme) throw new ApiError(404, 'Scheme not found');
  res.json({ scheme });
});

export const deleteScheme = asyncHandler(async (req, res) => {
  const deleted = await SchemeModel.remove(req.params.id);
  if (!deleted) throw new ApiError(404, 'Scheme not found');
  res.status(204).send();
});
