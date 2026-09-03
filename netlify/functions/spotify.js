export const handler = async () => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refreshToken) {
    return {
      statusCode: 503,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Spotify refresh token not configured',
      }),
    };
  }

  try {
    // Get new access token using refresh token
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.VITE_SPOTIFY_CLIENT_ID,
        client_secret: process.env.VITE_SPOTIFY_CLIENT_SECRET,
      }).toString(),
    });

    if (!authResponse.ok) {
      const error = await authResponse.json();
      console.error('Spotify auth error:', error);
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Failed to refresh Spotify token',
          details: error,
        }),
      };
    }

    const { access_token } = await authResponse.json();

    // Get currently playing track
    const currentlyPlayingResponse = await fetch(
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
      const recentlyPlayedResponse = await fetch(
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Spotify error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to fetch Spotify data',
      }),
    };
  }
};
