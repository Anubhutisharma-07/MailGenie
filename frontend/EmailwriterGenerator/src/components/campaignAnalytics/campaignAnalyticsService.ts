import type {
  Campaign,
  ABTest,
  DeliverabilityMetric,
  LinkClick,
  DeviceBreakdown,
  RecipientEngagement,
  CampaignTimelinePoint,
  HourlyHeatmapPoint,
  CampaignInsight,
  CampaignSummary,
  TopCampaign,
} from './campaignAnalyticsTypes';

// ============================================================================
// Campaigns
// ============================================================================

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001', name: 'Summer Sale Blast', subject: '☀️ 50% Off Everything — Today Only!',
    type: 'promotional', status: 'sent', provider: 'sendgrid', segment: 'engaged',
    totalRecipients: 45200, sentCount: 45200, deliveredCount: 44100,
    openedCount: 22050, clickedCount: 6615, bouncedCount: 1100, unsubscribedCount: 180,
    spamComplaints: 22, openRate: 0.50, clickRate: 0.15, bounceRate: 0.024,
    unsubscribeRate: 0.004, spamRate: 0.0005, revenue: 89432.50,
    createdAt: '2026-07-15T09:00:00Z', sentAt: '2026-07-16T10:00:00Z',
    completedAt: '2026-07-16T10:45:00Z', createdBy: 'marketing@company.com',
  },
  {
    id: 'camp-002', name: 'Product Launch Announcement', subject: '🚀 Introducing MailGenie Pro — Built for Teams',
    type: 'announcement', status: 'sent', provider: 'sendgrid', segment: 'all',
    totalRecipients: 87500, sentCount: 87500, deliveredCount: 85750,
    openedCount: 34300, clickedCount: 10290, bouncedCount: 1750, unsubscribedCount: 420,
    spamComplaints: 58, openRate: 0.40, clickRate: 0.12, bounceRate: 0.02,
    unsubscribeRate: 0.005, spamRate: 0.0007, revenue: 234500.00,
    createdAt: '2026-07-20T14:00:00Z', sentAt: '2026-07-21T08:00:00Z',
    completedAt: '2026-07-21T09:30:00Z', createdBy: 'product@company.com',
  },
  {
    id: 'camp-003', name: 'Weekly Newsletter #47', subject: '📬 This Week: AI Email Tips, New Features & More',
    type: 'newsletter', status: 'sent', provider: 'mailgun', segment: 'engaged',
    totalRecipients: 32100, sentCount: 32100, deliveredCount: 31458,
    openedCount: 12583, clickedCount: 3146, bouncedCount: 642, unsubscribedCount: 95,
    spamComplaints: 8, openRate: 0.40, clickRate: 0.10, bounceRate: 0.02,
    unsubscribeRate: 0.003, spamRate: 0.0003, revenue: 0,
    createdAt: '2026-08-01T10:00:00Z', sentAt: '2026-08-01T12:00:00Z',
    completedAt: '2026-08-01T12:20:00Z', createdBy: 'content@company.com',
  },
  {
    id: 'camp-004', name: 'Re-engagement Campaign', subject: 'We miss you! Here\'s 30% off to come back 💝',
    type: 'cold-outreach', status: 'sent', provider: 'sendgrid', segment: 'inactive',
    totalRecipients: 18900, sentCount: 18900, deliveredCount: 18144,
    openedCount: 5443, clickedCount: 1089, bouncedCount: 756, unsubscribedCount: 312,
    spamComplaints: 45, openRate: 0.30, clickRate: 0.06, bounceRate: 0.04,
    unsubscribeRate: 0.017, spamRate: 0.002, revenue: 15670.25,
    createdAt: '2026-08-05T11:00:00Z', sentAt: '2026-08-06T09:00:00Z',
    completedAt: '2026-08-06T09:30:00Z', createdBy: 'marketing@company.com',
  },
  {
    id: 'camp-005', name: 'Post-Purchase Follow-up', subject: 'How was your experience? Rate us ⭐',
    type: 'follow-up', status: 'sent', provider: 'ses', segment: 'vip',
    totalRecipients: 8200, sentCount: 8200, deliveredCount: 8036,
    openedCount: 4822, clickedCount: 2009, bouncedCount: 164, unsubscribedCount: 25,
    spamComplaints: 3, openRate: 0.60, clickRate: 0.25, bounceRate: 0.02,
    unsubscribeRate: 0.003, spamRate: 0.0004, revenue: 42300.00,
    createdAt: '2026-08-10T08:00:00Z', sentAt: '2026-08-10T14:00:00Z',
    completedAt: '2026-08-10T14:15:00Z', createdBy: 'support@company.com',
  },
  {
    id: 'camp-006', name: 'Webinar Invitation', subject: '🎓 Free Webinar: Master Email Deliverability',
    type: 'promotional', status: 'sent', provider: 'sendgrid', segment: 'engaged',
    totalRecipients: 28700, sentCount: 28700, deliveredCount: 28126,
    openedCount: 14063, clickedCount: 4922, bouncedCount: 574, unsubscribedCount: 88,
    spamComplaints: 12, openRate: 0.50, clickRate: 0.175, bounceRate: 0.02,
    unsubscribeRate: 0.003, spamRate: 0.0004, revenue: 0,
    createdAt: '2026-08-12T13:00:00Z', sentAt: '2026-08-13T10:00:00Z',
    completedAt: '2026-08-13T10:30:00Z', createdBy: 'events@company.com',
  },
  {
    id: 'camp-007', name: 'Black Friday Preview', subject: '🔥 Early Access: Black Friday Deals Inside',
    type: 'promotional', status: 'scheduled', provider: 'sendgrid', segment: 'vip',
    totalRecipients: 12400, sentCount: 0, deliveredCount: 0,
    openedCount: 0, clickedCount: 0, bouncedCount: 0, unsubscribedCount: 0,
    spamComplaints: 0, openRate: 0, clickRate: 0, bounceRate: 0,
    unsubscribeRate: 0, spamRate: 0, revenue: 0,
    createdAt: '2026-08-20T09:00:00Z', sentAt: null, completedAt: null,
    createdBy: 'marketing@company.com',
  },
  {
    id: 'camp-008', name: 'Security Alert — Password Reset', subject: '🔒 Action Required: Reset Your Password',
    type: 'transactional', status: 'sent', provider: 'ses', segment: 'all',
    totalRecipients: 3200, sentCount: 3200, deliveredCount: 3168,
    openedCount: 2851, clickedCount: 2534, bouncedCount: 32, unsubscribedCount: 0,
    spamComplaints: 0, openRate: 0.90, clickRate: 0.80, bounceRate: 0.01,
    unsubscribeRate: 0, spamRate: 0, revenue: 0,
    createdAt: '2026-08-18T06:00:00Z', sentAt: '2026-08-18T06:01:00Z',
    completedAt: '2026-08-18T06:10:00Z', createdBy: 'system',
  },
  {
    id: 'camp-009', name: 'Feature Update Digest', subject: '✨ What\'s New: Smart Templates, API v3 & More',
    type: 'newsletter', status: 'sending', provider: 'sendgrid', segment: 'engaged',
    totalRecipients: 35600, sentCount: 21360, deliveredCount: 20933,
    openedCount: 8373, clickedCount: 2093, bouncedCount: 427, unsubscribedCount: 63,
    spamComplaints: 5, openRate: 0.40, clickRate: 0.10, bounceRate: 0.02,
    unsubscribeRate: 0.003, spamRate: 0.0002, revenue: 0,
    createdAt: '2026-08-22T11:00:00Z', sentAt: '2026-08-22T12:00:00Z',
    completedAt: null, createdBy: 'product@company.com',
  },
  {
    id: 'camp-010', name: 'Customer Satisfaction Survey', subject: '📊 Quick Survey: Help Us Improve (2 min)',
    type: 'follow-up', status: 'sent', provider: 'mailgun', segment: 'vip',
    totalRecipients: 6800, sentCount: 6800, deliveredCount: 6664,
    openedCount: 3332, clickedCount: 1666, bouncedCount: 136, unsubscribedCount: 18,
    spamComplaints: 2, openRate: 0.50, clickRate: 0.25, bounceRate: 0.02,
    unsubscribeRate: 0.003, spamRate: 0.0003, revenue: 0,
    createdAt: '2026-08-15T09:00:00Z', sentAt: '2026-08-15T11:00:00Z',
    completedAt: '2026-08-15T11:20:00Z', createdBy: 'cs@company.com',
  },
];

// ============================================================================
// A/B Tests
// ============================================================================

export const mockABTests: ABTest[] = [
  {
    id: 'ab-001', campaignId: 'camp-001', campaignName: 'Summer Sale Blast', status: 'completed',
    variantA: { subject: '☀️ 50% Off Everything — Today Only!', openRate: 0.48, clickRate: 0.14, sampleSize: 22600, conversionRate: 0.08 },
    variantB: { subject: 'Flash Sale: Half Price on All Products!', openRate: 0.42, clickRate: 0.11, sampleSize: 22600, conversionRate: 0.06 },
    confidenceLevel: 0.97, winner: 'A', startedAt: '2026-07-16T10:00:00Z', endedAt: '2026-07-16T16:00:00Z',
  },
  {
    id: 'ab-002', campaignId: 'camp-002', campaignName: 'Product Launch Announcement', status: 'completed',
    variantA: { subject: '🚀 Introducing MailGenie Pro — Built for Teams', openRate: 0.41, clickRate: 0.13, sampleSize: 43750, conversionRate: 0.09 },
    variantB: { subject: 'MailGenie Pro is Here — See What\'s New', openRate: 0.38, clickRate: 0.10, sampleSize: 43750, conversionRate: 0.07 },
    confidenceLevel: 0.92, winner: 'A', startedAt: '2026-07-21T08:00:00Z', endedAt: '2026-07-21T20:00:00Z',
  },
  {
    id: 'ab-003', campaignId: 'camp-006', campaignName: 'Webinar Invitation', status: 'completed',
    variantA: { subject: '🎓 Free Webinar: Master Email Deliverability', openRate: 0.52, clickRate: 0.18, sampleSize: 14350, conversionRate: 0.12 },
    variantB: { subject: 'Join Our Live Workshop — Email Best Practices', openRate: 0.44, clickRate: 0.14, sampleSize: 14350, conversionRate: 0.09 },
    confidenceLevel: 0.95, winner: 'A', startedAt: '2026-08-13T10:00:00Z', endedAt: '2026-08-13T18:00:00Z',
  },
  {
    id: 'ab-004', campaignId: 'camp-009', campaignName: 'Feature Update Digest', status: 'running',
    variantA: { subject: '✨ What\'s New: Smart Templates, API v3 & More', openRate: 0.42, clickRate: 0.11, sampleSize: 10680, conversionRate: 0.07 },
    variantB: { subject: 'Your Monthly Product Update is Here', openRate: 0.35, clickRate: 0.08, sampleSize: 10680, conversionRate: 0.05 },
    confidenceLevel: 0.88, winner: null, startedAt: '2026-08-22T12:00:00Z', endedAt: null,
  },
];

// ============================================================================
// Deliverability Metrics
// ============================================================================

export const mockDeliverabilityMetrics: DeliverabilityMetric[] = [
  {
    id: 'del-001', campaignId: 'camp-001', campaignName: 'Summer Sale Blast',
    senderScore: 94, reputationScore: 92, inboxRate: 0.88, spamFolderRate: 0.08, missingRate: 0.04,
    hardBounces: 320, softBounces: 780, spamComplaints: 22, unsubscribes: 180, greylisted: 45, dnsFailures: 12,
    issues: ['soft-bounce', 'greylisted'], checkedAt: '2026-07-17T10:00:00Z',
  },
  {
    id: 'del-002', campaignId: 'camp-002', campaignName: 'Product Launch Announcement',
    senderScore: 96, reputationScore: 95, inboxRate: 0.91, spamFolderRate: 0.06, missingRate: 0.03,
    hardBounces: 520, softBounces: 1230, spamComplaints: 58, unsubscribes: 420, greylisted: 32, dnsFailures: 8,
    issues: ['soft-bounce'], checkedAt: '2026-07-22T10:00:00Z',
  },
  {
    id: 'del-003', campaignId: 'camp-004', campaignName: 'Re-engagement Campaign',
    senderScore: 82, reputationScore: 78, inboxRate: 0.72, spamFolderRate: 0.15, missingRate: 0.13,
    hardBounces: 420, softBounces: 336, spamComplaints: 45, unsubscribes: 312, greylisted: 120, dnsFailures: 35,
    issues: ['hard-bounce', 'spam-complaint', 'greylisted'], checkedAt: '2026-08-07T10:00:00Z',
  },
  {
    id: 'del-004', campaignId: 'camp-005', campaignName: 'Post-Purchase Follow-up',
    senderScore: 97, reputationScore: 96, inboxRate: 0.93, spamFolderRate: 0.04, missingRate: 0.03,
    hardBounces: 24, softBounces: 140, spamComplaints: 3, unsubscribes: 25, greylisted: 8, dnsFailures: 2,
    issues: [], checkedAt: '2026-08-11T10:00:00Z',
  },
];

// ============================================================================
// Link Clicks
// ============================================================================

export const mockLinkClicks: LinkClick[] = [
  { id: 'lc-001', campaignId: 'camp-001', url: 'https://shop.example.com/summer-sale', label: 'Shop Now — CTA Button', category: 'cta', totalClicks: 5292, uniqueClicks: 4812, clickRate: 0.11, firstClickedAt: '2026-07-16T10:05:00Z', lastClickedAt: '2026-07-18T23:59:00Z' },
  { id: 'lc-002', campaignId: 'camp-001', url: 'https://shop.example.com/sale-banners', label: 'Hero Banner Image', category: 'image', totalClicks: 987, uniqueClicks: 890, clickRate: 0.02, firstClickedAt: '2026-07-16T10:03:00Z', lastClickedAt: '2026-07-17T18:00:00Z' },
  { id: 'lc-003', campaignId: 'camp-001', url: 'https://shop.example.com/unsubscribe', label: 'Unsubscribe Link', category: 'unsubscribe', totalClicks: 180, uniqueClicks: 180, clickRate: 0.004, firstClickedAt: '2026-07-16T10:10:00Z', lastClickedAt: '2026-07-20T14:00:00Z' },
  { id: 'lc-004', campaignId: 'camp-002', url: 'https://product.example.com/pro', label: 'Try MailGenie Pro — CTA', category: 'cta', totalClicks: 8232, uniqueClicks: 7450, clickRate: 0.086, firstClickedAt: '2026-07-21T08:05:00Z', lastClickedAt: '2026-07-25T23:59:00Z' },
  { id: 'lc-005', campaignId: 'camp-002', url: 'https://twitter.com/mailgenie', label: 'Follow on Twitter', category: 'social', totalClicks: 512, uniqueClicks: 478, clickRate: 0.005, firstClickedAt: '2026-07-21T08:10:00Z', lastClickedAt: '2026-07-24T16:00:00Z' },
  { id: 'lc-006', campaignId: 'camp-002', url: 'https://linkedin.com/company/mailgenie', label: 'Follow on LinkedIn', category: 'social', totalClicks: 380, uniqueClicks: 355, clickRate: 0.004, firstClickedAt: '2026-07-21T08:12:00Z', lastClickedAt: '2026-07-24T19:00:00Z' },
  { id: 'lc-007', campaignId: 'camp-006', url: 'https://events.example.com/webinar-register', label: 'Register for Webinar', category: 'cta', totalClicks: 4102, uniqueClicks: 3800, clickRate: 0.14, firstClickedAt: '2026-08-13T10:05:00Z', lastClickedAt: '2026-08-15T20:00:00Z' },
  { id: 'lc-008', campaignId: 'camp-005', url: 'https://survey.example.com/nps', label: 'Rate Your Experience', category: 'cta', totalClicks: 1406, uniqueClicks: 1290, clickRate: 0.16, firstClickedAt: '2026-08-10T14:05:00Z', lastClickedAt: '2026-08-14T12:00:00Z' },
];

// ============================================================================
// Device Breakdown
// ============================================================================

export const mockDeviceBreakdown: DeviceBreakdown[] = [
  { device: 'mobile', count: 38450, percentage: 0.52 },
  { device: 'desktop', count: 22150, percentage: 0.30 },
  { device: 'webmail', count: 9400, percentage: 0.128 },
  { device: 'tablet', count: 3700, percentage: 0.052 },
];

// ============================================================================
// Recipient Engagement
// ============================================================================

export const mockRecipients: RecipientEngagement[] = [
  { id: 'r-001', email: 'alice@techcorp.io', name: 'Alice Johnson', engagementLevel: 'high', engagementScore: 92, totalEmailsReceived: 24, totalOpened: 22, totalClicked: 18, lastOpenedAt: '2026-08-22T14:30:00Z', lastClickedAt: '2026-08-22T14:32:00Z', lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 340, preferredDevice: 'mobile', tags: ['vip', 'early-adopter'] },
  { id: 'r-002', email: 'bob@startup.co', name: 'Bob Martinez', engagementLevel: 'high', engagementScore: 85, totalEmailsReceived: 20, totalOpened: 17, totalClicked: 12, lastOpenedAt: '2026-08-21T09:15:00Z', lastClickedAt: '2026-08-21T09:18:00Z', lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 520, preferredDevice: 'desktop', tags: ['power-user'] },
  { id: 'r-003', email: 'carol@enterprise.com', name: 'Carol Williams', engagementLevel: 'medium', engagementScore: 62, totalEmailsReceived: 18, totalOpened: 11, totalClicked: 5, lastOpenedAt: '2026-08-20T16:45:00Z', lastClickedAt: '2026-08-18T11:20:00Z', lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 1800, preferredDevice: 'webmail', tags: ['enterprise'] },
  { id: 'r-004', email: 'dave@agency.io', name: 'Dave Chen', engagementLevel: 'medium', engagementScore: 48, totalEmailsReceived: 22, totalOpened: 10, totalClicked: 3, lastOpenedAt: '2026-08-15T08:00:00Z', lastClickedAt: '2026-08-10T14:00:00Z', lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 3600, preferredDevice: 'mobile', tags: [] },
  { id: 'r-005', email: 'eve@freelance.dev', name: 'Eve Kowalski', engagementLevel: 'low', engagementScore: 22, totalEmailsReceived: 20, totalOpened: 4, totalClicked: 1, lastOpenedAt: '2026-08-01T12:00:00Z', lastClickedAt: '2026-07-25T09:00:00Z', lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 7200, preferredDevice: 'desktop', tags: ['at-risk'] },
  { id: 'r-006', email: 'frank@bigcorp.com', name: 'Frank O\'Brien', engagementLevel: 'none', engagementScore: 5, totalEmailsReceived: 16, totalOpened: 1, totalClicked: 0, lastOpenedAt: '2026-07-10T10:00:00Z', lastClickedAt: null, lastEmailAt: '2026-08-22T12:00:00Z', avgOpenTimeSeconds: 0, preferredDevice: 'desktop', tags: ['churn-risk'] },
];

// ============================================================================
// Campaign Timeline (for camp-001)
// ============================================================================

export const mockTimeline: CampaignTimelinePoint[] = [
  { timestamp: '2026-07-16T10:00:00Z', sent: 45200, delivered: 22000, opened: 1200, clicked: 180, bounced: 500 },
  { timestamp: '2026-07-16T10:05:00Z', sent: 45200, delivered: 35000, opened: 5600, clicked: 840, bounced: 800 },
  { timestamp: '2026-07-16T10:15:00Z', sent: 45200, delivered: 40000, opened: 11200, clicked: 2240, bounced: 950 },
  { timestamp: '2026-07-16T10:30:00Z', sent: 45200, delivered: 42500, opened: 15300, clicked: 3400, bounced: 1020 },
  { timestamp: '2026-07-16T10:45:00Z', sent: 45200, delivered: 44100, opened: 17640, clicked: 4410, bounced: 1100 },
  { timestamp: '2026-07-16T12:00:00Z', sent: 45200, delivered: 44100, opened: 19845, clicked: 5292, bounced: 1100 },
  { timestamp: '2026-07-16T18:00:00Z', sent: 45200, delivered: 44100, opened: 21000, clicked: 6100, bounced: 1100 },
  { timestamp: '2026-07-17T08:00:00Z', sent: 45200, delivered: 44100, opened: 21630, clicked: 6400, bounced: 1100 },
  { timestamp: '2026-07-17T18:00:00Z', sent: 45200, delivered: 44100, opened: 21900, clicked: 6550, bounced: 1100 },
  { timestamp: '2026-07-18T08:00:00Z', sent: 45200, delivered: 44100, opened: 22000, clicked: 6600, bounced: 1100 },
  { timestamp: '2026-07-18T18:00:00Z', sent: 45200, delivered: 44100, opened: 22050, clicked: 6615, bounced: 1100 },
];

// ============================================================================
// Hourly Heatmap (open rates by hour & day of week)
// ============================================================================

export const mockHourlyHeatmap: HourlyHeatmapPoint[] = (() => {
  const data: HourlyHeatmapPoint[] = [];
  const baseRates = [
    0.08, 0.05, 0.03, 0.03, 0.04, 0.07, 0.12, 0.22, 0.35, 0.42, 0.48, 0.45,
    0.38, 0.40, 0.44, 0.46, 0.42, 0.35, 0.28, 0.22, 0.18, 0.15, 0.12, 0.10,
  ];
  const dayMultiplier = [0.6, 1.0, 1.05, 1.08, 1.02, 0.85, 0.55];
  for (let dow = 0; dow < 7; dow++) {
    for (let h = 0; h < 24; h++) {
      data.push({
        hour: h, dayOfWeek: dow,
        openRate: baseRates[h] * dayMultiplier[dow] * (0.9 + Math.random() * 0.2),
        clickRate: baseRates[h] * dayMultiplier[dow] * 0.25 * (0.9 + Math.random() * 0.2),
      });
    }
  }
  return data;
})();

// ============================================================================
// Top Campaigns
// ============================================================================

export const mockTopCampaigns: TopCampaign[] = [
  { id: 'camp-008', name: 'Security Alert — Password Reset', subject: '🔒 Action Required: Reset Your Password', openRate: 0.90, clickRate: 0.80, sentCount: 3200, revenue: 0 },
  { id: 'camp-005', name: 'Post-Purchase Follow-up', subject: 'How was your experience? Rate us ⭐', openRate: 0.60, clickRate: 0.25, sentCount: 8200, revenue: 42300 },
  { id: 'camp-001', name: 'Summer Sale Blast', subject: '☀️ 50% Off Everything — Today Only!', openRate: 0.50, clickRate: 0.15, sentCount: 45200, revenue: 89432.50 },
  { id: 'camp-006', name: 'Webinar Invitation', subject: '🎓 Free Webinar: Master Email Deliverability', openRate: 0.50, clickRate: 0.175, sentCount: 28700, revenue: 0 },
  { id: 'camp-010', name: 'Customer Satisfaction Survey', subject: '📊 Quick Survey: Help Us Improve (2 min)', openRate: 0.50, clickRate: 0.25, sentCount: 6800, revenue: 0 },
];

// ============================================================================
// Insights
// ============================================================================

export const mockInsights: CampaignInsight[] = [
  { id: 'ins-001', type: 'success', title: 'Excellent Transactional Performance', description: 'Your security alert email achieved 90% open rate and 80% click rate — well above the 21% industry average for transactional emails.', metric: 'Open Rate', value: '90%', actionable: false },
  { id: 'ins-002', type: 'warning', title: 'Re-engagement Campaign Underperforming', description: 'The "We miss you" campaign has a 4% bounce rate and 1.7% unsubscribe rate. Consider cleaning inactive addresses before the next send.', metric: 'Bounce Rate', value: '4%', actionable: true },
  { id: 'ins-003', type: 'tip', title: 'Optimal Send Time Identified', description: 'Your highest open rates occur between 10:00 AM–12:00 PM on Tuesdays and Wednesdays. Schedule campaigns during this window for best results.', metric: 'Best Time', value: 'Tue–Wed 10AM–12PM', actionable: true },
  { id: 'ins-004', type: 'info', title: 'Mobile Opens Dominate', description: '52% of your email opens happen on mobile devices. Ensure all email templates are mobile-responsive for maximum impact.', metric: 'Mobile Opens', value: '52%', actionable: true },
  { id: 'ins-005', type: 'success', title: 'A/B Testing ROI', description: 'Subject line A/B tests have consistently identified 15–20% better-performing variants. Keep testing to compound gains.', metric: 'Avg Lift', value: '+18%', actionable: false },
  { id: 'ins-006', type: 'warning', title: 'Spam Complaints Rising', description: 'The re-engagement campaign generated 45 spam complaints (0.24% rate). Consider double opt-in for cold outreach segments.', metric: 'Spam Rate', value: '0.24%', actionable: true },
  { id: 'ins-007', type: 'tip', title: 'CTA Button Dominates Clicks', description: '83% of all link clicks go to CTA buttons vs. 12% to images and 5% to text links. Use prominent, action-oriented CTA buttons in every campaign.', metric: 'CTA Share', value: '83%', actionable: false },
  { id: 'ins-008', type: 'info', title: 'Deliverability Score Trending Up', description: 'Your average sender score improved from 89 to 94 over the past 3 months. Keep monitoring and maintaining list hygiene.', metric: 'Sender Score', value: '94', actionable: false },
];

// ============================================================================
// Campaign Summary
// ============================================================================

export const mockCampaignSummary: CampaignSummary = {
  totalCampaigns: 10,
  totalEmailsSent: 261800,
  avgOpenRate: 0.45,
  avgClickRate: 0.14,
  avgBounceRate: 0.021,
  totalRevenue: 381832.75,
  totalUnsubscribes: 1301,
  totalSpamComplaints: 155,
  bestPerformingCampaign: mockTopCampaigns[0],
  worstPerformingCampaign: { id: 'camp-004', name: 'Re-engagement Campaign', subject: 'We miss you! Here\'s 30% off to come back 💝', openRate: 0.30, clickRate: 0.06, sentCount: 18900, revenue: 15670.25 },
  deliverabilityScore: 92,
  engagementTrend: 'improving',
};
