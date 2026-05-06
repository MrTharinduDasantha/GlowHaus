// Generates a human-friendly booking ID like "GH-A3X9P2".
// Avoids ambiguous characters (0/O, 1/I, etc.) so customers reading the ID off an email don't mis-type it.

import crypto from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 unambiguous chars
const ID_LENGTH = 6;

export const generateBookingId = () => {
  const bytes = crypto.randomBytes(ID_LENGTH);
  let id = "GH-";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
};
