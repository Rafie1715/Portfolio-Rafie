export const handler = async (event) => {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const timeRange = event.queryStringParameters?.time_range || 'short_term';

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

    // Validate time_range parameter
    const validTimeRanges = ['short_term', 'medium_term', 'long_term'];
    const validTimeRange = validTimeRanges.includes(timeRange)
      ? timeRange
      : 'short_term';

    // Get user's top tracks
    const topTracksResponse = await fetch(
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
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
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
        error: 'Failed to fetch Spotify top tracks',
      }),
    };
  }
};
