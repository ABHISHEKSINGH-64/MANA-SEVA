import { getDb, isDbConfigured } from '../config/db.js';
import { checklists, nextId, services } from '../data/memoryStore.js';

const collection = () => getDb().collection('document_checklists');

const decorate = async (item) => {
  const service = isDbConfigured
    ? await getDb().collection('services').findOne({ id: item.service_id })
    : services.find((candidate) => candidate.id === item.service_id);
  return { ...item, service_title: service?.title, service_slug: service?.slug };
};

export const ChecklistModel = {
  async findByUser(userId) {
    const items = isDbConfigured
      ? await collection().find({ user_id: userId }).toArray()
      : checklists.filter((item) => item.user_id === userId);
    const decorated = await Promise.all(items.map(decorate));
    return decorated.sort((a, b) => `${a.service_title}${a.document_name}`.localeCompare(`${b.service_title}${b.document_name}`));
  },

  async upsert(userId, { serviceId, documentName, isCompleted }) {
    const service_id = Number(serviceId);
    const updates = {
      is_completed: Boolean(isCompleted),
      updated_at: new Date().toISOString()
    };

    if (!isDbConfigured) {
      const existing = checklists.find((item) => item.user_id === userId && item.service_id === service_id && item.document_name === documentName);
      if (existing) {
        Object.assign(existing, updates);
        return existing;
      }
      const checklist = { id: nextId(checklists), user_id: userId, service_id, document_name: documentName, ...updates, created_at: new Date().toISOString() };
      checklists.push(checklist);
      return checklist;
    }

    const insert = { id: await nextCollectionId(), user_id: userId, service_id, document_name: documentName, created_at: new Date().toISOString() };
    await collection().updateOne(
      { user_id: userId, service_id, document_name: documentName },
      { $set: updates, $setOnInsert: insert },
      { upsert: true }
    );
    return collection().findOne({ user_id: userId, service_id, document_name: documentName });
  }
};

const nextCollectionId = async () => {
  const last = await collection().find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
