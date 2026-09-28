import { webHandler } from './_shared/webHandler.js';
import { json } from './_shared/security.js';
import { fetchUpstream } from './_shared/upstream.js';
export const handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed." }, { Allow: "GET" });
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

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
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
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

    // Get currently playing track
    const currentlyPlayingResponse = await fetchUpstream(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // Handle 204 No Content (nothing playing)
    if (currentlyPlayingResponse.status === 204) {
      // Try to get last played track
      const recentlyPlayedResponse = await fetchUpstream(
        'https://api.spotify.com/v1/me/player/recently-played?limit=1',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!recentlyPlayedResponse.ok) {
        return {
          statusCode: 200,
        headers: {
          'Cache-Control': 'public, max-age=15, s-maxage=30',
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
          body: JSON.stringify({
            error: 'Not playing anything',
            is_playing: false,
          }),
        };
      }

      const recentlyPlayed = await recentlyPlayedResponse.json();
      const lastTrack = recentlyPlayed.items[0];

      return {
        statusCode: 200,
        headers: {
          'Cache-Control': 'public, max-age=15, s-maxage=30',
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
        body: JSON.stringify({
          item: lastTrack.track,
          is_playing: false,
        }),
      };
    }

    if (!currentlyPlayingResponse.ok) {
      throw new Error('Failed to fetch currently playing track');
    }

    const data = await currentlyPlayingResponse.json();

    return {
      statusCode: 200,
        headers: {
          'Cache-Control': 'public, max-age=15, s-maxage=30',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
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
        error: 'Failed to fetch Spotify data',
      }),
    };
  }
};

export default webHandler(handler);
export const config = { path: '/api/spotify', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
