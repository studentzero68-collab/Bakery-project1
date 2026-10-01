# Deployment Guide — Baker's Delight

This document covers deploying the Baker's Delight full-stack application.
Frontend and backend are deployed separately but live in the same repository.

---

## Prerequisites

- Node.js 18+
- A MongoDB Atlas account (or any MongoDB host)
- A frontend hosting provider (Vercel, Netlify, or similar)
- A backend hosting provider (Railway, Render, Fly.io, or similar)

---

## MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with a strong password
3. Add your deployment IP to the IP Access List (or use `0.0.0.0/0` for all IPs during development)
4. Copy the connection string — it will look like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/bakers-delight
   ```

---

## Backend deployment (Railway / Render)

### Environment variables to set on your hosting provider

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | A long random string (min 64 chars) — generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` |
| `PORT` | Set automatically by most providers |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your deployed frontend URL, e.g. `https://bakers-delight.vercel.app` |
| `BCRYPT_SALT_ROUNDS` | `12` |

### Deploy commands

```bash
# Build step (none needed — it's plain Node.js)
# Start command:
npm start
```

### Seed the production database

After deployment, seed the recipes once:

```bash
MONGODB_URI=<your-atlas-uri> npm run seed
```

---

## Frontend deployment (Vercel / Netlify)

### Environment variables to set

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your deployed backend URL + `/api`, e.g. `https://bakers-delight-api.railway.app/api` |

### Build settings

```
Build command:   npm run build
Publish directory: dist/
```

---

## Creating the first admin user

After deployment, create an admin via the API:

```bash
# Register normally
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Mukelani","email":"admin@bakersdelight.com","password":"StrongPass123!"}'

# Then manually update the role in MongoDB Atlas:
# db.users.updateOne({ email: "admin@bakersdelight.com" }, { $set: { role: "admin" } })
```

---

## Security checklist before going live

- [ ] `.env` file is in `.gitignore` and never committed
- [ ] MongoDB URI contains a strong password (not the example one)
- [ ] `JWT_SECRET` is at least 64 random characters
- [ ] `NODE_ENV` is set to `production`
- [ ] `CLIENT_URL` is set to the exact frontend domain (no trailing slash)
- [ ] MongoDB IP Access List restricts access to known IPs where possible
- [ ] HTTPS is enforced on both frontend and backend hosting

---

## Development vs production

| Setting | Development | Production |
|---|---|---|
| MongoDB | `localhost:27017` | Atlas connection string |
| API URL | `http://localhost:5000/api` | `https://your-api.com/api` |
| CORS | `localhost:5173` | Your frontend domain |
| `NODE_ENV` | `development` | `production` |
