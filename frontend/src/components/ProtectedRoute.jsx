import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import LoadingState from './LoadingState';

/**
 * ProtectedRoute — guards routes that require authentication or admin role.
 *
 * Props:
 *   adminOnly  — if true, also requires user.role === 'admin'
 *   children   — the protected component to render
 */
function ProtectedRoute({ adminOnly = false, children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <LoadingState message="Checking credentials…" />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
