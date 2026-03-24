# Zero Frontend — Smart Waste Management UI

A React 18 + TypeScript + Vite single-page application enabling citizens, cleaners, admins, and superadmins to participate in a collaborative smart waste management platform. **AI-powered waste analysis, real-time zone-based mapping, gamification, payment tracking, and leaderboards** drive engagement across roles.

---

## Technology Stack

- **React** 18 (component-based UI, hooks)
- **TypeScript** 5 (type safety across all components)
- **Vite** 6 (ultra-fast dev/build, instant HMR)
- **React Router** 6 (client-side routing with hash-based URLs)
- **Leaflet + React Leaflet** (interactive maps with zone polygon visualization)
- **Recharts** (data visualization: pie, bar, line charts)
- **Lucide React** (consistent icon library, 400+ icons)
- **Tailwind CSS** (utility-first styling, full dark mode support via dark: prefix)
- **Context API** (state management: auth user, theme preference)

## 🎯 Features by Role

### CITIZEN: Report → Review → Earn
Citizens report waste via photo, AI analyzes, location auto-detected on map, admin approves & rewards points, cleaner cleans, citizen reviews cleanup quality and earns additional points for participation.

**Key Workflows**:
1. **ReportWaste**: Photo upload → optional AI analysis → zone selection (GPS with point-in-polygon check) → severity selection → submit 
2. **MyReports**: Filterable list by status (SUBMITTED/APPROVED/IN_PROGRESS/COMPLETED/DECLINED), edit (SUBMITTED only), delete (SUBMITTED only), view details with AI analysis & before/after cleanup images
3. **MyReviews**: Rate cleanup quality (1-5 stars) + optional comment, see before/after AI comparison, earn +5 bonus points per review
4. **Leaderboard**: All-time/month/week rankings by green points earned
5. **Profile**: View/edit personal info, stats (points/reports/streak/rank/badges), notification prefs, password change, data download, account deletion

### CLEANER: Claim → Complete → Earn
Cleaners browse available tasks filtered by zone/priority, claim tasks, upload completion evidence photos, earn payments verified by AI before/after comparison and citizen review.

**Key Workflows**:
1. **AvailableTasks**: Browse marketplace of cleanup opportunities with zone/priority filters, task preview with AI waste analysis (composition, equipment needed), complete task detail with claim button
2. **MyTasks**: List active (IN_PROGRESS) tasks with countdown timers, upload evidence photo + notes, mark complete; view completed (COMPLETED) tasks awaiting payout
3. **History**: Task completion timeline with earnings summary (total earned, pending, completed count)
4. **Payments**: Available balance vs pending balance display, withdrawal form (method selector: bKash/Bank/Card) with destination account, payment transaction history
5. **Leaderboard**: Rankings by total earnings, tasks completed, and citizen rating
6. **Profile**: Similar to citizen + rating stats, earnings stats

### ADMIN: Approve → Manage → Process
Admins review/approve/decline reports with configurable reward suggestions, create zones with polygon boundaries, manage tasks, process cleaner payments, send bulk notifications.

**Key Workflows**:
1. **Dashboard**: KPI cards (pending reports, active tasks, system fund balance), zone report distribution chart, task completion trend chart, quick action buttons
2. **Reports**: Pending reports list, detail modal with full AI waste analysis, approve (with reward override) / decline (with reason) / reopen buttons, reward suggestion tooltip
3. **Tasks**: CRUD operations, manual task creation with zone/description/priority/reward/due_date, auto-linking to reports
4. **Zones**: Create zones with interactive polygon editor (click to add points), view cleanliness scores, edit zone properties
5. **Payments**: Pending payment list with evidence photos, process payments (bulk/individual), system fund balance, top-up form, fund transaction history
6. **Profile**: View/edit admin info and settings

### SUPERADMIN: Global Control
Superadmins manage all users (block/unblock/delete), view complete activity audit logs with timestamps/IPs/actions, revert critical system changes.

**Key Workflows**:
1. **Dashboard**: User counts by role, blocked/inactive count, activity audit trail (searchable by action/user/date), global user search/filter, block/unblock/delete user actions, action reversion capability

---

## 🗺️ Public Pages

### Landing Page
Hero section, role introduction cards (Citizens/Cleaners/Admins), feature highlights (AI analysis, mapping, gamification, rewards), 4-step "how it works" flow, statistics, CTA buttons.

### Auth Page
Role selector (toggle: CITIZEN/CLEANER/ADMIN), login/register tabs, email/password form, error/success toasts.

---

## 🎨 Design & UX

### Colors
- **Primary**: Green #10b981 (eco-themed actions)
- **Dark mode**: Slate background with white text
- **Status badges**: Yellow (SUBMITTED), Blue (APPROVED), Purple (IN_PROGRESS), Green (COMPLETED), Red (DECLINED)

### Responsive
- Mobile: Single column, overlay sidebar, fullscreen modals
- Tablet: 2-column grid for cards
- Desktop: 3-4 column grid, full sidebar, centered modals

### Dark Mode
- Toggle in navbar (sun/moon icon)
- Persisted to localStorage as 'theme'
- Applied via Tailwind dark: prefix classes

---

## 📁 Project Structure

`
Zero/
├── App.tsx                      # Route configuration, role-based auth guard
├── components/
│   ├── Layout.tsx              # Sidebar (mobile collapsible), header, notifications
│   ├── ZoneMap.tsx             # React Leaflet interactive map
│   ├── AIAnalysis Display.tsx   # Render AI waste analysis results
│   ├── ZoneEditor.tsx          # Polygon drawing interface
│   └── ui.tsx                  # Tailwind-based UI components
├── pages/
│   ├── Landing.tsx / Auth.tsx  # Public pages
│   ├── citizen/                # Citizen role pages (Report, Reports, Reviews, Leaderboard, Profile)
│   ├── cleaner/                # Cleaner role pages (AvailableTasks, MyTasks, History, Payments, Leaderboard, Profile)
│   ├── admin/                  # Admin role pages (Dashboard, Reports, Tasks, Zones, Payments, Profile)
│   └── superadmin/             # Superadmin Dashboard
├── contexts/
│   ├── AuthContext.tsx         # useAuth() hook
│   └── ThemeContext.tsx        # useTheme() hook
├── services/
│   └── api.ts                  # HTTP client with namespaced APIs (auth, citizen, cleaner, admin, etc.)
└── utils/
    └── geo.ts                  # isPointInPolygon(), findZoneForPoint() for zone detection
`

---

## 🚀 Setup & Running

### Prerequisites
`
Node.js 18+
npm 9+
`

### Install & Run
`ash
cd Zero
npm install
npm run dev                     # Runs on http://localhost:3000
`

### Environment
`env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_key (optional)
`

### Production Build
`ash
npm run build                   # Creates dist/ folder
npm run preview                 # Test production build
`

---

## 🔐 Security

- No plaintext secrets (all in .env)
- JWT in localStorage (httpOnly cookies recommended for production)
- All forms validate required fields, email format, etc.
- HTTPS in production
- No passwords/credit cards in logs

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Backend not running on :5000 |
| Login fails 401 | Check credentials, account may be inactive |
| Map not loading | Check tile server availability in browser console |
| AI analysis not working | Check HUGGINGFACE_API_KEY and GROQ_API_KEY in backend .env |
| Dark mode not persisting | localStorage may be disabled |

---

Production-ready, user-centric design ❤️
