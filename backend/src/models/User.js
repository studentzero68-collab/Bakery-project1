/**
 * User.js — Mongoose model for Baker's Delight users.
 *
 * Passwords are NEVER stored in plain text.
 * bcryptjs hashes the password before every save.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['user', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name must be 80 characters or fewer'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      // select: false ensures password is NOT returned in queries by default
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ROLES,
        message: `Role must be one of: ${ROLES.join(', ')}`,
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // Remove sensitive fields when serialising
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Pre-save hook — hash password
// ─────────────────────────────────────────────────────────────────────────────

userSchema.pre('save', async function hashPassword(next) {
  // Only hash if the password field has actually changed
  if (!this.isModified('password')) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Instance method — compare plain password against stored hash
// ─────────────────────────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

// ─────────────────────────────────────────────────────────────────────────────
// Index
// ─────────────────────────────────────────────────────────────────────────────

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
