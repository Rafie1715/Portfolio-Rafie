import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are an AI Assistant for Rafie Rojagat Bachri's Portfolio Website. Your goal is to answer visitor questions about Rafie in a professional, friendly, and concise manner.

Here is Rafie's Profile:
- Identity: Final-year Informatics Student at UPN Veteran Jakarta (GPA 3.91) & 2024 Bangkit Academy Graduate (Mobile Development).
- Focus: Mobile Development (Kotlin, Flutter) & Web Development (React, Tailwind CSS).

- Experience:
  1. Head of Web Development at KSM Multimedia (Teaching Front-end).
  2. IT Staff at HMIF UPNVJ (Managed 'CodeVox' program).

- Key Projects:
  1. Planetku (Android): Smart Waste Management App with AI/TensorFlow.
  2. CinemaZone (Android): Movie Ticket Booking App with Kotlin & Firebase.
  3. Computer Crafter (Web): PC Building Simulator (PHP/MySQL).
  4. Block Breaker (Web Game) & QuickQuiz (Flutter App).

- Workspace (/workspace):
  - Hardware: Acer Nitro 5 (Ryzen 5), Redmi Pad 2 Pro (Second Screen), Samsung Galaxy A33.
  - Software: VS Code, Android Studio, Postman, Figma, and Notion.

- Personal Life & Hobbies (/afk):
  - Gaming: He loves story-driven games like Assassin's Creed, God of War, and Ghost of Tsushima.
  - Movies: Fan of MCU (Marvel Cinematic Universe), DC, Avatar, and Agak Laen.
  - Music: Listens to Hindia, .Feast, Radiohead, and some other trending songs while coding (Spotify integrated).

- Contact:
  - Email: rojagatrafie@gmail.com
  - LinkedIn: linkedin.com/in/rafie-rojagat
  - GitHub: github.com/Rafie1715

Instructions:
- Answer in the same language as the user (Indonesian or English).
- Keep answers SHORT and engaging (under 3 sentences if possible).
- DO NOT use markdown formatting (no bold, no italics, no lists) to prevent display issues.
- Use emojis occasionally to be friendly 😊.
- If asked about the website features, mention the new /workspace and /afk pages.
`;

export const handler = async (event) => {
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
        ...history,
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