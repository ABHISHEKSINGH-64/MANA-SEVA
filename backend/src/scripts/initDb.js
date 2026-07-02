import { closeDb, connectDb, getDb, isDbConfigured } from '../config/db.js';

await connectDb();

if (!isDbConfigured) {
  console.error('MongoDB is not connected. Check MONGODB_URI, network access, and Atlas IP allowlist.');
  process.exitCode = 1;
} else {
  const collections = await getDb().listCollections({}, { nameOnly: true }).toArray();
  console.log(`MongoDB initialized: ${collections.map((item) => item.name).sort().join(', ')}`);
}

await closeDb();
