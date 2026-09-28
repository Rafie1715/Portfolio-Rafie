export async function recordEngagement(input) {
  const response = await fetch('/api/engagement', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Unable to save. Please try again later.');
}
