import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Divider, Grid,
} from '@mui/material';
import {
  mockDomainHealth, mockBlacklists, mockBounceEvents, mockReputationTimeline,
  mockAuthRecords, mockIPWarmup, mockAlerts, mockBounceTrends,
  mockDomainComparison, mockDeliverabilitySummary,
} from './deliverabilityMonitorService';
import {
  StatCard, DomainHealthCard, BlacklistCard, BounceEventCard,
  AuthRecordCard, AlertCard, IPWarmupCard,
} from './DeliverabilityMonitorCards';
import {
  ReputationTrend, BounceTrendBar, DomainComparisonBar, WarmupLine, DonutChart,
} from './DeliverabilityMonitorCharts';
import { SEVERITY_COLORS } from './deliverabilityMonitorTypes';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

export default function DeliverabilityMonitorDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const summary = mockDeliverabilitySummary;

  const alertDonut = ['critical', 'warning', 'info', 'resolved'].map(sev => ({
    label: sev, value: mockAlerts.filter(a => a.severity === sev).length,
    color: SEVERITY_COLORS[sev],
  }));

  const blacklistDonut = ['clean', 'listed', 'monitoring'].map(status => ({
    label: status, value: mockBlacklists.filter(b => b.status === status).length,
    color: { clean: '#4caf50', listed: '#f44336', monitoring: '#ff9800' }[status],
  }));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #17171d 100%)' }}>
      <Typography variant="h3" sx={{
        color: '#fff', fontWeight: 800, mb: 1,
        textShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
      }}>
        🛡️ Deliverability Monitor
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        Real-time domain health, blacklist tracking, bounce analysis, and email authentication monitoring
      </Typography>

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
        <Tab label="🌐 Domains" />
        <Tab label="🚨 Blacklists" />
        <Tab label="📮 Bounces" />
        <Tab label="🔐 Authentication" />
        <Tab label="🔥 IP Warmup" />
      </Tabs>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ===== OVERVIEW TAB ===== */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="Avg Sender Score" value={String(summary.avgSenderScore)} icon="🏆" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Inbox Rate" value={`${(summary.avgInboxRate * 100).toFixed(0)}%`} icon="📥" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Active Blacklists" value={String(summary.activeBlacklists)} icon="🚨" color={summary.activeBlacklists > 0 ? '#f44336' : '#4caf50'} /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Healthy Domains" value={`${summary.healthyDomains}/${summary.totalDomains}`} icon="✅" color="#4caf50" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <ReputationTrend data={mockReputationTimeline.slice(-14)} title="30-Day Reputation Trend" />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart title="Alert Summary" segments={alertDonut} centerLabel="Alerts" centerValue={String(mockAlerts.length)} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <DomainComparisonBar data={mockDomainComparison} title="Domain Sender Scores" />
          </Grid>
          <Grid item xs={12} md={6}>
            <DonutChart title="Blacklist Status" segments={blacklistDonut} centerLabel="Lists" centerValue={String(mockBlacklists.length)} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>🚨 Active Alerts</Typography>
        <Grid container spacing={2}>
          {mockAlerts.filter(a => !a.resolvedAt).slice(0, 3).map(alert => (
            <Grid item xs={12} md={4} key={alert.id}>
              <AlertCard alert={alert} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== DOMAINS TAB ===== */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Total Domains" value={String(summary.totalDomains)} icon="🌐" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="30-Day Bounces" value={summary.totalBounces30d.toLocaleString()} icon="📮" color="#ff9800" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="30-Day Complaints" value={String(summary.totalComplaints30d)} icon="⚠️" color="#f44336" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          {mockDomainHealth.map(domain => (
            <Grid item xs={12} md={6} lg={4} key={domain.id}>
              <DomainHealthCard domain={domain} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== BLACKLISTS TAB ===== */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Total Lists Checked" value={String(mockBlacklists.length)} icon="📋" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Listed" value={String(mockBlacklists.filter(b => b.status === 'listed').length)} icon="🚨" color="#f44336" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Monitoring" value={String(mockBlacklists.filter(b => b.status === 'monitoring').length)} icon="👁️" color="#ff9800" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          {mockBlacklists.map(entry => (
            <Grid item xs={12} md={6} key={entry.id}>
              <BlacklistCard entry={entry} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== BOUNCES TAB ===== */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="14-Day Bounces" value={mockBounceTrends.reduce((s, t) => s + t.total, 0).toLocaleString()} icon="📮" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Hard Bounces" value={mockBounceEvents.filter(e => e.category === 'hard').length.toString()} icon="❌" color="#f44336" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Soft Bounces" value={mockBounceEvents.filter(e => e.category === 'soft').length.toString()} icon="⏳" color="#ff9800" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <BounceTrendBar data={mockBounceTrends} title="14-Day Bounce Trend" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Recent Bounce Events</Typography>
        <Grid container spacing={1}>
          {mockBounceEvents.map(event => (
            <Grid item xs={12} md={6} key={event.id}>
              <BounceEventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== AUTHENTICATION TAB ===== */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Auth Pass Rate" value={`${(summary.authPassRate * 100).toFixed(0)}%`} icon="🔐" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="SPF Pass" value={String(mockAuthRecords.filter(r => r.spf.status === 'pass').length)} icon="✅" color="#4caf50" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="DKIM Issues" value={String(mockAuthRecords.filter(r => r.dkim.status !== 'pass').length)} icon="⚠️" color="#ff9800" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          {mockAuthRecords.map(record => (
            <Grid item xs={12} md={6} key={record.domain}>
              <AuthRecordCard record={record} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== IP WARMUP TAB ===== */}
      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Warming IPs" value={String(mockIPWarmup.filter(i => i.status === 'warming').length)} icon="🔥" color="#ff9800" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Reputation" value={String(Math.round(mockIPWarmup.reduce((s, i) => s + i.reputation, 0) / mockIPWarmup.length))} icon="🏆" color="#4caf50" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Total Target" value={`${(mockIPWarmup.reduce((s, i) => s + i.targetVolume, 0) / 1000).toFixed(0)}K/day`} icon="📊" color="#2196f3" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          {mockIPWarmup.map(config => (
            <Grid item xs={12} md={6} key={config.id}>
              <IPWarmupCard config={config} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {mockIPWarmup.map(config => (
            <Grid item xs={12} md={6} key={`chart-${config.id}`}>
              <WarmupLine data={config.dailyVolumes} title={`${config.ipAddress} Volume Progression`} targetVolume={config.targetVolume} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}
