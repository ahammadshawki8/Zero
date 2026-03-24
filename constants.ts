import { Report, Task, Alert, Zone, CleanerProfile, WasteAnalysis, CleanupComparison } from './types';

// Default map center (Dhaka, Bangladesh)
export const MAP_CENTER = { lat: 23.8103, lng: 90.4125 };
export const MAP_ZOOM = 13;

// Empty arrays - data will come from API
export const MOCK_ZONES: Zone[] = [];
export const MOCK_REPORTS: Report[] = [];
export const MOCK_TASKS: Task[] = [];
export const MOCK_ALERTS: Alert[] = [];

// Empty chart data - will be populated from API
export const CHART_DATA_CLEANLINESS: any[] = [];
export const CHART_DATA_COMPLETION: any[] = [];

// Gamification - Points system
// Points are earned at each stage of the report lifecycle
export const POINTS_CONFIG = {
  REPORT_CREATED: 5,        // Points when citizen creates a report
  REPORT_APPROVED: 10,      // Bonus when admin approves the report
  TASK_COMPLETED: 15,       // Bonus when cleaner completes the task
  REVIEW_SUBMITTED: 5,      // Bonus when citizen reviews the cleanup
  STREAK_BONUS: 5,          // Daily streak bonus
  FIRST_REPORT: 20,         // First report bonus (one-time)
  SEVERITY_BONUS: {         // Extra points based on severity
    LOW: 0,
    MEDIUM: 2,
    HIGH: 5,
    CRITICAL: 10,
  },
};

// Status descriptions for UI
export const STATUS_INFO = {
  SUBMITTED: { label: 'Submitted', description: 'Awaiting admin approval', color: 'yellow' },
  APPROVED: { label: 'Approved', description: 'Task created, awaiting cleaner', color: 'blue' },
  DECLINED: { label: 'Declined', description: 'Report was declined by admin', color: 'red' },
  IN_PROGRESS: { label: 'In Progress', description: 'Cleaner is working on it', color: 'purple' },
  COMPLETED: { label: 'Completed', description: 'Cleanup finished', color: 'green' },
};

// Empty leaderboard - data will come from API
export const MOCK_LEADERBOARD: any[] = [];

// Empty user profile - will come from auth/API
export const MOCK_CURRENT_USER_PROFILE: any = null;

// All available badges
export const ALL_BADGES = [
  { id: 'FIRST_REPORT', name: 'First Step', description: 'Submit your first report', icon: '🌱' },
  { id: 'ECO_WARRIOR', name: 'Eco Warrior', description: 'Get 10+ reports approved', icon: '🌍' },
  { id: 'ZONE_CHAMPION', name: 'Zone Champion', description: 'Most reports in a zone', icon: '🏆' },
  { id: 'STREAK_7', name: 'Week Warrior', description: '7-day reporting streak', icon: '🔥' },
  { id: 'STREAK_30', name: 'Monthly Master', description: '30-day reporting streak', icon: '⚡' },
  { id: 'TOP_REPORTER', name: 'Top Reporter', description: 'Reach #1 on leaderboard', icon: '👑' },
];

// Empty cleaner profile - will come from API
export const MOCK_CLEANER_PROFILE: CleanerProfile | null = null;
