import React from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip, Grid, Avatar,
} from '@mui/material';
import type {
  DomainHealth, BlacklistEntry, BounceEvent, AuthenticationRecord,
  DeliverabilityAlert, IPWarmupConfig,
} from './deliverabilityMonitorTypes';
import {
  REPUTATION_COLORS, AUTH_STATUS_COLORS, BOUNCE_CATEGORY_COLORS,
  SEVERITY_COLORS, SEVERITY_ICONS, formatNumber, formatRelativeTime,
} from './deliverabilityMonitorTypes';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  color: '#e0e0e0',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)' },
};

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

export function DomainHealthCard({ domain }: { domain: DomainHealth }) {
  const repColor = REPUTATION_COLORS[domain.reputationLevel];
  const trendIcon = domain.trend === 'improving' ? '📈' : domain.trend === 'stable' ? '➡️' : '📉';
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: repColor, width: 36, height: 36, fontSize: '0.75rem', fontWeight: 700 }}>
              {domain.senderScore}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{domain.domain}</Typography>
              <Typography variant="caption" sx={{ color: trendIcon === '📈' ? '#4caf50' : trendIcon === '📉' ? '#f44336' : '#888' }}>
                {trendIcon} {domain.trend}
              </Typography>
            </Box>
          </Box>
          <Chip label={domain.reputationLevel} size="small" sx={{ bgcolor: repColor, color: '#fff', fontWeight: 600, fontSize: '0.6rem' }} />
        </Box>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Sender Score</Typography>
            <Typography variant="caption" sx={{ color: repColor, fontWeight: 600 }}>{domain.senderScore}/100</Typography>
          </Box>
          <LinearProgress variant="determinate" value={domain.senderScore}
            sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: repColor, borderRadius: 4 } }} />
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Inbox</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(domain.inboxRate * 100).toFixed(0)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Bounce</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: domain.bounceRate > 0.03 ? '#f44336' : '#ff9800' }}>{(domain.bounceRate * 100).toFixed(1)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Spam</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: domain.spamComplaintRate > 0.001 ? '#f44336' : '#4caf50' }}>{(domain.spamComplaintRate * 100).toFixed(2)}%</Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={0.5}>
          <Chip label={`SPF: ${domain.spfStatus}`} size="small" sx={{ bgcolor: AUTH_STATUS_COLORS[domain.spfStatus], color: '#fff', fontSize: '0.55rem' }} />
          <Chip label={`DKIM: ${domain.dkimStatus}`} size="small" sx={{ bgcolor: AUTH_STATUS_COLORS[domain.dkimStatus], color: '#fff', fontSize: '0.55rem' }} />
          <Chip label={`DMARC: ${domain.dmarcStatus}`} size="small" sx={{ bgcolor: AUTH_STATUS_COLORS[domain.dmarcStatus], color: '#fff', fontSize: '0.55rem' }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function BlacklistCard({ entry }: { entry: BlacklistEntry }) {
  const statusColors = { clean: '#4caf50', listed: '#f44336', monitoring: '#ff9800', delisted: '#2196f3' };
  const statusIcons = { clean: '✅', listed: '🚨', monitoring: '👁️', delisted: '🔓' };
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{entry.blacklistName}</Typography>
          <Chip label={`${statusIcons[entry.status]} ${entry.status}`} size="small"
            sx={{ bgcolor: statusColors[entry.status], color: '#fff', fontSize: '0.6rem', fontWeight: 600 }} />
        </Box>
        {entry.reason && <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1 }}>{entry.reason}</Typography>}
        {entry.affectedDomains.length > 0 && (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {entry.affectedDomains.map(d => (
              <Chip key={d} label={d} size="small" sx={{ bgcolor: 'rgba(244,67,54,0.15)', color: '#f44336', fontSize: '0.55rem' }} />
            ))}
          </Box>
        )}
        <Typography variant="caption" sx={{ color: '#555', display: 'block', mt: 1 }}>Checked {formatRelativeTime(entry.lastCheckedAt)}</Typography>
      </CardContent>
    </Card>
  );
}

export function BounceEventCard({ event }: { event: BounceEvent }) {
  const catColor = BOUNCE_CATEGORY_COLORS[event.category];
  return (
    <Card sx={glassCard}>
      <CardContent sx={{ py: '10px !important' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: catColor, width: 32, height: 32, fontSize: '0.7rem', fontWeight: 700 }}>
            {event.errorCode}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{event.email}</Typography>
            <Typography variant="caption" sx={{ color: '#777' }}>{event.errorMessage}</Typography>
          </Box>
          <Box textAlign="right">
            <Chip label={event.category} size="small" sx={{ bgcolor: catColor, color: '#fff', fontSize: '0.55rem' }} />
            <Typography variant="caption" sx={{ color: '#555', display: 'block', mt: 0.5 }}>{formatRelativeTime(event.timestamp)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function AuthRecordCard({ record }: { record: AuthenticationRecord }) {
  const allPass = record.spf.status === 'pass' && record.dkim.status === 'pass' && record.dmarc.status === 'pass';
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{record.domain}</Typography>
          <Chip label={allPass ? 'All Pass' : 'Issues Found'} size="small"
            sx={{ bgcolor: allPass ? '#4caf50' : '#ff9800', color: '#fff', fontSize: '0.6rem' }} />
        </Box>
        {(['spf', 'dkim', 'dmarc'] as const).map(auth => {
          const cfg = record[auth];
          return (
            <Box key={auth} display="flex" alignItems="center" gap={1} mb={0.5}>
              <Chip label={auth.toUpperCase()} size="small" sx={{ bgcolor: AUTH_STATUS_COLORS[cfg.status], color: '#fff', fontSize: '0.55rem', width: 55 }} />
              <Typography variant="caption" sx={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.65rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {auth === 'dmarc' ? `p=${record.dmarc.policy}` : cfg.record || cfg.selector || '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#555' }}>{formatRelativeTime(cfg.lastVerified)}</Typography>
            </Box>
          );
        })}
        <Box display="flex" gap={1} mt={1}>
          <Chip label={`MX: ${record.mxValid ? '✅' : '❌'}`} size="small"
            sx={{ bgcolor: record.mxValid ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)', color: record.mxValid ? '#4caf50' : '#f44336', fontSize: '0.55rem' }} />
          <Chip label={`rDNS: ${record.reverseDns ? '✅' : '❌'}`} size="small"
            sx={{ bgcolor: record.reverseDns ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)', color: record.reverseDns ? '#4caf50' : '#f44336', fontSize: '0.55rem' }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export function AlertCard({ alert }: { alert: DeliverabilityAlert }) {
  const sevColor = SEVERITY_COLORS[alert.severity];
  const sevIcon = SEVERITY_ICONS[alert.severity];
  return (
    <Card sx={{ ...glassCard, borderLeft: `3px solid ${sevColor}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography sx={{ fontSize: '1.2rem' }}>{sevIcon}</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', flex: 1 }}>{alert.title}</Typography>
          <Chip label={alert.severity} size="small" sx={{ bgcolor: sevColor, color: '#fff', fontSize: '0.55rem' }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1 }}>{alert.description}</Typography>
        <Box display="flex" gap={2}>
          {alert.metric && <Typography variant="caption" sx={{ color: '#777' }}>{alert.metric}: <span style={{ color: sevColor, fontWeight: 600 }}>{alert.value}</span></Typography>}
          {alert.threshold && <Typography variant="caption" sx={{ color: '#555' }}>Threshold: {alert.threshold}</Typography>}
        </Box>
        <Typography variant="caption" sx={{ color: '#444', display: 'block', mt: 1 }}>{formatRelativeTime(alert.createdAt)}</Typography>
      </CardContent>
    </Card>
  );
}

export function IPWarmupCard({ config }: { config: IPWarmupConfig }) {
  const progress = (config.warmupDay / config.totalDays) * 100;
  const volProgress = (config.currentVolume / config.targetVolume) * 100;
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>{config.ipAddress}</Typography>
          <Chip label={config.status} size="small" sx={{
            bgcolor: config.status === 'warming' ? '#ff9800' : config.status === 'completed' ? '#4caf50' : '#9e9e9e',
            color: '#fff', fontSize: '0.6rem',
          }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>{config.domain}</Typography>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Warmup Day</Typography>
            <Typography variant="caption" sx={{ color: '#00e5ff' }}>{config.warmupDay}/{config.totalDays}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#00e5ff', borderRadius: 3 } }} />
        </Box>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" sx={{ color: '#777' }}>Volume</Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>{formatNumber(config.currentVolume)} / {formatNumber(config.targetVolume)}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={volProgress}
            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50', borderRadius: 3 } }} />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Reputation</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: config.reputation >= 80 ? '#4caf50' : '#ff9800' }}>{config.reputation}/100</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#999' }}>Target</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{formatNumber(config.targetVolume)}/day</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
