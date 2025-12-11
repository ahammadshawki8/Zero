# 🌱 Zero - Smart Waste Management Platform

<br>

<div align="center">

![Zero Waste Logo](https://img.shields.io/badge/Zero-Waste-22c55e?style=for-the-badge&logo=recycle&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

**A gamified waste management platform connecting citizens, cleaners, and administrators to build cleaner communities.**

[Features](#-features) • [Getting Started](#-getting-started) • [User Roles](#-user-roles) • [Tech Stack](#-tech-stack) • [Team](#-team)

</div>

---

## 📖 Overview

Zero is a comprehensive waste management solution designed for urban areas, specifically tailored for Dhaka, Bangladesh. The platform enables citizens to report waste issues, administrators to manage cleanup operations, and cleaners to earn rewards by completing cleanup tasks.

The system uses AI-powered waste analysis (Google Gemini) to automatically detect waste types, estimate quantities, and suggest appropriate cleanup methods.

## ✨ Features

### 🗺️ Zone-Based Management
- Interactive map with polygon-based zone definitions
- Real-time zone detection using ray-casting algorithm
- Cleanliness scores per zone
- Visual zone boundaries with custom colors

### 📸 Smart Waste Reporting
- Photo-based waste reporting with location selection
- AI-powered waste analysis (type detection, severity assessment, cleanup recommendations)
- Automatic zone detection from map coordinates
- Report status tracking (Submitted → Approved → In Progress → Completed)

### 🎮 Gamification System
- **Green Impact Points** for citizens:
  - Report Created: +5 points
  - Report Approved: +10 points
  - Review Submitted: +5 points
  - Severity Bonus: +0 to +10 points
- **6 Achievement Badges**: First Report, Eco Warrior, Zone Champion, Watchdog, Community Hero, Green Legend
- Leaderboards with time-based filters (Weekly, Monthly, All Time)

### 💰 Cleaner Rewards System
- Real monetary rewards (BDT) for completed tasks
- Competitive task claiming system
- Before/after photo verification
- AI-powered cleanup verification
- Earnings tracking and history

### 👁️ Citizen Watchdog
- Review completed cleanups with star ratings
- Before/after photo comparison
- Anonymous reviews (cleaner privacy)
- Quality assurance feedback loop

### 🔔 Notification System
- In-app notification center
- Multiple notification types (info, success, warning, alert)
- Mark as read functionality
- Admin bulk notifications to user groups

### 🌙 Dark Mode
- System-wide dark theme support
- Persistent theme preference
- Smooth theme transitions

### 📱 Mobile Responsive
- Fully responsive design for all screen sizes
- Mobile-optimized navigation with hamburger menu
- Touch-friendly UI components
- Bottom-sheet modals on mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/zero-waste.git

# Navigate to project directory
cd zero-waste/Zero

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the Zero directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Build for Production

```bash
npm run build
```

## 👥 User Roles

### 🏠 Citizen
Citizens are community members who report waste issues and monitor cleanup quality.

| Feature | Description |
|---------|-------------|
| Report Waste | Submit waste reports with photos and location |
| My Reports | Track status of submitted reports |
| My Reviews | Review completed cleanups |
| Leaderboard | Compete with other citizens for points |
| Profile | Manage account and view badges |

### 🧹 Cleaner
Cleaners are verified workers who complete cleanup tasks for rewards.

| Feature | Description |
|---------|-------------|
| Available Tasks | Browse and claim open tasks |
| My Tasks | Manage active cleanup assignments |
| History | View completed tasks and earnings |
| Leaderboard | Compete based on total earnings |
| Profile | Track earnings and ratings |

### 🛡️ Administrator
Administrators manage the entire waste management operation.

| Feature | Description |
|---------|-------------|
| Dashboard | Overview of system stats and charts |
| Reports | Review and approve citizen reports |
| Tasks | Monitor all cleanup tasks |
| Zones | Define and manage geographic zones |
| Bulk Notifications | Send announcements to user groups |
| Profile | Admin account settings |

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### Maps & Geolocation
- **Leaflet** - Interactive maps
- **React-Leaflet** - React components for Leaflet
- **CARTO Tiles** - Map tile provider

### Data Visualization
- **Recharts** - Charts and graphs

### AI Integration
- **Google Gemini API** - Waste analysis and detection

### Icons
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
Zero/
├── components/
│   ├── ui.tsx              # Reusable UI components
│   ├── Layout.tsx          # App layout with navigation
│   ├── Logo.tsx            # Brand logo component
│   ├── ZoneMap.tsx         # Zone display map
│   ├── ZoneEditor.tsx      # Zone polygon editor
│   └── AIAnalysisDisplay.tsx # AI analysis results
├── contexts/
│   └── ThemeContext.tsx    # Dark mode state management
├── pages/
│   ├── Landing.tsx         # Public landing page
│   ├── Auth.tsx            # Login/Register page
│   ├── citizen/
│   │   ├── ReportWaste.tsx # Create waste reports
│   │   ├── MyReports.tsx   # View own reports
│   │   ├── MyReviews.tsx   # Review cleanups
│   │   ├── Leaderboard.tsx # Points leaderboard
│   │   └── Profile.tsx     # Citizen profile
│   ├── cleaner/
│   │   ├── AvailableTasks.tsx # Browse tasks
│   │   ├── MyTasks.tsx     # Active tasks
│   │   ├── History.tsx     # Completed tasks
│   │   ├── Leaderboard.tsx # Earnings leaderboard
│   │   └── Profile.tsx     # Cleaner profile
│   └── admin/
│       ├── Dashboard.tsx   # Admin overview
│       ├── Reports.tsx     # Manage reports
│       ├── Tasks.tsx       # Manage tasks
│       ├── Zones.tsx       # Manage zones
│       └── Profile.tsx     # Admin profile
├── services/
│   └── gemini.ts           # AI service integration
├── utils/
│   └── geo.ts              # Geolocation utilities
├── types.ts                # TypeScript interfaces
├── constants.ts            # Mock data and constants
├── App.tsx                 # Main app component
└── index.tsx               # Entry point
```

## 🎨 UI Components

The project includes a custom component library (`components/ui.tsx`):

- **Button** - Primary, secondary, danger, outline, ghost variants
- **Input** - Text input with label and error states
- **Select** - Dropdown select component
- **Card** - Content container with optional title
- **Badge** - Status indicators with color variants
- **Modal** - Dialog overlay with mobile optimization
- **Toast** - Notification popups
- **ConfirmModal** - Confirmation dialogs

## 🗺️ Zone System

Zones are geographic areas defined by polygon coordinates:

```typescript
interface Zone {
  id: string;
  name: string;
  description: string;
  polygon: LatLng[];      // Array of coordinates
  cleanlinessScore: number;
  color: string;
}
```

The system uses a ray-casting algorithm to detect which zone a point belongs to, enabling automatic zone assignment when citizens report waste.

## 🤖 AI Integration

The platform integrates Google Gemini for intelligent waste analysis:

```typescript
interface WasteAnalysis {
  wasteTypes: string[];
  estimatedVolume: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  environmentalImpact: string;
  recommendedEquipment: string[];
  estimatedCleanupTime: string;
  healthHazards: string[];
  disposalRecommendations: string;
}
```

## 📊 Status Flow

```
SUBMITTED → APPROVED → IN_PROGRESS → COMPLETED
     ↓
  DECLINED
```

| Status | Color | Description |
|--------|-------|-------------|
| SUBMITTED | Yellow | Awaiting admin review |
| APPROVED | Blue | Task created, waiting for cleaner |
| IN_PROGRESS | Purple | Cleaner working on it |
| COMPLETED | Green | Cleanup verified |
| DECLINED | Red | Report rejected |

## 🏆 Gamification Details

### Citizen Points
| Action | Points |
|--------|--------|
| Report Created | +5 |
| Report Approved | +10 |
| Review Submitted | +5 |
| Low Severity | +0 |
| Medium Severity | +3 |
| High Severity | +7 |
| Critical Severity | +10 |

### Badges
| Badge | Requirement |
|-------|-------------|
| 🌱 First Report | Submit first report |
| 🌿 Eco Warrior | 10+ approved reports |
| 🗺️ Zone Champion | Reports in 5+ zones |
| 👁️ Watchdog | 5+ cleanup reviews |
| 🤝 Community Hero | 50+ total points |
| 🏆 Green Legend | All badges unlocked |

## 👨‍💻 Team

<div align="center">

| Developer | Role |
|-----------|------|
| **Ahammad Shawki** | Lead Developer |
| **SM Abu Fayeem** | Developer |

</div>

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with 💚 for a cleaner Bangladesh**

</div>
