import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ServiceModel } from '../models/serviceModel.js';

export const getServices = asyncHandler(async (req, res) => {
  const services = await ServiceModel.findAll(req.query);
  res.json({ services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.findById(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found');
  if (req.user) await ServiceModel.saveView(req.user.id, service.id);
  res.json({ service });
});

export const createService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.create(req.body);
  res.status(201).json({ service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.update(req.params.id, req.body);
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const deleted = await ServiceModel.remove(req.params.id);
  if (!deleted) throw new ApiError(404, 'Service not found');
  res.status(204).send();
});

export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const services = await ServiceModel.recentlyViewed(req.user.id);
  res.json({ services });
});
