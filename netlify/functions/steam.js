exports.handler = async (event, context) => {
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const STEAM_ID = process.env.VITE_STEAM_ID;

  if (!API_KEY || !STEAM_ID) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing Env Vars" }) };
  }

  // 1. URL Existing (Owned Games & Profile)
  const GAMES_URL = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=1&include_played_free_games=1`;
  const PROFILE_URL = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`;
  
  // 2. URL BARU (Recently Played - 2 Minggu Terakhir)
  const RECENT_URL = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json`;

  try {
    // 3. Fetch ketiganya secara paralel
    const [gamesRes, profileRes, recentRes] = await Promise.all([
        fetch(GAMES_URL),
        fetch(PROFILE_URL),
        fetch(RECENT_URL)
    ]);

    const gamesData = await gamesRes.json();
    const profileData = await profileRes.json();
    const recentData = await recentRes.json();

    // Logic Lama: Filter Most Played
    let topGames = [];
    if (gamesData.response && gamesData.response.games) {
        topGames = gamesData.response.games
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 30);
    }

    // Logic Lama: User Profile
    const playerInfo = profileData.response.players[0];

    // Logic BARU: Ambil Recently Played
    const recentGames = recentData.response.games || [];

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({
          games: topGames,
          // Kirim data user
          user: {
              personaname: playerInfo.personaname,
              avatar: playerInfo.avatarfull,
              status: playerInfo.personastate,
              gameextrainfo: playerInfo.gameextrainfo || null,
              profileurl: playerInfo.profileurl
          },
          // Kirim data recent baru ke frontend
          recent: recentGames 
      }),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};