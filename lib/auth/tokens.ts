import 'server-only';
import { createHash, randomBytes } from 'node:crypto';

export const RESET_TOKEN_TTL_MINUTES = 60;

export function generateResetToken(): { plain: string; hash: string } {
  const plain = randomBytes(32).toString('hex');
  return { plain, hash: hashToken(plain) };
}

export function hashToken(plain: string): string {
  return createHash('sha256').update(plain).digest('hex');
}

export function buildResetTokenExpiry(): Date {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + RESET_TOKEN_TTL_MINUTES);
  return expires;
}
