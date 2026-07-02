import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CategoryModel } from '../models/categoryModel.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await CategoryModel.findAll();
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.create(req.body);
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.update(req.params.id, req.body);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const deleted = await CategoryModel.remove(req.params.id);
  if (!deleted) throw new ApiError(404, 'Category not found');
  res.status(204).send();
});
