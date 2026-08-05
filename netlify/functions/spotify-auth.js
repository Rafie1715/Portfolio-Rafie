export const handler = async () => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Spotify refresh token not configured' }),
    };
  }

  try {
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken, client_id: process.env.VITE_SPOTIFY_CLIENT_ID, client_secret: process.env.VITE_SPOTIFY_CLIENT_SECRET }).toString(),
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Failed to refresh token', details: error }) };
    }

    const data = await authResponse.json();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ access_token: data.access_token, expires_in: data.expires_in }) };
  } catch (err) {
    console.error('spotify-auth error', err);
    return { statusCode: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Internal error' }) };
  }
};