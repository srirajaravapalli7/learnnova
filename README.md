# LearnNova University

### Explore. Learn. Evolve.

LearnNova University is a modern, interactive learning management system (LMS) built as a digital university experience. Explore an interactive 3D campus, browse courses, track learning progress, and work with assignments through student and instructor-oriented workspaces.

> **Project note:** LearnNova is a client-side college project. Accounts and LMS content are stored in the browser, so data is local to the current browser and device.

## About LearnNova

LearnNova brings a virtual campus and a sample learning portal together in one React application. Its campus scene features selectable academic buildings, while the LMS includes course, assignment, progress, and community pages. Sample courses, assignments, activity, and achievement data make it possible to explore the interface after registering.

## Key Features

- Interactive 3D university campus with selectable departments and featured courses
- Responsive LMS interface with dark and light themes
- Course catalog with search, category filters, enrollment, modules, and materials
- Role-aware student and instructor views
- Assignment submission, review, grading, and feedback flows
- Study analytics, grades, activity, announcements, and sample certificates
- Separate student and administrator sign-in, persistent local sessions, and profile details
- Admin dashboard for registered users, courses, assignments, and student enrollments

## Student Features

- Register a student account and receive a generated student ID
- Browse, search, filter, and enroll in available courses
- View course details, modules, and listed learning materials
- Submit assignment responses and optionally attach a file name
- Review submission status, grades, and instructor feedback
- View study activity, analytics, announcements, and sample certificates
- Download a certificate as an SVG image
- Update a profile name and choose local notification preferences

File attachments are represented by their file name in the demo; the file itself is not uploaded or stored by the app.

## Instructor Features

The application includes instructor-oriented views for course and learning management:

- Create, edit, and delete courses
- View course rosters (the included roster entries are sample data)
- Create and delete assignments
- Review student submissions and save grades with written feedback
- Post and remove campus announcements
- View course and submission analytics

**Account limitation:** Public registration creates student accounts only. Instructor-specific screens are available to accounts with an instructor role, but the project does not provide an instructor registration or role-assignment flow.

## Admin Login

Open **Admin** in the campus navigation or visit `/admin/login`. The first run creates a local demo administrator account:

- **Email:** `admin@learnnova.com`
- **Password:** `LearnNova@Admin123`

The admin dashboard includes overview statistics, registered student details, course and assignment management, enrollment listings, and the admin profile. Courses and assignments are stored separately and shared with student workspaces; announcements also use a separate shared Local Storage key. Student progress and submissions remain stored per account. The admin account is stored under `learnnova_admins`, and admin sessions use `learnnova_admin_session`, independently of student sessions.

The demo password is never displayed in the application UI. Admin and student passwords are stored as PBKDF2-SHA-256 hashes with unique salts. Because authentication and storage run entirely in the browser, this admin login is for demonstration only and does not provide production access control.

## Authentication System

Registration and sign-in run entirely in the browser. Account records are saved in Local Storage. Passwords are processed with PBKDF2-SHA-256 and a unique random salt using the browser Web Crypto API; plain-text passwords are not stored.

- Passwords must contain at least 8 characters, including uppercase and lowercase letters and a number.
- Student sessions persist in Local Storage under `learnnova_user_session`; admin sessions are separate under `learnnova_admin_session`.
- The local password-reset flow does not verify email ownership.
- This is a demonstration authentication system, **not production security**. Browser users and scripts running on the same origin can access or change locally stored data. Do not use real or sensitive account information.

## Technologies Used

- **React 18** — user interface
- **Vite 6** — development server and production build
- **React Router 6** — client-side routing
- **Three.js**, **React Three Fiber**, and **Drei** — interactive 3D campus
- **Lucide React** — interface icons
- **CSS** — responsive styling and themes
- **Browser Local Storage and Web Crypto API** — local data and authentication

## Project Folder Structure

```text
learnnova/
├── public/
│   └── learnnova.svg
├── src/
│   ├── App.jsx          # App routes, LMS pages, and application logic
│   ├── AdminModule.jsx  # Admin login, dashboard, and management views
│   ├── auth.js          # Local student/admin accounts, sign-in, and session helpers
│   ├── CampusScene.jsx  # Three.js campus scene
│   ├── StarDust.jsx     # Animated campus particle effect
│   ├── main.jsx         # React entry point and router setup
│   └── styles.css       # Application styles and themes
├── index.html           # HTML entry point and page metadata
├── package.json         # Scripts and dependencies
├── vite.config.js       # Vite configuration
└── vercel.json          # Hosting route rewrite
```

## Installation and Setup Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- A current browser with Web Crypto API support

### Install dependencies

Clone the repository, open a terminal in the project directory, and run:

```bash
npm install
```

## How to Run the Project Locally

Start the Vite development server:

```bash
npm run dev
```

Open the local address printed in the terminal (usually `http://localhost:5173`). Register at **Sign up** to create a student account, then sign in. The development server supports the Web Crypto API requirement through localhost.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Local Storage and Data Management

LearnNova keeps its data in the current browser; it is not synchronized between browsers or devices.

- Account records are stored in Local Storage under `learnnova_users`.
- The admin account is stored separately under `learnnova_admins`.
- Student and admin sessions are stored separately under `learnnova_user_session` and `learnnova_admin_session`.
- Shared course, assignment, and announcement content is stored under `learnnova_courses`, `learnnova_assignments`, and `learnnova_announcements`.
- LMS data is stored separately for each signed-in account using a `campusly-lms-v1:<userId>` key.
- The selected theme is saved under `learnsphere-theme-v1`.
- Sample courses, assignments, announcements, analytics, and certificates are provided by the app and can be restored from Settings.
- Clearing browser storage removes locally saved accounts, sessions, preferences, and LMS changes.

## Future Enhancements

Potential areas to build on include:

- Add an instructor onboarding and account-role management flow
- Support cross-device account and learning-data synchronization
- Add real file handling for course materials and assignment submissions
- Expand course authoring, learner progress, and certificate management

These are ideas for future development, not features currently provided by the project.

## Author / Project Information

- **Project:** LearnNova University
- **Tagline:** Explore. Learn. Evolve.
- **Type:** College project — client-side LMS demonstration
- **Repository:** [srirajaravapalli7/learnnova](https://github.com/srirajaravapalli7/learnnova)
