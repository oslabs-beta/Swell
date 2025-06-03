// electron/auth/githubCallback.js

const axios = require('axios');
const keytar = require('keytar');

// In-memory store for pending PKCE/state
const pendingAuth = {};

/**
 * Express route handler for GET /auth/callback.
 * Exchanges code for token, stores it, notifies renderer, then redirects popup.
 */
module.exports = async (req, res, mainWindow) => {
  try {
    const { code, state } = req.query;

    // 1. Verify state
    if (!pendingAuth[state]) {
      console.error('⚠️ State mismatch or expired:', state);
      return res.status(403).send('Invalid state parameter');
    }

    // 2. Extract codeVerifier
    const { codeVerifier } = pendingAuth[state];
    delete pendingAuth[state];

    // 3. Exchange code for access_token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        // If NOT using PKCE, also send client_secret
        // But here we assume PKCE→ omit client_secret
        code,
        redirect_uri: process.env.OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token: accessToken, error, error_description } = tokenResponse.data;
    if (error) {
      console.error('🚨 Token exchange error:', error, error_description);
      return res.status(500).send('OAuth token exchange failed');
    }

    // 4. Store token in OS keychain
    await keytar.setPassword('swell', 'github', accessToken);

    // 5. Notify renderer
    mainWindow.webContents.send('oauth:successfulLogin');

    // 6. Redirect popup to a custom URI so renderer can close it
    return res.redirect('swell://oauth-complete');
  } catch (err) {
    console.error('💥 Callback handler exception:', err);
    return res.status(500).send('Internal Server Error');
  }
};

/**
 * Register a PKCE/state pair so callback can validate later.
 */
module.exports.registerPendingAuth = (state, codeVerifier, mainWindow) => {
  pendingAuth[state] = { codeVerifier, mainWindow };
};
