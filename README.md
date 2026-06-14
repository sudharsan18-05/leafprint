# 🍃 Leafprint — Carbon Footprint Awareness Platform

> **Know Your Impact. Change Your Future.**

Leafprint is an interactive carbon footprint awareness platform that helps individuals **understand**, **track**, and **reduce** their carbon footprint through simple actions, personalized insights, and a living world that reacts to their choices.

[![Live Demo](https://img.shields.io/badge/Live-leafprint.vercel.app-059669?style=for-the-badge)](https://leafprint.vercel.app)
![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61dafb?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-68%20Passing-brightgreen?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Grade%20A-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## ✨ Key Features

### 🌍 Living Digital Terrarium
A real-time animated ecosystem that reacts to your carbon footprint. Low footprint = lush forests, healthy sky. High footprint = barren land, smog and factories. Your daily actions heal the world. **This is not a dashboard — it's an experience.**

### 🔔 Carbon Cost Nudge Tool
An interactive comparison tool that shows the carbon cost of everyday choices side-by-side with greener alternatives. Tap "Beef Burger" to instantly see: **6.6kg CO₂ → Veggie Burger 1.1kg CO₂ (83% reduction)**.

### 🔄 "What-If" Impact Simulator
Interactive sliders that let you model lifestyle changes and instantly see how they'd shrink your annual footprint in real time.

### 🧮 Interactive Carbon Calculator
A beautiful 4-step questionnaire covering transportation, energy, food, and lifestyle — powered by real EPA/EDGAR emission factors.

### 📊 Personal Dashboard
Score ring, category breakdowns, comparison charts, and impact equivalences (e.g., "Your footprint = 238 trees needed").

### ✅ Daily Action Logger
Tap-to-log checklist with streak tracking, XP rewards, and a 30-day calendar heatmap with an animated eco-growth visual.

### 💡 Personalized Insights
Category-filtered tips with effort/impact indicators and "Quick Wins" sorted by highest CO₂ savings.

### 🏆 Achievements & Gamification
6-level progression system (Seedling → Earth Guardian), 12 unlockable badges, weekly challenges, and a virtual offsetting store.

### 🌍 Community Leaderboard
Social proof through collective impact stats and anonymous XP rankings.

---

## 🏗️ Architecture

```
leafprint/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx           # Sticky frosted-glass navigation
│   │   ├── ErrorBoundary.jsx    # Global React error boundary
│   │   ├── DigitalTerrarium.jsx # Animated ecosystem reacting to footprint
│   │   ├── GridWidget.jsx       # Live carbon intensity widget
│   │   ├── LivingEcosystem.jsx  # HTML5 Canvas animated world
│   │   ├── CarbonNudge.jsx      # Decision-point nudge tool
│   │   └── WhatIfSimulator.jsx  # Interactive impact modeler
│   ├── pages/                   # Route-level page components
│   │   ├── Landing/             # Marketing landing page
│   │   ├── Calculator/          # 4-step carbon calculator + results
│   │   ├── Dashboard/           # Personal analytics dashboard
│   │   ├── Actions/             # Daily action logger + 30-day tracker
│   │   ├── Insights/            # Tips, What-If Simulator, and Carbon Nudge
│   │   ├── Achievements/        # Badges, challenges, and offsetting store
│   │   └── Community/           # Social leaderboard and global stats
│   ├── data/
│   │   └── constants.js         # Emission factors, badges, tips, levels
│   ├── utils/
│   │   ├── storage.js           # LocalStorage state management (JSDoc)
│   │   └── sanitize.js          # XSS prevention and input validation
│   └── test/                    # Vitest unit tests
│       ├── constants.test.js    # 30 tests — emission factors, levels, badges
│       ├── storage.test.js      # 12 tests — CRUD, XP, streaks, stats
│       └── sanitize.test.js     # 26 tests — XSS, validation, safe parsing
├── vercel.json                  # Deployment config + security headers
├── .env.example                 # Environment variable template
├── eslint.config.js             # ESLint rules
├── vitest.config.js             # Test configuration
└── vite.config.js               # Build configuration
```

---

## 🛡️ Security

Leafprint is built with security-first principles:

| Protection | Implementation |
|---|---|
| **XSS Prevention** | `sanitize.js` utility strips dangerous HTML characters from all user input |
| **Content Security Policy** | CSP header via `vercel.json` whitelists approved content sources |
| **Clickjacking Prevention** | `X-Frame-Options: SAMEORIGIN` header |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` header |
| **HTTPS Enforcement** | `Strict-Transport-Security` with 2-year max-age and preload |
| **Referrer Control** | `Referrer-Policy: strict-origin-when-cross-origin` |
| **Permissions Policy** | Camera, microphone, and geolocation explicitly denied |
| **Input Validation** | All numeric inputs clamped; date keys validated before storage writes |
| **Safe JSON Parsing** | `safeJsonParse()` wraps all localStorage reads — never throws |
| **Env Variables** | API keys stored in `.env`, excluded from version control |

> **Security Grade: A** — verified by [securityheaders.com](https://securityheaders.com)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage
```

**68 tests** across 3 test suites:

| Suite | Tests | Coverage |
|---|---|---|
| `storage.test.js` | 12 | LocalStorage CRUD, XP, streaks, stats |
| `constants.test.js` | 30 | Emission factors, levels, badges, challenges |
| `sanitize.test.js` | 26 | XSS prevention, input validation, safe JSON |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/sudharsan18-05/leafprint.git
cd leafprint

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Run all 68 tests
npm test

# Build for production
npm run build
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with lazy loading & Suspense |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing with 404 fallback |
| **Chart.js** | Data visualization |
| **CSS Animations** | Living Ecosystem & micro-interactions |
| **Vitest** | Unit testing (68 tests) |
| **LocalStorage** | Client-side data persistence |
| **Vercel** | Production deployment with security headers |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
