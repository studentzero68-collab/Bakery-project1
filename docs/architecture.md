# Full-Stack Architecture — Baker's Delight

This document describes the planned architecture for the full-stack transformation.

---

## System overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER                                 │
│                                                             │
│   React (Vite)  ←→  React Router  ←→  Components/Pages     │
│         ↓                                                   │
│   API Service (axios / fetch)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP / JSON
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER                            │
│                                                             │
│   Routes → Controllers → Middleware → Services              │
│         ↓                                                   │
│   JWT Authentication Middleware                             │
│   Role Authorisation Middleware                             │
└───────────────────────┬─────────────────────────────────────┘
                        │  Mongoose ODM
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB                                   │
│                                                             │
│   recipes collection                                        │
│   users collection                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication flow

```
User fills login form
        ↓
POST /api/auth/login
        ↓
Express verifies credentials
        ↓
bcryptjs compares hashed password
        ↓
JWT signed with secret
        ↓
Token returned to client
        ↓
Frontend stores token (localStorage)
        ↓
Token sent as Authorization: Bearer <token>
        ↓
Auth middleware verifies token on protected routes
        ↓
Role middleware checks user.role === 'admin'
```

---

## Request lifecycle (recipe CRUD)

```
React component
        ↓
api.js service function
        ↓
HTTP request (with optional JWT header)
        ↓
Express router
        ↓
Auth middleware (if protected)
        ↓
Role middleware (if admin-only)
        ↓
Controller function
        ↓
Mongoose model method
        ↓
MongoDB query
        ↓
JSON response { success: true, data: {} }
        ↓
React state updated
        ↓
UI re-renders
```

---

## API response standard

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Paginated list (future)
```json
{
  "success": true,
  "data": [],
  "count": 15,
  "total": 15
}
```

---

## Data models

### Recipe
```
title        String  required
category     Enum    dessert | breakfast | lunch
description  String
joke         String
meaning      String
prepTime     String
cookTime     String
ingredients  [String]
steps        [String]
audiences    [Enum]  family | friend | romantic
image        String  (URL)
video        String  (URL, optional)
createdBy    ObjectId ref User
createdAt    Date    auto
updatedAt    Date    auto
```

### User
```
name         String  required
email        String  required unique
password     String  required (hashed, never plain text)
role         Enum    user | admin  (default: user)
createdAt    Date    auto
```

---

## Frontend component tree

```
App
├── Navbar
├── Routes
│   ├── / → HomePage
│   │   ├── Hero
│   │   ├── CategoryNavigation
│   │   └── RecipeGrid
│   │       ├── CategorySection
│   │       └── RecipeCard
│   │
│   ├── /recipes → RecipesPage
│   │   ├── CategoryNavigation
│   │   ├── RelationshipFilter (sidebar)
│   │   └── RecipeGrid
│   │
│   ├── /recipes/:id → RecipeDetailPage
│   │   └── RecipeDetails
│   │
│   ├── /login → LoginPage
│   │
│   ├── /admin → AdminDashboard (protected)
│   │   └── RecipeTable
│   │
│   ├── /admin/recipes/new → RecipeFormPage (protected)
│   │   └── RecipeForm
│   │
│   └── /admin/recipes/:id/edit → RecipeFormPage (protected)
│       └── RecipeForm
│
└── Footer
```

---

## Folder structure

```
Bakery-project1/
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/           — images migrated from original
│   │   ├── components/       — reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CategoryNavigation.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeGrid.jsx
│   │   │   ├── RecipeDetails.jsx
│   │   │   ├── RelationshipFilter.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/            — route-level page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── RecipesPage.jsx
│   │   │   ├── RecipeDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── RecipeFormPage.jsx
│   │   ├── services/
│   │   │   └── api.js        — all API calls centralised here
│   │   ├── hooks/
│   │   │   ├── useRecipes.js
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         — MongoDB connection
│   │   ├── controllers/
│   │   │   ├── recipeController.js
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js       — JWT verification
│   │   │   ├── authorize.js  — role checking
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Recipe.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── recipeRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── seed/
│   │   │   ├── recipes.js    — recipe seed data
│   │   │   └── seed.js       — seed runner script
│   │   ├── tests/
│   │   │   ├── auth.test.js
│   │   │   ├── recipes.test.js
│   │   │   └── authorization.test.js
│   │   └── server.js         — Express entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── original-app.md       — original vanilla project documented
│   └── architecture.md       — this file
│
├── README.md
├── .gitignore
└── package.json
```

---

## Security considerations

- Passwords hashed with bcryptjs (saltRounds: 12)
- JWT secret stored in environment variable only
- MongoDB URI stored in environment variable only
- `.env` files never committed
- CORS restricted to known frontend origin
- Input validation on all write endpoints
- Admin endpoints require both valid JWT and role === 'admin'
- No sensitive data returned in API responses (password field excluded)
