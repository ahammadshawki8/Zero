import { 
  Report, 
  Task, 
  Zone, 
  User, 
  CitizenProfile, 
  CleanerProfile, 
  LeaderboardEntry,
  WasteAnalysis,
  CleanupComparison,
  Badge,
  CleanupReview
} from '../types';
import API_CONFIG from '../config/api';

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Token management
let authToken: string | null = localStorage.getItem('authToken');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// HTTP client with auth headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

const mapCitizenReportSummary = (item: any): Report => ({
  id: item?.id || '',
  userId: item?.user_id || '',
  userName: item?.user_name || '',
  zoneId: item?.zone_id || '',
  zoneName: item?.zone_name || 'Unknown Zone',
  description: item?.description || '',
  imageUrl: item?.image_url || undefined,
  severity: (item?.severity || 'LOW') as Report['severity'],
  status: (item?.status || 'SUBMITTED') as Report['status'],
  timestamp: item?.created_at || new Date().toISOString(),
  location:
    item?.latitude != null && item?.longitude != null
      ? { lat: Number(item.latitude), lng: Number(item.longitude) }
      : undefined,
  aiAnalysis: item?.ai_analysis
    ? {
        description: item.ai_analysis.description || 'AI analysis available',
        severity: (item.ai_analysis.severity || item?.severity || 'LOW') as Report['severity'],
        wasteComposition: Array.isArray(item.ai_analysis.waste_composition)
          ? item.ai_analysis.waste_composition.map((w: any) => ({
              type: w.waste_type || 'Unknown',
              percentage: Number(w.percentage || 0),
              recyclable: Boolean(w.recyclable),
            }))
          : [],
        estimatedVolume: item.ai_analysis.estimated_volume || 'N/A',
        environmentalImpact: (item.ai_analysis.environmental_impact || 'MODERATE') as WasteAnalysis['environmentalImpact'],
        healthHazard: Boolean(item.ai_analysis.health_hazard),
        hazardDetails: item.ai_analysis.hazard_details || undefined,
        recommendedAction: item.ai_analysis.recommended_action || 'Manual review recommended',
        estimatedCleanupTime: item.ai_analysis.estimated_cleanup_time || 'N/A',
        specialEquipmentNeeded: Array.isArray(item.ai_analysis.special_equipment_needed)
          ? item.ai_analysis.special_equipment_needed
          : [],
        confidence: Number(item.ai_analysis.confidence || 0),
      }
    : undefined,
  completedAt: item?.completed_at || undefined,
  cleanerName: item?.cleaner_name || undefined,
  afterImageUrl: item?.after_image_url || undefined,
  review: item?.citizen_rating
    ? {
        rating: Number(item.citizen_rating || 0),
        comment: item.citizen_comment || undefined,
        reviewedAt: item.citizen_reviewed_at || undefined,
        timestamp: item.citizen_reviewed_at || undefined,
      }
    : undefined,
  citizenReview: item?.citizen_rating
    ? {
        rating: Number(item.citizen_rating || 0),
        comment: item.citizen_comment || undefined,
        reviewedAt: item.citizen_reviewed_at || undefined,
        timestamp: item.citizen_reviewed_at || undefined,
      }
    : undefined,
});

const mapCitizenLeaderboardEntry = (entry: any): LeaderboardEntry => ({
  rank: Number(entry?.rank || 0),
  userId: entry?.user_id || '',
  name: entry?.user_name || 'Unknown User',
  avatarUrl: entry?.avatar_url || undefined,
  greenPoints: Number(entry?.total_green_points || 0),
  approvedReports: Number(entry?.approved_reports || 0),
  badges: Number(entry?.badges_count || 0),
});

const mapCleanerLeaderboardEntry = (entry: any): LeaderboardEntry => ({
  rank: Number(entry?.rank || 0),
  userId: entry?.user_id || '',
  name: entry?.user_name || 'Unknown Cleaner',
  avatar: entry?.avatar_url || undefined,
  avatarUrl: entry?.avatar_url || undefined,
  greenPoints: 0,
  approvedReports: 0,
  badges: 0,
  totalEarnings: Number(entry?.total_earnings || 0),
  monthlyEarnings: Number(entry?.period_earnings || 0),
  completedTasks: Number(entry?.completed_tasks || 0),
  rating: Number(entry?.rating || 0),
  isCurrentUser: Boolean(entry?.is_current_user),
});

const mapAdminTask = (item: any): Task => ({
  id: item?.id || '',
  reportId: item?.report_id || undefined,
  cleanerId: item?.cleaner_id || undefined,
  cleanerName: item?.cleaner_name || undefined,
  zoneId: item?.zone_id || '',
  zoneName: item?.zone_name || 'Unknown Zone',
  description: item?.description || '',
  status: (item?.status || 'APPROVED') as Task['status'],
  priority: (item?.priority || 'MEDIUM') as Task['priority'],
  dueDate: item?.due_date || item?.dueDate || new Date().toISOString(),
  reward: Number(item?.reward || 0),
  createdAt: item?.created_at || item?.createdAt || new Date().toISOString(),
  takenAt: item?.taken_at || item?.takenAt || undefined,
  completedAt: item?.completed_at || item?.completedAt || undefined,
  evidenceImageUrl: item?.evidence_image_url || item?.evidenceImageUrl || item?.report_after_image_url || undefined,
  beforeImageUrl: item?.before_image_url || item?.beforeImageUrl || undefined,
  aiAnalysis: item?.ai_description
    ? {
        description: item.ai_description || 'AI analysis available',
        severity: (item.ai_severity || item.priority || 'MEDIUM') as Task['priority'],
        wasteComposition: Array.isArray(item.waste_composition)
          ? item.waste_composition.map((w: any) => ({
              type: w?.waste_type || 'Unknown',
              percentage: Number(w?.percentage || 0),
              recyclable: Boolean(w?.recyclable),
            }))
          : [],
        estimatedVolume: item.estimated_volume || 'N/A',
        environmentalImpact: (item.environmental_impact || 'MODERATE') as WasteAnalysis['environmentalImpact'],
        healthHazard: Boolean(item.health_hazard),
        hazardDetails: item.hazard_details || undefined,
        recommendedAction: item.recommended_action || 'Manual review recommended',
        estimatedCleanupTime: item.estimated_cleanup_time || 'N/A',
        specialEquipmentNeeded: Array.isArray(item.special_equipment_needed)
          ? item.special_equipment_needed
          : [],
        confidence: Number(item.ai_confidence || 0),
      }
    : undefined,
  cleanupComparison: item?.completion_percentage != null
    ? {
        completionPercentage: Number(item.completion_percentage || 0),
        beforeSummary: item.before_summary || 'Before summary not available',
        afterSummary: item.after_summary || 'After summary not available',
        wasteRemoved: [],
        qualityRating: (item.quality_rating || 'FAIR') as CleanupComparison['qualityRating'],
        environmentalBenefit: item.environmental_benefit || 'N/A',
        verificationStatus: (item.verification_status || 'NEEDS_REVIEW') as CleanupComparison['verificationStatus'],
        feedback: item.feedback || 'No feedback available',
        confidence: Number(item.comparison_confidence || 0),
        remainingIssues: [],
      }
    : undefined,
});

const mapCleanerProfile = (payload: any): CleanerProfile => {
  const user = payload?.user || payload || {};
  const profile = payload?.profile || payload || {};

  return {
    userId: user?.id || profile?.user_id || '',
    name: user?.name || profile?.name || 'Cleaner',
    email: user?.email || profile?.email || undefined,
    phone: user?.phone || profile?.phone || undefined,
    address: user?.address || profile?.address || undefined,
    avatar: user?.avatar_url || profile?.avatar_url || undefined,
    language: user?.language || undefined,
    emailNotifications: Boolean(user?.email_notifications ?? true),
    pushNotifications: Boolean(user?.push_notifications ?? false),
    totalEarnings: Number(profile?.total_earnings ?? profile?.totalEarnings ?? 0),
    pendingEarnings: Number(profile?.pending_earnings ?? profile?.pendingEarnings ?? 0),
    completedTasks: Number(profile?.completed_tasks ?? profile?.completedTasks ?? 0),
    currentTasks: Number(profile?.current_tasks ?? profile?.currentTasks ?? 0),
    rating: Number(profile?.rating ?? 0),
    joinedAt: profile?.created_at || user?.created_at || new Date().toISOString(),
  };
};

const mapCleanerTask = (item: any): Task => ({
  id: item?.id || '',
  reportId: item?.report_id || undefined,
  cleanerId: item?.cleaner_id || undefined,
  cleanerName: item?.cleaner_name || undefined,
  zoneId: item?.zone_id || '',
  zoneName: item?.zone_name || 'Unknown Zone',
  description: item?.description || item?.report_description || '',
  status: (item?.status || 'APPROVED') as Task['status'],
  priority: (item?.priority || item?.severity || 'MEDIUM') as Task['priority'],
  dueDate: item?.due_date || item?.dueDate || new Date().toISOString(),
  location:
    item?.latitude != null && item?.longitude != null
      ? { lat: Number(item.latitude), lng: Number(item.longitude) }
      : undefined,
  reward: Number(item?.reward ?? 0),
  createdAt: item?.created_at || item?.createdAt || new Date().toISOString(),
  takenAt: item?.taken_at || undefined,
  completedAt: item?.completed_at || undefined,
  evidenceImageUrl: item?.evidence_image_url || item?.after_image_url || undefined,
  beforeImageUrl: item?.report_image || item?.image_url || undefined,
  aiAnalysis: item?.estimated_volume || item?.recommended_action || item?.ai_description || Array.isArray(item?.special_equipment)
    ? {
        description: item?.ai_description || item?.report_description || item?.description || 'Cleanup task analysis',
        severity: (item?.ai_severity || item?.priority || item?.severity || 'MEDIUM') as Task['priority'],
        wasteComposition: Array.isArray(item?.waste_composition)
          ? item.waste_composition.map((w: any) => ({
              type: w?.waste_type || 'Unknown',
              percentage: Number(w?.percentage || 0),
              recyclable: Boolean(w?.recyclable),
            }))
          : [],
        estimatedVolume: item?.estimated_volume || 'N/A',
        environmentalImpact: (item?.environmental_impact || 'MODERATE') as WasteAnalysis['environmentalImpact'],
        healthHazard: Boolean(item?.health_hazard),
        hazardDetails: item?.hazard_details || undefined,
        recommendedAction: item?.recommended_action || 'Follow cleanup checklist',
        estimatedCleanupTime: item?.estimated_cleanup_time || 'N/A',
        specialEquipmentNeeded: Array.isArray(item?.special_equipment)
          ? item.special_equipment
          : [],
        confidence: Number(item?.ai_confidence || item?.confidence || 0),
      }
    : undefined,
  review: item?.review_rating
    ? {
        rating: Number(item.review_rating),
        comment: item.review_comment || undefined,
        reviewedAt: item.review_date || undefined,
      }
    : undefined,
  cleanupComparison: item?.completion_percentage != null
    ? {
        completionPercentage: Number(item.completion_percentage || 0),
        beforeSummary: item.before_summary || 'Before summary not available',
        afterSummary: item.after_summary || 'After summary not available',
        wasteRemoved: [],
        qualityRating: (item.quality_rating || 'FAIR') as CleanupComparison['qualityRating'],
        environmentalBenefit: item.environmental_benefit || 'N/A',
        verificationStatus: (item.verification_status || 'NEEDS_REVIEW') as CleanupComparison['verificationStatus'],
        feedback: item.feedback || 'No feedback available',
        confidence: Number(item.comparison_confidence || 0),
        remainingIssues: [],
      }
    : undefined,
});

const mapCleanerTaskDetails = (payload: any, fallbackTaskId: string): Task => {
  const task = payload?.task || {};
  const zone = payload?.zone || {};
  const report = payload?.report || {};
  const ai = payload?.ai_analysis || {};
  const review = payload?.review;

  return {
    id: task?.id || fallbackTaskId,
    reportId: report?.id || undefined,
    cleanerId: task?.cleaner_id || undefined,
    zoneId: task?.zone_id || '',
    zoneName: zone?.name || 'Unknown Zone',
    description: task?.description || report?.description || '',
    status: (task?.status || 'APPROVED') as Task['status'],
    priority: (task?.priority || 'MEDIUM') as Task['priority'],
    dueDate: task?.due_date || new Date().toISOString(),
    reward: Number(task?.reward ?? 0),
    createdAt: task?.created_at || new Date().toISOString(),
    takenAt: task?.taken_at || undefined,
    completedAt: task?.completed_at || undefined,
    evidenceImageUrl: task?.evidence_image_url || report?.after_image_url || undefined,
    beforeImageUrl: report?.image_url || undefined,
    aiAnalysis: Object.keys(ai).length
      ? {
          description: report?.description || 'Task analysis',
          severity: (task?.priority || 'MEDIUM') as Task['priority'],
          wasteComposition: [],
          estimatedVolume: ai?.estimated_volume || 'N/A',
          environmentalImpact: (ai?.environmental_impact || 'MODERATE') as WasteAnalysis['environmentalImpact'],
          healthHazard: false,
          recommendedAction: ai?.recommended_action || 'Follow standard cleanup protocol',
          estimatedCleanupTime: ai?.estimated_cleanup_time || 'N/A',
          specialEquipmentNeeded: Array.isArray(ai?.special_equipment) ? ai.special_equipment : [],
          confidence: Number(ai?.confidence || 0),
        }
      : undefined,
    review: review
      ? {
          rating: Number(review?.rating || 0),
          comment: review?.comment || undefined,
          reviewedAt: review?.created_at || undefined,
        }
      : undefined,
  };
};

const mapCitizenReportDetails = (payload: any, fallbackReportId: string): Report => {
  const report = payload?.report || {};
  const zone = payload?.zone || {};
  const ai = payload?.ai_analysis;
  const cleanup = payload?.cleanup_comparison;
  const review = payload?.review;

  return {
    id: report?.id || fallbackReportId,
    userId: report?.user_id || '',
    userName: report?.user_name || '',
    zoneId: report?.zone_id || '',
    zoneName: zone?.name || 'Unknown Zone',
    description: report?.description || '',
    imageUrl: report?.image_url || undefined,
    severity: (report?.severity || 'LOW') as Report['severity'],
    status: (report?.status || 'SUBMITTED') as Report['status'],
    timestamp: report?.created_at || new Date().toISOString(),
    location:
      report?.latitude != null && report?.longitude != null
        ? { lat: Number(report.latitude), lng: Number(report.longitude) }
        : undefined,
    completedAt: report?.completed_at || undefined,
    cleanerName: payload?.cleaner?.name || undefined,
    afterImageUrl: report?.after_image_url || undefined,
    aiAnalysis: ai
      ? {
          description: ai.description || 'AI analysis available',
          severity: (ai.severity || report?.severity || 'LOW') as Report['severity'],
          wasteComposition: Array.isArray(ai.waste_composition)
            ? ai.waste_composition.map((w: any) => ({
                type: w.waste_type || 'Unknown',
                percentage: Number(w.percentage || 0),
                recyclable: Boolean(w.recyclable),
              }))
            : [],
          estimatedVolume: ai.estimated_volume || 'N/A',
          environmentalImpact: (ai.environmental_impact || 'MODERATE') as WasteAnalysis['environmentalImpact'],
          healthHazard: Boolean(ai.health_hazard),
          hazardDetails: ai.hazard_details || undefined,
          recommendedAction: ai.recommended_action || 'Manual review recommended',
          estimatedCleanupTime: ai.estimated_cleanup_time || 'N/A',
          specialEquipmentNeeded: Array.isArray(ai.special_equipment_needed)
            ? ai.special_equipment_needed
            : [],
          confidence: Number(ai.confidence || 0),
        }
      : undefined,
    cleanupComparison: cleanup
      ? {
          completionPercentage: Number(cleanup.completion_percentage || 0),
          beforeSummary: cleanup.before_summary || 'Before summary not available',
          afterSummary: cleanup.after_summary || 'After summary not available',
          wasteRemoved: [],
          qualityRating: (cleanup.quality_rating || 'FAIR') as CleanupComparison['qualityRating'],
          environmentalBenefit: cleanup.environmental_benefit || 'N/A',
          verificationStatus: (cleanup.verification_status || 'NEEDS_REVIEW') as CleanupComparison['verificationStatus'],
          feedback: cleanup.feedback || 'No feedback available',
          confidence: Number(cleanup.confidence || 60),
          remainingIssues: [],
        }
      : undefined,
    citizenReview: review
      ? {
          rating: Number(review.rating || 0),
          comment: review.comment || undefined,
          reviewedAt: review.reviewed_at || undefined,
          timestamp: review.reviewed_at || undefined,
        }
      : undefined,
    review: review
      ? {
          rating: Number(review.rating || 0),
          comment: review.comment || undefined,
          reviewedAt: review.reviewed_at || undefined,
          timestamp: review.reviewed_at || undefined,
        }
      : undefined,
  };
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'CITIZEN' | 'CLEANER' | 'ADMIN';
    phone?: string;
  }) => {
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Best-effort server logout; always clear client token.
    } finally {
      setAuthToken(null);
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient('/auth/me');
    return response.data;
  },
};

// Citizen API
export const citizenAPI = {
  getProfile: async (): Promise<CitizenProfile> => {
    const response = await apiClient('/citizen/profile');
    return response.data;
  },

  updateProfile: async (profileData: Partial<CitizenProfile>) => {
    const response = await apiClient('/citizen/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient('/citizen/stats');
    return response.data;
  },

  submitReport: async (reportData: {
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    location: { lat: number; lng: number };
    zoneId: string;
    imageUrl?: string;
    aiAnalysis?: WasteAnalysis;
  }) => {
    const mappedAiAnalysis = reportData.aiAnalysis
      ? {
          description: reportData.aiAnalysis.description,
          severity: reportData.aiAnalysis.severity,
          estimated_volume: reportData.aiAnalysis.estimatedVolume,
          environmental_impact: reportData.aiAnalysis.environmentalImpact,
          health_hazard: reportData.aiAnalysis.healthHazard,
          hazard_details: reportData.aiAnalysis.hazardDetails || '',
          recommended_action: reportData.aiAnalysis.recommendedAction,
          estimated_cleanup_time: reportData.aiAnalysis.estimatedCleanupTime,
          confidence: reportData.aiAnalysis.confidence,
          waste_composition: (reportData.aiAnalysis.wasteComposition || []).map((w) => ({
            waste_type: w.type,
            percentage: w.percentage,
            recyclable: w.recyclable,
          })),
          special_equipment_needed: reportData.aiAnalysis.specialEquipmentNeeded || [],
        }
      : undefined;

    // Map frontend data to backend expected format
    const backendData = {
      zone_id: reportData.zoneId,
      description: reportData.description,
      severity: reportData.severity,
      latitude: reportData.location.lat,
      longitude: reportData.location.lng,
      image_url: reportData.imageUrl,
      ai_analysis: mappedAiAnalysis,
    };
    
    const response = await apiClient('/citizen/reports', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return response.data;
  },

  getMyReports: async (): Promise<Report[]> => {
    const response = await apiClient('/citizen/reports');
    const reports = Array.isArray(response.data) ? response.data : [];
    return reports.map(mapCitizenReportSummary);
  },

  getReportDetails: async (reportId: string): Promise<Report> => {
    const response = await apiClient(`/citizen/reports/${reportId}`);
    return mapCitizenReportDetails(response.data, reportId);
  },

  updateReport: async (
    reportId: string,
    updates: Partial<{
      zoneId: string;
      description: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      location: { lat: number; lng: number };
      imageUrl?: string;
    }>
  ): Promise<Report> => {
    const payload: any = {};
    if (updates.zoneId !== undefined) payload.zone_id = updates.zoneId;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.severity !== undefined) payload.severity = updates.severity;
    if (updates.location?.lat !== undefined) payload.latitude = updates.location.lat;
    if (updates.location?.lng !== undefined) payload.longitude = updates.location.lng;
    if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;

    const response = await apiClient(`/citizen/reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapCitizenReportSummary(response.data);
  },

  deleteReport: async (reportId: string) => {
    const response = await apiClient(`/citizen/reports/${reportId}`, {
      method: 'DELETE',
    });
    return response;
  },

  submitReview: async (reportId: string, review: CleanupReview) => {
    const response = await apiClient(`/citizen/reports/${reportId}/review`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
    return response.data;
  },

  getBadges: async (): Promise<Badge[]> => {
    const response = await apiClient('/citizen/badges');
    return response.data; // Backend returns {success: true, data: [...]}
  },

  getPointsHistory: async () => {
    const response = await apiClient('/citizen/points');
    return response.data;
  },

  getLeaderboard: async (period: 'all_time' | 'month' | 'week' = 'all_time', limit = 20): Promise<LeaderboardEntry[]> => {
    const response = await apiClient(`/citizen/leaderboard?period=${period}&limit=${limit}`);
    const entries = Array.isArray(response.data) ? response.data : [];
    return entries.map(mapCitizenLeaderboardEntry);
  },

  getNotifications: async () => {
    const response = await apiClient('/citizen/notifications');
    return response.data;
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await apiClient('/citizen/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient('/citizen/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response.data;
  },

  downloadUserData: async () => {
    const response = await apiClient('/citizen/download-data', {
      method: 'GET',
    });
    // Handle file download
    const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient('/citizen/delete-account', {
      method: 'DELETE',
    });
    return response.data;
  },
};

// Cleaner API
export const cleanerAPI = {
  getProfile: async (): Promise<CleanerProfile> => {
    const response = await apiClient('/cleaner/profile');
    return mapCleanerProfile(response.data);
  },

  updateProfile: async (profileData: Partial<CleanerProfile>) => {
    const payload: any = {};
    if (profileData.name !== undefined) payload.name = profileData.name;
    if (profileData.phone !== undefined) payload.phone = profileData.phone;
    if (profileData.avatar !== undefined) payload.avatar_url = profileData.avatar;
    if ((profileData as any).address !== undefined) payload.address = (profileData as any).address;
    if ((profileData as any).language !== undefined) payload.language = (profileData as any).language;
    if ((profileData as any).emailNotifications !== undefined) payload.email_notifications = (profileData as any).emailNotifications;
    if ((profileData as any).pushNotifications !== undefined) payload.push_notifications = (profileData as any).pushNotifications;
    if ((profileData as any).email_notifications !== undefined) payload.email_notifications = (profileData as any).email_notifications;
    if ((profileData as any).push_notifications !== undefined) payload.push_notifications = (profileData as any).push_notifications;
    if ((profileData as any).avatar_url !== undefined) payload.avatar_url = (profileData as any).avatar_url;

    const response = await apiClient('/cleaner/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapCleanerProfile(response.data);
  },

  getStats: async () => {
    const response = await apiClient('/cleaner/stats');
    return response.data;
  },

  getAvailableTasks: async (): Promise<Task[]> => {
    const response = await apiClient('/cleaner/tasks/available');
    const tasks = Array.isArray(response?.data) ? response.data : [];
    return tasks.map(mapCleanerTask);
  },

  takeTask: async (taskId: string) => {
    const response = await apiClient(`/cleaner/tasks/${taskId}/take`, {
      method: 'POST',
    });
    return response.data;
  },

  getMyTasks: async (): Promise<Task[]> => {
    const response = await apiClient('/cleaner/tasks');
    const tasks = Array.isArray(response?.data) ? response.data : [];
    return tasks.map(mapCleanerTask);
  },

  completeTask: async (taskId: string, completionData: {
    evidenceImageUrl: string;
    completedAt?: string;
    notes?: string;
  }) => {
    const payload = {
      evidence_image_url: completionData.evidenceImageUrl,
      after_image_url: completionData.evidenceImageUrl,
      completed_at: completionData.completedAt,
      notes: completionData.notes,
    };

    const response = await apiClient(`/cleaner/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  getTaskDetails: async (taskId: string): Promise<Task> => {
    const response = await apiClient(`/cleaner/tasks/${taskId}`);
    return mapCleanerTaskDetails(response.data, taskId);
  },

  getEarnings: async () => {
    const response = await apiClient('/cleaner/earnings');
    return response.data;
  },

  getReviews: async () => {
    const response = await apiClient('/cleaner/reviews');
    return response.data;
  },

  getLeaderboard: async (period: 'all_time' | 'month' | 'week' = 'all_time', limit = 20): Promise<LeaderboardEntry[]> => {
    const response = await apiClient(`/cleaner/leaderboard?period=${period}&limit=${limit}`);
    const entries = Array.isArray(response?.data) ? response.data : [];
    return entries.map(mapCleanerLeaderboardEntry);
  },

  getCompletedTasks: async (): Promise<Task[]> => {
    const response = await apiClient('/cleaner/tasks?status=COMPLETED');
    const tasks = Array.isArray(response?.data) ? response.data : [];
    return tasks.map(mapCleanerTask);
  },

  getPaymentSummary: async () => {
    const response = await apiClient('/cleaner/payments/summary');
    return response.data;
  },

  requestWithdrawal: async (payload: {
    amount: number;
    method: 'BKASH' | 'BANK' | 'CARD';
    destination_account: string;
    reference_code?: string;
    note?: string;
  }) => {
    const response = await apiClient('/cleaner/payments/withdraw', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await apiClient('/cleaner/payments/history');
    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient('/cleaner/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response.data;
  },

  downloadUserData: async () => {
    const response = await apiClient('/cleaner/download-data', {
      method: 'GET',
    });
    const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-cleaner-data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient('/cleaner/delete-account', {
      method: 'DELETE',
    });
    return response.data;
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await apiClient('/cleaner/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getProfile: async () => {
    const response = await apiClient('/admin/profile');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await apiClient('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient('/admin/users');
    return response.data;
  },

  getUserDetails: async (userId: string): Promise<User> => {
    const response = await apiClient(`/admin/users/${userId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient('/admin/stats');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await apiClient('/admin/dashboard-summary');
    return response.data;
  },

  getPendingReports: async (): Promise<Report[]> => {
    const response = await apiClient('/admin/reports/pending');
    const reports = Array.isArray(response?.data) ? response.data : [];
    return reports.map(mapCitizenReportSummary);
  },

  approveReport: async (reportId: string, approvalData?: {
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reward?: number;
    dueDate?: string;
    notes?: string;
  }) => {
    const response = await apiClient(`/admin/reports/${reportId}/approve`, {
      method: 'POST',
      body: JSON.stringify(approvalData || {}),
    });
    return response.data;
  },

  getRewardSuggestion: async (reportId: string) => {
    const response = await apiClient(`/admin/reports/${reportId}/reward-suggestion`);
    return response.data;
  },

  declineReport: async (reportId: string, reason: string) => {
    const response = await apiClient(`/admin/reports/${reportId}/decline`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  },

  reopenReport: async (reportId: string) => {
    const response = await apiClient(`/admin/reports/${reportId}/reopen`, {
      method: 'POST',
    });
    return response.data;
  },

  getAllReports: async (): Promise<Report[]> => {
    const response = await apiClient('/admin/reports');
    const reports = Array.isArray(response?.data) ? response.data : [];
    return reports.map(mapCitizenReportSummary);
  },

  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient('/admin/tasks');
    const tasks = Array.isArray(response?.data) ? response.data : [];
    return tasks.map(mapAdminTask);
  },

  getTaskDetails: async (taskId: string): Promise<Task> => {
    const response = await apiClient(`/admin/tasks/${taskId}`);
    return mapAdminTask(response?.data || { id: taskId });
  },

  createTask: async (taskData: {
    description: string;
    zoneId: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reward: number;
    dueDate: string;
  }) => {
    const response = await apiClient('/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return mapAdminTask(response.data || {});
  },

  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    const response = await apiClient(`/admin/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    const updated = response.data || {};
    return {
      id: updated.id || taskId,
      description: updated.description,
      priority: updated.priority,
      reward: updated.reward != null ? Number(updated.reward) : undefined,
      dueDate: updated.due_date || updated.dueDate,
      status: updated.status,
    } as Partial<Task>;
  },

  deleteTask: async (taskId: string) => {
    const response = await apiClient(`/admin/tasks/${taskId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient('/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
    return response.data;
  },

  downloadUserData: async () => {
    const response = await apiClient('/admin/download-data', {
      method: 'GET',
    });
    const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-admin-data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient('/admin/delete-account', {
      method: 'DELETE',
    });
    return response.data;
  },

  getZones: async (): Promise<Zone[]> => {
    const response = await apiClient('/admin/zones');
    return response.data;
  },

  createZone: async (zoneData: Omit<Zone, 'id'>) => {
    const response = await apiClient('/admin/zones', {
      method: 'POST',
      body: JSON.stringify(zoneData),
    });
    return response.data;
  },

  updateZone: async (zoneId: string, zoneData: Partial<Zone>) => {
    const response = await apiClient(`/admin/zones/${zoneId}`, {
      method: 'PUT',
      body: JSON.stringify(zoneData),
    });
    return response.data;
  },

  getZoneDetails: async (zoneId: string): Promise<Zone> => {
    const response = await apiClient(`/admin/zones/${zoneId}`);
    return response.data;
  },

  deleteZone: async (zoneId: string) => {
    const response = await apiClient(`/admin/zones/${zoneId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  getReportDetails: async (reportId: string): Promise<Report> => {
    const response = await apiClient(`/admin/reports/${reportId}`);
    const payload = response?.data;
    if (payload?.report) {
      return mapCitizenReportDetails(payload, reportId);
    }

    return mapCitizenReportSummary(payload || { id: reportId });
  },

  sendBulkNotification: async (notificationData: {
    audience: 'all' | 'citizens' | 'cleaners';
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'alert';
  }) => {
    const response = await apiClient('/admin/notifications/bulk', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
    return response.data;
  },

  getPendingPayments: async (params?: { limit?: number; offset?: number; cleaner_id?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit != null) query.set('limit', String(params.limit));
    if (params?.offset != null) query.set('offset', String(params.offset));
    if (params?.cleaner_id) query.set('cleaner_id', params.cleaner_id);
    const suffix = query.toString() ? `?${query.toString()}` : '';

    const response = await apiClient(`/admin/payments/pending${suffix}`);
    return response.data;
  },

  getPendingPaymentDetails: async (transactionId: string) => {
    const response = await apiClient(`/admin/payments/pending/${transactionId}`);
    return response.data;
  },

  processPayments: async (paymentData: {
    transaction_ids: string[];
  }) => {
    const response = await apiClient('/admin/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.data;
  },

  topUpSystemFunds: async (payload: { amount: number; note?: string }) => {
    const response = await apiClient('/admin/payments/top-up', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  getPaymentSummary: async () => {
    const response = await apiClient('/admin/payments/summary');
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await apiClient('/admin/payments/history');
    return response.data;
  },

  getFundTransactionHistory: async () => {
    const response = await apiClient('/admin/payments/funds/history');
    return response.data;
  },

  updateNotificationSettings: async (settings: any) => {
    const response = await apiClient('/admin/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.data;
  },
};

// AI Analysis API
export const aiAPI = {
  analyzeWaste: async (imageData: string): Promise<WasteAnalysis> => {
    const response = await apiClient('/ai/analyze-waste', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageData }),
    });
    return response.data;
  },

  compareCleanup: async (beforeImage: string, afterImage: string, originalAnalysis?: WasteAnalysis): Promise<CleanupComparison> => {
    const response = await apiClient('/ai/compare-cleanup', {
      method: 'POST',
      body: JSON.stringify({ 
        before_image_url: beforeImage, 
        after_image_url: afterImage, 
        originalAnalysis 
      }),
    });
    return response.data;
  },

  analyzeReport: async (reportId: string): Promise<WasteAnalysis> => {
    const response = await apiClient(`/ai/analyze-report/${reportId}`, {
      method: 'POST',
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async () => {
    const response = await apiClient('/notifications');
    const notifications = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.notifications)
        ? response.notifications
        : [];

    return {
      notifications,
      unread_count: typeof response?.unread_count === 'number' ? response.unread_count : 0,
      total: typeof response?.total === 'number' ? response.total : notifications.length,
    };
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient('/notifications/read-all', {
      method: 'PUT',
    });
    return response.data;
  },
};

// Leaderboards API
export const leaderboardsAPI = {
  getCitizenLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await apiClient('/leaderboards/citizens');
    return response.data;
  },

  getCleanerLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await apiClient('/leaderboards/cleaners');
    return response.data;
  },

  recalculateLeaderboards: async () => {
    const response = await apiClient('/admin/leaderboards/recalculate', {
      method: 'POST',
    });
    return response.data;
  },
};

// Shared API
export const sharedAPI = {
  getZones: async (): Promise<Zone[]> => {
    const response = await apiClient('/zones');
    return response.data;
  },

  findZoneByLocation: async (lat: number, lng: number): Promise<Zone | null> => {
    const response = await apiClient(`/zones/by-location?lat=${lat}&lng=${lng}`);
    return response.data;
  },

  getZoneStats: async (zoneId: string) => {
    const response = await apiClient(`/zones/${zoneId}/stats`);
    return response.data;
  },

  getReportDetails: async (reportId: string): Promise<Report> => {
    const response = await apiClient(`/reports/${reportId}`);
    return response.data;
  },

  getTaskDetails: async (taskId: string): Promise<Task> => {
    const response = await apiClient(`/tasks/${taskId}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await apiClient('/health');
    return response;
  },
};

export const superadminAPI = {
  getDashboard: async () => {
    const response = await apiClient('/superadmin/dashboard');
    return response.data;
  },

  getUsers: async (params?: {
    role?: 'CITIZEN' | 'CLEANER' | 'ADMIN';
    is_active?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.role) query.set('role', params.role);
    if (params?.is_active !== undefined) query.set('is_active', String(params.is_active));
    if (params?.search) query.set('search', params.search);
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.offset !== undefined) query.set('offset', String(params.offset));

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await apiClient(`/superadmin/users${suffix}`);
    return response;
  },

  getActivityLogs: async (params?: {
    user_id?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.user_id) query.set('user_id', params.user_id);
    if (params?.action) query.set('action', params.action);
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.offset !== undefined) query.set('offset', String(params.offset));

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const response = await apiClient(`/superadmin/activity-logs${suffix}`);
    return response;
  },

  blockUser: async (userId: string) => {
    const response = await apiClient(`/superadmin/users/${userId}/block`, { method: 'POST' });
    return response;
  },

  unblockUser: async (userId: string) => {
    const response = await apiClient(`/superadmin/users/${userId}/unblock`, { method: 'POST' });
    return response;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient(`/superadmin/users/${userId}`, { method: 'DELETE' });
    return response;
  },

  revertAction: async (actionId: string) => {
    const response = await apiClient(`/superadmin/actions/${actionId}/revert`, { method: 'POST' });
    return response;
  },
};

// Export auth token utilities
export { setAuthToken, authToken };

// Default export with all APIs
export default {
  auth: authAPI,
  citizen: citizenAPI,
  cleaner: cleanerAPI,
  admin: adminAPI,
  superadmin: superadminAPI,
  ai: aiAPI,
  notifications: notificationsAPI,
  leaderboards: leaderboardsAPI,
  shared: sharedAPI,
  health: healthAPI,
};