/**
 * response.js — consistent API response helpers.
 *
 * Every API response follows the same shape:
 *   Success:  { success: true,  data: ..., message?: string }
 *   Error:    { success: false, message: string }
 *   List:     { success: true,  data: [...], count: N }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [status=200]
 * @param {string} [message]
 */
function success(res, data, status = 200, message) {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(status).json(body);
}

/**
 * Send a successful list response with count.
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {number} [status=200]
 */
function list(res, data, status = 200) {
  return res.status(status).json({ success: true, data, count: data.length });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [status=500]
 */
function error(res, message, status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, list, error };
