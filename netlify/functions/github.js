import { webHandler } from './_shared/webHandler.js';
import { json } from './_shared/security.js';
import { fetchUpstream } from './_shared/upstream.js';
import { integrationEnv } from './_shared/integrationEnv.js';
export const handleEvent = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed." }, { Allow: "GET" });
  const GITHUB_TOKEN = integrationEnv('GITHUB_TOKEN');
  const USERNAME = "Rafie1715";

  if (!GITHUB_TOKEN) {
    return json(503, { error: 'Service temporarily unavailable.' });
  }

  const url = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`;

  try {
    const response = await fetchUpstream(url, {
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
        !repo.private && repo.name?.toLowerCase() !== USERNAME.toLowerCase()
      )
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6);

    return {
      statusCode: 200,
      headers: { 'X-Content-Type-Options': 'nosniff', 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60, s-maxage=300' },
      body: JSON.stringify(portfolioRepos),
    };

  } catch {

    return json(502, { error: 'Service temporarily unavailable.' });
  }
};

export default webHandler(handleEvent);
export const config = { path: '/api/github', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
