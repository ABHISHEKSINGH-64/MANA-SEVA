import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/tokens.js';
import { UserModel } from '../models/userModel.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, preferredLanguage } = req.body;
  if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');

  const existing = await UserModel.findByEmail(email);
  if (existing) throw new ApiError(409, 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, passwordHash, phone, preferredLanguage });
  res.status(201).json({ user, token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userWithPassword = await UserModel.findByEmail(email);
  if (!userWithPassword) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, userWithPassword.password_hash);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  await UserModel.recordLogin(userWithPassword.id, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  const user = await UserModel.findById(userWithPassword.id);
  res.json({ user, token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.updateProfile(req.user.id, {
    name: req.body.name,
    phone: req.body.phone,
    preferredLanguage: req.body.preferredLanguage
  });
  res.json({ user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) throw new ApiError(400, 'New password must be at least 8 characters');

  const userWithPassword = await UserModel.findByEmail(req.user.email);
  const isMatch = await bcrypt.compare(currentPassword || '', userWithPassword.password_hash);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await UserModel.updatePassword(req.user.id, passwordHash);
  res.json({ message: 'Password changed successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const existing = req.body.email ? await UserModel.findByEmail(req.body.email) : null;
  res.json({
    message: existing
      ? 'Password reset instructions would be sent by the configured email provider.'
      : 'If the email is registered, password reset instructions will be sent.'
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  res.json({ message: 'Reset token accepted by the API contract. Configure an email/token provider for production resets.' });
});
