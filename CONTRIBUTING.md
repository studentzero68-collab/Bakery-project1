# Contributing to Baker's Delight

Thank you for your interest in contributing. This is a personal portfolio project but contributions that improve the application are welcome.

---

## Development setup

```bash
# Clone the repo
git clone https://github.com/studentzero68-collab/Bakery-project1.git
cd Bakery-project1

# Install all dependencies
npm run install:all

# Configure environment
cp backend/.env.example backend/.env    # fill in MongoDB URI and JWT secret
cp frontend/.env.example frontend/.env  # fill in VITE_API_URL

# Seed the database
cd backend && npm run seed && cd ..

# Start both servers (in separate terminals)
npm run dev:backend     # port 5000
npm run dev:frontend    # port 5173
```

---

## Running tests

```bash
npm run test:backend    # Jest + Supertest (uses mongodb-memory-server)
npm run test:frontend   # Vitest + React Testing Library
```

All tests must pass before opening a pull request.

---

## Code style

- Follow existing patterns in the codebase
- Use descriptive variable and function names
- Add JSDoc comments to new functions
- CSS modules for component styling (no global class pollution)
- Consistent API response format: `{ success, data }` or `{ success, message }`

---

## Git conventions

- Branch from `main`
- Use the commit prefix that matches the work:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code improvements without behaviour change
  - `docs:` for documentation
  - `chore:` for setup, config, tooling
  - `test:` for new or updated tests
- Write clear, present-tense commit messages

---

## Project structure recap

```
Bakery-project1/
├── frontend/    — React (Vite) application
├── backend/     — Express REST API
├── docs/        — Architecture and deployment docs
└── .github/     — CI workflows
```

---

*Built with flour, butter, and discipline — Mukelani N. Sindana*
