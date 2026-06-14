# 🍃 Leafprint — Carbon Footprint Awareness Platform

> **Know Your Impact. Change Your Future.**

Leafprint is an interactive carbon footprint awareness platform that helps individuals **understand**, **track**, and **reduce** their carbon footprint through simple actions, personalized insights, and a living world that reacts to their choices.

![Leafprint](https://img.shields.io/badge/Built%20With-React%20%2B%20Vite-61dafb?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-42%20Passing-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## ✨ Key Features

### 🌍 Living Ecosystem (Canvas Animation)
A real-time animated world that visually reacts to your carbon footprint. Low footprint = lush forests, birds, and fireflies. High footprint = barren land, factories, and smog. **This is not a dashboard — it's an experience.**

### 🔔 Carbon Cost Nudge Tool
An interactive comparison tool that shows the carbon cost of everyday choices side-by-side with greener alternatives. Tap "Beef Burger" to instantly see: **6.6kg CO₂ → Veggie Burger 1.1kg CO₂ (83% reduction)**.

### 🔄 "What-If" Impact Simulator
Interactive sliders that let you model lifestyle changes and instantly see how they'd shrink your annual footprint.

### ⚡ Real-Time Grid Carbon Intensity
Live API integration showing whether your electricity grid is currently running on clean or dirty energy, with actionable advice.

### 🧮 Interactive Carbon Calculator
A beautiful 4-step questionnaire covering transportation, energy, food, and lifestyle — powered by real EPA/EDGAR emission factors.

### 📊 Personal Dashboard
Score ring, category breakdowns, comparison charts, and impact equivalences (e.g., "Your footprint = 238 trees needed").

### ✅ Daily Action Logger
Tap-to-log checklist with streak tracking, XP rewards, and a 30-day calendar heatmap.

### 💡 Personalized Insights
Category-filtered tips with effort/impact indicators and "Quick Wins" sorted by highest savings.

### 🏆 Achievements & Gamification
6-level progression system, 12 unlockable badges, weekly challenges, and a virtual offsetting store.

### 🌍 Community Leaderboard
Social proof through collective impact stats and anonymous XP rankings.

---

## 🏗️ Architecture

```
leafprint/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Sticky frosted-glass navigation
│   │   ├── GridWidget.jsx   # Live API carbon intensity widget
│   │   ├── LivingEcosystem.jsx  # HTML5 Canvas animated world
│   │   ├── CarbonNudge.jsx  # Decision-point nudge tool
│   │   └── WhatIfSimulator.jsx  # Interactive impact modeler
│   ├── pages/               # Route-level page components
│   │   ├── Landing/         # Marketing landing page
│   │   ├── Calculator/      # 4-step carbon calculator + results
│   │   ├── Dashboard/       # Personal analytics dashboard
│   │   ├── Actions/         # Daily action logger
│   │   ├── Insights/        # Tips, What-If, and Carbon Nudge
│   │   ├── Achievements/    # Badges, challenges, and offsetting
│   │   └── Community/       # Social leaderboard
│   ├── data/
│   │   └── constants.js     # Emission factors, badges, tips, levels
│   ├── utils/
│   │   └── storage.js       # LocalStorage state management
│   └── test/                # Vitest unit tests
│       ├── setup.js
│       ├── storage.test.js  # 12 tests
│       └── constants.test.js # 30 tests
├── .env                     # Environment variables (not committed)
├── .env.example             # Template for env setup
├── vitest.config.js         # Test configuration
└── vite.config.js           # Build configuration
```

## 🛡️ Security

- API URLs are stored in `.env` files and accessed via `import.meta.env`
- `.env` is excluded from version control via `.gitignore`
- No API keys are hardcoded in source files

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**42 tests** covering:
- Storage utility functions (load, save, toggle, XP spending)
- Emission factor calculations and data integrity
- Level progression and badge conditions
- Edge cases (corrupted data, insufficient XP)

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/leafprint.git
cd leafprint

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Chart.js** | Data visualization |
| **HTML5 Canvas** | Living Ecosystem animation |
| **Vitest** | Unit testing |
| **LocalStorage** | Client-side data persistence |
| **Carbon Intensity API** | Real-time grid data |

## 📄 License

MIT License — feel free to use, modify, and distribute.
