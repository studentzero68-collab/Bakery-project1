# Baker's Delight — Mukelani's Kitchen

> *"Some people express love through words. I express it through what comes out of the oven."*

---

## Project story

This project started as a vanilla **HTML + CSS + JavaScript** personal recipe/cookbook application.  
It has since evolved into a complete **full-stack web application** as part of a Full Stack Web Development journey.

```
HTML + CSS + JavaScript
        ↓
React (Vite)
        ↓
Node.js + Express
        ↓
REST API
        ↓
MongoDB + Mongoose
        ↓
JWT Authentication + Role-based Authorization
        ↓
Admin CRUD
        ↓
Automated Testing
        ↓
Deployment-ready
```

The original bakery identity — Baker's Delight, Mukelani's Kitchen, the recipes, the personality — is fully preserved.  
The goal was to upgrade the technology without destroying what made it personal.

---

## What is Baker's Delight?

A personal recipe/cookbook application. Every recipe comes with:

- Ingredients and step-by-step instructions
- Preparation time and cooking/baking time
- A quirky joke
- What the recipe symbolises (meaning)
- Who to make it for — **Family**, **Friend**, or **Romantic**

### Categories

- 🍰 **Desserts** — Sweet wins. The final boss of any meal.
- 🥞 **Breakfast** — Start your day like a main character.
- 🥗 **Lunch Bakes** — Savoury power-ups for the middle of the day.

---

## Technology stack

### Frontend
- React 18
- Vite
- React Router v6
- CSS custom properties (original bakery palette preserved)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- Express Validator

### Testing
- Jest
- Supertest (backend)
- React Testing Library (frontend)

---

## Project structure

```
Bakery-project1/
│
├── frontend/          — React application (Vite)
├── backend/           — Express REST API
├── docs/              — Architecture and project documentation
├── package.json       — Root scripts
├── .gitignore
└── README.md
```

See `frontend/README.md` and `backend/README.md` for detailed setup instructions.

---

## Supabase Environment Setup

1. Copy `.env.example` to `.env.local` inside the `frontend/` folder:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
2. Open `frontend/.env.local`
3. Add your Supabase Project URL
4. Add your Supabase Publishable Key
5. Save the file
6. Restart the Vite development server (`npm run dev`)

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

> **Important:** `.env.local` is listed in `.gitignore` and must never be committed to GitHub.  
> Get your credentials from [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Settings → API**.

---

## Quick start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- npm

### Install dependencies
```bash
npm run install:all
```

### Configure environment
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

### Run in development
```bash
# Terminal 1 — backend
npm run dev:backend

# Terminal 2 — frontend
npm run dev:frontend
```

### Run tests
```bash
npm run test:backend
npm run test:frontend
```

---

## Testing

```bash
# Backend (Jest + Supertest — uses mongodb-memory-server, no real DB needed)
npm run test:backend

# Frontend (Vitest + React Testing Library)
npm run test:frontend
```

### Backend test suites

| Suite | Tests | Coverage |
|---|---|---|
| `auth.test.js` | Register, login, /me endpoint | 17 tests |
| `recipes.test.js` | Full recipe CRUD, filtering | 19 tests |
| `authorization.test.js` | Role-based access control | 11 tests |
| **Total** | | **47 tests** |

### Frontend test suites

| Suite | Tests |
|---|---|
| `RecipeCard.test.jsx` | Card rendering, expand/collapse | 10 tests |
| `LoadingState.test.jsx` | Loading + error states | 9 tests |
| `RelationshipFilter.test.jsx` | Audience filter behavior | 6 tests |
| `Hero.test.jsx` | Hero section rendering | 5 tests |
| `helpers.test.js` | Utility functions | 12 tests |
| **Total** | **42 tests** |

---

## Authentication

- Register at `POST /api/auth/register`
- Login at `POST /api/auth/login` to receive a JWT
- Admin routes require `role: "admin"` — set this in the database or via seed

---

## API overview

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/recipes` | List recipes (filterable) | Public |
| GET | `/api/recipes/:id` | Get one recipe | Public |
| GET | `/api/recipes/category/:category` | Filter by category | Public |
| POST | `/api/recipes` | Create recipe | Admin |
| PUT | `/api/recipes/:id` | Update recipe | Admin |
| DELETE | `/api/recipes/:id` | Delete recipe | Admin |
| POST | `/api/auth/register` | Register | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user | Authenticated |

Full API documentation: `backend/README.md`

---

## Author

**Mukelani N. Sindana**  
Full Stack Web Developer in training | iHub Africa | Gauteng, South Africa  
Gamer · Anime fan · Disciplined baker

---

*Built with flour, butter, and discipline.*
