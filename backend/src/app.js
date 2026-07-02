import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { isDbConfigured } from './config/db.js';
import { env } from './config/env.js';
import { aiRouter } from './routes/aiRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { categoryRouter } from './routes/categoryRoutes.js';
import { checklistRouter } from './routes/checklistRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { faqRouter } from './routes/faqRoutes.js';
import { favoriteRouter } from './routes/favoriteRoutes.js';
import { schemeRouter } from './routes/schemeRoutes.js';
import { serviceRouter } from './routes/serviceRoutes.js';
import { collectionRouters, searchRouter } from './routes/collectionRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) =>
  res.json({
    message: 'Welcome to the Mana Seva API. Please use /api for endpoints.'
  })
);

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'Mana Seva API',
    database: isDbConfigured ? 'mongodb' : 'memory',
    databaseConfigured: isDbConfigured
  })
);
app.use('/api/auth', authRouter);
app.use('/api', authRouter);
app.use('/api/services', serviceRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/checklist', checklistRouter);
app.use('/api/schemes', schemeRouter);
app.use('/api/faqs', faqRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/search', searchRouter);
app.use('/api/ai', aiRouter);
app.use('/api/scholarships', collectionRouters.scholarships);
app.use('/api/loans', collectionRouters.loans);
app.use('/api/banks', collectionRouters.banks);
app.use('/api/hospitals', collectionRouters.hospitals);
app.use('/api/blood-banks', collectionRouters.bloodBanks);
app.use('/api/jobs', collectionRouters.jobs);
app.use('/api/internships', collectionRouters.internships);
app.use('/api/utilities', collectionRouters.utilities);
app.use('/api/emergency-contacts', collectionRouters.emergencyContacts);
app.use('/api/notifications', collectionRouters.notifications);
app.use('/api/logos', collectionRouters.logos);

app.use(notFound);
app.use(errorHandler);
