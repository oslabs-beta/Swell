// src/common/auth/pkce.ts

import crypto from 'crypto';

/**
 * Generate a cryptographically random string to use as the PKCE code_verifier.
 * Default length 128 bytes → Base64-URL string ~172 characters.
 */
export function generateCodeVerifier(length: number = 128): string {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/=/g, '')   // Remove padding
    .replace(/\+/g, '-') // URL-safe replace
    .replace(/\//g, '_');
}

/**
 * Compute the code_challenge = BASE64URL(SHA256(code_verifier))
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
