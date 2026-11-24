# LearnNova – 3D University LMS

LearnNova is a futuristic Learning Management System built using React. It provides an interactive 3D university campus, course management, student dashboards, assignments, academic analytics, and certificates.

This frontend-only academic project uses realistic sample data and browser `localStorage`; it does not require a backend or database. Authentication is simulated in the client and is not suitable for protecting real accounts.

## Features

- Interactive 3D campus with five selectable academic departments
- Student and instructor dashboards
- Course catalog, search, enrollment, and course management
- Assignment creation, submission, review, grading, and feedback
- Academic analytics, progress tracking, and certificates
- Announcements, notifications, profiles, and settings
- Responsive layout, dark/light themes, and local data persistence

## Technologies

- React 18 and JavaScript (ES modules)
- Vite
- React Router
- Three.js, React Three Fiber, and Drei
- Lucide React
- HTML5, CSS3, and browser `localStorage`

## Requirements

- Node.js 18 or newer
- npm

## Installation and development

From the project directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local URL when the server is ready.

## Build and preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project structure

```text
learnnova-university/
├── public/
│   └── learnnova.svg
├── src/
│   ├── App.jsx
│   ├── CampusScene.jsx
│   ├── StarDust.jsx
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

## Screenshots

Add screenshots to a `screenshots/` directory and replace these placeholders before publishing:

- 3D Campus: `screenshots/3d-campus.png`
- Student Dashboard: `screenshots/student-dashboard.png`
- Instructor Dashboard: `screenshots/instructor-dashboard.png`
