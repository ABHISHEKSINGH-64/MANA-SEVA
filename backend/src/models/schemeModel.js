import { getDb, isDbConfigured } from '../config/db.js';
import { nextId, schemes } from '../data/memoryStore.js';

const collection = () => getDb().collection('schemes');

const matchesFilters = (scheme, { state, age, income, beneficiaryType } = {}) => {
  const userAge = Number(age);
  const userIncome = Number(income);
  return (!state || scheme.state.toLowerCase() === state.toLowerCase() || scheme.state.toLowerCase() === 'all india')
    && (!age || ((!scheme.min_age || scheme.min_age <= userAge) && (!scheme.max_age || scheme.max_age >= userAge)))
    && (!income || !scheme.max_income || scheme.max_income >= userIncome)
    && (!beneficiaryType || scheme.beneficiary_type.toLowerCase() === beneficiaryType.toLowerCase());
};

export const SchemeModel = {
  async findAll(filters = {}) {
    if (!isDbConfigured) {
      return schemes.filter((scheme) => matchesFilters(scheme, filters)).sort((a, b) => a.state.localeCompare(b.state) || a.title.localeCompare(b.title));
    }

    const items = await collection().find({}).sort({ state: 1, title: 1 }).toArray();
    return items.filter((scheme) => matchesFilters(scheme, filters));
  },

  async create(payload) {
    const scheme = { id: await nextCollectionId(), ...payload, state: payload.state || 'All India', created_at: new Date().toISOString() };
    if (!isDbConfigured) schemes.push(scheme);
    else await collection().insertOne(scheme);
    return scheme;
  },

  async update(id, payload) {
    if (!isDbConfigured) {
      const scheme = schemes.find((item) => item.id === Number(id));
      if (!scheme) return undefined;
      Object.assign(scheme, payload);
      return scheme;
    }
    const result = await collection().findOneAndUpdate({ id: Number(id) }, { $set: payload }, { returnDocument: 'after' });
    return result?.value ?? result;
  },

  async remove(id) {
    if (!isDbConfigured) {
      const index = schemes.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      schemes.splice(index, 1);
      return true;
    }
    const { deletedCount } = await collection().deleteOne({ id: Number(id) });
    return deletedCount > 0;
  }
};

const nextCollectionId = async () => {
  if (!isDbConfigured) return nextId(schemes);
  const last = await collection().find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
