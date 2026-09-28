# 🚀 My Personal Portfolio v2.0

> My digital playground built with React, Tailwind CSS, and AI integration.

Check it out live here: [**https://rafierb.me**](https://rafierb.me)

## ✨ Key Features
- **🤖 AI Assistant:** Integrated custom chatbot powered by **Google Gemini API**.
- **🕹️ Interactive UI:** 3D physics-based nametag and custom cursor interactions.
- **⚡ Performance:** Lazy loading, WebP optimization, and Lighthouse score 95+.

## 🛠️ Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Netlify Functions (Serverless)
- **Deployment:** Netlify

## Admin security

Use a Firebase custom claim `admin: true` for the owner account. Firestore Rules require this claim; an email allowlist in the UI alone does not grant database permissions.

Follow [the security review and deployment steps](docs/SECURITY_REVIEW.md) before deploying these changes. They cover the chosen unsigned Cloudinary upload tradeoff, server-only environment variables, admin role checks, and both Firebase rule sets.

Public project and certification data is served through filtered catalog APIs. Direct CMS access is restricted to administrators. Public counters and reaction scores are written through a validated, rate-limited server endpoint.

## 📸 Screenshots
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/84d41166-06b5-408b-ab89-82ef985fe8e8" />
<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/9c365028-f564-4f6b-ba5c-f736aebbfd2a" />
<img width="1917" height="903" alt="image" src="https://github.com/user-attachments/assets/c83d7e62-debf-470f-88b2-5ce1e78f8975" />
<img width="1913" height="905" alt="image" src="https://github.com/user-attachments/assets/b54e1eb0-6b00-4b4d-8ab8-740008e86dd4" />
<img width="1908" height="898" alt="image" src="https://github.com/user-attachments/assets/6e520716-ddd5-4e4c-985c-693e8662e7cb" />
<img width="1914" height="904" alt="image" src="https://github.com/user-attachments/assets/d35e2546-4063-4f4e-96a2-2d40835bde75" />
