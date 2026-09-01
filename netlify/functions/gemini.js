import { GoogleGenAI } from "@google/genai";
import {
  buildPortfolioSystemInstruction,
  getSuggestedActionIds,
} from "./_shared/portfolio-context.js";

const MAX_BODY_LENGTH = 16_000;
const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_ITEMS = 8;
const MAX_HISTORY_TEXT_LENGTH = 800;
const GEMINI_TIMEOUT_MS = 12_000;

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

const jsonResponse = (status, payload, headers = {}) => new Response(
  JSON.stringify(payload),
  {
    status,
    headers: { ...responseHeaders, ...headers },
  },
);

const invalidInput = (message) => jsonResponse(400, {
  error: { code: "invalid_input", message },
});

const sanitizeHistory = (history) => {
  if (history === undefined) return [];
  if (!Array.isArray(history)) return null;

  const sanitized = [];

  for (const entry of history.slice(-MAX_HISTORY_ITEMS)) {
    if (!entry || !["user", "model"].includes(entry.role) || typeof entry.text !== "string") {
      return null;
    }

    const text = entry.text.trim();
    if (!text || text.length > MAX_HISTORY_TEXT_LENGTH) return null;
    if (entry.role === "model" && sanitized.length === 0) continue;
    if (sanitized.at(-1)?.role === entry.role) continue;

    sanitized.push({ role: entry.role, parts: [{ text }] });
  }

  // A chat history must contain complete user-model turns. The current user
  // message is sent separately below.
  if (sanitized.at(-1)?.role === "user") sanitized.pop();

  return sanitized;
};

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: responseHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error: { code: "method_not_allowed", message: "Method not allowed." },
    }, { Allow: "POST" });
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_LENGTH) {
    return jsonResponse(413, {
      error: { code: "payload_too_large", message: "Request body is too large." },
    });
  }

  let payload;
  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > MAX_BODY_LENGTH) {
      return invalidInput("A JSON request body is required.");
    }
    payload = JSON.parse(rawBody);
  } catch {
    return invalidInput("The request body must be valid JSON.");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return invalidInput("The request body must be a JSON object.");
  }

  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return invalidInput(`Message must contain between 1 and ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const history = sanitizeHistory(payload.history);
  if (history === null) {
    return invalidInput("Chat history contains an invalid entry.");
  }

  const locale = payload.locale === "id" ? "id" : "en";
  if (!process.env.GEMINI_API_KEY) {
    return jsonResponse(503, {
      error: { code: "service_unavailable", message: "The assistant is not configured." },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history,
      config: {
        systemInstruction: buildPortfolioSystemInstruction(locale),
        temperature: 0.2,
        maxOutputTokens: 320,
        thinkingConfig: { thinkingBudget: 0 },
        httpOptions: { timeout: GEMINI_TIMEOUT_MS },
      },
    });

    const result = await chat.sendMessage({ message });
    const reply = result.text?.trim();

    if (!reply) {
      return jsonResponse(502, {
        error: { code: "empty_response", message: "The assistant returned an empty response." },
      });
    }

    return jsonResponse(200, {
      reply,
      actions: getSuggestedActionIds(message),
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError"
      || error?.name === "RequestTimeoutError"
      || /timed?\s*out|timeout/i.test(error?.message || "");

    console.error("Gemini request failed", {
      name: error?.name || "Error",
      message: error?.message || "Unknown provider error",
    });

    return jsonResponse(timedOut ? 504 : 502, {
      error: {
        code: timedOut ? "timeout" : "provider_error",
        message: timedOut
          ? "The assistant took too long to respond."
          : "The assistant is temporarily unavailable.",
      },
    });
  }
};

export const config = {
  path: "/api/chat",
  rateLimit: {
    windowLimit: 12,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
