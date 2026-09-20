// Never distribute owner access tokens. Tombstone for older clients.
export const handler = async () => ({ statusCode: 410, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'This endpoint is no longer available.' }) });
