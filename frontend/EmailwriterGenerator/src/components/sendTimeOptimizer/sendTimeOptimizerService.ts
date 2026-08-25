import type {
  OptimalTimeSlot, TimezoneDistribution, ScheduledCampaign, HourlyEngagement,
  DailyEngagement, SendWindowAnalysis, RecipientTimePreference, BatchScheduleConfig,
  TimezoneOverlapMap, SendTimeInsight, SendTimeSummary,
} from './sendTimeOptimizerTypes';

// ============================================================================
// Optimal Time Slots (AI-predicted best send times)
// ============================================================================

export const mockOptimalSlots: OptimalTimeSlot[] = [
  { hour: 10, dayOfWeek: 'tue', predictedOpenRate: 0.52, predictedClickRate: 0.18, confidence: 'very-high', sampleSize: 12400, timezone: 'America/New_York' },
  { hour: 11, dayOfWeek: 'wed', predictedOpenRate: 0.49, predictedClickRate: 0.16, confidence: 'high', sampleSize: 11200, timezone: 'America/New_York' },
  { hour: 9, dayOfWeek: 'thu', predictedOpenRate: 0.47, predictedClickRate: 0.15, confidence: 'high', sampleSize: 9800, timezone: 'America/New_York' },
  { hour: 14, dayOfWeek: 'tue', predictedOpenRate: 0.45, predictedClickRate: 0.14, confidence: 'medium', sampleSize: 8600, timezone: 'America/Los_Angeles' },
  { hour: 8, dayOfWeek: 'mon', predictedOpenRate: 0.43, predictedClickRate: 0.13, confidence: 'medium', sampleSize: 7400, timezone: 'Europe/London' },
  { hour: 13, dayOfWeek: 'wed', predictedOpenRate: 0.42, predictedClickRate: 0.12, confidence: 'medium', sampleSize: 6800, timezone: 'America/Chicago' },
  { hour: 19, dayOfWeek: 'sun', predictedOpenRate: 0.38, predictedClickRate: 0.10, confidence: 'low', sampleSize: 4200, timezone: 'Asia/Tokyo' },
  { hour: 7, dayOfWeek: 'fri', predictedOpenRate: 0.36, predictedClickRate: 0.09, confidence: 'low', sampleSize: 3600, timezone: 'Europe/Berlin' },
];

// ============================================================================
// Timezone Distribution
// ============================================================================

export const mockTimezoneDistribution: TimezoneDistribution[] = [
  { timezone: 'America/New_York', label: 'Eastern (ET)', recipientCount: 28500, percentage: 0.38, avgOpenRate: 0.46, avgClickRate: 0.14, peakHour: 10, utcOffset: -5 },
  { timezone: 'America/Los_Angeles', label: 'Pacific (PT)', recipientCount: 18200, percentage: 0.243, avgOpenRate: 0.44, avgClickRate: 0.13, peakHour: 11, utcOffset: -8 },
  { timezone: 'Europe/London', label: 'GMT/BST', recipientCount: 12400, percentage: 0.165, avgOpenRate: 0.42, avgClickRate: 0.12, peakHour: 9, utcOffset: 0 },
  { timezone: 'America/Chicago', label: 'Central (CT)', recipientCount: 8600, percentage: 0.115, avgOpenRate: 0.43, avgClickRate: 0.13, peakHour: 10, utcOffset: -6 },
  { timezone: 'Asia/Tokyo', label: 'JST', recipientCount: 4800, percentage: 0.064, avgOpenRate: 0.40, avgClickRate: 0.11, peakHour: 13, utcOffset: 9 },
  { timezone: 'Europe/Berlin', label: 'CET/CEST', recipientCount: 2400, percentage: 0.033, avgOpenRate: 0.39, avgClickRate: 0.10, peakHour: 7, utcOffset: 1 },
];

// ============================================================================
// Scheduled Campaigns
// ============================================================================

export const mockScheduledCampaigns: ScheduledCampaign[] = [
  {
    id: 'sc-001', name: 'Weekly Newsletter #48', subject: '📬 This Week: Smart Send Times & More',
    status: 'scheduled', mode: 'ai-optimal', totalRecipients: 32100,
    scheduledTime: '2026-08-25T14:00:00Z', scheduledTimeLocal: '10:00 AM ET',
    timezone: 'America/New_York', aiConfidence: 'very-high',
    predictedOpenRate: 0.52, predictedClickRate: 0.18,
    actualOpenRate: null, actualClickRate: null,
    estimatedSendWindow: 15, createdAt: '2026-08-22T09:00:00Z', createdBy: 'content@company.com',
  },
  {
    id: 'sc-002', name: 'Flash Sale Announcement', subject: '⚡ 4-Hour Flash Sale — 60% Off',
    status: 'scheduled', mode: 'ai-optimal', totalRecipients: 45200,
    scheduledTime: '2026-08-26T15:00:00Z', scheduledTimeLocal: '11:00 AM ET',
    timezone: 'America/New_York', aiConfidence: 'high',
    predictedOpenRate: 0.48, predictedClickRate: 0.16,
    actualOpenRate: null, actualClickRate: null,
    estimatedSendWindow: 20, createdAt: '2026-08-23T11:00:00Z', createdBy: 'marketing@company.com',
  },
  {
    id: 'sc-003', name: 'Product Update v3.2', subject: '✨ What\'s New in MailGenie v3.2',
    status: 'sending', mode: 'batch-send', totalRecipients: 87500,
    scheduledTime: '2026-08-24T13:00:00Z', scheduledTimeLocal: '9:00 AM ET',
    timezone: 'America/New_York', aiConfidence: 'high',
    predictedOpenRate: 0.40, predictedClickRate: 0.12,
    actualOpenRate: 0.38, actualClickRate: 0.11,
    estimatedSendWindow: 45, createdAt: '2026-08-21T14:00:00Z', createdBy: 'product@company.com',
  },
  {
    id: 'sc-004', name: 'Onboarding Drip — Day 3', subject: '💡 Tip: Create Your First Template',
    status: 'sent', mode: 'drip', totalRecipients: 2800,
    scheduledTime: '2026-08-22T14:00:00Z', scheduledTimeLocal: '10:00 AM ET',
    timezone: 'America/New_York', aiConfidence: 'very-high',
    predictedOpenRate: 0.58, predictedClickRate: 0.28,
    actualOpenRate: 0.62, actualClickRate: 0.31,
    estimatedSendWindow: 5, createdAt: '2026-08-20T09:00:00Z', createdBy: 'automation@company.com',
  },
  {
    id: 'sc-005', name: 'Re-engagement Campaign', subject: '💝 We miss you — here\'s 30% off',
    status: 'sent', mode: 'ai-optimal', totalRecipients: 18900,
    scheduledTime: '2026-08-20T16:00:00Z', scheduledTimeLocal: '12:00 PM PT',
    timezone: 'America/Los_Angeles', aiConfidence: 'medium',
    predictedOpenRate: 0.35, predictedClickRate: 0.08,
    actualOpenRate: 0.30, actualClickRate: 0.06,
    estimatedSendWindow: 12, createdAt: '2026-08-18T10:00:00Z', createdBy: 'marketing@company.com',
  },
  {
    id: 'sc-006', name: 'Security Alert Batch', subject: '🔒 Password Reset Required',
    status: 'sent', mode: 'batch-send', totalRecipients: 3200,
    scheduledTime: '2026-08-18T10:01:00Z', scheduledTimeLocal: '10:01 AM ET',
    timezone: 'America/New_York', aiConfidence: 'very-high',
    predictedOpenRate: 0.88, predictedClickRate: 0.75,
    actualOpenRate: 0.90, actualClickRate: 0.80,
    estimatedSendWindow: 3, createdAt: '2026-08-18T06:00:00Z', createdBy: 'security@company.com',
  },
];

// ============================================================================
// Hourly Engagement (24-hour pattern)
// ============================================================================

export const mockHourlyEngagement: HourlyEngagement[] = [
  { hour: 0, openRate: 0.04, clickRate: 0.01, sendVolume: 120, conversionRate: 0.005 },
  { hour: 1, openRate: 0.03, clickRate: 0.008, sendVolume: 80, conversionRate: 0.003 },
  { hour: 2, openRate: 0.02, clickRate: 0.005, sendVolume: 40, conversionRate: 0.002 },
  { hour: 3, openRate: 0.02, clickRate: 0.004, sendVolume: 30, conversionRate: 0.001 },
  { hour: 4, openRate: 0.03, clickRate: 0.006, sendVolume: 50, conversionRate: 0.002 },
  { hour: 5, openRate: 0.06, clickRate: 0.02, sendVolume: 180, conversionRate: 0.008 },
  { hour: 6, openRate: 0.12, clickRate: 0.04, sendVolume: 650, conversionRate: 0.02 },
  { hour: 7, openRate: 0.22, clickRate: 0.07, sendVolume: 1800, conversionRate: 0.04 },
  { hour: 8, openRate: 0.35, clickRate: 0.11, sendVolume: 4200, conversionRate: 0.06 },
  { hour: 9, openRate: 0.45, clickRate: 0.15, sendVolume: 7600, conversionRate: 0.08 },
  { hour: 10, openRate: 0.52, clickRate: 0.18, sendVolume: 9800, conversionRate: 0.10 },
  { hour: 11, openRate: 0.49, clickRate: 0.16, sendVolume: 8400, conversionRate: 0.09 },
  { hour: 12, openRate: 0.38, clickRate: 0.12, sendVolume: 5200, conversionRate: 0.06 },
  { hour: 13, openRate: 0.42, clickRate: 0.13, sendVolume: 6100, conversionRate: 0.07 },
  { hour: 14, openRate: 0.44, clickRate: 0.14, sendVolume: 6800, conversionRate: 0.08 },
  { hour: 15, openRate: 0.39, clickRate: 0.12, sendVolume: 5400, conversionRate: 0.06 },
  { hour: 16, openRate: 0.34, clickRate: 0.10, sendVolume: 4000, conversionRate: 0.05 },
  { hour: 17, openRate: 0.28, clickRate: 0.08, sendVolume: 3000, conversionRate: 0.04 },
  { hour: 18, openRate: 0.22, clickRate: 0.06, sendVolume: 2200, conversionRate: 0.03 },
  { hour: 19, openRate: 0.18, clickRate: 0.05, sendVolume: 1800, conversionRate: 0.025 },
  { hour: 20, openRate: 0.14, clickRate: 0.04, sendVolume: 1400, conversionRate: 0.02 },
  { hour: 21, openRate: 0.10, clickRate: 0.03, sendVolume: 900, conversionRate: 0.015 },
  { hour: 22, openRate: 0.07, clickRate: 0.02, sendVolume: 500, conversionRate: 0.01 },
  { hour: 23, openRate: 0.05, clickRate: 0.015, sendVolume: 280, conversionRate: 0.007 },
];

// ============================================================================
// Daily Engagement (day-of-week pattern)
// ============================================================================

export const mockDailyEngagement: DailyEngagement[] = [
  { day: 'mon', openRate: 0.40, clickRate: 0.12, sendVolume: 14200, bestHour: 9 },
  { day: 'tue', openRate: 0.48, clickRate: 0.16, sendVolume: 18600, bestHour: 10 },
  { day: 'wed', openRate: 0.46, clickRate: 0.15, sendVolume: 17800, bestHour: 11 },
  { day: 'thu', openRate: 0.44, clickRate: 0.14, sendVolume: 16400, bestHour: 9 },
  { day: 'fri', openRate: 0.38, clickRate: 0.11, sendVolume: 12600, bestHour: 8 },
  { day: 'sat', openRate: 0.28, clickRate: 0.07, sendVolume: 4800, bestHour: 10 },
  { day: 'sun', openRate: 0.25, clickRate: 0.06, sendVolume: 3200, bestHour: 11 },
];

// ============================================================================
// Send Window Analysis
// ============================================================================

export const mockSendWindows: SendWindowAnalysis[] = [
  { id: 'sw-001', name: 'Early Morning', startTime: '06:00', endTime: '09:00', durationMinutes: 180, avgOpenRate: 0.30, avgClickRate: 0.09, totalCampaigns: 12, color: '#ff9800' },
  { id: 'sw-002', name: 'Morning Peak', startTime: '09:00', endTime: '12:00', durationMinutes: 180, avgOpenRate: 0.49, avgClickRate: 0.16, totalCampaigns: 28, color: '#4caf50' },
  { id: 'sw-003', name: 'Lunch Break', startTime: '12:00', endTime: '14:00', durationMinutes: 120, avgOpenRate: 0.40, avgClickRate: 0.12, totalCampaigns: 15, color: '#ffd700' },
  { id: 'sw-004', name: 'Afternoon', startTime: '14:00', endTime: '17:00', durationMinutes: 180, avgOpenRate: 0.39, avgClickRate: 0.12, totalCampaigns: 18, color: '#2196f3' },
  { id: 'sw-005', name: 'Evening', startTime: '17:00', endTime: '21:00', durationMinutes: 240, avgOpenRate: 0.18, avgClickRate: 0.05, totalCampaigns: 8, color: '#9c27b0' },
  { id: 'sw-006', name: 'Night', startTime: '21:00', endTime: '06:00', durationMinutes: 540, avgOpenRate: 0.04, avgClickRate: 0.01, totalCampaigns: 3, color: '#607d8b' },
];

// ============================================================================
// Recipient Time Preferences
// ============================================================================

export const mockRecipientPreferences: RecipientTimePreference[] = [
  { id: 'rp-001', email: 'alice@techcorp.io', name: 'Alice Johnson', timezone: 'America/New_York', preferredHour: 10, preferredDay: 'tue', engagementWindow: 'morning', lastOpenedAt: '2026-08-24T14:30:00Z', avgResponseTimeMinutes: 12, openRate: 0.85, clickRate: 0.32 },
  { id: 'rp-002', email: 'bob@startup.co', name: 'Bob Martinez', timezone: 'America/Los_Angeles', preferredHour: 11, preferredDay: 'wed', engagementWindow: 'midday', lastOpenedAt: '2026-08-23T19:15:00Z', avgResponseTimeMinutes: 45, openRate: 0.72, clickRate: 0.22 },
  { id: 'rp-003', email: 'carol@enterprise.com', name: 'Carol Williams', timezone: 'Europe/London', preferredHour: 9, preferredDay: 'thu', engagementWindow: 'morning', lastOpenedAt: '2026-08-24T13:00:00Z', avgResponseTimeMinutes: 180, openRate: 0.55, clickRate: 0.15 },
  { id: 'rp-004', email: 'dave@agency.io', name: 'Dave Chen', timezone: 'America/Chicago', preferredHour: 14, preferredDay: 'tue', engagementWindow: 'afternoon', lastOpenedAt: '2026-08-22T20:45:00Z', avgResponseTimeMinutes: 320, openRate: 0.42, clickRate: 0.10 },
  { id: 'rp-005', email: 'eve@freelance.dev', name: 'Eve Kowalski', timezone: 'Asia/Tokyo', preferredHour: 13, preferredDay: 'mon', engagementWindow: 'afternoon', lastOpenedAt: '2026-08-24T04:00:00Z', avgResponseTimeMinutes: 90, openRate: 0.68, clickRate: 0.20 },
  { id: 'rp-006', email: 'frank@bigcorp.com', name: "Frank O'Brien", timezone: 'Europe/Berlin', preferredHour: 7, preferredDay: 'fri', engagementWindow: 'morning', lastOpenedAt: '2026-08-21T07:30:00Z', avgResponseTimeMinutes: 60, openRate: 0.48, clickRate: 0.12 },
];

// ============================================================================
// Batch Schedule Config
// ============================================================================

export const mockBatchConfigs: BatchScheduleConfig[] = [
  { id: 'bc-001', campaignId: 'sc-003', campaignName: 'Product Update v3.2', totalBatches: 10, batchSize: 8750, intervalMinutes: 5, startHour: 9, timezone: 'America/New_York', status: 'running', completedBatches: 6, lastBatchAt: '2026-08-24T13:30:00Z' },
  { id: 'bc-002', campaignId: 'sc-006', campaignName: 'Security Alert Batch', totalBatches: 4, batchSize: 800, intervalMinutes: 1, startHour: 10, timezone: 'America/New_York', status: 'completed', completedBatches: 4, lastBatchAt: '2026-08-18T10:04:00Z' },
];

// ============================================================================
// Timezone Overlap Map (UTC hours vs regions)
// ============================================================================

export const mockOverlapMap: TimezoneOverlapMap[] = [
  { hour: 0, regions: [{ timezone: 'ET', localHour: 19, awake: true, optimal: false }, { timezone: 'PT', localHour: 16, awake: true, optimal: false }, { timezone: 'GMT', localHour: 0, awake: false, optimal: false }, { timezone: 'JST', localHour: 9, awake: true, optimal: true }], globalScore: 32 },
  { hour: 1, regions: [{ timezone: 'ET', localHour: 20, awake: true, optimal: false }, { timezone: 'PT', localHour: 17, awake: true, optimal: false }, { timezone: 'GMT', localHour: 1, awake: false, optimal: false }, { timezone: 'JST', localHour: 10, awake: true, optimal: true }], globalScore: 28 },
  { hour: 4, regions: [{ timezone: 'ET', localHour: 23, awake: false, optimal: false }, { timezone: 'PT', localHour: 20, awake: true, optimal: false }, { timezone: 'GMT', localHour: 4, awake: false, optimal: false }, { timezone: 'JST', localHour: 13, awake: true, optimal: false }], globalScore: 15 },
  { hour: 7, regions: [{ timezone: 'ET', localHour: 2, awake: false, optimal: false }, { timezone: 'PT', localHour: 23, awake: false, optimal: false }, { timezone: 'GMT', localHour: 7, awake: true, optimal: true }, { timezone: 'JST', localHour: 16, awake: true, optimal: false }], globalScore: 22 },
  { hour: 8, regions: [{ timezone: 'ET', localHour: 3, awake: false, optimal: false }, { timezone: 'PT', localHour: 0, awake: false, optimal: false }, { timezone: 'GMT', localHour: 8, awake: true, optimal: true }, { timezone: 'JST', localHour: 17, awake: true, optimal: false }], globalScore: 25 },
  { hour: 13, regions: [{ timezone: 'ET', localHour: 8, awake: true, optimal: true }, { timezone: 'PT', localHour: 5, awake: false, optimal: false }, { timezone: 'GMT', localHour: 13, awake: true, optimal: false }, { timezone: 'JST', localHour: 22, awake: true, optimal: false }], globalScore: 38 },
  { hour: 14, regions: [{ timezone: 'ET', localHour: 9, awake: true, optimal: true }, { timezone: 'PT', localHour: 6, awake: true, optimal: false }, { timezone: 'GMT', localHour: 14, awake: true, optimal: false }, { timezone: 'JST', localHour: 23, awake: false, optimal: false }], globalScore: 42 },
  { hour: 15, regions: [{ timezone: 'ET', localHour: 10, awake: true, optimal: true }, { timezone: 'PT', localHour: 7, awake: true, optimal: true }, { timezone: 'GMT', localHour: 15, awake: true, optimal: false }, { timezone: 'JST', localHour: 0, awake: false, optimal: false }], globalScore: 55 },
  { hour: 17, regions: [{ timezone: 'ET', localHour: 12, awake: true, optimal: false }, { timezone: 'PT', localHour: 9, awake: true, optimal: true }, { timezone: 'GMT', localHour: 17, awake: true, optimal: false }, { timezone: 'JST', localHour: 2, awake: false, optimal: false }], globalScore: 40 },
  { hour: 19, regions: [{ timezone: 'ET', localHour: 14, awake: true, optimal: false }, { timezone: 'PT', localHour: 11, awake: true, optimal: true }, { timezone: 'GMT', localHour: 19, awake: true, optimal: false }, { timezone: 'JST', localHour: 4, awake: false, optimal: false }], globalScore: 35 },
];

// ============================================================================
// Insights
// ============================================================================

export const mockInsights: SendTimeInsight[] = [
  { id: 'sti-001', type: 'success', title: 'AI Predictions 92% Accurate', description: 'Your AI-optimized send times have matched predicted open rates within 3% in 23 of 25 recent campaigns.', metric: 'Accuracy', value: '92%', actionable: false },
  { id: 'sti-002', type: 'tip', title: 'Tuesday 10 AM is Golden Hour', description: 'Your highest open rates (52%) occur on Tuesdays at 10 AM ET. Consider prioritizing this slot for high-value campaigns.', metric: 'Best Slot', value: 'Tue 10 AM ET', actionable: true },
  { id: 'sti-003', type: 'warning', title: 'Weekend Sends Underperform', description: 'Saturday and Sunday sends average 26% open rate vs 44% on weekdays. Consider pausing weekend sends or targeting only highly-engaged segments.', metric: 'Weekend Open Rate', value: '26%', actionable: true },
  { id: 'sti-004', type: 'info', title: 'Global Overlap at 3 PM UTC', description: 'For international campaigns, 3 PM UTC provides the best overlap between ET (10 AM), PT (7 AM), and GMT (3 PM) business hours.', metric: 'Optimal UTC', value: '3:00 PM', actionable: true },
  { id: 'sti-005', type: 'success', title: 'Batch Sending Improved Deliverability', description: 'The batch-send strategy reduced bounce rates by 40% compared to instant sends, improving overall sender reputation.', metric: 'Bounce Reduction', value: '40%', actionable: false },
  { id: 'sti-006', type: 'tip', title: 'Pacific Timezone Morning Window', description: 'PT recipients respond best between 11 AM–1 PM PT. Schedule campaigns to land in their inbox during this window.', metric: 'PT Best Time', value: '11 AM–1 PM', actionable: true },
];

// ============================================================================
// Summary
// ============================================================================

export const mockSendTimeSummary: SendTimeSummary = {
  totalScheduled: 4,
  totalSent: 2,
  avgPredictedOpenRate: 0.47,
  avgActualOpenRate: 0.44,
  avgPredictedClickRate: 0.15,
  avgActualClickRate: 0.14,
  aiAccuracyRate: 0.92,
  bestOptimalHour: 10,
  bestOptimalDay: 'tue',
  totalRecipientsCovered: 149600,
  timezoneCount: 6,
  avgSendWindowMinutes: 17,
};
