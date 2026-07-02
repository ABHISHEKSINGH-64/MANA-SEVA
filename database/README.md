# Database

Mana Seva now uses MongoDB.

Set these values in `server/.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/
MONGODB_DATABASE=manaseva
ALLOW_MEMORY_DB_FALLBACK=false
```

Create MongoDB collections and indexes:

```bash
npm run db:init --prefix server
```

On first server startup, MongoDB collections are automatically seeded from `server/src/data/memoryStore.js` when the collections are empty.

Registration data is stored in the `users` collection. Successful login activity updates `users.last_login_at` and inserts a record into `login_history`.
