// netlify/functions/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// === OTAK AI (SYSTEM PROMPT) ===
// Di sini kita kasih tau AI siapa Rafie itu berdasarkan data portfolio Anda
const SYSTEM_PROMPT = `
You are an AI Assistant for Rafie Rojagat Bachri's Portfolio Website.
Your goal is to answer visitor questions about Rafie in a professional, friendly, and concise manner.

Here is Rafie's Data:
- Role: Undergraduate Informatics Student @ UPN Veteran Jakarta.
- Focus: Mobile Development (Kotlin, Flutter) & Web Development (React, Tailwind).
- Experience: 
  1. Head of Web Dev at KSM Multimedia (Teaching Front-end).
  2. IT Staff at HMIF UPNVJ (Managed CodeVox).
  3. Bangkit Academy Graduate (Mobile Cohort).
- Top Projects: 
  1. Planetku (Waste Management App with AI).
  2. CinemaZone (Movie Ticket App).
  3. Block Breaker (Game).
- Tech Stack: Kotlin, React, Python, Firebase, MySQL, Figma.
- Contact: rojagatrafie@gmail.com, LinkedIn: linkedin.com/in/rafie-rojagat.

Instructions:
- Answer in the same language as the user (Indonesian or English).
- Keep answers short and engaging (under 3 sentences if possible).
- If asked about something unrelated to Rafie, politely steer back to his portfolio.
- Use emojis occasionally to be friendly.
`;

export const handler = async (event) => {
  // Hanya terima method POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message, history } = JSON.parse(event.body);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to assist visitors with information about Rafie." }],
        },
        ...history, // Masukkan histori chat sebelumnya agar nyambung
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI sedang istirahat. Coba lagi nanti." }),
    };
  }
};