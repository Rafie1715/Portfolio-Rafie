exports.handler = async (event, context) => {
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const STEAM_ID = process.env.VITE_STEAM_ID;

  if (!API_KEY || !STEAM_ID) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing Env Vars" }) };
  }

  const API_URL = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=1&include_played_free_games=1`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.response || !data.response.games) {
        return { statusCode: 200, body: JSON.stringify([]) };
    }

    const sortedGames = data.response.games.sort((a, b) => b.playtime_forever - a.playtime_forever);

    const topGames = sortedGames.slice(0, 10);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(topGames),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};