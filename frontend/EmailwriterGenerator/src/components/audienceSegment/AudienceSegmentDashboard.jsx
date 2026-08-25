import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, TextField, InputAdornment, Chip, Divider, Grid,
} from '@mui/material';
import {
  mockSegments, mockTags, mockRecipients, mockOverlaps, mockLifecycle,
  mockEngagementDist, mockPerformance, mockInsights, mockSegmentSummary,
} from './audienceSegmentService';
import {
  StatCard, SegmentCard, TagCard, RecipientProfileCard, FilterPreviewCard,
  InsightCard, LifecycleCard, EngagementTierCard,
} from './AudienceSegmentCards';
import {
  DonutChart, HorizontalBar, OverlapMatrix, LifecycleFunnel, TierBar,
} from './AudienceSegmentCharts';
import { formatNumber, TIER_COLORS, LIFECYCLE_COLORS } from './audienceSegmentTypes';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

export default function AudienceSegmentDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const summary = mockSegmentSummary;

  const filteredSegments = mockSegments.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchType;
  });

  // Engagement donut data
  const engagementDonut = mockEngagementDist.map(d => ({
    label: d.tier, value: d.count, color: d.color,
  }));

  // Segment size bar data
  const segmentSizeData = mockSegments.map(s => ({
    label: s.name.substring(0, 15), value: s.recipientCount,
    color: '#00e5ff',
  }));

  // Lifecycle funnel data
  const lifecycleData = mockLifecycle.map(l => ({
    stage: l.stage, count: l.count, percentage: l.percentage, color: LIFECYCLE_COLORS[l.stage],
  }));

  // Performance bar data
  const perfBarData = mockPerformance.map(p => ({
    label: p.segmentName.substring(0, 15), value: p.avgOpenRate * 100, color: p.trend === 'improving' ? '#4caf50' : p.trend === 'stable' ? '#2196f3' : '#f44336',
  }));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #17171d 100%)' }}>
      <Typography variant="h3" sx={{
        color: '#fff', fontWeight: 800, mb: 1,
        textShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
      }}>
        🎯 Audience Segmentation
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        Behavioral filtering, dynamic lists, lifecycle tracking, and engagement scoring
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
        <Tab label="🎯 Segments" />
        <Tab label="🏷️ Tags & Recipients" />
        <Tab label="🔄 Lifecycle" />
        <Tab label="🔀 Overlaps" />
        <Tab label="💡 Insights" />
      </Tabs>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ===== OVERVIEW TAB ===== */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="Total Segments" value={summary.totalSegments} icon="🎯" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Total Recipients" value={formatNumber(summary.totalRecipients)} icon="📧" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Total Tagged" value={formatNumber(summary.totalTagged)} icon="🏷️" color="#2196f3" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Engagement" value={String(summary.avgEngagementScore)} icon="⭐" color="#ffd700" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <DonutChart title="Engagement Tiers" segments={engagementDonut} centerLabel="Recipients" centerValue={formatNumber(summary.totalRecipients)} />
          </Grid>
          <Grid item xs={12} md={8}>
            <HorizontalBar title="Segment Sizes" data={segmentSizeData} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <LifecycleFunnel title="Lifecycle Stages" data={lifecycleData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TierBar title="Engagement Tier Details" data={mockEngagementDist} />
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== SEGMENTS TAB ===== */}
      <TabPanel value={activeTab} index={1}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            size="small" placeholder="Search segments..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#00e5ff' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
          />
          {['all', 'dynamic', 'static', 'behavioral', 'predictive'].map(type => (
            <Chip key={type} label={type} onClick={() => setTypeFilter(type)}
              sx={{
                bgcolor: typeFilter === type ? '#00e5ff' : 'rgba(255,255,255,0.06)',
                color: typeFilter === type ? '#000' : '#aaa',
                fontWeight: 600, cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        <Grid container spacing={2} mb={3}>
          {filteredSegments.map(segment => (
            <Grid item xs={12} md={6} lg={4} key={segment.id}>
              <SegmentCard segment={segment} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>🔍 Filter Previews</Typography>
        <Grid container spacing={2}>
          {filteredSegments.slice(0, 4).map(segment => (
            <Grid item xs={12} md={6} key={segment.id}>
              <FilterPreviewCard segment={segment} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== TAGS & RECIPIENTS TAB ===== */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>🏷️ Tags</Typography>
        <Grid container spacing={2} mb={3}>
          {mockTags.map(tag => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
              <TagCard tag={tag} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>👤 Recipient Profiles</Typography>
        <Grid container spacing={2}>
          {mockRecipients.map(recipient => (
            <Grid item xs={12} md={6} lg={4} key={recipient.id}>
              <RecipientProfileCard recipient={recipient} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== LIFECYCLE TAB ===== */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Active Users" value={formatNumber(24200)} icon="⚡" color="#4caf50" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Evangelists" value={formatNumber(6400)} icon="🌟" color="#ffd700" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Churned" value={formatNumber(7600)} icon="💤" color="#f44336" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <LifecycleFunnel title="Lifecycle Distribution" data={lifecycleData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TierBar title="Engagement Tier Breakdown" data={mockEngagementDist} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Stage Details</Typography>
        <Grid container spacing={2}>
          {mockLifecycle.map(metric => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={metric.stage}>
              <LifecycleCard metric={metric} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== OVERLAPS TAB ===== */}
      <TabPanel value={activeTab} index={4}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          Visualize how segments overlap to identify consolidation opportunities and cross-segment patterns
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <OverlapMatrix data={mockOverlaps} title="Segment Overlap Matrix" />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Segment Performance Comparison</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <HorizontalBar title="Avg Open Rate by Segment" data={perfBarData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DonutChart
              title="Engagement Tier Distribution"
              segments={engagementDonut}
              centerLabel="Tiers"
              centerValue={String(mockEngagementDist.length)}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== INSIGHTS TAB ===== */}
      <TabPanel value={activeTab} index={5}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Best Segment" value="VIP Evangelists" icon="🏆" color="#ffd700" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Largest Segment" value="Mobile-First" icon="📱" color="#2196f3" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Segment Size" value={formatNumber(summary.avgSegmentSize)} icon="📊" color="#4caf50" /></Grid>
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
