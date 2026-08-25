import React from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip, Avatar, Grid,
} from '@mui/material';
import type {
  Segment, Tag, RecipientProfile, SegmentFilter, SegmentInsight,
  LifecycleMetric, EngagementDistribution,
} from './audienceSegmentTypes';
import {
  SEGMENT_STATUS_COLORS, SEGMENT_TYPE_ICONS, TIER_COLORS, LIFECYCLE_ICONS, LIFECYCLE_COLORS,
  formatNumber, formatRelativeTime, buildFilterLabel,
} from './audienceSegmentTypes';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  color: '#e0e0e0',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)' },
};

// ============================================================================
// StatCard
// ============================================================================

export function StatCard({ label, value, subtitle, icon, color = '#00e5ff' }: {
  label: string; value: string | number; subtitle?: string; icon?: string; color?: string;
}) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2" sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>{label}</Typography>
          {icon && <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
        {subtitle && <Typography variant="caption" sx={{ color: '#777' }}>{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SegmentCard
// ============================================================================

export function SegmentCard({ segment }: { segment: Segment }) {
  const statusColor = SEGMENT_STATUS_COLORS[segment.status];
  const typeIcon = SEGMENT_TYPE_ICONS[segment.type];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Typography sx={{ fontSize: '1.3rem' }}>{typeIcon}</Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{segment.name}</Typography>
              <Typography variant="caption" sx={{ color: '#777' }}>{segment.type} · {segment.filters.length} filters</Typography>
            </Box>
          </Box>
          <Chip label={segment.status} size="small" sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1.5 }}>{segment.description}</Typography>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Size</Typography>
            <Typography variant="caption" sx={{ color: '#00e5ff', fontWeight: 600 }}>{formatNumber(segment.recipientCount)} ({(segment.percentage * 100).toFixed(1)}%)</Typography>
          </Box>
          <LinearProgress variant="determinate" value={segment.percentage * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#00e5ff', borderRadius: 3 } }} />
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(segment.avgOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(segment.avgClickRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Campaigns</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{segment.campaignCount}</Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={0.5} flexWrap="wrap">
          {segment.tags.slice(0, 3).map(tag => (
            <Chip key={tag} label={tag} size="small"
              sx={{ bgcolor: 'rgba(0,229,255,0.1)', color: '#00e5ff', fontSize: '0.6rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TagCard
// ============================================================================

export function TagCard({ tag }: { tag: Tag }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: tag.color, flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', flex: 1 }}>{tag.name}</Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Recipients</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{formatNumber(tag.recipientCount)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Used in</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00e5ff' }}>{tag.usageCount} campaigns</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RecipientProfileCard
// ============================================================================

export function RecipientProfileCard({ recipient }: { recipient: RecipientProfile }) {
  const tierColor = TIER_COLORS[recipient.engagementTier];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Avatar sx={{ bgcolor: tierColor, width: 40, height: 40, fontSize: '0.9rem', fontWeight: 700 }}>
            {recipient.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{recipient.name}</Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{recipient.email}</Typography>
          </Box>
          <Chip label={recipient.engagementTier} size="small" sx={{ bgcolor: tierColor, color: '#000', fontWeight: 600, fontSize: '0.6rem' }} />
        </Box>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Engagement</Typography>
            <Typography variant="caption" sx={{ color: tierColor, fontWeight: 600 }}>{recipient.engagementScore}/100</Typography>
          </Box>
          <LinearProgress variant="determinate" value={recipient.engagementScore}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: tierColor, borderRadius: 3 } }} />
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Opens</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(recipient.openRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Clicks</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(recipient.clickRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Revenue</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffd700' }}>${recipient.revenue}</Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={0.5} flexWrap="wrap">
          <Chip label={recipient.lifecycleStage} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: '0.6rem' }} />
          <Chip label={recipient.device} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: '0.6rem' }} />
          {recipient.tags.slice(0, 2).map(t => (
            <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(0,229,255,0.1)', color: '#00e5ff', fontSize: '0.6rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FilterPreviewCard
// ============================================================================

export function FilterPreviewCard({ segment }: { segment: Segment }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>{segment.name}</Typography>
        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.3)', mb: 1 }}>
          {segment.filters.map((filter, i) => (
            <Box key={filter.id} display="flex" alignItems="center" gap={1} mb={0.5}>
              {i > 0 && <Chip label={filter.conjunction} size="small" sx={{ bgcolor: '#00e5ff', color: '#000', fontSize: '0.55rem', fontWeight: 700, height: 18 }} />}
              <Typography variant="caption" sx={{ color: '#00e5ff', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                {buildFilterLabel(filter)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: '#555' }}>{formatNumber(segment.recipientCount)} recipients match</Typography>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// InsightCard
// ============================================================================

export function InsightCard({ insight }: { insight: SegmentInsight }) {
  const typeConfig: Record<string, { color: string; icon: string }> = {
    success: { color: '#4caf50', icon: '✅' },
    warning: { color: '#ff9800', icon: '⚠️' },
    tip: { color: '#00e5ff', icon: '💡' },
    info: { color: '#9c27b0', icon: 'ℹ️' },
  };
  const config = typeConfig[insight.type];
  return (
    <Card sx={{ ...glassCard, borderLeft: `3px solid ${config.color}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography sx={{ fontSize: '1.2rem' }}>{config.icon}</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', flex: 1 }}>{insight.title}</Typography>
          {insight.actionable && <Chip label="Actionable" size="small" sx={{ bgcolor: 'rgba(0,229,255,0.15)', color: '#00e5ff', fontSize: '0.6rem' }} />}
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1 }}>{insight.description}</Typography>
        {insight.metric && (
          <Box display="flex" gap={2}>
            <Typography variant="caption" sx={{ color: '#777' }}>{insight.metric}:</Typography>
            <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>{insight.value}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LifecycleCard
// ============================================================================

export function LifecycleCard({ metric }: { metric: LifecycleMetric }) {
  const icon = LIFECYCLE_ICONS[metric.stage];
  const color = LIFECYCLE_COLORS[metric.stage];
  const trendIcon = metric.trend === 'up' ? '📈' : metric.trend === 'down' ? '📉' : '➡️';
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{metric.stage}</Typography>
            <Typography variant="caption" sx={{ color: trendIcon === '📈' ? '#4caf50' : trendIcon === '📉' ? '#f44336' : '#888' }}>{trendIcon} {metric.trend}</Typography>
          </Box>
        </Box>
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Count</Typography>
            <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>{formatNumber(metric.count)} ({(metric.percentage * 100).toFixed(1)}%)</Typography>
          </Box>
          <LinearProgress variant="determinate" value={metric.percentage * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Avg Engagement</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00e5ff' }}>{metric.avgEngagement}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Avg Revenue</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffd700' }}>${metric.avgRevenue}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EngagementTierCard
// ============================================================================

export function EngagementTierCard({ dist }: { dist: EngagementDistribution }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: dist.color, flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', flex: 1, textTransform: 'capitalize' }}>{dist.tier}</Typography>
          <Typography variant="caption" sx={{ color: dist.color, fontWeight: 600 }}>{formatNumber(dist.count)} ({(dist.percentage * 100).toFixed(1)}%)</Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(dist.avgOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(dist.avgClickRate * 100).toFixed(0)}%</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
