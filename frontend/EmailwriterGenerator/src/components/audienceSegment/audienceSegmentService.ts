import type {
  Segment, Tag, RecipientProfile, SegmentOverlap, LifecycleMetric,
  EngagementDistribution, SegmentPerformance, SegmentInsight, SegmentSummary,
} from './audienceSegmentTypes';

// ============================================================================
// Segments
// ============================================================================

export const mockSegments: Segment[] = [
  {
    id: 'seg-001', name: 'High-Value Customers', description: 'Recipients with engagement score > 75 and revenue > $100',
    type: 'dynamic', status: 'active', filters: [
      { id: 'f1', field: 'engagement_score', operator: 'gt', value: 75, conjunction: 'AND' },
      { id: 'f2', field: 'open_rate', operator: 'gt', value: 0.4, conjunction: 'AND' },
    ],
    recipientCount: 12400, totalRecipients: 75200, percentage: 0.165,
    avgOpenRate: 0.62, avgClickRate: 0.28, avgEngagementScore: 85,
    tags: ['vip', 'high-value', 'loyal'], createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'marketing@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 18,
  },
  {
    id: 'seg-002', name: 'At-Risk Subscribers', description: 'No opens in last 30 days but previously active',
    type: 'behavioral', status: 'active', filters: [
      { id: 'f3', field: 'last_opened_at', operator: 'gt', value: '30d_ago', conjunction: 'AND' },
      { id: 'f4', field: 'total_opens', operator: 'gt', value: 5, conjunction: 'AND' },
    ],
    recipientCount: 8900, totalRecipients: 75200, percentage: 0.118,
    avgOpenRate: 0.12, avgClickRate: 0.03, avgEngagementScore: 28,
    tags: ['at-risk', 'churn-risk'], createdAt: '2026-06-15T14:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'marketing@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 4,
  },
  {
    id: 'seg-003', name: 'New Subscribers (Last 7 Days)', description: 'Signed up in the past week',
    type: 'dynamic', status: 'active', filters: [
      { id: 'f5', field: 'signup_date', operator: 'gt', value: '7d_ago', conjunction: 'AND' },
    ],
    recipientCount: 1240, totalRecipients: 75200, percentage: 0.016,
    avgOpenRate: 0.55, avgClickRate: 0.22, avgEngagementScore: 68,
    tags: ['new', 'onboarding'], createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'product@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 3,
  },
  {
    id: 'seg-004', name: 'Power Clickers', description: 'Click rate > 20% across all campaigns',
    type: 'behavioral', status: 'active', filters: [
      { id: 'f6', field: 'click_rate', operator: 'gt', value: 0.20, conjunction: 'AND' },
      { id: 'f7', field: 'total_sends', operator: 'gt', value: 5, conjunction: 'AND' },
    ],
    recipientCount: 6800, totalRecipients: 75200, percentage: 0.090,
    avgOpenRate: 0.58, avgClickRate: 0.32, avgEngagementScore: 82,
    tags: ['engaged', 'power-user'], createdAt: '2026-04-20T11:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'data@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 15,
  },
  {
    id: 'seg-005', name: 'Mobile-First Users', description: 'Primarily open emails on mobile devices',
    type: 'dynamic', status: 'active', filters: [
      { id: 'f8', field: 'device', operator: 'equals', value: 'mobile', conjunction: 'AND' },
    ],
    recipientCount: 38500, totalRecipients: 75200, percentage: 0.512,
    avgOpenRate: 0.42, avgClickRate: 0.14, avgEngagementScore: 55,
    tags: ['mobile'], createdAt: '2026-07-01T09:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'product@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 22,
  },
  {
    id: 'seg-006', name: 'VIP Evangelists', description: 'Engagement score > 90 and tagged as VIP',
    type: 'predictive', status: 'active', filters: [
      { id: 'f9', field: 'engagement_score', operator: 'gt', value: 90, conjunction: 'AND' },
      { id: 'f10', field: 'tag', operator: 'contains', value: 'vip', conjunction: 'AND' },
    ],
    recipientCount: 3200, totalRecipients: 75200, percentage: 0.043,
    avgOpenRate: 0.72, avgClickRate: 0.38, avgEngagementScore: 94,
    tags: ['vip', 'evangelist', 'champion'], createdAt: '2026-03-15T10:00:00Z', updatedAt: '2026-08-24T09:00:00Z',
    createdBy: 'marketing@company.com', lastCalculatedAt: '2026-08-24T09:00:00Z', campaignCount: 24,
  },
  {
    id: 'seg-007', name: 'Enterprise Segment', description: 'Work email domains matching enterprise patterns',
    type: 'static', status: 'active', filters: [
      { id: 'f11', field: 'email', operator: 'contains', value: '@company.com', conjunction: 'OR' },
      { id: 'f12', field: 'email', operator: 'contains', value: '@enterprise.io', conjunction: 'OR' },
    ],
    recipientCount: 15600, totalRecipients: 75200, percentage: 0.207,
    avgOpenRate: 0.38, avgClickRate: 0.10, avgEngagementScore: 48,
    tags: ['enterprise', 'b2b'], createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-08-20T14:00:00Z',
    createdBy: 'sales@company.com', lastCalculatedAt: '2026-08-20T14:00:00Z', campaignCount: 8,
  },
  {
    id: 'seg-008', name: 'Dormant Users', description: 'No activity in 90+ days',
    type: 'behavioral', status: 'paused', filters: [
      { id: 'f13', field: 'last_email_at', operator: 'gt', value: '90d_ago', conjunction: 'AND' },
      { id: 'f14', field: 'total_sends', operator: 'gt', value: 0, conjunction: 'AND' },
    ],
    recipientCount: 5400, totalRecipients: 75200, percentage: 0.072,
    avgOpenRate: 0.02, avgClickRate: 0.005, avgEngagementScore: 8,
    tags: ['dormant', 'win-back'], createdAt: '2026-07-10T11:00:00Z', updatedAt: '2026-08-15T09:00:00Z',
    createdBy: 'marketing@company.com', lastCalculatedAt: '2026-08-15T09:00:00Z', campaignCount: 2,
  },
];

// ============================================================================
// Tags
// ============================================================================

export const mockTags: Tag[] = [
  { id: 'tag-001', name: 'vip', color: '#ffd700', recipientCount: 8200, createdAt: '2026-03-01T10:00:00Z', usageCount: 45 },
  { id: 'tag-002', name: 'high-value', color: '#4caf50', recipientCount: 12400, createdAt: '2026-04-01T10:00:00Z', usageCount: 32 },
  { id: 'tag-003', name: 'at-risk', color: '#ff9800', recipientCount: 8900, createdAt: '2026-05-15T10:00:00Z', usageCount: 18 },
  { id: 'tag-004', name: 'new', color: '#00e5ff', recipientCount: 1240, createdAt: '2026-08-01T10:00:00Z', usageCount: 12 },
  { id: 'tag-005', name: 'enterprise', color: '#9c27b0', recipientCount: 15600, createdAt: '2026-06-01T10:00:00Z', usageCount: 28 },
  { id: 'tag-006', name: 'mobile', color: '#2196f3', recipientCount: 38500, createdAt: '2026-07-01T10:00:00Z', usageCount: 40 },
  { id: 'tag-007', name: 'champion', color: '#ffd700', recipientCount: 3200, createdAt: '2026-03-15T10:00:00Z', usageCount: 22 },
  { id: 'tag-008', name: 'dormant', color: '#9e9e9e', recipientCount: 5400, createdAt: '2026-07-10T10:00:00Z', usageCount: 8 },
];

// ============================================================================
// Recipient Profiles
// ============================================================================

export const mockRecipients: RecipientProfile[] = [
  { id: 'r-001', email: 'alice@techcorp.io', name: 'Alice Johnson', engagementScore: 95, engagementTier: 'champion', lifecycleStage: 'evangelist', tags: ['vip', 'champion', 'high-value'], segments: ['seg-001', 'seg-004', 'seg-006'], totalSends: 24, totalOpens: 22, totalClicked: 18, openRate: 0.92, clickRate: 0.75, lastOpenedAt: '2026-08-24T14:30:00Z', lastClickedAt: '2026-08-24T14:32:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2025-01-15T10:00:00Z', location: 'New York, NY', device: 'mobile', revenue: 2450 },
  { id: 'r-002', email: 'bob@startup.co', name: 'Bob Martinez', engagementScore: 82, engagementTier: 'loyal', lifecycleStage: 'active', tags: ['high-value', 'power-user'], segments: ['seg-001', 'seg-004'], totalSends: 20, totalOpens: 17, totalClicked: 12, openRate: 0.85, clickRate: 0.60, lastOpenedAt: '2026-08-23T09:15:00Z', lastClickedAt: '2026-08-23T09:18:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2025-06-20T14:00:00Z', location: 'San Francisco, CA', device: 'desktop', revenue: 1820 },
  { id: 'r-003', email: 'carol@enterprise.com', name: 'Carol Williams', engagementScore: 55, engagementTier: 'potential', lifecycleStage: 'subscriber', tags: ['enterprise'], segments: ['seg-007'], totalSends: 18, totalOpens: 11, totalClicked: 5, openRate: 0.61, clickRate: 0.28, lastOpenedAt: '2026-08-20T16:45:00Z', lastClickedAt: '2026-08-18T11:20:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2026-01-10T09:00:00Z', location: 'London, UK', device: 'webmail', revenue: 680 },
  { id: 'r-004', email: 'dave@agency.io', name: 'Dave Chen', engagementScore: 30, engagementTier: 'at-risk', lifecycleStage: 'subscriber', tags: ['at-risk'], segments: ['seg-002'], totalSends: 22, totalOpens: 10, totalClicked: 3, openRate: 0.45, clickRate: 0.14, lastOpenedAt: '2026-08-01T08:00:00Z', lastClickedAt: '2026-07-25T14:00:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2025-09-05T11:00:00Z', location: 'Chicago, IL', device: 'mobile', revenue: 320 },
  { id: 'r-005', email: 'eve@freelance.dev', name: 'Eve Kowalski', engagementScore: 12, engagementTier: 'dormant', lifecycleStage: 'churned', tags: ['dormant', 'win-back'], segments: ['seg-008'], totalSends: 20, totalOpens: 4, totalClicked: 1, openRate: 0.20, clickRate: 0.05, lastOpenedAt: '2026-07-01T12:00:00Z', lastClickedAt: '2026-06-20T09:00:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2025-03-12T10:00:00Z', location: 'Tokyo, JP', device: 'desktop', revenue: 0 },
  { id: 'r-006', email: 'frank@bigcorp.com', name: "Frank O'Brien", engagementScore: 42, engagementTier: 'potential', lifecycleStage: 'active', tags: ['enterprise', 'mobile'], segments: ['seg-005', 'seg-007'], totalSends: 16, totalOpens: 8, totalClicked: 4, openRate: 0.50, clickRate: 0.25, lastOpenedAt: '2026-08-22T10:00:00Z', lastClickedAt: '2026-08-22T10:05:00Z', lastEmailAt: '2026-08-24T12:00:00Z', signupDate: '2026-02-28T08:00:00Z', location: 'Berlin, DE', device: 'mobile', revenue: 950 },
];

// ============================================================================
// Segment Overlaps
// ============================================================================

export const mockOverlaps: SegmentOverlap[] = [
  { segmentA: 'High-Value Customers', segmentB: 'Power Clickers', overlapCount: 5400, overlapPercentage: 0.44 },
  { segmentA: 'High-Value Customers', segmentB: 'VIP Evangelists', overlapCount: 3200, overlapPercentage: 0.26 },
  { segmentA: 'Mobile-First Users', segmentB: 'Enterprise Segment', overlapCount: 4200, overlapPercentage: 0.27 },
  { segmentA: 'At-Risk Subscribers', segmentB: 'Dormant Users', overlapCount: 3800, overlapPercentage: 0.43 },
  { segmentA: 'Power Clickers', segmentB: 'VIP Evangelists', overlapCount: 2800, overlapPercentage: 0.41 },
  { segmentA: 'New Subscribers', segmentB: 'Mobile-First Users', overlapCount: 680, overlapPercentage: 0.55 },
];

// ============================================================================
// Lifecycle Metrics
// ============================================================================

export const mockLifecycle: LifecycleMetric[] = [
  { stage: 'lead', count: 8400, percentage: 0.112, avgEngagement: 25, avgRevenue: 0, trend: 'up' },
  { stage: 'subscriber', count: 28600, percentage: 0.380, avgEngagement: 42, avgRevenue: 180, trend: 'stable' },
  { stage: 'active', count: 24200, percentage: 0.322, avgEngagement: 65, avgRevenue: 850, trend: 'up' },
  { stage: 'evangelist', count: 6400, percentage: 0.085, avgEngagement: 90, avgRevenue: 2200, trend: 'up' },
  { stage: 'churned', count: 7600, percentage: 0.101, avgEngagement: 8, avgRevenue: 120, trend: 'down' },
];

// ============================================================================
// Engagement Distribution
// ============================================================================

export const mockEngagementDist: EngagementDistribution[] = [
  { tier: 'champion', count: 3200, percentage: 0.043, avgOpenRate: 0.72, avgClickRate: 0.38, color: '#ffd700' },
  { tier: 'loyal', count: 12400, percentage: 0.165, avgOpenRate: 0.58, avgClickRate: 0.22, color: '#4caf50' },
  { tier: 'potential', count: 18600, percentage: 0.247, avgOpenRate: 0.42, avgClickRate: 0.12, color: '#2196f3' },
  { tier: 'new', count: 5200, percentage: 0.069, avgOpenRate: 0.55, avgClickRate: 0.20, color: '#00e5ff' },
  { tier: 'at-risk', count: 14200, percentage: 0.189, avgOpenRate: 0.15, avgClickRate: 0.04, color: '#ff9800' },
  { tier: 'dormant', count: 12800, percentage: 0.170, avgOpenRate: 0.03, avgClickRate: 0.008, color: '#9e9e9e' },
  { tier: 'lost', count: 8800, percentage: 0.117, avgOpenRate: 0.01, avgClickRate: 0.002, color: '#f44336' },
];

// ============================================================================
// Segment Performance
// ============================================================================

export const mockPerformance: SegmentPerformance[] = [
  { segmentId: 'seg-006', segmentName: 'VIP Evangelists', campaignsSent: 24, avgOpenRate: 0.72, avgClickRate: 0.38, avgRevenue: 42.50, avgUnsubRate: 0.001, trend: 'improving' },
  { segmentId: 'seg-001', segmentName: 'High-Value Customers', campaignsSent: 18, avgOpenRate: 0.62, avgClickRate: 0.28, avgRevenue: 28.30, avgUnsubRate: 0.002, trend: 'stable' },
  { segmentId: 'seg-004', segmentName: 'Power Clickers', campaignsSent: 15, avgOpenRate: 0.58, avgClickRate: 0.32, avgRevenue: 18.60, avgUnsubRate: 0.003, trend: 'improving' },
  { segmentId: 'seg-003', segmentName: 'New Subscribers', campaignsSent: 3, avgOpenRate: 0.55, avgClickRate: 0.22, avgRevenue: 5.20, avgUnsubRate: 0.005, trend: 'stable' },
  { segmentId: 'seg-005', segmentName: 'Mobile-First Users', campaignsSent: 22, avgOpenRate: 0.42, avgClickRate: 0.14, avgRevenue: 12.40, avgUnsubRate: 0.004, trend: 'stable' },
  { segmentId: 'seg-007', segmentName: 'Enterprise Segment', campaignsSent: 8, avgOpenRate: 0.38, avgClickRate: 0.10, avgRevenue: 22.80, avgUnsubRate: 0.003, trend: 'declining' },
  { segmentId: 'seg-002', segmentName: 'At-Risk Subscribers', campaignsSent: 4, avgOpenRate: 0.12, avgClickRate: 0.03, avgRevenue: 1.80, avgUnsubRate: 0.012, trend: 'declining' },
  { segmentId: 'seg-008', segmentName: 'Dormant Users', campaignsSent: 2, avgOpenRate: 0.02, avgClickRate: 0.005, avgRevenue: 0.20, avgUnsubRate: 0.018, trend: 'declining' },
];

// ============================================================================
// Insights
// ============================================================================

export const mockInsights: SegmentInsight[] = [
  { id: 'si-001', type: 'success', title: 'VIP Evangelists Drive 3x Revenue', description: 'Your VIP Evangelists segment generates $42.50 avg revenue per campaign vs $12.40 overall. Focus retention efforts here.', metric: 'Avg Revenue', value: '$42.50', actionable: false },
  { id: 'si-002', type: 'warning', title: 'At-Risk Segment Growing', description: 'The At-Risk Subscribers segment has grown 15% this month. Launch a re-engagement campaign before they become dormant.', metric: 'Growth Rate', value: '+15%', actionable: true },
  { id: 'si-003', type: 'tip', title: 'Mobile Users Need Shorter Subject Lines', description: 'Mobile-first users show 22% higher open rates with subject lines under 40 characters. Optimize for mobile.', metric: 'Mobile Open Lift', value: '+22%', actionable: true },
  { id: 'si-004', type: 'info', title: 'High Overlap Between VIP and Power Clickers', description: '44% of VIP Evangelists are also Power Clickers. Consider merging these segments for more targeted campaigns.', metric: 'Overlap Rate', value: '44%', actionable: true },
  { id: 'si-005', type: 'warning', title: 'Dormant Segment Unsubscribe Rate 9x Higher', description: 'Dormant users unsubscribe at 1.8% rate vs 0.2% average. Consider suppressing this segment from regular sends.', metric: 'Unsub Rate', value: '1.8%', actionable: true },
  { id: 'si-006', type: 'success', title: 'New Subscriber Onboarding Working', description: 'New subscribers maintain 55% open rate through their first 3 campaigns — well above the 42% average. Onboarding sequence is effective.', metric: 'New Sub Open Rate', value: '55%', actionable: false },
];

// ============================================================================
// Summary
// ============================================================================

export const mockSegmentSummary: SegmentSummary = {
  totalSegments: 8,
  activeSegments: 6,
  totalRecipients: 75200,
  totalTagged: 58400,
  avgEngagementScore: 52,
  bestPerformingSegment: 'VIP Evangelists',
  largestSegment: 'Mobile-First Users',
  avgSegmentSize: 11305,
};
