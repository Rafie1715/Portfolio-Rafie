import { HttpError, errorResponse } from './security.js';

// Adapt existing handlers to Netlify's modern API so config.path and edge rate limits apply.
// Bound the stream even if the caller omits or falsifies Content-Length.
export async function readBoundedBody(request, maxBytes) {
    if (Number(request.headers.get('content-length')) > maxBytes) throw new HttpError(413, 'Request body too large.');
    if (request.body) {
      const reader = request.body.getReader();
      const chunks = [];
      let length = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > maxBytes) { await reader.cancel(); throw new HttpError(413, 'Request body too large.'); }
        chunks.push(Buffer.from(value));
      }
      return Buffer.concat(chunks).toString('utf8');
    }
    return '';
}

export const webHandler = (handler, maxBytes = 32768) => async request => {
  try {
    const body = await readBoundedBody(request, maxBytes);
    const result = await handler({ httpMethod: request.method, headers: Object.fromEntries(request.headers), queryStringParameters: Object.fromEntries(new URL(request.url).searchParams), body, isBase64Encoded: false });
    return new Response(result.body, { status: result.statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...result.headers } });
  } catch (error) {
    const result = errorResponse(error);
    return new Response(result.body, { status: result.statusCode, headers: result.headers });
  }
};
