import React from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip, Avatar, Divider, Rating, Grid,
} from '@mui/material';
import type {
  Template, TemplateVersion, ComponentLibraryItem, SavedStyle, ABTestConfig,
} from './templateBuilderTypes';
import {
  TEMPLATE_STATUS_COLORS, TEMPLATE_CATEGORY_ICONS, BLOCK_TYPE_ICONS, DIFFICULTY_COLORS,
  formatDate, formatRelativeTime,
} from './templateBuilderTypes';

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
// TemplateCard
// ============================================================================

export function TemplateCard({ template }: { template: Template }) {
  const statusColor = TEMPLATE_STATUS_COLORS[template.status];
  const categoryIcon = TEMPLATE_CATEGORY_ICONS[template.category];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Typography sx={{ fontSize: '1.3rem' }}>{categoryIcon}</Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>{template.name}</Typography>
              <Typography variant="caption" sx={{ color: '#777' }}>v{template.version} · {template.blocks.length} blocks</Typography>
            </Box>
          </Box>
          <Chip label={template.status} size="small" sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1.5 }}>{template.description}</Typography>

        <Box mb={1}>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5, fontFamily: 'monospace', fontSize: '0.7rem' }}>
            Subject: "{template.subject}"
          </Typography>
        </Box>

        <Grid container spacing={1} mb={1}>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Sends</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>{template.usageCount}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Open Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{(template.avgOpenRate * 100).toFixed(1)}%</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" sx={{ color: '#999' }}>Click Rate</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196f3' }}>{(template.avgClickRate * 100).toFixed(1)}%</Typography>
          </Grid>
        </Grid>

        <Box display="flex" gap={0.5} flexWrap="wrap">
          {template.tags.slice(0, 3).map(tag => (
            <Chip key={tag} label={tag} size="small"
              sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', fontSize: '0.6rem' }} />
          ))}
        </Box>
        <Typography variant="caption" sx={{ color: '#555', display: 'block', mt: 1 }}>Updated {formatRelativeTime(template.updatedAt)}</Typography>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ComponentCard
// ============================================================================

export function ComponentCard({ item }: { item: ComponentLibraryItem }) {
  const difficultyColor = DIFFICULTY_COLORS[item.difficulty];
  const typeIcon = BLOCK_TYPE_ICONS[item.category];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
              {typeIcon}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>{item.name}</Typography>
              <Typography variant="caption" sx={{ color: '#777' }}>{item.category}</Typography>
            </Box>
          </Box>
          <Chip label={item.difficulty} size="small" sx={{ bgcolor: difficultyColor, color: '#fff', fontSize: '0.6rem', fontWeight: 600 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem', mb: 1 }}>{item.description}</Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Rating value={item.rating} precision={0.1} readOnly size="small" sx={{ color: '#ffd700' }} />
          <Typography variant="caption" sx={{ color: '#888' }}>{item.rating}</Typography>
          <Typography variant="caption" sx={{ color: '#555', ml: 'auto' }}>{item.usageCount} uses</Typography>
        </Box>

        <Box display="flex" gap={0.5} flexWrap="wrap">
          {item.tags.slice(0, 3).map(tag => (
            <Chip key={tag} label={tag} size="small"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', color: '#aaa', fontSize: '0.6rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// VersionCard
// ============================================================================

export function VersionCard({ version }: { version: TemplateVersion }) {
  const actionColors: Record<string, string> = {
    created: '#4caf50', edited: '#ff9800', published: '#2196f3', archived: '#9e9e9e', duplicated: '#9c27b0',
  };
  const actionIcons: Record<string, string> = {
    created: '✨', edited: '✏️', published: '🚀', archived: '📦', duplicated: '📋',
  };
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Avatar sx={{ bgcolor: actionColors[version.action], width: 36, height: 36, fontSize: '0.9rem' }}>
            {actionIcons[version.action]}
          </Avatar>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>v{version.versionNumber}</Typography>
              <Chip label={version.action} size="small" sx={{ bgcolor: actionColors[version.action], color: '#fff', fontSize: '0.6rem' }} />
            </Box>
            <Typography variant="caption" sx={{ color: '#777' }}>{version.changedBy} · {formatRelativeTime(version.createdAt)}</Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#aaa', fontSize: '0.8rem' }}>{version.changeNote}</Typography>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// StyleCard
// ============================================================================

export function StyleCard({ style }: { style: SavedStyle }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>{style.name}</Typography>
        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.3)', mb: 1, fontFamily: 'monospace', fontSize: '0.7rem' }}>
          {Object.entries(style.styles).map(([key, val]) => (
            <Typography key={key} variant="caption" sx={{ color: '#00e5ff', display: 'block' }}>
              {key}: <span style={{ color: '#e0e0e0' }}>{val}</span>
            </Typography>
          ))}
        </Box>
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {style.appliedTo.map(t => (
            <Chip key={t} label={BLOCK_TYPE_ICONS[t] + ' ' + t} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: '0.6rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ABTestCard
// ============================================================================

export function ABTestCard({ test }: { test: ABTestConfig }) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#fff' }}>
            {test.variantAName} vs {test.variantBName}
          </Typography>
          <Chip label={test.status} size="small" sx={{
            bgcolor: test.status === 'running' ? '#ff5722' : test.status === 'completed' ? '#4caf50' : '#9e9e9e',
            color: '#fff', fontSize: '0.6rem',
          }} />
        </Box>
        <Typography variant="caption" sx={{ color: '#888' }}>
          Metric: {test.testMetric.replace('_', ' ')} · Split: {test.splitPercentage}%
        </Typography>
        {test.winner && (
          <Box mt={1} p={1} sx={{ borderRadius: '8px', bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>🏆 Winner: Variant {test.winner}</Typography>
          </Box>
        )}
        {test.startedAt && (
          <Typography variant="caption" sx={{ color: '#555', display: 'block', mt: 1 }}>
            Started {formatRelativeTime(test.startedAt)}
            {test.endedAt && ` · Ended ${formatRelativeTime(test.endedAt)}`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ActivityCard
// ============================================================================

export function ActivityCard({ activity }: { activity: { action: string; template: string; user: string; time: string } }) {
  const actionColors: Record<string, string> = {
    edited: '#ff9800', published: '#4caf50', duplicated: '#9c27b0', created: '#2196f3', archived: '#9e9e9e',
  };
  return (
    <Card sx={glassCard}>
      <CardContent sx={{ py: '12px !important' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: actionColors[activity.action] || '#666', flexShrink: 0 }} />
          <Box flex={1}>
            <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600, color: '#fff' }}>{activity.user.split('@')[0]}</span>
              {' '}{activity.action}{' '}
              <span style={{ fontWeight: 600, color: '#00e5ff' }}>{activity.template}</span>
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#555', flexShrink: 0 }}>{activity.time}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BlockPreviewCard — shows a block's type and properties in builder
// ============================================================================

export function BlockPreviewCard({ block, index }: { block: any; index: number }) {
  const icon = BLOCK_TYPE_ICONS[block.type] || '?';
  return (
    <Card sx={{ ...glassCard, cursor: 'grab', py: 1 }}>
      <CardContent sx={{ py: '8px !important' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff', width: 32, height: 32, fontSize: '0.85rem' }}>
            {icon}
          </Avatar>
          <Box flex={1}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{block.type}</Typography>
            {block.properties.text && (
              <Typography variant="caption" sx={{ color: '#666', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                {String(block.properties.text).substring(0, 50)}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#444' }}>#{index + 1}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
