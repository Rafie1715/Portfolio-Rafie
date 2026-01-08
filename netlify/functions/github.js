exports.handler = async (event, context) => {
  const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;
  const USERNAME = "Rafie1715"; 

  if (!GITHUB_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing GitHub Token" }) };
  }

  const url = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const repos = await response.json();

    const portfolioRepos = repos
      .filter(repo => 
        !repo.fork &&         
        !repo.private         
      )
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)) 
      .slice(0, 6);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolioRepos),
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};