import React from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip, Avatar, Grid, Tooltip,
} from '@mui/material';
import type {
  OptimalTimeSlot, TimezoneDistribution, ScheduledCampaign, RecipientTimePreference,
  BatchScheduleConfig, SendTimeInsight,
} from './sendTimeOptimizerTypes';
import {
  CONFIDENCE_COLORS, SCHEDULE_STATUS_COLORS, MODE_ICONS, ENGAGEMENT_WINDOW_COLORS,
  DAY_LABELS, formatHour, formatRelativeTime,
} from './sendTimeOptimizerTypes';

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
// OptimalSlotCard
// ============================================================================

export function OptimalSlotCard({ slot, rank }: { slot: OptimalTimeSlot; rank: number }) {
  const confColor = CONFIDENCE_COLORS[slot.confidence];
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Typography sx={{ fontSize: '1.5rem' }}>{medals[rank] || '📊'}</Typography>
          <Box flex={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#00e5ff' }}>
              {DAY_LABELS[slot.dayOfWeek]} at {formatHour(slot.hour)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{slot.timezone}</Typography>
          </Box>
          <Chip label={slot.confidence} size="small" sx={{ bgcolor: confColor, color: '#fff', fontWeight: 600, fontSize: '0.6rem' }} />
        </Box>
        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(slot.predictedOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(slot.predictedClickRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Sample</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{(slot.sampleSize / 1000).toFixed(1)}K</Typography>
          </Grid>
        </Grid>
        <Box mb={0.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Confidence</Typography>
            <Typography variant="caption" sx={{ color: confColor }}>{(slot.confidence.replace('-', ' '))}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={slot.predictedOpenRate * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: confColor, borderRadius: 3 } }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TimezoneCard
// ============================================================================

export function TimezoneCard({ tz }: { tz: TimezoneDistribution }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{tz.label}</Typography>
          <Typography variant="caption" sx={{ color: '#555', fontFamily: 'monospace' }}>UTC{tz.utcOffset >= 0 ? '+' : ''}{tz.utcOffset}</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>{tz.timezone}</Typography>
        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Recipients</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{(tz.recipientCount / 1000).toFixed(1)}K</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(tz.avgOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Peak Hour</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00e5ff' }}>{formatHour(tz.peakHour)}</Typography>
          </Grid>
        </Grid>
        <Box mb={0.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Share of Audience</Typography>
            <Typography variant="caption" sx={{ color: '#00e5ff' }}>{(tz.percentage * 100).toFixed(1)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={tz.percentage * 100}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#00e5ff', borderRadius: 3 } }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ScheduledCampaignCard
// ============================================================================

export function ScheduledCampaignCard({ campaign }: { campaign: ScheduledCampaign }) {
  const statusColor = SCHEDULE_STATUS_COLORS[campaign.status];
  const modeIcon = MODE_ICONS[campaign.mode];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Typography sx={{ fontSize: '1.2rem' }}>{modeIcon}</Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{campaign.name}</Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>{campaign.mode} · {campaign.totalRecipients.toLocaleString()} recipients</Typography>
            </Box>
          </Box>
          <Chip label={campaign.status} size="small" sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
        </Box>

        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(0,229,255,0.05)', mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#00e5ff', fontWeight: 600 }}>⏰ {campaign.scheduledTimeLocal}</Typography>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
            Send window: {campaign.estimatedSendWindow} min · Confidence: {campaign.aiConfidence}
          </Typography>
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Predicted Open</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(campaign.predictedOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Predicted Click</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(campaign.predictedClickRate * 100).toFixed(0)}%</Typography>
          </Grid>
        </Grid>

        {campaign.actualOpenRate !== null && (
          <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.2)' }}>
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
              ✅ Actual: {(campaign.actualOpenRate * 100).toFixed(1)}% open · {(campaign.actualClickRate * 100).toFixed(1)}% click
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RecipientPreferenceCard
// ============================================================================

export function RecipientPreferenceCard({ pref }: { pref: RecipientTimePreference }) {
  const windowColor = ENGAGEMENT_WINDOW_COLORS[pref.engagementWindow];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Avatar sx={{ bgcolor: windowColor, width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
            {pref.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{pref.name}</Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{pref.email}</Typography>
          </Box>
          <Chip label={pref.engagementWindow} size="small" sx={{ bgcolor: windowColor, color: '#fff', fontSize: '0.6rem', fontWeight: 600 }} />
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Best Day</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00e5ff' }}>{DAY_LABELS[pref.preferredDay].substring(0, 3)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Best Hour</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{formatHour(pref.preferredHour)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Response</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{pref.avgResponseTimeMinutes}m</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(pref.openRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(pref.clickRate * 100).toFixed(0)}%</Typography>
          </Grid>
        </Grid>

        <Typography variant="caption" sx={{ color: '#555', display: 'block', mt: 1 }}>Last opened {formatRelativeTime(pref.lastOpenedAt)}</Typography>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BatchConfigCard
// ============================================================================

export function BatchConfigCard({ config }: { config: BatchScheduleConfig }) {
  const progress = (config.completedBatches / config.totalBatches) * 100;
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{config.campaignName}</Typography>
          <Chip label={config.status} size="small" sx={{
            bgcolor: config.status === 'completed' ? '#4caf50' : config.status === 'running' ? '#ff9800' : '#9e9e9e',
            color: '#fff', fontSize: '0.6rem',
          }} />
        </Box>
        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Batch Size</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{config.batchSize.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Interval</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#00e5ff' }}>{config.intervalMinutes}m</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Timezone</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#888', fontSize: '0.75rem' }}>{config.timezone.split('/')[1]}</Typography>
          </Grid>
        </Grid>
        <Box mb={0.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Progress</Typography>
            <Typography variant="caption" sx={{ color: '#00e5ff' }}>{config.completedBatches}/{config.totalBatches} batches</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#00e5ff', borderRadius: 4 } }} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// InsightCard
// ============================================================================

export function InsightCard({ insight }: { insight: SendTimeInsight }) {
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
// SendWindowCard
// ============================================================================

export function SendWindowCard({ window: sw }: { window: { name: string; avgOpenRate: number; avgClickRate: number; totalCampaigns: number; color: string } }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: sw.color, flexShrink: 0 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{sw.name}</Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(sw.avgOpenRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(sw.avgClickRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Campaigns</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{sw.totalCampaigns}</Typography>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={sw.avgOpenRate * 100}
          sx={{ mt: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: sw.color, borderRadius: 3 } }} />
      </CardContent>
    </Card>
  );
}
