import { webHandler } from './_shared/webHandler.js';
import { json } from './_shared/security.js';
import { fetchUpstream } from './_shared/upstream.js';
import { integrationEnv } from './_shared/integrationEnv.js';
export const handleEvent = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed." }, { Allow: "GET" });
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientId = integrationEnv('SPOTIFY_CLIENT_ID');
  const clientSecret = integrationEnv('SPOTIFY_CLIENT_SECRET');
  if (!clientId || !clientSecret) return json(503, { error: 'Spotify is not configured.' });
  const timeRange = event.queryStringParameters?.time_range || 'short_term';

  if (!refreshToken) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify({
        error: 'Spotify refresh token not configured',
      }),
    };
  }

  try {
    // Get new access token using refresh token
    const authResponse = await fetchUpstream('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
    });

    if (!authResponse.ok) {


      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
        body: JSON.stringify({
          error: 'Failed to refresh Spotify token',

        }),
      };
    }

    const { access_token } = await authResponse.json();

    // Validate time_range parameter
    const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
    const validTimeRange = validTimeRanges.includes(timeRange)
      ? timeRange
      : 'short_term';

    // Get user's top tracks
    const topTracksResponse = await fetchUpstream(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${validTimeRange}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!topTracksResponse.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await topTracksResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
      },
      body: JSON.stringify(data),
    };
  } catch {

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
      body: JSON.stringify({
        error: 'Failed to fetch Spotify top tracks',
      }),
    };
  }
};

export default webHandler(handleEvent);
export const config = { path: '/api/spotify-top', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
