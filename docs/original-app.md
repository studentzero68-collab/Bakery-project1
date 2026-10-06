# Original Baker's Delight — Vanilla HTML/CSS/JS Application

This document records the state of the Baker's Delight project **before** the full-stack transformation.
It exists so the Git history clearly shows the starting point.

---

## Application identity

- **Name:** Baker's Delight — Mukelani's Kitchen
- **Author:** Mukelani N. Sindana
- **Purpose:** Personal recipe/cookbook web application

---

## Original technology stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Behaviour | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Playfair Display, DM Sans |
| Images | Unsplash URLs + local assets |
| Version control | Git & GitHub |

---

## Original file structure

```
Bakery-project1/
├── index.html        — single-page application
├── style.css         — all styling
├── script.js         — all interactivity
├── README.md         — project documentation
└── assets/
    ├── 1096626578034021546.jpg
    ├── download (4).jpg
    └── The-Chocolate-Chip-Cookie-of-my-dreams-_2.webp
```

---

## Original features

### Hero section
- "Baker's Delight" heading with gold highlight
- "Mukelani's Kitchen" badge
- Personality tags: Gamer-approved, Anime-worthy, Disciplined Baker, Made with love
- Warm gradient background with subtle diagonal pattern

### Category navigation (sticky)
- All Recipes
- Desserts
- Breakfast
- Lunch Bakes

### Recipe sections
Each section contains a header with coloured dot indicator and a CSS grid of recipe cards.

### Recipe cards
Each card displays:
- Food image (real Unsplash photo or styled placeholder)
- Recipe title
- Quirky joke (left-bordered italic block)
- Prep time and cook time
- Meaning / symbolism of the recipe
- Relationship tags (Family / Friend / Romantic)
- Expand/collapse "Show Recipe" button
- Ingredients list (hidden by default)
- Optional video placeholder (hidden by default)
- Step-by-step instructions (hidden by default)

### Audience/relationship sidebar filter
- All
- Family
- Friends
- Romantic
- Collapsible on mobile via toggle button

### Footer
- "Built by Mukelani N. Sindana"

---

## Original recipe inventory

### Desserts (4 recipes)
| Recipe | Prep | Bake | Audiences |
|---|---|---|---|
| Chocolate Chip Cookies | 15 min | 12 min | Family, Friend, Romantic |
| Lava Cake | 20 min | 12 min | Romantic, Friend |
| Fudgy Brownies | 15 min | 25 min | Family, Friend, Romantic |
| Classic Cheesecake | 30 min | 55 min | Romantic, Family |

### Breakfast (5 recipes)
| Recipe | Prep | Cook | Audiences |
|---|---|---|---|
| Fluffy Pancakes | 10 min | 15 min | Family, Romantic |
| Banana Bread | 15 min | 60 min | Family, Friend |
| Cinnamon French Toast | 5 min | 10 min | Family, Romantic |
| Blueberry Muffins | 10 min | 22 min | Family, Friend |
| Strawberry Shortcake | 20 min | 18 min | Family, Romantic |

### Lunch Bakes (6 recipes)
| Recipe | Prep | Bake | Audiences |
|---|---|---|---|
| Bacon & Cheese Quiche | 20 min | 35 min | Family, Friend |
| Spinach & Feta Rolls | 15 min | 20 min | Friend, Family |
| Savoury Herb Scones | 10 min | 18 min | Friend, Family |
| Olive & Tomato Focaccia | 20 min | 25 min | Family, Friend |
| Caprese Pizza | 15 min | 15 min | Friend, Romantic |
| Garlic Knots | 10 min | 12 min | Family, Friend |

---

## Original colour palette

| Variable | Value | Usage |
|---|---|---|
| `--cream` | `#e8dcc8` | Page background |
| `--cream-dark` | `#dcc8b0` | Subtle depth |
| `--warm-white` | `#f0e8dc` | Card backgrounds |
| `--brown` | `#2a1f15` | Primary text |
| `--brown-soft` | `#4a3a2a` | Secondary text |
| `--brown-muted` | `#6b5f52` | Muted text |
| `--gold` | `#a67d52` | Brand accent |
| `--gold-light` | `#d4b084` | Borders, placeholders |
| `--honey` | `#b8885c` | Hover states |
| `--blush` | `#e0c4b0` | Hover backgrounds |

---

## Original JavaScript behaviour

- `toggleCard(btn)` — show/hide recipe details
- `assignRecipeAudienceTags()` — reads CSS classes, writes `data-audience` attributes
- `applyRelationshipFilter()` — hides/shows cards and sections based on active filter
- `initCategoryFilter()` — handles sticky category nav tab switching
- `initRelationshipFilter()` — handles sidebar filter toggle and audience buttons

---

## Known limitations (pre-transformation)

- All recipe data is hardcoded in HTML
- No backend — all data is static
- No authentication or authorisation
- No admin interface for managing recipes
- No database — adding recipes requires editing HTML
- Single large HTML file (no component architecture)
- No automated tests
- No API

---

## What the full-stack transformation will add

See `docs/architecture.md` for the planned architecture.
