import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, clearToken } from '../services/api';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app, provides user + auth functions to all children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, try to restore session from existing token
  useEffect(() => {
    const token = localStorage.getItem('bd_token');
    if (!token) { setLoading(false); return; }

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * login — calls POST /api/auth/login, stores token, sets user.
   * Returns true on success, false on failure.
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * register — calls POST /api/auth/register, stores token, sets user.
   */
  const register = useCallback(async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await apiRegister(name, email, password);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * logout — clears token and user state.
   */
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuthContext — consume the AuthContext inside any component.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}

/**
 * useAuth — convenience alias for LoginPage and similar components.
 */
export function useAuth() {
  return useAuthContext();
}
