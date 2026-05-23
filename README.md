<div align="center">
  <img src="./public/logo.png" alt="EatClub Portal Logo" width="120" height="120" />
  <h1 align="center">EatClub CC Training Hub</h1>
  <p align="center">
    <strong>Corporate Training & Agent Operations Portal</strong>
    <br />
    A centralized platform for EatClub's Customer Contact team — combining an LMS, agent toolkit, menu explorer, real-time collaboration, and performance tracking.
    <br />
    <br />
    <a href="https://eatclub-training.netlify.app" target="_blank">Live Demo</a>
    ·
    <a href="https://github.com/anomalyco/eatclub-portal/issues">Report Bug</a>
    ·
    <a href="https://github.com/anomalyco/eatclub-portal/issues">Request Feature</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
    <img src="https://img.shields.io/badge/Firebase-12.12-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white" alt="Netlify" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Features in Detail](#features-in-detail)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**EatClub CC Training Hub** is a comprehensive single-page application built for EatClub's Customer Contact (CC) team. It serves as a unified operations hub where customer support agents can:

- Access structured **training modules** with progress tracking
- Explore **brand-specific portioning guides** and SOPs
- Search the complete **EatClub menu database** across 9 brands
- Use **chat/call scripts**, templates, and resolution flows
- Participate in **real-time team chat** with presence detection
- Track **personal progress** on a Firebase-synced leaderboard
- Personalize their experience with **10 color themes, 3 background modes, and 8 fonts**

---

## Key Features

### Corporate Training / LMS

| Feature | Description |
|---|---|
| **Dashboard** | Welcome panel with overall progress circle, quick stats (courses completed, hours spent, quizzes passed, streak) |
| **Training Categories** | Onboarding, Technical Skills, Soft Skills, Compliance, Leadership |
| **Courses** | Rich lesson lists with video/text/quiz content, progress bars, completion tracking |
| **Quiz System** | Multiple-choice questions with per-question feedback, score calculation, 70% pass threshold, retry option |
| **Progress Persistence** | localStorage + Firebase sync for leaderboard |
| **XP & Streaks** | Daily login XP (+3), module completion XP (+25), daily visit streak tracking |

### Agent Operations Toolkit

| Feature | Description |
|---|---|
| **Chat KPIs & Flows** | Metrics, expectations, decision trees, conversation flow diagrams |
| **Hash Library** | Template responses (hashtag-based) for quick replies |
| **Agent Guide** | Best practices for chat-based customer interactions |
| **Call KPIs & Scripts** | Call metrics reference and pre-written scripts |
| **CC Templates** | Customer copy / email templates |
| **Brand Portioning** | Box8, Mojo Pizza, LeanCrust — detailed spec tables |
| **Complaint Tags** | Categorization system for customer complaints |
| **Resolution Flows** | Step-by-step resolution procedures |
| **Escalation Matrix** | When and how to escalate issues |
| **Refunds & Compensation** | Policies with a refund master sheet |

### EatClub Menu Explorer

- Complete menu database across **9 brands**: Box8, MOJO Pizza, LeanCrust, Itminaan, NH1 Bowls, WeFit, Mealful Rolls, Hola Pasta
- **Power Search** across item names, descriptions, ingredients, and agent tips with text highlighting
- **Brand tab filtering** and **category chips**
- Price comparison: Store MRP vs EatClub Pass price with savings display
- Expanded view with ingredients, portioning standards, and agent handling tips
- Veg/Non-Veg indicators with fallback emoji display

### Real-Time Collaboration

- **Team Chat** — Real-time messaging via Firebase Realtime Database + BroadcastChannel for cross-tab sync
- **Active Presence** — Shows who's online, their location (via ipapi.co), browser, and current page
- **Direct Messaging** — 1-on-1 conversations via Firebase
- **Notice Board** — Admin-published notices with read-by tracking and audit logs
- **Notepad** — Firebase-synced personal notes with color coding and edit/delete
- **Toast Notifications** — Real-time alerts for new messages

### User System & Admin

- **Google Sign-In** via Firebase Auth
- **Profile Setup** — Bio, role, avatar (emoji/gradient), display name
- **Role-Based Access** — Admin vs regular user with admin-only pages
- **Admin Dashboard** — User management, role assignment, version backup management

### UI Customization

| Category | Options |
|---|---|
| **Background Themes** | Light, Dark, Dim |
| **Accent Colors** | Orange, Pink, Sky, Gold, Blue, Green, Slate, Indigo, Forest, Midnight + custom picker |
| **Fonts** | System Default, Poppins, Inter, Open Sans, Roboto, Playfair Display, Montserrat, Lato |
| **Animation Speeds** | Slow, Normal, Fast, Instant |
| **Navigation** | Fixed sidebar (280px, collapses to 72px on mobile) with accordion groups |

### Extras

- **Breadcrumb navigation** tracker
- **YouTube Music player** embed
- **Contact card** with developer social links
- **Entry animation** — Food emoji particles + audio chime
- **Party mode** — Celebration particle effects

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19.2** | Frontend framework |
| **Vite 7.3** | Build tool & dev server |
| **Firebase 12.12** | Authentication, Realtime Database, Analytics |
| **Tailwind CSS 4.3** | Utility-first CSS |
| **Anime.js 4.4** | Animations |
| **DOMPurify 3.4** | XSS sanitization |
| **ESLint 9** | Code linting |
| **Vitest 4** | Unit testing |
| **Netlify** | Deployment |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/anomalyco/eatclub-portal.git
cd eatclub-portal
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run lint` | Run ESLint on the project |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest test suite |

---

## Project Structure

```
eatclub-portal/
├── index.html                 # Entry HTML
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── netlify.toml               # Netlify deploy config
├── eslint.config.js           # ESLint flat config
├── firebase-database.rules.json  # Firebase security rules
├── SPEC.md                    # Full project specification
│
├── public/                    # Static assets
│   ├── logo.png / logo.jpeg
│   ├── app-icon.png
│   └── creespy-cover.jpg
│
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component (routing, auth, layout)
│   ├── index.css              # Main stylesheet (1300+ lines)
│   ├── redesign.css           # Premium glassmorphism UI
│   ├── firebase.js            # Firebase initialization
│   │
│   ├── components/            # Reusable components
│   │   ├── EntryPage.jsx      # Login screen
│   │   ├── DirectChat.jsx     # Team chat panel
│   │   ├── Toast.jsx          # Toast notifications
│   │   ├── Clock.jsx          # Live clock
│   │   ├── YTMusicPlayer.jsx  # YouTube Music embed
│   │   ├── UserAvatar.jsx     # Avatar component
│   │   ├── VersionInfo.jsx    # Version backup manager
│   │   ├── NoticeBubble.jsx   # Notice notification
│   │   ├── SettingsManager.jsx# Themes, fonts, animations
│   │   └── ui/                # Shared UI components
│   │
│   ├── pages/                 # Application pages (29 files)
│   │   ├── Home.jsx           # Landing page
│   │   ├── UserDashboard.jsx  # Profile, notes, leaderboard
│   │   ├── Menu Explorer (various) # Brand pages
│   │   ├── AdminDashboard.jsx # Admin-only panel
│   │   └── ...                # All training/ops pages
│   │
│   ├── config/                # Config & roles
│   │   ├── roles.js           # Role definitions
│   │   └── roles.test.js      # Role unit tests
│   │
│   ├── context/               # React contexts
│   │   ├── ToastContext.jsx
│   │   └── UpdatesContext.jsx
│   │
│   ├── data/                  # Static data
│   │   ├── trainingData.js    # Course content
│   │   ├── quiz.js            # Quiz questions
│   │   ├── tags.js            # Complaint tags
│   │   └── hashTemplates.js   # Hash templates
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useLocalStorage.js
│   │   ├── useAvatar.js
│   │   ├── useNotices.js
│   │   └── useToast.js
│   │
│   ├── services/              # Firebase services
│   │   ├── messaging.js       # Team chat service
│   │   └── noticeAudit.js     # Notice audit logs
│   │
│   ├── utils/                 # Utilities
│   │   ├── whatsappFormat.js
│   │   └── whatsappFormat.test.js
│   │
│   └── _versions/             # Version backup system
│       └── CHANGELOG.md       # Full changelog (v0.1.0 → v1.0.0)
│
├── docs/
│   └── api-contract.md        # API documentation
│
└── src/_versions/CHANGELOG.md # Version history
```

---

## Features in Detail

### Training & LMS

The training module delivers structured learning paths with categories (Onboarding, Technical Skills, Soft Skills, Compliance, Leadership). Each course contains lessons with mixed content types (video, text, quiz). Progress is tracked per-user and synced to a Firebase leaderboard for friendly competition.

### Menu Explorer

A searchable menu database spanning all 9 EatClub brands. Agents can look up item details, compare prices (MRP vs EatClub Pass), view ingredients, and access portioning standards — all from one interface.

### Agent Tools

A comprehensive toolkit covering every aspect of customer support operations: chat and call KPIs, pre-written scripts, email templates, complaint tagging, resolution workflows, escalation procedures, and refund policies.

### Real-Time Chat

Built on Firebase Realtime Database with cross-tab sync via BroadcastChannel. Features include active presence detection, typing indicators, 1-on-1 direct messaging, and team-wide announcements.

### Admin Dashboard

Administrators can manage users, assign roles, and access version backup/restore functionality. All notices are published with read-receipt tracking and full audit logs.

### Customization

Users can personalize their experience with 3 background themes (Light/Dark/Dim), 10 accent colors, 8 font choices, and 4 animation speed settings — all persisted across sessions.

---

## Deployment

The app is configured for **Netlify** deployment via `netlify.toml`:

```bash
npm run build   # outputs to dist/
```

Then deploy the `dist/` directory to your Netlify site, or use the Netlify CLI for continuous deployment from your repository.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>
    Made with ❤️ for the EatClub CC Team
    <br />
    <a href="https://github.com/anomalyco">GitHub</a>
    ·
    <a href="https://eatclub-training.netlify.app">Live Demo</a>
  </p>
</div>
