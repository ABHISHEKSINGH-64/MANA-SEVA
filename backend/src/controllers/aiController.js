import { entityCollections, schemes, services } from '../data/memoryStore.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const profileMatches = ({ age, state, income, occupation, education } = {}) => schemes.filter((scheme) => {
  const userAge = Number(age);
  const userIncome = Number(income);
  return (!state || scheme.state === 'All India' || scheme.state.toLowerCase() === state.toLowerCase())
    && (!age || ((!scheme.min_age || scheme.min_age <= userAge) && (!scheme.max_age || scheme.max_age >= userAge)))
    && (!income || !scheme.max_income || scheme.max_income >= userIncome)
    && (!occupation || scheme.beneficiary_type.toLowerCase() === occupation.toLowerCase() || (education && scheme.beneficiary_type === 'student'));
});

export const chat = asyncHandler(async (req, res) => {
  const message = String(req.body.message || '').toLowerCase();
  const related = services.filter((service) => JSON.stringify(service).toLowerCase().includes(message.split(' ')[0] || '')).slice(0, 3);
  const answer = message.includes('document')
    ? 'Start with identity proof, address proof, recent photo, mobile number, and service-specific certificates. Open the matching service guide for the exact checklist.'
    : message.includes('scholarship')
      ? 'Check state, course level, income limit, category, bank account details, and deadline before applying on the official scholarship portal.'
      : 'I can help you find services, documents, eligibility, scholarships, loans, hospitals, and citizen utility guidance. Share your age, state, income, occupation, and goal for better suggestions.';

  entityCollections.aiChatHistory.push({ id: entityCollections.aiChatHistory.length + 1, user_id: req.user?.id || null, message: req.body.message, answer, created_at: new Date().toISOString() });
  res.json({ answer, relatedServices: related });
});

export const eligibility = asyncHandler(async (req, res) => {
  res.json({
    profile: req.body,
    eligibleSchemes: profileMatches(req.body),
    scholarships: entityCollections.scholarships.filter((item) => !req.body.income || !item.max_income || item.max_income >= Number(req.body.income)),
    loans: entityCollections.loans
  });
});

export const recommend = asyncHandler(async (req, res) => {
  const text = JSON.stringify(req.body).toLowerCase();
  res.json({
    services: services.filter((service) => text.includes(service.category_slug) || text.includes(service.title.toLowerCase().split(' ')[0])).slice(0, 6),
    schemes: profileMatches(req.body).slice(0, 6),
    scholarships: entityCollections.scholarships.slice(0, 4),
    loans: entityCollections.loans.slice(0, 4)
  });
});
