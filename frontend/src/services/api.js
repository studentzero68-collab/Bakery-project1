/**
 * api.js — centralised API service for Baker's Delight.
 *
 * All HTTP communication with the Express backend goes through this module.
 * Components never call fetch/axios directly — they use these functions.
 *
 * Base URL is configured via VITE_API_URL environment variable.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the stored JWT token from localStorage, or null.
 */
function getToken() {
  return localStorage.getItem('bd_token');
}

/**
 * Builds request headers, adding Authorization when a token is available.
 */
function headers(extra = {}) {
  const base = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) base['Authorization'] = `Bearer ${token}`;
  return base;
}

/**
 * Core request wrapper. Throws a descriptive Error on non-2xx responses.
 */
async function request(method, path, body) {
  const opts = {
    method,
    headers: headers(),
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message ?? `Request failed: ${res.status} ${res.statusText}`);
  }
  return json;
}

// ─────────────────────────────────────────────────────────────────────────────
// RECIPE ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/recipes
 * Supports optional query filters: category, audience
 */
export async function getRecipes(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.audience) params.set('audience', filters.audience);
  const query = params.toString() ? `?${params}` : '';
  const res = await request('GET', `/recipes${query}`);
  return res.data ?? [];
}

/**
 * GET /api/recipes/:id
 */
export async function getRecipeById(id) {
  const res = await request('GET', `/recipes/${id}`);
  return res.data;
}

/**
 * POST /api/recipes — Admin only
 */
export async function createRecipe(data) {
  const res = await request('POST', '/recipes', data);
  return res.data;
}

/**
 * PUT /api/recipes/:id — Admin only
 */
export async function updateRecipe(id, data) {
  const res = await request('PUT', `/recipes/${id}`, data);
  return res.data;
}

/**
 * DELETE /api/recipes/:id — Admin only
 */
export async function deleteRecipe(id) {
  return request('DELETE', `/recipes/${id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export async function register(name, email, password) {
  const res = await request('POST', '/auth/register', { name, email, password });
  if (res.token) localStorage.setItem('bd_token', res.token);
  return res;
}

/**
 * POST /api/auth/login
 */
export async function login(email, password) {
  const res = await request('POST', '/auth/login', { email, password });
  if (res.token) localStorage.setItem('bd_token', res.token);
  return res;
}

/**
 * GET /api/auth/me — requires authentication
 */
export async function getCurrentUser() {
  const res = await request('GET', '/auth/me');
  return res.data;
}

/**
 * Clears the stored token (client-side logout).
 */
export function clearToken() {
  localStorage.removeItem('bd_token');
}
