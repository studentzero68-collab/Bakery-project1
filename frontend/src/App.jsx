import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import RecipeFormPage from './pages/RecipeFormPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App — root component, defines all routes.
 *
 * Routes:
 *   /                      → HomePage (hero + all category sections)
 *   /recipes               → RecipesPage (filterable recipe grid)
 *   /recipes/:id           → RecipeDetailPage (single recipe view)
 *   /login                 → LoginPage
 *   /admin                 → AdminDashboard (admin only)
 *   /admin/recipes/new     → RecipeFormPage (admin only)
 *   /admin/recipes/:id/edit → RecipeFormPage (admin only)
 */
function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app">
        <Navbar />
        <main className="page-wrapper" id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recipes/new"
              element={
                <ProtectedRoute adminOnly>
                  <RecipeFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recipes/:id/edit"
              element={
                <ProtectedRoute adminOnly>
                  <RecipeFormPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
