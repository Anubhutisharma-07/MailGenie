import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, TextField, InputAdornment, Chip, Grid, Divider,
} from '@mui/material';
import {
  mockCampaigns, mockABTests, mockDeliverabilityMetrics, mockLinkClicks,
  mockDeviceBreakdown, mockRecipients, mockTimeline, mockTopCampaigns,
  mockInsights, mockCampaignSummary,
} from './campaignAnalyticsService';
import {
  StatCard, CampaignCard, ABTestCard, DeliverabilityCard, LinkClickCard,
  EngagementCard, DeviceCard, InsightCard, TopCampaignCard,
} from './CampaignAnalyticsCards';
import {
  BarChart, DonutChart, TrendLine, HeatmapChart, HorizontalBar,
} from './CampaignAnalyticsCharts';
import {
  formatPercentage, formatNumber, formatCurrency, CAMPAIGN_STATUS_COLORS,
} from './campaignAnalyticsTypes';

// ============================================================================
// Tab Panel helper
// ============================================================================

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

// ============================================================================
// Main Dashboard
// ============================================================================

export default function CampaignAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = mockCampaignSummary;

  const filteredCampaigns = mockCampaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCampaigns = mockCampaigns.filter(c => c.status === 'sending');
  const completedCampaigns = mockCampaigns.filter(c => c.status === 'sent');

  // Campaign status donut data
  const statusDonutData = ['sent', 'scheduled', 'sending', 'draft'].map((status) => ({
    label: status,
    value: mockCampaigns.filter(c => c.status === status).length,
    color: CAMPAIGN_STATUS_COLORS[status],
  }));

  // Campaign type bar data
  const typeBarData = ['promotional', 'transactional', 'newsletter', 'cold-outreach', 'follow-up', 'announcement'].map((type) => ({
    type,
    campaigns: mockCampaigns.filter(c => c.type === type).length,
    sent: mockCampaigns.filter(c => c.type === type).reduce((s, c) => s + c.sentCount, 0),
  }));

  // Timeline chart data for top campaign
  const timelineChartData = mockTimeline.map(t => ({
    time: t.timestamp.substring(11, 16),
    opened: t.opened,
    clicked: t.clicked,
    bounced: t.bounced,
  }));

  // Link click totals by category
  const linkCategoryTotals = mockLinkClicks.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + l.uniqueClicks;
    return acc;
  }, {});
  const linkCategoryData = Object.entries(linkCategoryTotals).map(([category, count]) => ({
    category, count,
  }));

  // Engagement distribution
  const engagementDist = ['high', 'medium', 'low', 'none'].map(level => ({
    label: level,
    value: mockRecipients.filter(r => r.engagementLevel === level).length,
    color: { high: '#4caf50', medium: '#ff9800', low: '#ff5722', none: '#9e9e9e' }[level],
  }));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #17171d 100%)' }}>
      {/* Header */}
      <Typography variant="h3" sx={{
        color: '#fff', fontWeight: 800, mb: 1,
        textShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
      }}>
        📧 Campaign Analytics
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        Track email campaigns, A/B tests, deliverability, and engagement across all sends
      </Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{
          mb: 2,
          '& .MuiTab-root': { color: '#888', fontWeight: 600, textTransform: 'none', fontSize: '0.85rem' },
          '& .Mui-selected': { color: '#00e5ff !important' },
          '& .MuiTabs-indicator': { bgcolor: '#00e5ff' },
        }}
      >
        <Tab label="📊 Overview" />
        <Tab label="📨 Campaigns" />
        <Tab label="🧪 A/B Testing" />
        <Tab label="📬 Deliverability" />
        <Tab label="🔗 Link Analytics" />
        <Tab label="👤 Engagement" />
        <Tab label="💡 Insights" />
      </Tabs>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ===== OVERVIEW TAB ===== */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="Total Campaigns" value={summary.totalCampaigns} icon="📨" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Emails Sent" value={formatNumber(summary.totalEmailsSent)} icon="📧" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Open Rate" value={formatPercentage(summary.avgOpenRate)} icon="👁️" color="#2196f3" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon="💰" color="#ffd700" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <DonutChart
              title="Campaign Status"
              segments={statusDonutData}
              centerLabel="Campaigns"
              centerValue={String(summary.totalCampaigns)}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <BarChart
              title="Campaigns by Type"
              data={typeBarData}
              xKey="type"
              yKeys={['campaigns']}
              colors={['#00e5ff']}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <TrendLine
              title="Campaign Send Timeline (Summer Sale)"
              data={timelineChartData}
              xKey="time"
              yKeys={['opened', 'clicked']}
              colors={['#4caf50', '#2196f3']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DeviceCard devices={mockDeviceBreakdown} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2, mt: 2 }}>🏆 Top Performing Campaigns</Typography>
        <Grid container spacing={2}>
          {mockTopCampaigns.slice(0, 5).map((c, i) => (
            <Grid item xs={12} md={4} key={c.id}>
              <TopCampaignCard campaign={c} rank={i} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== CAMPAIGNS TAB ===== */}
      <TabPanel value={activeTab} index={1}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            size="small" placeholder="Search campaigns..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#00e5ff' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
          />
          {['all', 'sent', 'sending', 'scheduled', 'draft'].map((status) => (
            <Chip key={status} label={status} onClick={() => setStatusFilter(status)}
              sx={{
                bgcolor: statusFilter === status ? '#00e5ff' : 'rgba(255,255,255,0.06)',
                color: statusFilter === status ? '#000' : '#aaa',
                fontWeight: 600, cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        <Grid container spacing={2}>
          {filteredCampaigns.map((campaign) => (
            <Grid item xs={12} md={6} lg={4} key={campaign.id}>
              <CampaignCard campaign={campaign} />
            </Grid>
          ))}
        </Grid>
        {filteredCampaigns.length === 0 && (
          <Typography sx={{ color: '#666', textAlign: 'center', mt: 5 }}>No campaigns match your search.</Typography>
        )}
      </TabPanel>

      {/* ===== A/B TESTING TAB ===== */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          Compare subject line variants and find what drives opens and clicks
        </Typography>
        <Grid container spacing={2}>
          {mockABTests.map((test) => (
            <Grid item xs={12} md={6} key={test.id}>
              <ABTestCard test={test} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== DELIVERABILITY TAB ===== */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="Avg Sender Score" value={String(Math.round(mockDeliverabilityMetrics.reduce((s, m) => s + m.senderScore, 0) / mockDeliverabilityMetrics.length))} icon="🏆" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Inbox Rate" value={formatPercentage(mockDeliverabilityMetrics.reduce((s, m) => s + m.inboxRate, 0) / mockDeliverabilityMetrics.length)} icon="📥" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Spam Rate" value={formatPercentage(mockDeliverabilityMetrics.reduce((s, m) => s + m.spamFolderRate, 0) / mockDeliverabilityMetrics.length)} icon="🗑️" color="#ff9800" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Total Bounces" value={formatNumber(mockDeliverabilityMetrics.reduce((s, m) => s + m.hardBounces + m.softBounces, 0))} icon="⚠️" color="#f44336" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          {mockDeliverabilityMetrics.map((metric) => (
            <Grid item xs={12} md={6} key={metric.id}>
              <DeliverabilityCard metric={metric} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== LINK ANALYTICS TAB ===== */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <BarChart
              title="Clicks by Category"
              data={linkCategoryData}
              xKey="category"
              yKeys={['count']}
              colors={['#00e5ff']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DonutChart
              title="Click Distribution"
              segments={[
                { label: 'CTA Buttons', value: linkCategoryTotals.cta || 0, color: '#4caf50' },
                { label: 'Images', value: linkCategoryTotals.image || 0, color: '#2196f3' },
                { label: 'Social Links', value: linkCategoryTotals.social || 0, color: '#9c27b0' },
                { label: 'Unsubscribe', value: linkCategoryTotals.unsubscribe || 0, color: '#ff5722' },
              ]}
              centerLabel="Total Clicks"
              centerValue={formatNumber(Object.values(linkCategoryTotals).reduce((s, v) => s + v, 0))}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Link Performance</Typography>
        <Grid container spacing={2}>
          {mockLinkClicks.map((link) => (
            <Grid item xs={12} md={6} lg={4} key={link.id}>
              <LinkClickCard link={link} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== ENGAGEMENT TAB ===== */}
      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <DonutChart
              title="Engagement Distribution"
              segments={engagementDist}
              centerLabel="Recipients"
              centerValue={String(mockRecipients.length)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DeviceCard devices={mockDeviceBreakdown} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Recipient Profiles</Typography>
        <Grid container spacing={2}>
          {mockRecipients.map((recipient) => (
            <Grid item xs={12} md={6} lg={4} key={recipient.id}>
              <EngagementCard recipient={recipient} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== INSIGHTS TAB ===== */}
      <TabPanel value={activeTab} index={6}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Deliverability Score" value={String(summary.deliverabilityScore)} icon="🛡️" /></Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Engagement Trend"
              value={summary.engagementTrend === 'improving' ? '📈 Improving' : summary.engagementTrend === 'stable' ? '➡️ Stable' : '📉 Declining'}
              icon="📊"
              color={summary.engagementTrend === 'improving' ? '#4caf50' : summary.engagementTrend === 'stable' ? '#ff9800' : '#f44336'}
            />
          </Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Click Rate" value={formatPercentage(summary.avgClickRate)} icon="🖱️" color="#2196f3" /></Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Actionable Insights</Typography>
        <Grid container spacing={2}>
          {mockInsights.map((insight) => (
            <Grid item xs={12} md={6} key={insight.id}>
              <InsightCard insight={insight} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}
