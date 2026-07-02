import { app } from '../src/app.js';
import { connectDb } from '../src/config/db.js';

// Connect to MongoDB Atlas
await connectDb();

// Export the express app as default handler for Vercel
export default app;
