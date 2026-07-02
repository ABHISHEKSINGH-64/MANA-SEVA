import crypto from 'node:crypto';
import { getDb, isDbConfigured } from '../config/db.js';
import { publicUser, users } from '../data/memoryStore.js';

const collection = () => getDb().collection('users');

export const UserModel = {
  async create({ name, email, passwordHash, phone, preferredLanguage = 'en' }) {
    const user = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      phone: phone || null,
      preferred_language: preferredLanguage,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!isDbConfigured) {
      users.push(user);
      return publicUser(user);
    }

    await collection().insertOne(user);
    return publicUser(user);
  },

  async findByEmail(email) {
    if (!isDbConfigured) return users.find((user) => user.email === email.toLowerCase());
    return collection().findOne({ email: email.toLowerCase() });
  },

  async findById(id) {
    const user = isDbConfigured
      ? await collection().findOne({ id })
      : users.find((item) => item.id === id);
    return user ? publicUser(user) : undefined;
  },

  async updateProfile(id, { name, phone, preferredLanguage }) {
    const updates = {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(preferredLanguage !== undefined ? { preferred_language: preferredLanguage } : {}),
      updated_at: new Date().toISOString()
    };

    if (!isDbConfigured) {
      const user = users.find((item) => item.id === id);
      if (!user) return undefined;
      Object.assign(user, updates);
      return publicUser(user);
    }

    const result = await collection().findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    const value = result?.value ?? result;
    return value ? publicUser(value) : undefined;
  },

  async updatePassword(id, passwordHash) {
    const updates = { password_hash: passwordHash, updated_at: new Date().toISOString() };

    if (!isDbConfigured) {
      const user = users.find((item) => item.id === id);
      if (!user) return undefined;
      Object.assign(user, updates);
      return publicUser(user);
    }

    const result = await collection().findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    const value = result?.value ?? result;
    return value ? publicUser(value) : undefined;
  },

  async recordLogin(id, metadata = {}) {
    const logged_in_at = new Date().toISOString();

    if (!isDbConfigured) {
      const user = users.find((item) => item.id === id);
      if (user) user.last_login_at = logged_in_at;
      return;
    }

    await Promise.all([
      collection().updateOne({ id }, { $set: { last_login_at: logged_in_at, updated_at: logged_in_at } }),
      getDb().collection('login_history').insertOne({
        id: crypto.randomUUID(),
        user_id: id,
        logged_in_at,
        ip: metadata.ip || null,
        user_agent: metadata.userAgent || null
      })
    ]);
  }
};
