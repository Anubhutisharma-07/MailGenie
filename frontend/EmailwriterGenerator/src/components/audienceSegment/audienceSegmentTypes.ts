/**
 * Audience Segmentation Engine — Behavioral filtering & dynamic lists
 * Type definitions for segments, filters, tags, audiences, and engagement scoring
 */

export type SegmentType = 'dynamic' | 'static' | 'behavioral' | 'predictive';
export type SegmentStatus = 'active' | 'draft' | 'paused' | 'archived';
export type FilterOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'gt' | 'lt' | 'between' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
export type FilterField = 'email' | 'name' | 'tag' | 'total_sends' | 'total_opens' | 'total_clicks' | 'open_rate' | 'click_rate' | 'last_opened_at' | 'last_clicked_at' | 'last_email_at' | 'engagement_score' | 'signup_date' | 'location' | 'device' | 'custom_field';
export type EngagementTier = 'champion' | 'loyal' | 'potential' | 'at-risk' | 'dormant' | 'new' | 'lost';
export type LifecycleStage = 'lead' | 'subscriber' | 'active' | 'evangelist' | 'churned';
export type AudienceAction = 'export' | 'send-campaign' | 'add-tag' | 'remove-tag' | 'move-segment' | 'suppress';

export interface SegmentFilter {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: string | number | string[];
  conjunction: 'AND' | 'OR';
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  type: SegmentType;
  status: SegmentStatus;
  filters: SegmentFilter[];
  recipientCount: number;
  totalRecipients: number;
  percentage: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgEngagementScore: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastCalculatedAt: string;
  campaignCount: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  recipientCount: number;
  createdAt: string;
  usageCount: number;
}

export interface RecipientProfile {
  id: string;
  email: string;
  name: string;
  engagementScore: number;
  engagementTier: EngagementTier;
  lifecycleStage: LifecycleStage;
  tags: string[];
  segments: string[];
  totalSends: number;
  totalOpens: number;
  totalClicks: number;
  openRate: number;
  clickRate: number;
  lastOpenedAt: string | null;
  lastClickedAt: string | null;
  lastEmailAt: string;
  signupDate: string;
  location: string;
  device: string;
  revenue: number;
}

export interface SegmentOverlap {
  segmentA: string;
  segmentB: string;
  overlapCount: number;
  overlapPercentage: number;
}

export interface LifecycleMetric {
  stage: LifecycleStage;
  count: number;
  percentage: number;
  avgEngagement: number;
  avgRevenue: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EngagementDistribution {
  tier: EngagementTier;
  count: number;
  percentage: number;
  avgOpenRate: number;
  avgClickRate: number;
  color: string;
}

export interface SegmentPerformance {
  segmentId: string;
  segmentName: string;
  campaignsSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgRevenue: number;
  avgUnsubRate: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface SegmentInsight {
  id: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  metric?: string;
  value?: string;
  actionable: boolean;
}

export interface SegmentSummary {
  totalSegments: number;
  activeSegments: number;
  totalRecipients: number;
  totalTagged: number;
  avgEngagementScore: number;
  bestPerformingSegment: string;
  largestSegment: string;
  avgSegmentSize: number;
}

// ============================================================================
// Helper Utilities
// ============================================================================

export const SEGMENT_STATUS_COLORS: Record<SegmentStatus, string> = {
  active: '#4caf50',
  draft: '#9e9e9e',
  paused: '#ff9800',
  archived: '#607d8b',
};

export const SEGMENT_TYPE_ICONS: Record<SegmentType, string> = {
  dynamic: '🔄',
  static: '📌',
  behavioral: '🧠',
  predictive: '🤖',
};

export const TIER_COLORS: Record<EngagementTier, string> = {
  champion: '#ffd700',
  loyal: '#4caf50',
  potential: '#2196f3',
  'at-risk': '#ff9800',
  dormant: '#9e9e9e',
  new: '#00e5ff',
  lost: '#f44336',
};

export const LIFECYCLE_ICONS: Record<LifecycleStage, string> = {
  lead: '🌱',
  subscriber: '📬',
  active: '⚡',
  evangelist: '🌟',
  churned: '💤',
};

export const LIFECYCLE_COLORS: Record<LifecycleStage, string> = {
  lead: '#2196f3',
  subscriber: '#00e5ff',
  active: '#4caf50',
  evangelist: '#ffd700',
  churned: '#9e9e9e',
};

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

export function buildFilterLabel(filter: SegmentFilter): string {
  const fieldNames: Record<string, string> = {
    email: 'Email', name: 'Name', tag: 'Tag', total_sends: 'Total Sends', total_opens: 'Total Opens',
    total_clicks: 'Total Clicks', open_rate: 'Open Rate', click_rate: 'Click Rate',
    last_opened_at: 'Last Opened', last_clicked_at: 'Last Clicked', last_email_at: 'Last Email',
    engagement_score: 'Engagement Score', signup_date: 'Signup Date', location: 'Location',
    device: 'Device', custom_field: 'Custom Field',
  };
  const opSymbols: Record<string, string> = {
    equals: '=', not_equals: '≠', contains: 'contains', not_contains: 'excludes',
    gt: '>', lt: '<', between: 'between', in: 'in', not_in: 'not in',
    is_null: 'is empty', is_not_null: 'is not empty',
  };
  return `${fieldNames[filter.field] || filter.field} ${opSymbols[filter.operator] || filter.operator} ${filter.value}`;
}
