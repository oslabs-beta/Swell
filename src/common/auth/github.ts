// src/common/auth/github.ts

import { generateCodeVerifier, generateCodeChallenge } from './pkce';
import { nanoid } from 'nanoid';

/**
 * Generate a random “state” to prevent CSRF.
 */
export function generateState(): string {
  return nanoid(); // e.g., "V1StGXR8_Z5jdHi6B-myT"
}

/**
 * Build the GitHub OAuth URL (Auth Code + PKCE).
 */
export async function buildGitHubAuthUrl(): Promise<{
  url: string;
  codeVerifier: string;
  state: string;
}> {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const redirectUri = encodeURIComponent(process.env.OAUTH_REDIRECT_URI!);
  const scope = encodeURIComponent('read:user user:email');

  // 1. PKCE stuff
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // 2. State
  const state = generateState();

  // 3. Assemble URL
  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&response_type=code` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  return { url, codeVerifier, state };
}
