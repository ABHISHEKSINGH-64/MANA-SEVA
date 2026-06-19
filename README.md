# Mana Seva

Mana Seva is a full-stack citizen assistance platform. It helps users understand services, eligibility, required documents, application steps, FAQs, scholarships, schemes, loans, hospitals, utilities, and job-related guidance. It does not submit official applications.

## Stack

- Frontend: React, Vite, React Router DOM, Tailwind CSS, Axios, React Icons
- Backend: Node.js, Express.js, MVC-style controllers/models/routes
- Database: MongoDB Atlas with an in-memory fallback for local development
- Auth: JWT and bcrypt

## Features

- Register, login, logout, forgot/reset password API contracts, profile update, and change password
- Service discovery, category browsing, detailed guides, FAQs, favorites, recently viewed services, and document checklist progress
- Government scheme finder by state, age, income, and user type
- Directories for scholarships, loans, banks, hospitals, blood banks, jobs, internships, utilities, emergency contacts, notifications, and logos
- AI assistant, eligibility checker, recommender, document guidance, and global search endpoints
- Admin APIs for services, categories, FAQs, schemes, directories, and logos
- English, Telugu, and Hindi UI labels
- Responsive layouts for mobile, tablet, and desktop

## Folder Structure

```text
client/
  src/
    components/
    context/
    data/
    hooks/
    pages/
    services/
server/
  src/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    utils/
database/
  README.md
```

## Local Setup

1. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Update `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/
MONGODB_DATABASE=manaseva
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

If `MONGODB_URI` is not set, the API runs with in-memory seed data.

3. Install dependencies:

```bash
npm run install:all
```

4. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000/api` by default, or the `PORT` value in `server/.env`.

Seed admin account:

- Email: `admin@manaseva.in`
- Password: `Admin@1234`

Change this account outside local development.

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`
- `POST /api/auth/logout`

Short aliases are also mounted: `POST /api/register`, `POST /api/login`, `POST /api/logout`, and `GET /api/profile`.

Core:

- `GET /api/services`
- `GET /api/services/:id`
- `GET /api/categories`
- `GET /api/faqs`
- `GET /api/schemes`
- `GET /api/dashboard`
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:serviceId`
- `GET /api/checklist`
- `POST /api/checklist`

Search and AI:

- `GET /api/search?q=passport`
- `GET /api/search/recent`
- `POST /api/ai/chat`
- `POST /api/ai/eligibility`
- `POST /api/ai/recommend`

Directories:

- `GET /api/scholarships`
- `GET /api/loans`
- `GET /api/banks`
- `GET /api/hospitals`
- `GET /api/blood-banks`
- `GET /api/jobs`
- `GET /api/internships`
- `GET /api/utilities`
- `GET /api/emergency-contacts`
- `GET /api/notifications`
- `GET /api/logos`

Admin-protected `POST`, `PUT`, and `DELETE` routes are available for services, categories, FAQs, schemes, directories, and logos.

## MongoDB Seeding

On startup, the server connects to MongoDB and seeds empty collections from `server/src/data/memoryStore.js`. Existing collections are left untouched.

## Deployment

Backend:

1. Create a MongoDB Atlas cluster.
2. Set `MONGODB_URI`, `MONGODB_DATABASE`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`.
3. Deploy `server` with `npm install` and `npm start`.

Frontend:

1. Set `VITE_API_URL` to your deployed backend URL ending in `/api`.
2. Build with `npm run build --prefix client`.
3. Deploy `client/dist` to Vercel, Netlify, Cloudflare Pages, or static hosting.

Production notes:

- Rotate any credentials that were shared publicly.
- Use HTTPS and strong environment secrets.
- Keep official service links and scheme criteria updated.
- Add rate limiting and email verification before opening public registration at scale.
