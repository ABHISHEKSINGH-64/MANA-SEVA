import { app } from './app.js';
import { closeDb, connectDb } from './config/db.js';
import { env } from './config/env.js';

await connectDb();

const server = app.listen(env.port, () => {
  console.log(`Mana Seva API running on port ${env.port}`);
});

const shutdown = async () => {
  await closeDb();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
