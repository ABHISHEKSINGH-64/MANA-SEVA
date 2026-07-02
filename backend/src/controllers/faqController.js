import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { FaqModel } from '../models/faqModel.js';

export const getFaqs = asyncHandler(async (req, res) => {
  const faqs = await FaqModel.findAll(req.query);
  res.json({ faqs });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await FaqModel.create(req.body);
  res.status(201).json({ faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FaqModel.update(req.params.id, req.body);
  if (!faq) throw new ApiError(404, 'FAQ not found');
  res.json({ faq });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const deleted = await FaqModel.remove(req.params.id);
  if (!deleted) throw new ApiError(404, 'FAQ not found');
  res.status(204).send();
});
