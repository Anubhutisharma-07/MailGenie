/**
 * Email Campaign Analytics & Insights Dashboard
 * Type definitions for campaign tracking, A/B testing, deliverability, and engagement
 */

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'failed';
export type CampaignType = 'promotional' | 'transactional' | 'newsletter' | 'cold-outreach' | 'follow-up' | 'announcement';
export type EmailProvider = 'gmail' | 'outlook' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark';
export type ABTestStatus = 'running' | 'completed' | 'cancelled';
export type SegmentType = 'all' | 'engaged' | 'inactive' | 'new' | 'vip' | 'custom';
export type DeliverabilityIssue = 'hard-bounce' | 'soft-bounce' | 'spam-complaint' | 'unsubscribed' | 'greylisted' | 'dns-failure';
export type EngagementLevel = 'high' | 'medium' | 'low' | 'none';
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'webmail';
export type LinkCategory = 'cta' | 'image' | 'text' | 'social' | 'unsubscribe' | 'other';
export type TimeGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

// ============================================================================
// Core Interfaces
// ============================================================================

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  type: CampaignType;
  status: CampaignStatus;
  provider: EmailProvider;
  segment: SegmentType;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  spamComplaints: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  spamRate: number;
  revenue: number;
  createdAt: string;
  sentAt: string | null;
  completedAt: string | null;
  createdBy: string;
}

export interface ABTest {
  id: string;
  campaignId: string;
  campaignName: string;
  status: ABTestStatus;
  variantA: {
    subject: string;
    openRate: number;
    clickRate: number;
    sampleSize: number;
    conversionRate: number;
  };
  variantB: {
    subject: string;
    openRate: number;
    clickRate: number;
    sampleSize: number;
    conversionRate: number;
  };
  confidenceLevel: number;
  winner: 'A' | 'B' | null;
  startedAt: string;
  endedAt: string | null;
}

export interface DeliverabilityMetric {
  id: string;
  campaignId: string;
  campaignName: string;
  senderScore: number;
  reputationScore: number;
  inboxRate: number;
  spamFolderRate: number;
  missingRate: number;
  hardBounces: number;
  softBounces: number;
  spamComplaints: number;
  unsubscribes: number;
  greylisted: number;
  dnsFailures: number;
  issues: DeliverabilityIssue[];
  checkedAt: string;
}

export interface LinkClick {
  id: string;
  campaignId: string;
  url: string;
  label: string;
  category: LinkCategory;
  totalClicks: number;
  uniqueClicks: number;
  clickRate: number;
  firstClickedAt: string;
  lastClickedAt: string;
}

export interface DeviceBreakdown {
  device: DeviceType;
  count: number;
  percentage: number;
}

export interface RecipientEngagement {
  id: string;
  email: string;
  name: string;
  engagementLevel: EngagementLevel;
  engagementScore: number;
  totalEmailsReceived: number;
  totalOpened: number;
  totalClicked: number;
  lastOpenedAt: string | null;
  lastClickedAt: string | null;
  lastEmailAt: string;
  avgOpenTimeSeconds: number;
  preferredDevice: DeviceType;
  tags: string[];
}

export interface CampaignTimelinePoint {
  timestamp: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export interface HourlyHeatmapPoint {
  hour: number;
  dayOfWeek: number;
  openRate: number;
  clickRate: number;
}

export interface TopCampaign {
  id: string;
  name: string;
  subject: string;
  openRate: number;
  clickRate: number;
  sentCount: number;
  revenue: number;
}

export interface CampaignInsight {
  id: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  metric?: string;
  value?: string;
  actionable: boolean;
}

export interface CampaignSummary {
  totalCampaigns: number;
  totalEmailsSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgBounceRate: number;
  totalRevenue: number;
  totalUnsubscribes: number;
  totalSpamComplaints: number;
  bestPerformingCampaign: TopCampaign | null;
  worstPerformingCampaign: TopCampaign | null;
  deliverabilityScore: number;
  engagementTrend: 'improving' | 'stable' | 'declining';
}

// ============================================================================
// Helper Utilities
// ============================================================================

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  draft: '#9e9e9e',
  scheduled: '#2196f3',
  sending: '#ff9800',
  sent: '#4caf50',
  paused: '#ff5722',
  failed: '#f44336',
};

export const CAMPAIGN_TYPE_ICONS: Record<CampaignType, string> = {
  promotional: '🏷️',
  transactional: '🧾',
  newsletter: '📰',
  'cold-outreach': '🎯',
  'follow-up': '🔄',
  announcement: '📢',
};

export const ENGAGEMENT_COLORS: Record<EngagementLevel, string> = {
  high: '#4caf50',
  medium: '#ff9800',
  low: '#ff5722',
  none: '#9e9e9e',
};

export const DEVICE_ICONS: Record<DeviceType, string> = {
  desktop: '🖥️',
  mobile: '📱',
  tablet: '📋',
  webmail: '🌐',
};

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function getEngagementLevel(score: number): EngagementLevel {
  if (score >= 75) return 'high';
  if (score >= 50) return 'medium';
  if (score >= 25) return 'low';
  return 'none';
}
