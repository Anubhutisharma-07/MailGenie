import type {
  DomainHealth, BlacklistEntry, BounceEvent, ReputationTimeline,
  AuthenticationRecord, IPWarmupConfig, DeliverabilityAlert,
  BounceTrend, DomainComparison, DeliverabilitySummary,
} from './deliverabilityMonitorTypes';

// ============================================================================
// Domain Health
// ============================================================================

export const mockDomainHealth: DomainHealth[] = [
  {
    id: 'dh-001', domain: 'mail.company.com', senderScore: 95, reputationLevel: 'excellent',
    inboxRate: 0.94, spamFolderRate: 0.04, missingRate: 0.02, bounceRate: 0.015, unsubscribeRate: 0.002,
    spamComplaintRate: 0.0003, dailySendVolume: 45000, trend: 'stable',
    lastCheckedAt: '2026-08-24T10:00:00Z', spfStatus: 'pass', dkimStatus: 'pass', dmarcStatus: 'pass',
  },
  {
    id: 'dh-002', domain: 'marketing.company.com', senderScore: 87, reputationLevel: 'good',
    inboxRate: 0.88, spamFolderRate: 0.08, missingRate: 0.04, bounceRate: 0.022, unsubscribeRate: 0.004,
    spamComplaintRate: 0.0008, dailySendVolume: 32000, trend: 'improving',
    lastCheckedAt: '2026-08-24T10:00:00Z', spfStatus: 'pass', dkimStatus: 'pass', dmarcStatus: 'softfail',
  },
  {
    id: 'dh-003', domain: 'newsletters.company.com', senderScore: 78, reputationLevel: 'good',
    inboxRate: 0.82, spamFolderRate: 0.12, missingRate: 0.06, bounceRate: 0.035, unsubscribeRate: 0.006,
    spamComplaintRate: 0.0012, dailySendVolume: 18000, trend: 'declining',
    lastCheckedAt: '2026-08-24T10:00:00Z', spfStatus: 'pass', dkimStatus: 'softfail', dmarcStatus: 'none',
  },
  {
    id: 'dh-004', domain: 'notifications.company.com', senderScore: 92, reputationLevel: 'excellent',
    inboxRate: 0.92, spamFolderRate: 0.05, missingRate: 0.03, bounceRate: 0.012, unsubscribeRate: 0.001,
    spamComplaintRate: 0.0002, dailySendVolume: 12000, trend: 'stable',
    lastCheckedAt: '2026-08-24T10:00:00Z', spfStatus: 'pass', dkimStatus: 'pass', dmarcStatus: 'pass',
  },
  {
    id: 'dh-005', domain: 'outbound.company.com', senderScore: 62, reputationLevel: 'fair',
    inboxRate: 0.68, spamFolderRate: 0.20, missingRate: 0.12, bounceRate: 0.058, unsubscribeRate: 0.012,
    spamComplaintRate: 0.0025, dailySendVolume: 8500, trend: 'declining',
    lastCheckedAt: '2026-08-24T10:00:00Z', spfStatus: 'pass', dkimStatus: 'fail', dmarcStatus: 'fail',
  },
];

// ============================================================================
// Blacklist Entries
// ============================================================================

export const mockBlacklists: BlacklistEntry[] = [
  { id: 'bl-001', blacklistName: 'Spamhaus SBL', blacklistUrl: 'https://www.spamhaus.org/sbl/', status: 'clean', listedAt: null, delistedAt: null, reason: '', affectedDomains: [], lastCheckedAt: '2026-08-24T10:00:00Z' },
  { id: 'bl-002', blacklistName: 'Barracuda RBL', blacklistUrl: 'https://www.barracudacentral.org/lookups', status: 'clean', listedAt: null, delistedAt: null, reason: '', affectedDomains: [], lastCheckedAt: '2026-08-24T10:00:00Z' },
  { id: 'bl-003', blacklistName: 'SpamCop', blacklistUrl: 'https://www.spamcop.net/bl.shtml', status: 'listed', listedAt: '2026-08-22T14:30:00Z', delistedAt: null, reason: 'High complaint rate from outbound domain', affectedDomains: ['outbound.company.com'], lastCheckedAt: '2026-08-24T10:00:00Z' },
  { id: 'bl-004', blacklistName: 'SURBL', blacklistUrl: 'https://www.surbl.org/', status: 'clean', listedAt: null, delistedAt: null, reason: '', affectedDomains: [], lastCheckedAt: '2026-08-24T10:00:00Z' },
  { id: 'bl-005', blacklistName: 'Invaluement', blacklistUrl: 'https://www.invaluement.com/', status: 'monitoring', listedAt: null, delistedAt: null, reason: 'Borderline complaint rate — monitoring', affectedDomains: ['newsletters.company.com'], lastCheckedAt: '2026-08-24T10:00:00Z' },
  { id: 'bl-006', blacklistName: 'SORBS', blacklistUrl: 'https://www.sorbs.net/', status: 'clean', listedAt: null, delistedAt: null, reason: '', affectedDomains: [], lastCheckedAt: '2026-08-24T10:00:00Z' },
];

// ============================================================================
// Bounce Events (recent)
// ============================================================================

export const mockBounceEvents: BounceEvent[] = [
  { id: 'be-001', email: 'invalid@test.com', domain: 'test.com', category: 'hard', errorCode: '550', errorMessage: 'User unknown', campaignId: 'camp-001', campaignName: 'Summer Sale Blast', timestamp: '2026-08-24T09:30:00Z', retryCount: 0, permanent: true },
  { id: 'be-002', email: 'full@bigcorp.com', domain: 'bigcorp.com', category: 'soft', errorCode: '452', errorMessage: 'Mailbox full', campaignId: 'camp-002', campaignName: 'Product Launch', timestamp: '2026-08-24T09:28:00Z', retryCount: 2, permanent: false },
  { id: 'be-003', email: 'spam@complainer.net', domain: 'complainer.net', category: 'hard', errorCode: '550', errorMessage: 'Sender rejected', campaignId: 'camp-003', campaignName: 'Newsletter #48', timestamp: '2026-08-24T09:25:00Z', retryCount: 0, permanent: true },
  { id: 'be-004', email: 'timeout@slowserver.org', domain: 'slowserver.org', category: 'soft', errorCode: '408', errorMessage: 'Connection timeout', campaignId: 'camp-001', campaignName: 'Summer Sale Blast', timestamp: '2026-08-24T09:20:00Z', retryCount: 1, permanent: false },
  { id: 'be-005', email: 'blocked@enterprise.co', domain: 'enterprise.co', category: 'throttled', errorCode: '421', errorMessage: 'Rate limit exceeded', campaignId: 'camp-002', campaignName: 'Product Launch', timestamp: '2026-08-24T09:15:00Z', retryCount: 3, permanent: false },
  { id: 'be-006', email: 'unknown@startup.io', domain: 'startup.io', category: 'hard', errorCode: '550', errorMessage: 'Mailbox not found', campaignId: 'camp-004', campaignName: 'Re-engagement', timestamp: '2026-08-24T09:10:00Z', retryCount: 0, permanent: true },
  { id: 'be-007', email: 'grey@techfirm.dev', domain: 'techfirm.dev', category: 'undetermined', errorCode: '451', errorMessage: 'Greylisted — try again later', campaignId: 'camp-003', campaignName: 'Newsletter #48', timestamp: '2026-08-24T09:05:00Z', retryCount: 1, permanent: false },
];

// ============================================================================
// Reputation Timeline (30 days)
// ============================================================================

export const mockReputationTimeline: ReputationTimeline[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-07-26');
  date.setDate(date.getDate() + i);
  const baseScore = 88 + Math.sin(i * 0.3) * 5;
  return {
    date: date.toISOString().split('T')[0],
    senderScore: Math.round(baseScore + (Math.random() - 0.5) * 4),
    inboxRate: 0.88 + Math.sin(i * 0.2) * 0.04 + (Math.random() - 0.5) * 0.02,
    bounceRate: 0.02 + Math.sin(i * 0.15) * 0.005 + (Math.random() - 0.5) * 0.003,
    spamRate: 0.0008 + Math.sin(i * 0.25) * 0.0003 + (Math.random() - 0.5) * 0.0002,
    complaintRate: 0.0005 + Math.sin(i * 0.2) * 0.0002 + (Math.random() - 0.5) * 0.0001,
  };
});

// ============================================================================
// Authentication Records
// ============================================================================

export const mockAuthRecords: AuthenticationRecord[] = [
  {
    domain: 'mail.company.com',
    spf: { status: 'pass', record: 'v=spf1 include:_spf.google.com ~all', lastVerified: '2026-08-24T10:00:00Z' },
    dkim: { status: 'pass', selector: 'google', lastVerified: '2026-08-24T10:00:00Z' },
    dmarc: { status: 'pass', record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@company.com', policy: 'quarantine', lastVerified: '2026-08-24T10:00:00Z' },
    mxValid: true, reverseDns: true,
  },
  {
    domain: 'marketing.company.com',
    spf: { status: 'pass', record: 'v=spf1 include:sendgrid.net ~all', lastVerified: '2026-08-24T10:00:00Z' },
    dkim: { status: 'pass', selector: 's1', lastVerified: '2026-08-24T10:00:00Z' },
    dmarc: { status: 'softfail', record: 'v=DMARC1; p=none; rua=mailto:dmarc@company.com', policy: 'none', lastVerified: '2026-08-24T10:00:00Z' },
    mxValid: true, reverseDns: true,
  },
  {
    domain: 'newsletters.company.com',
    spf: { status: 'pass', record: 'v=spf1 include:mailgun.org ~all', lastVerified: '2026-08-24T10:00:00Z' },
    dkim: { status: 'softfail', selector: 'k1', lastVerified: '2026-08-20T10:00:00Z' },
    dmarc: { status: 'none', record: '', policy: 'none', lastVerified: '2026-08-24T10:00:00Z' },
    mxValid: true, reverseDns: false,
  },
  {
    domain: 'outbound.company.com',
    spf: { status: 'pass', record: 'v=spf1 ip4:203.0.113.0/24 ~all', lastVerified: '2026-08-24T10:00:00Z' },
    dkim: { status: 'fail', selector: 'mail', lastVerified: '2026-08-22T10:00:00Z' },
    dmarc: { status: 'fail', record: 'v=DMARC1; p=reject; rua=mailto:dmarc@company.com', policy: 'reject', lastVerified: '2026-08-24T10:00:00Z' },
    mxValid: false, reverseDns: false,
  },
];

// ============================================================================
// IP Warmup Config
// ============================================================================

export const mockIPWarmup: IPWarmupConfig[] = [
  {
    id: 'ipw-001', ipAddress: '203.0.113.10', domain: 'mail.company.com',
    currentVolume: 25000, targetVolume: 50000, warmupDay: 14, totalDays: 21, status: 'warming',
    reputation: 88,
    dailyVolumes: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1, volume: Math.round(500 + (25000 - 500) * (i / 20)),
      bounceRate: 0.02 + Math.random() * 0.01,
    })),
  },
  {
    id: 'ipw-002', ipAddress: '203.0.113.11', domain: 'marketing.company.com',
    currentVolume: 15000, targetVolume: 35000, warmupDay: 10, totalDays: 18, status: 'warming',
    reputation: 82,
    dailyVolumes: Array.from({ length: 10 }, (_, i) => ({
      day: i + 1, volume: Math.round(300 + (15000 - 300) * (i / 17)),
      bounceRate: 0.025 + Math.random() * 0.01,
    })),
  },
];

// ============================================================================
// Alerts
// ============================================================================

export const mockAlerts: DeliverabilityAlert[] = [
  { id: 'al-001', severity: 'critical', title: 'Blacklisted on SpamCop', description: 'outbound.company.com has been listed on SpamCop due to high complaint rate. Immediate action required.', domain: 'outbound.company.com', metric: 'Complaint Rate', value: '0.25%', threshold: '< 0.1%', createdAt: '2026-08-22T14:30:00Z', acknowledgedAt: '2026-08-22T15:00:00Z', resolvedAt: null },
  { id: 'al-002', severity: 'warning', title: 'DKIM Failure Detected', description: 'DKIM signature verification failed for newsletters.company.com. Emails may be flagged as suspicious.', domain: 'newsletters.company.com', metric: 'DKIM Status', value: 'softfail', threshold: 'pass', createdAt: '2026-08-23T08:00:00Z', acknowledgedAt: null, resolvedAt: null },
  { id: 'al-003', severity: 'warning', title: 'Bounce Rate Elevated', description: 'outbound.company.com bounce rate reached 5.8% — above the 3% recommended threshold.', domain: 'outbound.company.com', metric: 'Bounce Rate', value: '5.8%', threshold: '< 3%', createdAt: '2026-08-24T09:00:00Z', acknowledgedAt: null, resolvedAt: null },
  { id: 'al-004', severity: 'info', title: 'DMARC Policy Upgrade Recommended', description: 'marketing.company.com uses p=none DMARC policy. Upgrade to p=quarantine for better protection.', domain: 'marketing.company.com', metric: 'DMARC Policy', value: 'none', threshold: 'quarantine', createdAt: '2026-08-20T10:00:00Z', acknowledgedAt: '2026-08-20T12:00:00Z', resolvedAt: null },
  { id: 'al-005', severity: 'resolved', title: 'Spamhaus Cleared', description: 'mail.company.com has been removed from Spamhaus SBL. Sender score recovering.', domain: 'mail.company.com', metric: 'Blacklist', value: 'Clean', threshold: 'N/A', createdAt: '2026-08-18T10:00:00Z', acknowledgedAt: '2026-08-18T10:30:00Z', resolvedAt: '2026-08-19T08:00:00Z' },
  { id: 'al-006', severity: 'warning', title: 'Reverse DNS Missing', description: 'newsletters.company.com lacks reverse DNS (PTR record). Some receivers may reject mail.', domain: 'newsletters.company.com', metric: 'rDNS', value: 'Missing', threshold: 'Required', createdAt: '2026-08-21T14:00:00Z', acknowledgedAt: null, resolvedAt: null },
];

// ============================================================================
// Bounce Trends (14 days)
// ============================================================================

export const mockBounceTrends: BounceTrend[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date('2026-08-11');
  date.setDate(date.getDate() + i);
  const hard = Math.round(80 + Math.random() * 60);
  const soft = Math.round(120 + Math.random() * 80);
  return {
    date: date.toISOString().split('T')[0],
    hardBounces: hard, softBounces: soft, total: hard + soft,
    rate: (hard + soft) / 85000,
  };
});

// ============================================================================
// Domain Comparison
// ============================================================================

export const mockDomainComparison: DomainComparison[] = [
  { domain: 'mail.company.com', senderScore: 95, inboxRate: 0.94, bounceRate: 0.015, spamRate: 0.0003, dailyVolume: 45000, reputationLevel: 'excellent' },
  { domain: 'notifications.company.com', senderScore: 92, inboxRate: 0.92, bounceRate: 0.012, spamRate: 0.0002, dailyVolume: 12000, reputationLevel: 'excellent' },
  { domain: 'marketing.company.com', senderScore: 87, inboxRate: 0.88, bounceRate: 0.022, spamRate: 0.0008, dailyVolume: 32000, reputationLevel: 'good' },
  { domain: 'newsletters.company.com', senderScore: 78, inboxRate: 0.82, bounceRate: 0.035, spamRate: 0.0012, dailyVolume: 18000, reputationLevel: 'good' },
  { domain: 'outbound.company.com', senderScore: 62, inboxRate: 0.68, bounceRate: 0.058, spamRate: 0.0025, dailyVolume: 8500, reputationLevel: 'fair' },
];

// ============================================================================
// Summary
// ============================================================================

export const mockDeliverabilitySummary: DeliverabilitySummary = {
  totalDomains: 5,
  healthyDomains: 3,
  avgSenderScore: 83,
  avgInboxRate: 0.85,
  totalBounces30d: 4250,
  totalComplaints30d: 85,
  activeBlacklists: 1,
  authPassRate: 0.60,
  overallTrend: 'stable',
};
