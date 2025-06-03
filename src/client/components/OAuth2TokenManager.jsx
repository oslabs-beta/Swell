import React, { useState } from 'react';

const OAuth2TokenManager = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [scope, setScope] = useState('');
  const [tokenEndpoint, setTokenEndpoint] = useState('');
  const [token, setToken] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope,
        }),
      });

      const data = await response.json();
      setToken(data.access_token);
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  };

  return (
    <div style={{ padding: '1rem', background: '#eee', borderRadius: '8px' }}>
      <h3>OAuth2 Token Manager</h3>
      <input
        placeholder="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{ display: 'block', margin: '5px 0', width: '100%' }}
      />
      <input
        placeholder="Client Secret"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        style={{ display: 'block', margin: '5px 0', width: '100%' }}
      />
      <input
        placeholder="Scope"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        style={{ display: 'block', margin: '5px 0', width: '100%' }}
      />
      <input
        placeholder="Token Endpoint"
        value={tokenEndpoint}
        onChange={(e) => setTokenEndpoint(e.target.value)}
        style={{ display: 'block', margin: '5px 0', width: '100%' }}
      />
      <button onClick={fetchToken} style={{ marginTop: '10px' }}>
        Fetch Token
      </button>

      {token && (
        <div style={{ marginTop: '10px' }}>
          <h4>Access Token:</h4>
          <textarea value={token} readOnly rows={5} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default OAuth2TokenManager;
