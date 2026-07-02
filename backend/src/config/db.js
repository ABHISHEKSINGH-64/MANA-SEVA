import dns from 'node:dns';
import { MongoClient } from 'mongodb';
import { env } from './env.js';
import {
  categories,
  entityCollections,
  faqs,
  guides,
  schemes,
  services,
  users
} from '../data/memoryStore.js';

export let isDbConfigured = Boolean(env.mongodbUri);

let client;
let db;

export const connectDb = async () => {
  if (!isDbConfigured) return null;
  if (db) return db;

  try {
    if (env.mongodbDnsServers.length) dns.setServers(env.mongodbDnsServers);
    client = new MongoClient(env.mongodbUri);
    await client.connect();
    db = client.db(env.mongodbDatabase);
    await initializeDatabase();
    return db;
  } catch (error) {
    if (!env.allowMemoryDbFallback) throw error;
    console.warn(`MongoDB connection failed (${error.code || error.message}). Falling back to in-memory data.`);
    await client?.close();
    client = null;
    db = null;
    isDbConfigured = false;
    return null;
  }
};

export const getDb = () => db;

export const closeDb = async () => {
  await client?.close();
  client = null;
  db = null;
};

const seedIfEmpty = async (collectionName, records) => {
  const collection = db.collection(collectionName);
  if (await collection.estimatedDocumentCount()) return;
  if (records.length) await collection.insertMany(records);
};

const appCollections = [
  'users',
  'categories',
  'services',
  'guides',
  'faqs',
  'schemes',
  'favorites',
  'document_checklists',
  'recently_viewed',
  'login_history',
  'search_history',
  'ai_chat_history',
  'scholarships',
  'loans',
  'banks',
  'hospitals',
  'bloodBanks',
  'jobs',
  'internships',
  'utilities',
  'emergencyContacts',
  'notifications',
  'logos'
];

const ensureCollections = async () => {
  const existing = await db.listCollections({}, { nameOnly: true }).toArray();
  const existingNames = new Set(existing.map((item) => item.name));
  await Promise.all(
    appCollections
      .filter((name) => !existingNames.has(name))
      .map((name) => db.createCollection(name))
  );
};

export const initializeDatabase = async () => {
  await ensureCollections();

  await Promise.all([
    seedIfEmpty('users', users),
    seedIfEmpty('categories', categories),
    seedIfEmpty('services', services),
    seedIfEmpty('guides', guides),
    seedIfEmpty('faqs', faqs),
    seedIfEmpty('schemes', schemes),
    seedIfEmpty('favorites', []),
    seedIfEmpty('document_checklists', []),
    seedIfEmpty('recently_viewed', []),
    seedIfEmpty('login_history', []),
    seedIfEmpty('search_history', []),
    seedIfEmpty('ai_chat_history', []),
    seedIfEmpty('scholarships', entityCollections.scholarships),
    seedIfEmpty('loans', entityCollections.loans),
    seedIfEmpty('banks', entityCollections.banks),
    seedIfEmpty('hospitals', entityCollections.hospitals),
    seedIfEmpty('bloodBanks', entityCollections.bloodBanks),
    seedIfEmpty('jobs', entityCollections.jobs),
    seedIfEmpty('internships', entityCollections.internships),
    seedIfEmpty('utilities', entityCollections.utilities),
    seedIfEmpty('emergencyContacts', entityCollections.emergencyContacts),
    seedIfEmpty('notifications', entityCollections.notifications),
    seedIfEmpty('logos', entityCollections.logos)
  ]);

  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('categories').createIndex({ slug: 1 }, { unique: true }),
    db.collection('services').createIndex({ slug: 1 }, { unique: true }),
    db.collection('favorites').createIndex({ user_id: 1, service_id: 1 }, { unique: true }),
    db.collection('document_checklists').createIndex({ user_id: 1, service_id: 1, document_name: 1 }, { unique: true }),
    db.collection('recently_viewed').createIndex({ user_id: 1, service_id: 1 }, { unique: true }),
    db.collection('login_history').createIndex({ user_id: 1, logged_in_at: -1 }),
    db.collection('search_history').createIndex({ user_id: 1, searched_at: -1 })
  ]);
};
