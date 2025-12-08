import { Report, Task, Alert, Zone } from './types';

export const MOCK_ZONES: Zone[] = [
  { id: '1', name: 'Downtown Core', cleanlinessScore: 85, description: 'Central business district' },
  { id: '2', name: 'Westside Park', cleanlinessScore: 62, description: 'Residential and park area' },
  { id: '3', name: 'Industrial Sector', cleanlinessScore: 45, description: 'Factories and warehouses' },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'R-101',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '2',
    zoneName: 'Westside Park',
    description: 'Overflowing bin near the playground entrance.',
    severity: 'MEDIUM',
    status: 'PENDING',
    timestamp: '2023-10-25T09:30:00Z',
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'R-102',
    userId: 'U-1',
    userName: 'Alice Citizen',
    zoneId: '1',
    zoneName: 'Downtown Core',
    description: 'Litter scattered after the night market.',
    severity: 'LOW',
    status: 'COMPLETED',
    timestamp: '2023-10-24T18:15:00Z',
    imageUrl: 'https://picsum.photos/400/300?random=2'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'T-501',
    reportId: 'R-101',
    cleanerId: 'C-1',
    cleanerName: 'Bob Cleaner',
    zoneId: '2',
    zoneName: 'Westside Park',
    description: 'Clear overflowing bin at playground.',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    dueDate: '2023-10-26T12:00:00Z'
  },
  {
    id: 'T-502',
    cleanerId: 'C-1',
    cleanerName: 'Bob Cleaner',
    zoneId: '3',
    zoneName: 'Industrial Sector',
    description: 'Routine check of Sector 4 bins.',
    status: 'COMPLETED',
    priority: 'LOW',
    dueDate: '2023-10-24T16:00:00Z',
    evidenceImageUrl: 'https://picsum.photos/400/300?random=3'
  }
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
