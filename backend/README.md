# Baker's Delight — Backend API

Express.js REST API for Baker's Delight, backed by MongoDB.

---

## Setup

```bash
# Install dependencies
npm install

# Copy environment file and fill in values
cp .env.example .env

# Start in development mode (requires nodemon)
npm run dev

# Start in production
npm start

# Seed the database with all original recipes
npm run seed

# Force re-seed (clears existing recipes first)
npm run seed -- --force

# Run tests
npm test
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `CLIENT_URL` | No | Frontend URL for CORS |
| `BCRYPT_SALT_ROUNDS` | No | Password hashing strength (default: `12`) |
| `TEST_MONGODB_URI` | No | Separate DB for tests |

---

## API Reference

### Base URL

```
http://localhost:5000/api
```

### Health check

```
GET /api/health
```

---

### Recipe endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/recipes` | List all recipes | Public |
| GET | `/api/recipes?category=dessert` | Filter by category | Public |
| GET | `/api/recipes?audience=family` | Filter by audience | Public |
| GET | `/api/recipes?category=dessert&audience=romantic` | Combined filter | Public |
| GET | `/api/recipes/category/:category` | Category route | Public |
| GET | `/api/recipes/:id` | Get single recipe | Public |
| POST | `/api/recipes` | Create recipe | Admin |
| PUT | `/api/recipes/:id` | Update recipe | Admin |
| DELETE | `/api/recipes/:id` | Delete recipe | Admin |

### Auth endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user | Authenticated |

---

### Response format

**Success:**
```json
{ "success": true, "data": {} }
```

**List:**
```json
{ "success": true, "data": [], "count": 15 }
```

**Error:**
```json
{ "success": false, "message": "Recipe not found" }
```

---

### HTTP status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

### Authentication

Send the JWT in the Authorization header:

```
Authorization: Bearer <token>
```

---

### Recipe categories

`dessert` | `breakfast` | `lunch`

### Audience values

`family` | `friend` | `romantic`

---

## Project structure

```
src/
├── config/
│   └── db.js              — MongoDB connection
├── controllers/
│   ├── recipeController.js
│   └── authController.js
├── middleware/
│   ├── auth.js            — JWT protect + authorize
│   ├── errorHandler.js    — centralised error handling
│   └── validate.js        — express-validator result checker
├── models/
│   ├── Recipe.js
│   └── User.js
├── routes/
│   ├── recipeRoutes.js
│   └── authRoutes.js
├── seed/
│   ├── recipes.js         — all original recipe data
│   └── seed.js            — seed runner script
├── tests/
│   ├── auth.test.js
│   ├── recipes.test.js
│   └── authorization.test.js
├── utils/
│   ├── AppError.js        — custom error class
│   ├── response.js        — consistent response helpers
│   └── tokenHelper.js     — JWT utilities
├── app.js                 — Express app factory
└── server.js              — server entry point
```

---

## Testing

Tests use Jest + Supertest against a separate test database (`TEST_MONGODB_URI`).

```bash
npm test
```
