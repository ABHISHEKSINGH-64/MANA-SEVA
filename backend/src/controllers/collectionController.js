import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CollectionModel } from '../models/collectionModel.js';

const responseKey = {
  bloodBanks: 'bloodBanks',
  emergencyContacts: 'emergencyContacts'
};

export const listCollection = (name) => asyncHandler(async (req, res) => {
  res.json({ [responseKey[name] || name]: await CollectionModel.findAll(name, req.query) });
});

export const createCollectionItem = (name) => asyncHandler(async (req, res) => {
  res.status(201).json({ item: await CollectionModel.create(name, req.body) });
});

export const updateCollectionItem = (name) => asyncHandler(async (req, res) => {
  const item = await CollectionModel.update(name, req.params.id, req.body);
  if (!item) throw new ApiError(404, 'Item not found');
  res.json({ item });
});

export const deleteCollectionItem = (name) => asyncHandler(async (req, res) => {
  const deleted = await CollectionModel.remove(name, req.params.id);
  if (!deleted) throw new ApiError(404, 'Item not found');
  res.status(204).send();
});

export const search = asyncHandler(async (req, res) => {
  res.json(await CollectionModel.globalSearch(req.query.q || req.query.search, req.user?.id));
});

export const recentSearches = asyncHandler(async (req, res) => {
  res.json({ searches: await CollectionModel.recentSearches(req.user.id) });
});
