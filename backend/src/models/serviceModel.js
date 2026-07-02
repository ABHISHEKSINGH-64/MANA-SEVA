import { getDb, isDbConfigured } from '../config/db.js';
import { categories, guides, nextId, recentlyViewed, serviceWithGuide, services } from '../data/memoryStore.js';

const servicesCollection = () => getDb().collection('services');

const decorateService = async (service) => {
  if (!service) return undefined;
  if (!isDbConfigured) return serviceWithGuide(service);
  const guide = await getDb().collection('guides').findOne({ service_id: service.id });
  const category = await getDb().collection('categories').findOne({ id: service.category_id });
  return {
    ...service,
    category_name: service.category_name || category?.name,
    category_slug: service.category_slug || category?.slug,
    guide
  };
};

export const ServiceModel = {
  async findAll({ search, category, popular } = {}) {
    if (!isDbConfigured) {
      const term = search?.toLowerCase();
      return services
        .filter((service) => {
          if (!term) return true;
          const guide = guides.find((item) => item.service_id === service.id);
          const haystack = [
            service.title,
            service.short_description,
            service.category_name,
            service.category_slug,
            service.processing_time,
            service.fee,
            guide?.overview,
            ...(guide?.required_documents || []),
            ...(guide?.process_steps || []),
            ...(guide?.important_notes || []),
            ...(guide?.common_mistakes || [])
          ].filter(Boolean).join(' ').toLowerCase();
          return haystack.includes(term);
        })
        .filter((service) => !category || service.category_slug === category)
        .filter((service) => popular !== 'true' || service.is_popular)
        .sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || a.title.localeCompare(b.title))
        .map(serviceWithGuide);
    }

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } },
        { category_name: { $regex: search, $options: 'i' } },
        { category_slug: { $regex: search, $options: 'i' } },
        { processing_time: { $regex: search, $options: 'i' } },
        { fee: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category_slug = category;
    if (popular === 'true') filter.is_popular = true;

    const items = await servicesCollection().find(filter).sort({ is_popular: -1, title: 1 }).toArray();
    return Promise.all(items.map(decorateService));
  },

  async findById(idOrSlug) {
    const id = Number(idOrSlug);
    const service = isDbConfigured
      ? await servicesCollection().findOne(Number.isNaN(id) ? { slug: idOrSlug } : { id })
      : services.find((item) => item.id === id || item.slug === idOrSlug);
    return decorateService(service);
  },

  async create(payload) {
    const category = isDbConfigured
      ? await getDb().collection('categories').findOne({ id: Number(payload.category_id) })
      : categories.find((item) => item.id === Number(payload.category_id));
    const service = {
      id: isDbConfigured ? await nextMongoId('services') : nextId(services),
      category_id: Number(payload.category_id),
      category_name: category?.name,
      category_slug: category?.slug,
      title: payload.title,
      slug: payload.slug,
      short_description: payload.short_description,
      official_url: payload.official_url || null,
      processing_time: payload.processing_time || null,
      fee: payload.fee || null,
      languages: payload.languages || ['en'],
      is_popular: Boolean(payload.is_popular),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (!isDbConfigured) services.push(service);
    else await servicesCollection().insertOne(service);
    return service;
  },

  async update(id, payload) {
    const updates = { ...payload, updated_at: new Date().toISOString() };
    if (payload.category_id) {
      const category = isDbConfigured
        ? await getDb().collection('categories').findOne({ id: Number(payload.category_id) })
        : categories.find((item) => item.id === Number(payload.category_id));
      updates.category_id = Number(payload.category_id);
      updates.category_name = category?.name;
      updates.category_slug = category?.slug;
    }

    if (!isDbConfigured) {
      const service = services.find((item) => item.id === Number(id));
      if (!service) return undefined;
      Object.assign(service, updates);
      return service;
    }

    const result = await servicesCollection().findOneAndUpdate({ id: Number(id) }, { $set: updates }, { returnDocument: 'after' });
    return result?.value ?? result;
  },

  async remove(id) {
    if (!isDbConfigured) {
      const index = services.findIndex((item) => item.id === Number(id));
      if (index === -1) return false;
      services.splice(index, 1);
      return true;
    }
    const { deletedCount } = await servicesCollection().deleteOne({ id: Number(id) });
    return deletedCount > 0;
  },

  async saveView(userId, serviceId) {
    const viewed_at = new Date().toISOString();
    if (!isDbConfigured) {
      const existing = recentlyViewed.find((item) => item.user_id === userId && item.service_id === serviceId);
      if (existing) existing.viewed_at = viewed_at;
      else recentlyViewed.push({ id: nextId(recentlyViewed), user_id: userId, service_id: serviceId, viewed_at });
      return;
    }
    await getDb().collection('recently_viewed').updateOne(
      { user_id: userId, service_id: serviceId },
      { $set: { viewed_at }, $setOnInsert: { id: await nextMongoId('recently_viewed'), user_id: userId, service_id: serviceId } },
      { upsert: true }
    );
  },

  async recentlyViewed(userId) {
    if (!isDbConfigured) {
      return recentlyViewed
        .filter((item) => item.user_id === userId)
        .sort((a, b) => b.viewed_at.localeCompare(a.viewed_at))
        .slice(0, 8)
        .map((item) => services.find((service) => service.id === item.service_id))
        .filter(Boolean);
    }
    const views = await getDb().collection('recently_viewed').find({ user_id: userId }).sort({ viewed_at: -1 }).limit(8).toArray();
    const items = await servicesCollection().find({ id: { $in: views.map((item) => item.service_id) } }).toArray();
    return views.map((view) => items.find((service) => service.id === view.service_id)).filter(Boolean);
  }
};

const nextMongoId = async (name) => {
  const last = await getDb().collection(name).find({ id: { $type: 'number' } }).sort({ id: -1 }).limit(1).next();
  return (last?.id || 0) + 1;
};
