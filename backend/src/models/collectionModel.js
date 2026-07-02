import { getDb, isDbConfigured } from '../config/db.js';
import { entityCollections, faqs, nextId, schemes, searchHistory, services } from '../data/memoryStore.js';

const collectionMap = {
  scholarships: entityCollections.scholarships,
  loans: entityCollections.loans,
  banks: entityCollections.banks,
  hospitals: entityCollections.hospitals,
  bloodBanks: entityCollections.bloodBanks,
  jobs: entityCollections.jobs,
  internships: entityCollections.internships,
  utilities: entityCollections.utilities,
  emergencyContacts: entityCollections.emergencyContacts,
  notifications: entityCollections.notifications,
  logos: entityCollections.logos
};

const matches = (item, search) => {
  if (!search) return true;
  return JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
};

const collection = (name) => getDb().collection(name);

export const CollectionModel = {
  async findAll(name, { search, ...filters } = {}) {
    if (!isDbConfigured) {
      const source = collectionMap[name] || [];
      return source.filter((item) => {
        if (!matches(item, search)) return false;
        return Object.entries(filters).every(([key, value]) => !value || String(item[key] || '').toLowerCase() === String(value).toLowerCase());
      });
    }

    const items = await collection(name).find({}).toArray();
    return items.filter((item) => {
      if (!matches(item, search)) return false;
      return Object.entries(filters).every(([key, value]) => !value || String(item[key] || '').toLowerCase() === String(value).toLowerCase());
    });
  },

  async create(name, payload) {
    const source = collectionMap[name] || [];
    const record = { id: isDbConfigured ? await nextCollectionId(name) : nextId(source), ...payload, created_at: new Date().toISOString() };
    if (!isDbConfigured) source.push(record);
    else await collection(name).insertOne(record);
    return record;
  },

  async update(name, id, payload) {
    if (!isDbConfigured) {
      const source = collectionMap[name] || [];
      const record = source.find((item) => item.id === Number(id));
      if (!record) return undefined;
      Object.assign(record, payload, { updated_at: new Date().toISOString() });
      return record;
    }
    const result = await collection(name).findOneAndUpdate(
      { id: Number(id) },
      { $set: { ...payload, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result?.value ?? result;
  },

  async remove(name, id) {
    if (!isDbConfigured) {
      const source = collectionMap[name] || [];
      const index = source.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      source.splice(index, 1);
      return true;
    }
    const { deletedCount } = await collection(name).deleteOne({ id: Number(id) });
    return deletedCount > 0;
  },

  async globalSearch(query, userId) {
    const term = query?.trim().toLowerCase();
    if (!term) return { services: [], schemes: [], faqs: [], scholarships: [], loans: [], jobs: [] };

    if (!isDbConfigured) {
      if (userId) searchHistory.push({ id: nextId(searchHistory), user_id: userId, query, searched_at: new Date().toISOString() });
      return {
        services: services.filter((item) => matches(item, term)).slice(0, 8),
        schemes: schemes.filter((item) => matches(item, term)).slice(0, 8),
        faqs: faqs.filter((item) => matches(item, term)).slice(0, 8),
        scholarships: entityCollections.scholarships.filter((item) => matches(item, term)).slice(0, 8),
        loans: entityCollections.loans.filter((item) => matches(item, term)).slice(0, 8),
        jobs: entityCollections.jobs.filter((item) => matches(item, term)).slice(0, 8)
      };
    }

    if (userId) {
      await collection('search_history').insertOne({ id: await nextCollectionId('search_history'), user_id: userId, query, searched_at: new Date().toISOString() });
    }
    const [serviceRows, schemeRows, faqRows, scholarships, loans, jobs] = await Promise.all([
      collection('services').find({}).toArray(),
      collection('schemes').find({}).toArray(),
      collection('faqs').find({}).toArray(),
      collection('scholarships').find({}).toArray(),
      collection('loans').find({}).toArray(),
      collection('jobs').find({}).toArray()
    ]);
    return {
      services: serviceRows.filter((item) => matches(item, term)).slice(0, 8),
      schemes: schemeRows.filter((item) => matches(item, term)).slice(0, 8),
      faqs: faqRows.filter((item) => matches(item, term)).slice(0, 8),
      scholarships: scholarships.filter((item) => matches(item, term)).slice(0, 8),
      loans: loans.filter((item) => matches(item, term)).slice(0, 8),
      jobs: jobs.filter((item) => matches(item, term)).slice(0, 8)
    };
  },

  async recentSearches(userId) {
    if (!isDbConfigured) return searchHistory.filter((item) => item.user_id === userId).slice(-10).reverse();
    return collection('search_history').find({ user_id: userId }).sort({ searched_at: -1 }).limit(10).toArray();
  }
};

const nextCollectionId = async (name) => {
  const last = await collection(name).find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
