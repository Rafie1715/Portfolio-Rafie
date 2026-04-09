# 🚀 My Personal Portfolio v2.0

> My digital playground built with React, Tailwind CSS, and AI integration.

Check it out live here: [**https://rafierb.me**](https://rafierb.me)

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
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/84d41166-06b5-408b-ab89-82ef985fe8e8" />
<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/9c365028-f564-4f6b-ba5c-f736aebbfd2a" />
<img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/c83d7e62-debf-470f-88b2-5ce1e78f8975" />
<img width="1913" height="905" alt="image" src="https://github.com/user-attachments/assets/b54e1eb0-6b00-4b4d-8ab8-740008e86dd4" />
<img width="1908" height="898" alt="image" src="https://github.com/user-attachments/assets/6e520716-ddd5-4e4c-985c-693e8662e7cb" />
<img width="1914" height="904" alt="image" src="https://github.com/user-attachments/assets/d35e2546-4063-4f4e-96a2-2d40835bde75" />
