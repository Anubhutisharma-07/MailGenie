import React from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip, Divider, Avatar, Tooltip, Grid,
} from '@mui/material';
import type {
  Campaign, ABTest, DeliverabilityMetric, LinkClick, RecipientEngagement,
  CampaignInsight, DeviceBreakdown, TopCampaign,
} from './campaignAnalyticsTypes';
import {
  formatPercentage, formatNumber, formatCurrency,
  CAMPAIGN_STATUS_COLORS, ENGAGEMENT_COLORS, DEVICE_ICONS,
} from './campaignAnalyticsTypes';

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
          <Typography variant="subtitle2" sx={{ color: '#999', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
            {label}
          </Typography>
          {icon && <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
        {subtitle && <Typography variant="caption" sx={{ color: '#777' }}>{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CampaignCard
// ============================================================================

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusColor = CAMPAIGN_STATUS_COLORS[campaign.status];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', flex: 1, mr: 1 }}>
            {campaign.name}
          </Typography>
          <Chip label={campaign.status} size="small" sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1.5 }}>
          {campaign.subject}
        </Typography>

        <Grid container spacing={1} mb={1.5}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{formatPercentage(campaign.openRate)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{formatPercentage(campaign.clickRate)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Bounce</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{formatPercentage(campaign.bounceRate)}</Typography>
          </Grid>
        </Grid>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Delivery</Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{formatNumber(campaign.deliveredCount)} / {formatNumber(campaign.totalRecipients)}</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={campaign.totalRecipients > 0 ? (campaign.deliveredCount / campaign.totalRecipients) * 100 : 0}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50', borderRadius: 3 } }}
          />
        </Box>

        {campaign.revenue > 0 && (
          <Typography variant="caption" sx={{ color: '#ffd700' }}>💰 Revenue: {formatCurrency(campaign.revenue)}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ABTestCard
// ============================================================================

export function ABTestCard({ test }: { test: ABTest }) {
  const aWins = test.winner === 'A';
  const bWins = test.winner === 'B';
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{test.campaignName}</Typography>
          <Chip
            label={test.status === 'running' ? '🔴 Running' : test.winner ? `Winner: ${test.winner}` : 'Completed'}
            size="small" sx={{ bgcolor: test.status === 'running' ? '#ff5722' : '#4caf50', color: '#fff', fontSize: '0.65rem' }}
          />
        </Box>

        <Grid container spacing={2} mb={1}>
          {(['A', 'B'] as const).map((variant) => {
            const v = variant === 'A' ? test.variantA : test.variantB;
            const isWinner = test.winner === variant;
            return (
              <Grid item xs={6} key={variant}>
                <Box sx={{
                  p: 1.5, borderRadius: '12px',
                  border: isWinner ? '2px solid #4caf50' : '1px solid rgba(255,255,255,0.1)',
                  bgcolor: isWinner ? 'rgba(76, 175, 80, 0.08)' : 'rgba(255,255,255,0.03)',
                }}>
                  <Typography variant="caption" sx={{ color: isWinner ? '#4caf50' : '#999', fontWeight: 600 }}>
                    Variant {variant} {isWinner && '🏆'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.75rem', mt: 0.5, mb: 1 }}>
                    "{v.subject.substring(0, 35)}..."
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Opens: <span style={{ color: '#4caf50', fontWeight: 600 }}>{formatPercentage(v.openRate)}</span> ·
                    Clicks: <span style={{ color: '#2196f3', fontWeight: 600 }}>{formatPercentage(v.clickRate)}</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                    n = {formatNumber(v.sampleSize)} · Conv: {formatPercentage(v.conversionRate)}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" sx={{ color: '#888' }}>Confidence:</Typography>
          <LinearProgress
            variant="determinate"
            value={test.confidenceLevel * 100}
            sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { bgcolor: test.confidenceLevel >= 0.95 ? '#4caf50' : '#ff9800', borderRadius: 3 } }}
          />
          <Typography variant="caption" sx={{ color: test.confidenceLevel >= 0.95 ? '#4caf50' : '#ff9800', fontWeight: 600 }}>
            {formatPercentage(test.confidenceLevel)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DeliverabilityCard
// ============================================================================

export function DeliverabilityCard({ metric }: { metric: DeliverabilityMetric }) {
  const scoreColor = metric.senderScore >= 90 ? '#4caf50' : metric.senderScore >= 70 ? '#ff9800' : '#f44336';
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{metric.campaignName}</Typography>
          <Chip label={`Score: ${metric.senderScore}`} size="small" sx={{ bgcolor: scoreColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
        </Box>

        <Grid container spacing={1} mb={1.5}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Inbox Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{formatPercentage(metric.inboxRate)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Spam Folder</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{formatPercentage(metric.spamFolderRate)}</Typography>
          </Grid>
        </Grid>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Reputation</Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{metric.reputationScore}/100</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={metric.reputationScore}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 3 } }}
          />
        </Box>

        {metric.issues.length > 0 && (
          <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
            {metric.issues.map((issue) => (
              <Chip key={issue} label={issue} size="small"
                sx={{ bgcolor: 'rgba(255, 87, 34, 0.15)', color: '#ff5722', fontSize: '0.6rem' }} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LinkClickCard
// ============================================================================

export function LinkClickCard({ link }: { link: LinkClick }) {
  const categoryColors: Record<string, string> = {
    cta: '#4caf50', image: '#2196f3', text: '#9e9e9e', social: '#9c27b0', unsubscribe: '#ff5722', other: '#607d8b',
  };
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', flex: 1, mr: 1 }}>{link.label}</Typography>
          <Chip label={link.category} size="small" sx={{ bgcolor: categoryColors[link.category] || '#607d8b', color: '#fff', fontSize: '0.6rem' }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1, wordBreak: 'break-all' }}>{link.url}</Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Total Clicks</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{formatNumber(link.totalClicks)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Unique</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{formatNumber(link.uniqueClicks)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>CTR</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{formatPercentage(link.clickRate)}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EngagementCard
// ============================================================================

export function EngagementCard({ recipient }: { recipient: RecipientEngagement }) {
  const levelColor = ENGAGEMENT_COLORS[recipient.engagementLevel];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Avatar sx={{ bgcolor: levelColor, width: 40, height: 40, fontSize: '0.9rem', fontWeight: 700 }}>
            {recipient.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{recipient.name}</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>{recipient.email}</Typography>
          </Box>
          <Chip label={recipient.engagementLevel} size="small" sx={{ bgcolor: levelColor, color: '#fff', fontWeight: 600, fontSize: '0.6rem' }} />
        </Box>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Engagement Score</Typography>
            <Typography variant="caption" sx={{ color: levelColor, fontWeight: 600 }}>{recipient.engagementScore}/100</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={recipient.engagementScore}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { bgcolor: levelColor, borderRadius: 3 } }}
          />
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Received</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{recipient.totalEmailsReceived}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Opened</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{recipient.totalOpened}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Clicked</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{recipient.totalClicked}</Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={0.5} flexWrap="wrap">
          <Chip icon={<span>{DEVICE_ICONS[recipient.preferredDevice]}</span>} label={recipient.preferredDevice} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: '0.6rem' }} />
          {recipient.tags.map(tag => (
            <Chip key={tag} label={tag} size="small"
              sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', fontSize: '0.6rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DeviceCard
// ============================================================================

export function DeviceCard({ devices }: { devices: DeviceBreakdown[] }) {
  const colors = ['#00e5ff', '#4caf50', '#ff9800', '#9c27b0'];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>Device Breakdown</Typography>
        {devices.map((d, i) => (
          <Box key={d.device} mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#ccc' }}>{DEVICE_ICONS[d.device]} {d.device}</Typography>
              <Typography variant="caption" sx={{ color: colors[i], fontWeight: 600 }}>{formatPercentage(d.percentage)} ({formatNumber(d.count)})</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={d.percentage * 100}
              sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': { bgcolor: colors[i], borderRadius: 4 } }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// InsightCard
// ============================================================================

export function InsightCard({ insight }: { insight: CampaignInsight }) {
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
          {insight.actionable && <Chip label="Actionable" size="small" sx={{ bgcolor: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', fontSize: '0.6rem' }} />}
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
// TopCampaignCard
// ============================================================================

export function TopCampaignCard({ campaign, rank }: { campaign: TopCampaign; rank: number }) {
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Typography sx={{ fontSize: '1.5rem' }}>{medals[rank] || '📊'}</Typography>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{campaign.name}</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>{campaign.subject}</Typography>
          </Box>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Opens</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{formatPercentage(campaign.openRate)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Clicks</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{formatPercentage(campaign.clickRate)}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Sent</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{formatNumber(campaign.sentCount)}</Typography>
          </Grid>
        </Grid>
        {campaign.revenue > 0 && (
          <Typography variant="caption" sx={{ color: '#ffd700', display: 'block', mt: 1 }}>💰 {formatCurrency(campaign.revenue)}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
