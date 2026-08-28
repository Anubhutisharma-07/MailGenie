import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Divider, Grid,
} from '@mui/material';
import {
  mockOptimalSlots, mockTimezoneDistribution, mockScheduledCampaigns,
  mockHourlyEngagement, mockDailyEngagement, mockSendWindows,
  mockRecipientPreferences, mockBatchConfigs, mockOverlapMap,
  mockInsights, mockSendTimeSummary,
} from './sendTimeOptimizerService';
import {
  StatCard, OptimalSlotCard, TimezoneCard, ScheduledCampaignCard,
  RecipientPreferenceCard, BatchConfigCard, InsightCard, SendWindowCard,
} from './SendTimeOptimizerCards';
import {
  HourlyBar, DailyBar, OverlapHeatmap, WindowBar, TimezonePie,
} from './SendTimeOptimizerCharts';
import { formatHour, DAY_LABELS } from './sendTimeOptimizerTypes';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

export default function SendTimeOptimizerDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const summary = mockSendTimeSummary;

  const tzPieData = mockTimezoneDistribution.map(tz => ({
    label: tz.label, value: tz.recipientCount,
    color: ['#00e5ff', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#ffd700'][mockTimezoneDistribution.indexOf(tz) % 6],
  }));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #17171d 100%)' }}>
      <Typography variant="h3" sx={{
        color: '#fff', fontWeight: 800, mb: 1,
        textShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
      }}>
        ⏰ Smart Send Time Optimizer
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        AI-powered optimal send time prediction, timezone analysis, and batch scheduling
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
        <Tab label="🎯 Optimal Slots" />
        <Tab label="🌍 Timezones" />
        <Tab label="📅 Scheduled" />
        <Tab label="👤 Recipients" />
        <Tab label="📦 Batch Config" />
        <Tab label="💡 Insights" />
      </Tabs>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ===== OVERVIEW TAB ===== */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="AI Accuracy" value={`${(summary.aiAccuracyRate * 100).toFixed(0)}%`} icon="🤖" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Predicted Open" value={`${(summary.avgPredictedOpenRate * 100).toFixed(0)}%`} icon="👁️" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Best Day & Hour" value={`${DAY_LABELS[summary.bestOptimalDay].substring(0, 3)} ${formatHour(summary.bestOptimalHour)}`} icon="🏆" color="#ffd700" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Recipients Covered" value={`${(summary.totalRecipientsCovered / 1000).toFixed(0)}K`} icon="📧" color="#2196f3" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <HourlyBar data={mockHourlyEngagement} title="24-Hour Engagement Pattern" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TimezonePie data={tzPieData} title="Audience by Timezone" />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <DailyBar data={mockDailyEngagement} title="Day-of-Week Engagement" />
          </Grid>
          <Grid item xs={12} md={6}>
            <WindowBar data={mockSendWindows} title="Send Window Performance" />
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== OPTIMAL SLOTS TAB ===== */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          AI-predicted best send times ranked by predicted open rate and confidence
        </Typography>
        <Grid container spacing={2}>
          {mockOptimalSlots.map((slot, i) => (
            <Grid item xs={12} md={6} lg={4} key={`${slot.dayOfWeek}-${slot.hour}`}>
              <OptimalSlotCard slot={slot} rank={i} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== TIMEZONES TAB ===== */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <StatCard label="Timezone Count" value={String(summary.timezoneCount)} icon="🌍" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Best Global Window" value="3 PM UTC" icon="⏰" color="#4caf50" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Avg Send Window" value={`${summary.avgSendWindowMinutes} min`} icon="📦" color="#ff9800" />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <OverlapHeatmap data={mockOverlapMap} title="Global Timezone Overlap (UTC Hours)" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TimezonePie data={tzPieData} title="Audience Distribution" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Timezone Details</Typography>
        <Grid container spacing={2}>
          {mockTimezoneDistribution.map(tz => (
            <Grid item xs={12} md={6} lg={4} key={tz.timezone}>
              <TimezoneCard tz={tz} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== SCHEDULED TAB ===== */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Scheduled" value={String(summary.totalScheduled)} icon="📅" color="#2196f3" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Sent" value={String(summary.totalSent)} icon="✅" color="#4caf50" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Send Window" value={`${summary.avgSendWindowMinutes} min`} icon="⏱️" color="#ff9800" /></Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>All Campaigns</Typography>
        <Grid container spacing={2}>
          {mockScheduledCampaigns.map(campaign => (
            <Grid item xs={12} md={6} key={campaign.id}>
              <ScheduledCampaignCard campaign={campaign} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== RECIPIENTS TAB ===== */}
      <TabPanel value={activeTab} index={4}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          Individual recipient time preferences based on their engagement history
        </Typography>
        <Grid container spacing={2}>
          {mockRecipientPreferences.map(pref => (
            <Grid item xs={12} md={6} lg={4} key={pref.id}>
              <RecipientPreferenceCard pref={pref} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== BATCH CONFIG TAB ===== */}
      <TabPanel value={activeTab} index={5}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          Batch send configurations for throttled delivery and improved deliverability
        </Typography>
        <Grid container spacing={2}>
          {mockBatchConfigs.map(config => (
            <Grid item xs={12} md={6} key={config.id}>
              <BatchConfigCard config={config} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== INSIGHTS TAB ===== */}
      <TabPanel value={activeTab} index={6}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <StatCard label="AI Accuracy" value={`${(summary.aiAccuracyRate * 100).toFixed(0)}%`} icon="🤖" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Best Day" value={DAY_LABELS[summary.bestOptimalDay]} icon="📅" color="#4caf50" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard label="Best Hour" value={formatHour(summary.bestOptimalHour)} icon="⏰" color="#00e5ff" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>AI-Generated Insights</Typography>
        <Grid container spacing={2}>
          {mockInsights.map(insight => (
            <Grid item xs={12} md={6} key={insight.id}>
              <InsightCard insight={insight} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}
