import { Report, Task, Alert, Zone, CleanerProfile, WasteAnalysis, CleanupComparison } from './types';

// Mock AI Analysis data
const MOCK_AI_ANALYSIS: Record<string, WasteAnalysis> = {
  overflowingBin: {
    description: 'Overflowing public waste bin with scattered food containers and beverage bottles.',
    severity: 'MEDIUM',
    wasteComposition: [
      { type: 'Plastic', percentage: 55, recyclable: true },
      { type: 'Organic/Food', percentage: 30, recyclable: false },
      { type: 'Paper', percentage: 15, recyclable: true },
    ],
    estimatedVolume: '1-2 garbage bags',
    environmentalImpact: 'MODERATE',
    healthHazard: false,
    recommendedAction: 'Empty overflowing bin and collect scattered litter. Report bin capacity issue.',
    estimatedCleanupTime: '15-20 minutes',
    specialEquipmentNeeded: ['Gloves', 'Garbage bag'],
    confidence: 91,
  },
  streetLitter: {
    description: 'Street litter with plastic bottles, food packaging, and paper materials scattered after market.',
    severity: 'LOW',
    wasteComposition: [
      { type: 'Plastic', percentage: 45, recyclable: true },
      { type: 'Paper/Cardboard', percentage: 35, recyclable: true },
      { type: 'Organic', percentage: 20, recyclable: false },
    ],
    estimatedVolume: '2-3 garbage bags',
    environmentalImpact: 'LOW',
    healthHazard: false,
    recommendedAction: 'Standard cleanup with sorting for recyclables.',
    estimatedCleanupTime: '30-45 minutes',
    specialEquipmentNeeded: ['Gloves', 'Garbage bags', 'Recycling bins'],
    confidence: 88,
  },
  illegalDumping: {
    description: 'Illegal dumping site with mixed waste including construction debris and household items.',
    severity: 'HIGH',
    wasteComposition: [
      { type: 'Construction Debris', percentage: 40, recyclable: false },
      { type: 'Plastic', percentage: 25, recyclable: true },
      { type: 'Mixed Household', percentage: 25, recyclable: false },
      { type: 'Metal', percentage: 10, recyclable: true },
    ],
    estimatedVolume: 'Requires pickup truck',
    environmentalImpact: 'HIGH',
    healthHazard: true,
    hazardDetails: 'Sharp objects and potential chemical contamination from unknown substances.',
    recommendedAction: 'Professional cleanup required. Check for hazardous materials before disposal.',
    estimatedCleanupTime: '2-3 hours',
    specialEquipmentNeeded: ['Heavy-duty gloves', 'Safety boots', 'Face mask', 'Vehicle'],
    confidence: 84,
  },
  constructionWaste: {
    description: 'Hazardous construction waste near site including concrete, metal scraps, and chemical containers.',
    severity: 'CRITICAL',
    wasteComposition: [
      { type: 'Construction Debris', percentage: 50, recyclable: false },
      { type: 'Metal', percentage: 20, recyclable: true },
      { type: 'Chemical/Hazardous', percentage: 15, recyclable: false },
      { type: 'Plastic', percentage: 15, recyclable: true },
    ],
    estimatedVolume: 'Requires heavy equipment',
    environmentalImpact: 'SEVERE',
    healthHazard: true,
    hazardDetails: 'Chemical containers present. Potential soil contamination. Sharp metal edges.',
    recommendedAction: 'Specialized hazmat team required. Do not handle chemicals without proper training.',
    estimatedCleanupTime: '4-6 hours',
    specialEquipmentNeeded: ['Hazmat suit', 'Chemical containers', 'Heavy machinery', 'First aid kit'],
    confidence: 79,
  },
  plasticWaste: {
    description: 'Accumulated plastic waste near school gate including bottles, bags, and food wrappers.',
    severity: 'MEDIUM',
    wasteComposition: [
      { type: 'Plastic', percentage: 70, recyclable: true },
      { type: 'Paper', percentage: 20, recyclable: true },
      { type: 'Organic', percentage: 10, recyclable: false },
    ],
    estimatedVolume: '2-3 garbage bags',
    environmentalImpact: 'MODERATE',
    healthHazard: false,
    recommendedAction: 'Collect and sort plastics for recycling. Consider installing more bins in area.',
    estimatedCleanupTime: '25-35 minutes',
    specialEquipmentNeeded: ['Gloves', 'Garbage bags', 'Recycling container'],
    confidence: 93,
  },
};

const MOCK_CLEANUP_COMPARISON: Record<string, CleanupComparison> = {
  excellent: {
    completionPercentage: 98,
    beforeSummary: 'Street litter with plastic bottles and food packaging scattered after night market',
    afterSummary: 'Area completely clean with all waste removed and properly sorted',
    wasteRemoved: [
      { type: 'Plastic', percentage: 45, recyclable: true },
      { type: 'Paper/Cardboard', percentage: 35, recyclable: true },
      { type: 'Organic', percentage: 20, recyclable: false },
    ],
    qualityRating: 'EXCELLENT',
    environmentalBenefit: 'Prevented 2.5kg of plastic from entering drainage system. All recyclables properly sorted.',
    verificationStatus: 'VERIFIED',
    feedback: 'Outstanding work! The area is spotless and all waste was properly categorized for recycling.',
    confidence: 95,
  },
  good: {
    completionPercentage: 85,
    beforeSummary: 'Plastic waste accumulated near school gate with bottles and wrappers',
    afterSummary: 'Most waste cleared, minor debris remains in corners',
    wasteRemoved: [
      { type: 'Plastic', percentage: 70, recyclable: true },
      { type: 'Paper', percentage: 20, recyclable: true },
    ],
    remainingIssues: ['Small debris in corner areas', 'Some staining on pavement'],
    qualityRating: 'GOOD',
    environmentalBenefit: 'Significant reduction in plastic pollution. Area is now safe for children.',
    verificationStatus: 'VERIFIED',
    feedback: 'Good cleanup effort. Consider checking corner areas for remaining small items.',
    confidence: 88,
  },
};

// Default map center (Dhaka, Bangladesh)
export const MAP_CENTER = { lat: 23.8103, lng: 90.4125 };
export const MAP_ZOOM = 13;

export const MOCK_ZONES: Zone[] = [
  {
    id: '1',
    name: 'Gulshan',
    cleanlinessScore: 85,
    description: 'Diplomatic and commercial zone',
    color: '#3b82f6',
    polygon: [
      { lat: 23.7925, lng: 90.4050 },
      { lat: 23.7925, lng: 90.4200 },
      { lat: 23.8050, lng: 90.4200 },
      { lat: 23.8050, lng: 90.4050 },
    ],
  },
  {
    id: '2',
    name: 'Dhanmondi',
    cleanlinessScore: 62,
    description: 'Residential and educational area',
    color: '#22c55e',
    polygon: [
      { lat: 23.7400, lng: 90.3700 },
      { lat: 23.7400, lng: 90.3900 },
      { lat: 23.7600, lng: 90.3900 },
      { lat: 23.7600, lng: 90.3700 },
    ],
  },
  {
    id: '3',
    name: 'Motijheel',
    cleanlinessScore: 45,
    description: 'Central business district',
    color: '#f59e0b',
    polygon: [
      { lat: 23.7250, lng: 90.4150 },
      { lat: 23.7250, lng: 90.4300 },
      { lat: 23.7400, lng: 90.4300 },
      { lat: 23.7400, lng: 90.4150 },
    ],
  },
];

// Trash/waste images for mock data (before cleanup)
const TRASH_IMAGES = {
  overflowingBin: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop',
  streetLitter: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop',
  illegalDumping: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop',
  constructionWaste: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  plasticWaste: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop',
  beachTrash: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=300&fit=crop',
};

// Clean area images (after cleanup)
const CLEAN_IMAGES = {
  cleanStreet: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=400&h=300&fit=crop',
  cleanPark: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
  cleanArea: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
};

export const MOCK_REPORTS: Report[] = [
  {
    id: 'R-101',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '2',
    zoneName: 'Dhanmondi',
    description: 'Overflowing bin near the playground entrance.',
    severity: 'MEDIUM',
    status: 'SUBMITTED',
    timestamp: '2024-12-10T09:30:00Z',
    imageUrl: TRASH_IMAGES.overflowingBin,
    aiAnalysis: MOCK_AI_ANALYSIS.overflowingBin,
  },
  {
    id: 'R-102',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '1',
    zoneName: 'Gulshan',
    description: 'Litter scattered after the night market.',
    severity: 'LOW',
    status: 'COMPLETED',
    timestamp: '2024-12-08T18:15:00Z',
    imageUrl: TRASH_IMAGES.streetLitter,
    aiAnalysis: MOCK_AI_ANALYSIS.streetLitter,
    completedAt: '2024-12-09T14:30:00Z',
    cleanerId: 'C-1',
    cleanerName: 'Bob Cleaner',
    afterImageUrl: CLEAN_IMAGES.cleanStreet,
    cleanupComparison: MOCK_CLEANUP_COMPARISON.excellent,
    review: {
      rating: 5,
      comment: 'Excellent job! The area looks spotless now.',
      reviewedAt: '2024-12-09T16:00:00Z',
    },
  },
  {
    id: 'R-103',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '1',
    zoneName: 'Gulshan',
    description: 'Illegal dumping near the lake.',
    severity: 'HIGH',
    status: 'APPROVED',
    timestamp: '2024-12-09T14:20:00Z',
    aiAnalysis: MOCK_AI_ANALYSIS.illegalDumping,
    imageUrl: TRASH_IMAGES.illegalDumping,
  },
  {
    id: 'R-104',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '3',
    zoneName: 'Motijheel',
    description: 'Hazardous waste near construction site.',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    timestamp: '2024-12-07T10:45:00Z',
    imageUrl: TRASH_IMAGES.constructionWaste,
    aiAnalysis: MOCK_AI_ANALYSIS.constructionWaste,
  },
  {
    id: 'R-105',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '2',
    zoneName: 'Dhanmondi',
    description: 'Broken glass bottles on sidewalk.',
    severity: 'MEDIUM',
    status: 'DECLINED',
    timestamp: '2024-12-05T16:00:00Z',
    imageUrl: TRASH_IMAGES.beachTrash,
  },
  {
    id: 'R-106',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '2',
    zoneName: 'Dhanmondi',
    description: 'Plastic waste accumulated near the school gate.',
    severity: 'MEDIUM',
    status: 'COMPLETED',
    timestamp: '2024-12-06T11:00:00Z',
    imageUrl: TRASH_IMAGES.plasticWaste,
    aiAnalysis: MOCK_AI_ANALYSIS.plasticWaste,
    completedAt: '2024-12-08T10:15:00Z',
    cleanerId: 'C-2',
    cleanerName: 'Karim Cleaner',
    afterImageUrl: CLEAN_IMAGES.cleanPark,
    cleanupComparison: MOCK_CLEANUP_COMPARISON.good,
    // No review - pending citizen review
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'T-501',
    reportId: 'R-103',
    cleanerId: undefined,
    cleanerName: undefined,
    zoneId: '1',
    zoneName: 'Gulshan',
    description: 'Clear illegal dumping near the lake.',
    status: 'APPROVED',
    priority: 'HIGH',
    dueDate: '2024-12-12T12:00:00Z',
    reward: 800,
    createdAt: '2024-12-10T10:00:00Z',
  },
  {
    id: 'T-502',
    reportId: 'R-104',
    cleanerId: 'C-1',
    cleanerName: 'Bob Cleaner',
    zoneId: '3',
    zoneName: 'Motijheel',
    description: 'Handle hazardous waste near construction site.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    dueDate: '2024-12-11T16:00:00Z',
    reward: 1200,
    createdAt: '2024-12-08T09:00:00Z',
    takenAt: '2024-12-08T09:30:00Z',
  },
  {
    id: 'T-503',
    reportId: 'R-102',
    cleanerId: 'C-1',
    cleanerName: 'Bob Cleaner',
    zoneId: '1',
    zoneName: 'Gulshan',
    description: 'Clean litter from night market area.',
    status: 'COMPLETED',
    priority: 'LOW',
    dueDate: '2024-12-09T10:00:00Z',
    evidenceImageUrl: CLEAN_IMAGES.cleanStreet,
    reward: 400,
    createdAt: '2024-12-08T08:00:00Z',
    takenAt: '2024-12-08T08:15:00Z',
    completedAt: '2024-12-09T14:30:00Z',
  },
  {
    id: 'T-504',
    reportId: 'R-106',
    cleanerId: 'C-2',
    cleanerName: 'Karim Cleaner',
    zoneId: '2',
    zoneName: 'Dhanmondi',
    description: 'Clean plastic waste near school gate.',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: '2024-12-08T18:00:00Z',
    evidenceImageUrl: CLEAN_IMAGES.cleanPark,
    reward: 500,
    createdAt: '2024-12-07T10:00:00Z',
    takenAt: '2024-12-07T10:30:00Z',
    completedAt: '2024-12-08T10:15:00Z',
  },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'A-901', source: 'AI', zoneId: '3', zoneName: 'Industrial Sector', severity: 'HIGH', timestamp: '2023-10-25T08:45:00Z', status: 'OPEN' },
  { id: 'A-902', source: 'CITIZEN', zoneId: '2', zoneName: 'Westside Park', severity: 'MEDIUM', timestamp: '2023-10-25T09:30:00Z', status: 'OPEN' },
];

export const CHART_DATA_CLEANLINESS = [
  { name: 'Downtown', score: 85 },
  { name: 'Westside', score: 62 },
  { name: 'Industrial', score: 45 },
  { name: 'North Hills', score: 92 },
];

export const CHART_DATA_COMPLETION = [
  { name: 'Mon', completed: 12 },
  { name: 'Tue', completed: 19 },
  { name: 'Wed', completed: 15 },
  { name: 'Thu', completed: 22 },
  { name: 'Fri', completed: 28 },
  { name: 'Sat', completed: 10 },
  { name: 'Sun', completed: 8 },
];

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

// Mock leaderboard data
export const MOCK_LEADERBOARD = [
  { rank: 1, userId: 'U-5', name: 'Rahim Ahmed', avatar: 'https://i.pravatar.cc/150?img=11', greenPoints: 450, approvedReports: 32, badges: 6 },
  { rank: 2, userId: 'U-3', name: 'Fatima Khan', avatar: 'https://i.pravatar.cc/150?img=5', greenPoints: 385, approvedReports: 28, badges: 5 },
  { rank: 3, userId: 'U-7', name: 'Kamal Hossain', avatar: 'https://i.pravatar.cc/150?img=12', greenPoints: 320, approvedReports: 24, badges: 4 },
  { rank: 4, userId: 'U-2', name: 'Nusrat Jahan', avatar: 'https://i.pravatar.cc/150?img=9', greenPoints: 275, approvedReports: 19, badges: 4 },
  { rank: 5, userId: 'U-1', name: 'Alice Citizen', avatar: 'https://i.pravatar.cc/150?img=1', greenPoints: 180, approvedReports: 12, badges: 3 },
  { rank: 6, userId: 'U-8', name: 'Tanvir Rahman', avatar: 'https://i.pravatar.cc/150?img=13', greenPoints: 145, approvedReports: 10, badges: 2 },
  { rank: 7, userId: 'U-4', name: 'Sadia Islam', avatar: 'https://i.pravatar.cc/150?img=10', greenPoints: 120, approvedReports: 8, badges: 2 },
  { rank: 8, userId: 'U-6', name: 'Imran Chowdhury', avatar: 'https://i.pravatar.cc/150?img=14', greenPoints: 95, approvedReports: 6, badges: 1 },
  { rank: 9, userId: 'U-9', name: 'Mita Das', avatar: 'https://i.pravatar.cc/150?img=16', greenPoints: 60, approvedReports: 4, badges: 1 },
  { rank: 10, userId: 'U-10', name: 'Arif Hasan', avatar: 'https://i.pravatar.cc/150?img=15', greenPoints: 35, approvedReports: 2, badges: 1 },
];

// Current user's profile (mock - would come from auth in real app)
export const MOCK_CURRENT_USER_PROFILE = {
  userId: 'U-1',
  name: 'Alice Citizen',
  avatar: 'https://i.pravatar.cc/150?img=1',
  greenPoints: 180,
  totalReports: 15,
  approvedReports: 12,
  currentStreak: 3,
  longestStreak: 7,
  rank: 5,
  badges: [
    { id: 'FIRST_REPORT', name: 'First Step', description: 'Submitted your first report', icon: '🌱', earnedAt: '2024-01-15' },
    { id: 'STREAK_7', name: 'Week Warrior', description: '7-day reporting streak', icon: '🔥', earnedAt: '2024-02-20' },
    { id: 'ECO_WARRIOR', name: 'Eco Warrior', description: '10+ approved reports', icon: '🌍', earnedAt: '2024-03-10' },
  ],
  joinedAt: '2024-01-10',
};

// All available badges
export const ALL_BADGES = [
  { id: 'FIRST_REPORT', name: 'First Step', description: 'Submit your first report', icon: '🌱' },
  { id: 'ECO_WARRIOR', name: 'Eco Warrior', description: 'Get 10+ reports approved', icon: '🌍' },
  { id: 'ZONE_CHAMPION', name: 'Zone Champion', description: 'Most reports in a zone', icon: '🏆' },
  { id: 'STREAK_7', name: 'Week Warrior', description: '7-day reporting streak', icon: '🔥' },
  { id: 'STREAK_30', name: 'Monthly Master', description: '30-day reporting streak', icon: '⚡' },
  { id: 'TOP_REPORTER', name: 'Top Reporter', description: 'Reach #1 on leaderboard', icon: '👑' },
];

// Current cleaner's profile (mock)
export const MOCK_CLEANER_PROFILE: CleanerProfile = {
  userId: 'C-1',
  name: 'Bob Cleaner',
  avatar: 'https://i.pravatar.cc/150?img=8',
  totalEarnings: 2400,
  pendingEarnings: 1200, // From T-502 in progress
  completedTasks: 5,
  currentTasks: 1,
  rating: 4.8,
  joinedAt: '2024-01-05',
};
