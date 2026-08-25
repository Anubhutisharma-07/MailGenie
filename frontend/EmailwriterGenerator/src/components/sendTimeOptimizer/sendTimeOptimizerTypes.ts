/**
 * Smart Send Time Optimizer — AI-powered optimal send time prediction
 * Type definitions for scheduling, timezone analysis, engagement prediction
 */

export type ScheduleStatus = 'pending' | 'scheduled' | 'sending' | 'sent' | 'cancelled' | 'failed';
export type TimeGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type OptimizationMode = 'ai-optimal' | 'manual' | 'batch-send' | 'drip';
export type RecipientTimezone = string; // IANA timezone like 'America/New_York'
export type EngagementWindow = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
export type PredictionConfidence = 'very-high' | 'high' | 'medium' | 'low';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface OptimalTimeSlot {
  hour: number;
  dayOfWeek: DayOfWeek;
  predictedOpenRate: number;
  predictedClickRate: number;
  confidence: PredictionConfidence;
  sampleSize: number;
  timezone: RecipientTimezone;
}

export interface TimezoneDistribution {
  timezone: RecipientTimezone;
  label: string;
  recipientCount: number;
  percentage: number;
  avgOpenRate: number;
  avgClickRate: number;
  peakHour: number;
  utcOffset: number;
}

export interface ScheduledCampaign {
  id: string;
  name: string;
  subject: string;
  status: ScheduleStatus;
  mode: OptimizationMode;
  totalRecipients: number;
  scheduledTime: string;
  scheduledTimeLocal: string;
  timezone: RecipientTimezone;
  aiConfidence: PredictionConfidence;
  predictedOpenRate: number;
  predictedClickRate: number;
  actualOpenRate: number | null;
  actualClickRate: number | null;
  estimatedSendWindow: number; // minutes
  createdAt: string;
  createdBy: string;
}

export interface HourlyEngagement {
  hour: number;
  openRate: number;
  clickRate: number;
  sendVolume: number;
  conversionRate: number;
}

export interface DailyEngagement {
  day: DayOfWeek;
  openRate: number;
  clickRate: number;
  sendVolume: number;
  bestHour: number;
}

export interface SendWindowAnalysis {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalCampaigns: number;
  color: string;
}

export interface RecipientTimePreference {
  id: string;
  email: string;
  name: string;
  timezone: RecipientTimezone;
  preferredHour: number;
  preferredDay: DayOfWeek;
  engagementWindow: EngagementWindow;
  lastOpenedAt: string;
  avgResponseTimeMinutes: number;
  openRate: number;
  clickRate: number;
}

export interface BatchScheduleConfig {
  id: string;
  campaignId: string;
  campaignName: string;
  totalBatches: number;
  batchSize: number;
  intervalMinutes: number;
  startHour: number;
  timezone: RecipientTimezone;
  status: 'pending' | 'running' | 'completed';
  completedBatches: number;
  lastBatchAt: string | null;
}

export interface TimezoneOverlapMap {
  hour: number; // UTC hour 0-23
  regions: { timezone: string; localHour: number; awake: boolean; optimal: boolean }[];
  globalScore: number; // 0-100 overlap score
}

export interface SendTimeInsight {
  id: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  metric?: string;
  value?: string;
  actionable: boolean;
}

export interface SendTimeSummary {
  totalScheduled: number;
  totalSent: number;
  avgPredictedOpenRate: number;
  avgActualOpenRate: number;
  avgPredictedClickRate: number;
  avgActualClickRate: number;
  aiAccuracyRate: number;
  bestOptimalHour: number;
  bestOptimalDay: DayOfWeek;
  totalRecipientsCovered: number;
  timezoneCount: number;
  avgSendWindowMinutes: number;
}

// ============================================================================
// Helper Utilities
// ============================================================================

export const CONFIDENCE_COLORS: Record<PredictionConfidence, string> = {
  'very-high': '#4caf50',
  'high': '#8bc34a',
  'medium': '#ff9800',
  'low': '#f44336',
};

export const SCHEDULE_STATUS_COLORS: Record<ScheduleStatus, string> = {
  pending: '#9e9e9e',
  scheduled: '#2196f3',
  sending: '#ff9800',
  sent: '#4caf50',
  cancelled: '#9e9e9e',
  failed: '#f44336',
};

export const MODE_ICONS: Record<OptimizationMode, string> = {
  'ai-optimal': '🤖',
  'manual': '✋',
  'batch-send': '📦',
  'drip': '💧',
};

export const ENGAGEMENT_WINDOW_COLORS: Record<EngagementWindow, string> = {
  morning: '#ff9800',
  midday: '#ffd700',
  afternoon: '#ff6b35',
  evening: '#9c27b0',
  night: '#3f51b5',
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function formatTimeRange(startHour: number, endHour: number): string {
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}

export function getEngagementWindow(hour: number): EngagementWindow {
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
