import { getDb, isDbConfigured } from '../config/db.js';
import { categories, faqs, nextId, services } from '../data/memoryStore.js';

const collection = () => getDb().collection('faqs');

const decorate = async (faq) => {
  if (!faq) return faq;
  const service = isDbConfigured
    ? await getDb().collection('services').findOne({ id: faq.service_id })
    : services.find((item) => item.id === faq.service_id);
  const category = isDbConfigured
    ? await getDb().collection('categories').findOne({ id: faq.category_id })
    : categories.find((item) => item.id === faq.category_id);
  return { ...faq, service_title: service?.title, category_name: category?.name };
};

export const FaqModel = {
  async findAll({ search } = {}) {
    if (!isDbConfigured) {
      const term = search?.toLowerCase();
      return Promise.all(faqs
        .filter((faq) => !term || `${faq.question} ${faq.answer}`.toLowerCase().includes(term))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(decorate));
    }

    const filter = search ? { $or: [{ question: { $regex: search, $options: 'i' } }, { answer: { $regex: search, $options: 'i' } }] } : {};
    const items = await collection().find(filter).sort({ created_at: -1 }).toArray();
    return Promise.all(items.map(decorate));
  },

  async create(payload) {
    const faq = { id: await nextCollectionId(), service_id: payload.service_id || null, category_id: payload.category_id || null, question: payload.question, answer: payload.answer, created_at: new Date().toISOString() };
    if (!isDbConfigured) faqs.push(faq);
    else await collection().insertOne(faq);
    return faq;
  },

  async update(id, payload) {
    if (!isDbConfigured) {
      const faq = faqs.find((item) => item.id === Number(id));
      if (!faq) return undefined;
      Object.assign(faq, payload);
      return faq;
    }
    const result = await collection().findOneAndUpdate({ id: Number(id) }, { $set: payload }, { returnDocument: 'after' });
    return result?.value ?? result;
  },

  async remove(id) {
    if (!isDbConfigured) {
      const index = faqs.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      faqs.splice(index, 1);
      return true;
    }
    const { deletedCount } = await collection().deleteOne({ id: Number(id) });
    return deletedCount > 0;
  }
};

const nextCollectionId = async () => {
  if (!isDbConfigured) return nextId(faqs);
  const last = await collection().find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
