# Baker's Delight — Frontend

React + Vite frontend for the Baker's Delight full-stack application.

---

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env: set VITE_API_URL to your backend URL

# Run in development (requires backend running on port 5000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## Structure

```
src/
├── assets/          — static images from original project
├── components/      — reusable UI components
├── pages/           — route-level page components
├── services/
│   └── api.js       — ALL API calls go through here
├── hooks/
│   ├── useRecipes.js
│   └── useAuth.js
├── App.jsx          — router and layout
├── main.jsx         — React entry point
└── index.css        — global styles (original bakery palette)
```

---

## Key components

| Component | Purpose |
|---|---|
| `Navbar` | Top navigation, auth controls |
| `Hero` | Landing page hero section |
| `CategoryNavigation` | Sticky category tabs + layout |
| `CategorySection` | Individual category block |
| `RecipeGrid` | Grid renderer (grouped or flat) |
| `RecipeCard` | Individual recipe card with expand/collapse |
| `RecipeDetails` | Full recipe page view |
| `RelationshipFilter` | Audience sidebar filter |
| `LoadingState` | Loading spinner |
| `ErrorState` | Error display |
| `ProtectedRoute` | Auth/admin route guard |
| `RecipeForm` | Create/edit recipe form |

---

## Testing

```bash
npm test        # single run
npm run test:watch   # watch mode
```

---

## Deployment

Build: `npm run build` → outputs to `dist/`

Set `VITE_API_URL` to the production backend URL in your deployment environment variables.

Recommended: Vercel, Netlify, or serve `dist/` via Express static middleware.
