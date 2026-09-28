// Keep curated lists working while each server request has a strict size limit.
export async function fetchMovieDetails(ids) {
  const unique = [...new Set(ids)].filter(id => Number.isSafeInteger(id) && id > 0);
  const result = [];
  for (let index = 0; index < unique.length; index += 60) {
    const response = await fetch(`/api/movies?ids=${unique.slice(index, index + 60).join(',')}`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Movie details are temporarily unavailable.');
    const data = await response.json();
    if (Array.isArray(data)) result.push(...data);
  }
  return result;
}
