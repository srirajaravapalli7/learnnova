# LearnNova – 3D University LMS

LearnNova is a React-based university LMS with an interactive 3D campus, student and instructor workspaces, course management, assignments, analytics, certificates, and browser-based demo authentication.

## Authentication

Sign-up and sign-in use browser `localStorage` only. Accounts are saved under `learnnova_users`; passwords are derived with PBKDF2-SHA-256 and a unique random salt using the Web Crypto API. Passwords are never saved in plain text. “Remember me” stores a session in `localStorage`; otherwise, the session is kept in `sessionStorage`.

**This is demo-only authentication, not production security.** Browser users and scripts running on the same origin can read or alter local storage, and local password reset cannot verify email ownership. Roles and account records are not protected by a server. Do not use this system for real accounts or sensitive data.

LMS course, assignment, and preference data also remains local to the browser and is separated by local account.

## Features

- Interactive 3D campus with academic departments
- Local student sign-up, sign-in, session persistence, logout, and demo password reset
- Per-account student profiles with generated student IDs
- Student and instructor dashboard layouts
- Course catalog, assignments, analytics, certificates, and profile settings
- Responsive layout, dark/light themes, and local LMS data

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with Web Crypto API support (localhost or HTTPS)

## Installation and development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Register from `/signup`, then sign in using the same email and password. Test sign-out, incorrect credentials, duplicate registration, refresh persistence, and the local password-reset flow. The reset flow has no email verification.

## Build and preview

```bash
npm run build
npm run preview
```

## Vercel deployment

No authentication environment variables or external database setup are required. Deploy the Vite project to Vercel over HTTPS; `vercel.json` sends app routes to the React entry point. User accounts and LMS data remain in each browser and do not sync across devices.

## Project structure

```text
learnnova-university/
├── public/
│   └── learnnova.svg
├── src/
│   ├── App.jsx
│   ├── auth.js
│   ├── CampusScene.jsx
│   ├── StarDust.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```
