import React from 'react';

export type UserRole = 'CITIZEN' | 'CLEANER' | 'ADMIN';

// Report/Task Status Flow:
// SUBMITTED -> Citizen created report (awaiting admin review)
// APPROVED -> Admin accepted report & created task
// DECLINED -> Admin declined the report
// IN_PROGRESS -> Cleaner took the task
// COMPLETED -> Cleaner finished the task
export type Status = 'SUBMITTED' | 'APPROVED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isSuperAdmin?: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  cleanlinessScore: number;
  description: string;
  polygon: LatLng[]; // Array of coordinates defining the zone boundary
  color?: string; // Optional color for map display
}

export interface ReportLocation {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  zoneId: string;
  zoneName: string;
  description: string;
  imageUrl?: string;
  severity: Severity;
  status: Status;
  timestamp: string;
  location?: ReportLocation; // Exact coordinates of the waste
  // AI Analysis of the waste
  aiAnalysis?: WasteAnalysis;
  // Cleanup completion details (filled when status is COMPLETED)
  completedAt?: string;
  cleanerId?: string;
  cleanerName?: string;
  afterImageUrl?: string; // Photo taken by cleaner after cleanup
  cleanupComparison?: CleanupComparison; // AI comparison of before/after
  // Citizen review (citizen watchdog feature)
  review?: CleanupReview;
  citizenReview?: CleanupReview;
}

export interface CleanupReview {
  rating: number; // 1-5 stars
  comment?: string;
  reviewedAt?: string;
  timestamp?: string;
}

export interface Task {
  id: string;
  reportId?: string;
  cleanerId?: string;
  cleanerName?: string;
  zoneId: string;
  zoneName: string;
  description: string;
  status: Status;
  priority: Severity;
  dueDate: string;
  location?: ReportLocation;
  evidenceImageUrl?: string;
  beforeImageUrl?: string; // Image from the original report
  reward: number; // Payment in BDT for completing the task
  createdAt: string;
  takenAt?: string; // When cleaner took the task
  completedAt?: string;
  // AI Analysis and cleanup data
  aiAnalysis?: WasteAnalysis;
  cleanupComparison?: CleanupComparison;
  review?: CleanupReview; // Citizen review of the cleanup
}

export interface CleanerProfile {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  language?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  notify_report_updates?: boolean;
  notify_news_updates?: boolean;
  totalEarnings: number; // Total BDT earned
  pendingEarnings: number; // Earnings from tasks not yet paid out
  completedTasks: number;
  currentTasks: number;
  rating: number; // Average rating from citizen reviews
  joinedAt: string;
}

export interface Alert {
  id: string;
  source: 'AI' | 'CITIZEN';
  zoneId: string;
  zoneName: string;
  severity: Severity;
  timestamp: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

// Gamification types
export type BadgeType = 'FIRST_REPORT' | 'ECO_WARRIOR' | 'ZONE_CHAMPION' | 'STREAK_7' | 'STREAK_30' | 'TOP_REPORTER';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface CitizenProfile {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  avatarUrl?: string;
  greenPoints: number;
  totalReports: number;
  approvedReports: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  badges: Badge[];
  joinedAt: string;
  createdAt?: string;
  notificationSettings?: any;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  greenPoints: number;
  approvedReports: number;
  badges: number;
  // Cleaner-specific fields
  totalEarnings?: number;
  monthlyEarnings?: number;
  completedTasks?: number;
  rating?: number;
  isCurrentUser?: boolean;
}

// AI Waste Analysis types
export interface WasteComposition {
  type: string; // e.g., "Plastic", "Paper", "Organic", "Metal", "Glass", "E-waste"
  percentage: number;
  recyclable: boolean;
}

export interface WasteAnalysis {
  description: string;
  severity: Severity;
  wasteComposition: WasteComposition[];
  estimatedVolume: string; // e.g., "Small bag", "Multiple bags", "Requires truck"
  environmentalImpact: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  healthHazard: boolean;
  hazardDetails?: string;
  recommendedAction: string;
  estimatedCleanupTime: string; // e.g., "15-30 minutes", "1-2 hours"
  specialEquipmentNeeded: string[];
  confidence: number; // 0-100 AI confidence score
}

// Cleanup comparison analysis (before vs after)
export interface CleanupComparison {
  completionPercentage: number; // 0-100 how much waste was cleaned
  beforeSummary: string;
  afterSummary: string;
  wasteRemoved: WasteComposition[]; // What was cleaned
  remainingIssues?: string[]; // Any issues still present
  qualityRating: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  environmentalBenefit: string;
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'INCOMPLETE';
  feedback: string; // AI feedback for the cleaner
  confidence: number;
}