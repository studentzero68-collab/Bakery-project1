import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { deleteRecipe } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboard — /admin
 * Lists all recipes with create / edit / delete controls.
 * Accessible only to users with role === 'admin'.
 */
function AdminDashboard() {
  const { recipes, loading, error, refetch } = useRecipes();

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteRecipe(id);
      refetch();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Recipe Management</h1>
          <p className={styles.subtitle}>Baker's Delight — Admin Dashboard</p>
        </div>
        <Link to="/admin/recipes/new" className="btn-primary">
          + New Recipe
        </Link>
      </div>

      {loading && <LoadingState message="Loading recipes…" />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Audiences</th>
                <th>Prep</th>
                <th>Cook</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No recipes yet. <Link to="/admin/recipes/new">Add the first one.</Link>
                  </td>
                </tr>
              )}
              {recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td className={styles.titleCell}>{recipe.title}</td>
                  <td>
                    <span className={`${styles.catBadge} ${styles[recipe.category]}`}>
                      {recipe.category}
                    </span>
                  </td>
                  <td className={styles.audiences}>
                    {recipe.audiences?.map((a) => (
                      <span key={a} className={`${styles.audTag} rel-${a === 'romantic' ? 'lover' : a}`}>
                        {a}
                      </span>
                    ))}
                  </td>
                  <td>{recipe.prepTime}</td>
                  <td>{recipe.cookTime}</td>
                  <td className={styles.actions}>
                    <Link
                      to={`/admin/recipes/${recipe._id}/edit`}
                      className="btn-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(recipe._id, recipe.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
