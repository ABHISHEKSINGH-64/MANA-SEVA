import { getDb, isDbConfigured } from '../config/db.js';
import { favorites, nextId, services } from '../data/memoryStore.js';

const collection = () => getDb().collection('favorites');

export const FavoriteModel = {
  async add(userId, serviceId) {
    const service_id = Number(serviceId);
    if (!isDbConfigured) {
      const existing = favorites.find((item) => item.user_id === userId && item.service_id === service_id);
      if (existing) return existing;
      const favorite = { id: nextId(favorites), user_id: userId, service_id, created_at: new Date().toISOString() };
      favorites.push(favorite);
      return favorite;
    }

    const favorite = { id: await nextCollectionId(), user_id: userId, service_id, created_at: new Date().toISOString() };
    await collection().updateOne({ user_id: userId, service_id }, { $setOnInsert: favorite }, { upsert: true });
    return collection().findOne({ user_id: userId, service_id });
  },

  async remove(userId, serviceId) {
    const service_id = Number(serviceId);
    if (!isDbConfigured) {
      const index = favorites.findIndex((item) => item.user_id === userId && item.service_id === service_id);
      if (index === -1) return false;
      favorites.splice(index, 1);
      return true;
    }
    const { deletedCount } = await collection().deleteOne({ user_id: userId, service_id });
    return deletedCount > 0;
  },

  async findByUser(userId) {
    if (!isDbConfigured) {
      return favorites
        .filter((item) => item.user_id === userId)
        .map((item) => {
          const service = services.find((candidate) => candidate.id === item.service_id);
          return service ? { favorite_id: item.id, saved_at: item.created_at, ...service } : null;
        })
        .filter(Boolean);
    }

    const saved = await collection().find({ user_id: userId }).sort({ created_at: -1 }).toArray();
    const serviceRows = await getDb().collection('services').find({ id: { $in: saved.map((item) => item.service_id) } }).toArray();
    return saved.map((item) => {
      const service = serviceRows.find((candidate) => candidate.id === item.service_id);
      return service ? { favorite_id: item.id, saved_at: item.created_at, ...service } : null;
    }).filter(Boolean);
  }
};

const nextCollectionId = async () => {
  const last = await collection().find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
