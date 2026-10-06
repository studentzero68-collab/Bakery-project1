/**
 * validate.js — express-validator result checker middleware.
 *
 * Add to any route after express-validator check() chains.
 * Sends a 400 with validation errors if any exist.
 *
 * Usage:
 *   router.post('/recipes', [...validationRules], validate, createRecipe);
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  next();
}

module.exports = validate;
