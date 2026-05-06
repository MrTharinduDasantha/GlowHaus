// Password hashing helpers — used in registration, login, password reset, profile-update.

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Hash a plain-text password before saving to the DB
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

// Compare a plain-text password against a stored bcrypt hash
export const comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);
