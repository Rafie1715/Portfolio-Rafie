# 🚀 My Personal Portfolio v2.0

> My digital playground built with React, Tailwind CSS, and AI integration.

Check it out live here: [**https://rafie-dev.netlify.app**](https://rafie-dev.netlify.app)

## ✨ Key Features
- **🤖 AI Assistant:** Integrated custom chatbot powered by **Google Gemini API**.
- **🎵 Live Music:** Real-time **Spotify API** integration (Now Playing & Top Tracks).
- **🕹️ Interactive UI:** 3D physics-based nametag and custom cursor interactions.
- **⚡ Performance:** Lazy loading, WebP optimization, and Lighthouse score 95+.

## 🛠️ Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Netlify Functions (Serverless)
- **Deployment:** Netlify

## 🔐 Admin Security Setup
- Add an email allowlist in your `.env` file:
	- `VITE_ADMIN_EMAILS=your-admin@email.com,another-admin@email.com`
- Frontend admin routes now check authenticated users against this allowlist.
- Backend write access must still be protected by Firestore Rules.

### Firestore Rules
- A template rules file is included at `firestore.rules`.
- The rules support three admin checks:
	- custom claim `admin: true` (recommended)
	- verified admin email allowlist
	- optional UID allowlist fallback
- Deploy rules with Firebase CLI:
	- `firebase deploy --only firestore:rules`
- Public users can still read projects, but create/update/delete is admin-only.

### Recommended (Custom Claim)
- Set custom claim for your admin account using Firebase Admin SDK:
	- `admin.auth().setCustomUserClaims(uid, { admin: true })`
- After setting claim, logout/login once so the new token is used.

## 📸 Screenshots
