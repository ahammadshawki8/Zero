import React from 'react';

export type UserRole = 'CITIZEN' | 'CLEANER' | 'ADMIN';

export type Status = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'APPROVED';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Zone {
  id: string;
  name: string;
  cleanlinessScore: number;
  description: string;
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
  evidenceImageUrl?: string;
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