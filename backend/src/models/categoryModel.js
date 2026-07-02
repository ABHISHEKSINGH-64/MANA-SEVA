import { getDb, isDbConfigured } from '../config/db.js';
import { categories, nextId, services } from '../data/memoryStore.js';

const collection = () => getDb().collection('categories');

const withServiceCounts = async (items) => {
  if (!isDbConfigured) {
    return items.map((category) => ({
      ...category,
      service_count: services.filter((service) => service.category_id === category.id).length
    }));
  }

  const counts = await getDb().collection('services').aggregate([
    { $group: { _id: '$category_id', count: { $sum: 1 } } }
  ]).toArray();
  const countMap = new Map(counts.map((item) => [item._id, item.count]));
  return items.map((category) => ({ ...category, service_count: countMap.get(category.id) || 0 }));
};

export const CategoryModel = {
  async findAll() {
    const items = isDbConfigured
      ? await collection().find({}).sort({ name: 1 }).toArray()
      : [...categories].sort((a, b) => a.name.localeCompare(b.name));
    return withServiceCounts(items);
  },

  async create({ name, slug, description, icon }) {
    const category = { id: nextId(categories), name, slug, description, icon: icon || null, created_at: new Date().toISOString() };
    if (!isDbConfigured) categories.push(category);
    else await collection().insertOne(category);
    return category;
  },

  async update(id, payload) {
    const updates = {
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.icon !== undefined ? { icon: payload.icon } : {})
    };

    if (!isDbConfigured) {
      const category = categories.find((item) => item.id === Number(id));
      if (!category) return undefined;
      Object.assign(category, updates);
      return category;
    }

    const result = await collection().findOneAndUpdate({ id: Number(id) }, { $set: updates }, { returnDocument: 'after' });
    return result?.value ?? result;
  },

  async remove(id) {
    if (!isDbConfigured) {
      const index = categories.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      categories.splice(index, 1);
      return true;
    }
    const { deletedCount } = await collection().deleteOne({ id: Number(id) });
    return deletedCount > 0;
  }
};
