/**
 * Email Deliverability Monitor — Real-time domain health & blacklist tracking
 * Type definitions for reputation, bounces, blacklists, authentication, alerts
 */

export type ReputationLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
export type BounceCategory = 'hard' | 'soft' | 'throttled' | 'undetermined';
export type BlacklistStatus = 'clean' | 'listed' | 'monitoring' | 'delisted';
export type AuthStatus = 'pass' | 'fail' | 'softfail' | 'none' | 'permerror';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'resolved';
export type HealthTrend = 'improving' | 'stable' | 'declining';
export type MonitorInterval = '5min' | '15min' | '1hour' | '6hours' | 'daily';

export interface DomainHealth {
  id: string;
  domain: string;
  senderScore: number;
  reputationLevel: ReputationLevel;
  inboxRate: number;
  spamFolderRate: number;
  missingRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  spamComplaintRate: number;
  dailySendVolume: number;
  trend: HealthTrend;
  lastCheckedAt: string;
  spfStatus: AuthStatus;
  dkimStatus: AuthStatus;
  dmarcStatus: AuthStatus;
}

export interface BlacklistEntry {
  id: string;
  blacklistName: string;
  blacklistUrl: string;
  status: BlacklistStatus;
  listedAt: string | null;
  delistedAt: string | null;
  reason: string;
  affectedDomains: string[];
  lastCheckedAt: string;
}

export interface BounceEvent {
  id: string;
  email: string;
  domain: string;
  category: BounceCategory;
  errorCode: string;
  errorMessage: string;
  campaignId: string;
  campaignName: string;
  timestamp: string;
  retryCount: number;
  permanent: boolean;
}

export interface ReputationTimeline {
  date: string;
  senderScore: number;
  inboxRate: number;
  bounceRate: number;
  spamRate: number;
  complaintRate: number;
}

export interface AuthenticationRecord {
  domain: string;
  spf: { status: AuthStatus; record: string; lastVerified: string };
  dkim: { status: AuthStatus; selector: string; lastVerified: string };
  dmarc: { status: AuthStatus; record: string; policy: string; lastVerified: string };
  mxValid: boolean;
  reverseDns: boolean;
}

export interface IPWarmupConfig {
  id: string;
  ipAddress: string;
  domain: string;
  currentVolume: number;
  targetVolume: number;
  warmupDay: number;
  totalDays: number;
  status: 'warming' | 'completed' | 'paused';
  reputation: number;
  dailyVolumes: { day: number; volume: number; bounceRate: number }[];
}

export interface DeliverabilityAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  domain: string;
  metric?: string;
  value?: string;
  threshold?: string;
  createdAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

export interface BounceTrend {
  date: string;
  hardBounces: number;
  softBounces: number;
  total: number;
  rate: number;
}

export interface DomainComparison {
  domain: string;
  senderScore: number;
  inboxRate: number;
  bounceRate: number;
  spamRate: number;
  dailyVolume: number;
  reputationLevel: ReputationLevel;
}

export interface DeliverabilitySummary {
  totalDomains: number;
  healthyDomains: number;
  avgSenderScore: number;
  avgInboxRate: number;
  totalBounces30d: number;
  totalComplaints30d: number;
  activeBlacklists: number;
  authPassRate: number;
  overallTrend: HealthTrend;
}

// ============================================================================
// Helper Utilities
// ============================================================================

export const REPUTATION_COLORS: Record<ReputationLevel, string> = {
  excellent: '#4caf50',
  good: '#8bc34a',
  fair: '#ff9800',
  poor: '#ff5722',
  critical: '#f44336',
};

export const REPUTATION_THRESHOLDS: Record<ReputationLevel, { min: number; max: number }> = {
  excellent: { min: 90, max: 100 },
  good: { min: 75, max: 89 },
  fair: { min: 50, max: 74 },
  poor: { min: 25, max: 49 },
  critical: { min: 0, max: 24 },
};

export const AUTH_STATUS_COLORS: Record<AuthStatus, string> = {
  pass: '#4caf50',
  fail: '#f44336',
  softfail: '#ff9800',
  none: '#9e9e9e',
  permerror: '#f44336',
};

export const BOUNCE_CATEGORY_COLORS: Record<BounceCategory, string> = {
  hard: '#f44336',
  soft: '#ff9800',
  throttled: '#9c27b0',
  undetermined: '#9e9e9e',
};

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  info: '#2196f3',
  warning: '#ff9800',
  critical: '#f44336',
  resolved: '#4caf50',
};

export const SEVERITY_ICONS: Record<AlertSeverity, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  critical: '🚨',
  resolved: '✅',
};

export function getReputationLevel(score: number): ReputationLevel {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 25) return 'poor';
  return 'critical';
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
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
