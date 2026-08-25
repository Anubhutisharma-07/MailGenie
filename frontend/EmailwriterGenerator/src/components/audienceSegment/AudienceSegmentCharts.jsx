import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  color: '#e0e0e0',
};

// ============================================================================
// DonutChart
// ============================================================================

export function DonutChart({ segments, title, centerLabel, centerValue, size = 200 }: {
  segments: { label: string; value: number; color: string }[];
  title: string; centerLabel?: string; centerValue?: string; size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = size * 0.35;
  const innerRadius = radius * 0.6;
  let startAngle = -Math.PI / 2;

  const arcs = segments.map(seg => {
    const sweep = (seg.value / total) * 2 * Math.PI;
    const angle = startAngle;
    startAngle += sweep;
    const largeArc = sweep > Math.PI ? 1 : 0;
    const x1 = size / 2 + radius * Math.cos(angle);
    const y1 = size / 2 + radius * Math.sin(angle);
    const x2 = size / 2 + radius * Math.cos(angle + sweep);
    const y2 = size / 2 + radius * Math.sin(angle + sweep);
    const ix1 = size / 2 + innerRadius * Math.cos(angle);
    const iy1 = size / 2 + innerRadius * Math.sin(angle);
    const ix2 = size / 2 + innerRadius * Math.cos(angle + sweep);
    const iy2 = size / 2 + innerRadius * Math.sin(angle + sweep);
    const d = `M${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} L${ix2},${iy2} A${innerRadius},${innerRadius} 0 ${largeArc} 0 ${ix1},${iy1} Z`;
    return { d, color: seg.color, label: seg.label, pct: ((seg.value / total) * 100).toFixed(1) };
  });

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
            {arcs.map((arc, i) => <path key={i} d={arc.d} fill={arc.color} opacity="0.85" />)}
            {centerLabel && (
              <>
                <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">{centerValue}</text>
                <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fill="#888" fontSize="10">{centerLabel}</text>
              </>
            )}
          </svg>
          <Box>
            {arcs.map((arc, i) => (
              <Box key={i} display="flex" alignItems="center" gap={1} mb={0.5}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: arc.color }} />
                <Typography variant="caption" sx={{ color: '#ccc' }}>{arc.label}</Typography>
                <Typography variant="caption" sx={{ color: '#888', ml: 'auto' }}>{arc.pct}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HorizontalBar — segment size comparison
// ============================================================================

export function HorizontalBar({ data, title, maxValue }: {
  data: { label: string; value: number; color: string }[]; title: string; maxValue?: number;
}) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map(d => (
          <Box key={d.label} mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#ccc' }}>{d.label}</Typography>
              <Typography variant="caption" sx={{ color: d.color, fontWeight: 600 }}>{d.value.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${(d.value / max) * 100}%`, borderRadius: 5, bgcolor: d.color, transition: 'width 0.6s ease' }} />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// OverlapMatrix — segment overlap heatmap
// ============================================================================

export function OverlapMatrix({ data, title }: {
  data: { segmentA: string; segmentB: string; overlapCount: number; overlapPercentage: number }[];
  title: string;
}) {
  const segments = [...new Set(data.flatMap(d => [d.segmentA, d.segmentB]))];
  const getColor = (pct: number) => {
    if (pct > 0.4) return 'rgba(76, 175, 80, 0.8)';
    if (pct > 0.3) return 'rgba(139, 195, 74, 0.6)';
    if (pct > 0.2) return 'rgba(255, 152, 0, 0.5)';
    return 'rgba(255, 255, 255, 0.08)';
  };

  const cellSize = Math.min(50, Math.floor(400 / segments.length));
  const offsetX = 120;
  const offsetY = 80;

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${offsetX + segments.length * cellSize + 20} ${offsetY + segments.length * cellSize + 20}`} style={{ minWidth: 400 }}>
            {segments.map((seg, i) => (
              <text key={`h-${i}`} x={offsetX + i * cellSize + cellSize / 2} y={offsetY - 10} textAnchor="middle" fill="#888" fontSize="8" transform={`rotate(-30, ${offsetX + i * cellSize + cellSize / 2}, ${offsetY - 10})`}>
                {seg.substring(0, 10)}
              </text>
            ))}
            {segments.map((seg, i) => (
              <text key={`v-${i}`} x={offsetX - 8} y={offsetY + i * cellSize + cellSize / 2 + 4} textAnchor="end" fill="#888" fontSize="8">
                {seg.substring(0, 12)}
              </text>
            ))}
            {segments.map((segA, i) =>
              segments.map((segB, j) => {
                if (i === j) return null;
                const match = data.find(d =>
                  (d.segmentA === segA && d.segmentB === segB) || (d.segmentA === segB && d.segmentB === segA)
                );
                if (!match) return null;
                return (
                  <g key={`${i}-${j}`}>
                    <rect x={offsetX + j * cellSize} y={offsetY + i * cellSize}
                      width={cellSize - 1} height={cellSize - 1} rx="4"
                      fill={getColor(match.overlapPercentage)} />
                    <text x={offsetX + j * cellSize + cellSize / 2} y={offsetY + i * cellSize + cellSize / 2 + 3}
                      textAnchor="middle" fill="#fff" fontSize="7" fontWeight="600">
                      {(match.overlapPercentage * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })
            )}
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LifecycleFunnel — lifecycle stage progression
// ============================================================================

export function LifecycleFunnel({ data, title }: {
  data: { stage: string; count: number; percentage: number; color: string }[];
  title: string;
}) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map((d, i) => {
          const width = 40 + (d.count / maxCount) * 60;
          return (
            <Box key={d.stage} display="flex" alignItems="center" gap={1.5} mb={1}>
              <Typography variant="caption" sx={{ color: '#aaa', width: 70, textAlign: 'right', textTransform: 'capitalize' }}>{d.stage}</Typography>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  width: `${width}%`, height: 28, borderRadius: '6px', bgcolor: d.color, opacity: 0.8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 0.6s ease',
                }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}>
                    {(d.percentage * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TierBar — engagement tier distribution with rates
// ============================================================================

export function TierBar({ data, title }: {
  data: { tier: string; count: number; percentage: number; avgOpenRate: number; avgClickRate: number; color: string }[];
  title: string;
}) {
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map(d => (
          <Box key={d.tier} mb={1.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
                <Typography variant="caption" sx={{ color: '#ccc', textTransform: 'capitalize' }}>{d.tier}</Typography>
              </Box>
              <Box display="flex" gap={2}>
                <Typography variant="caption" sx={{ color: '#4caf50' }}>O:{(d.avgOpenRate * 100).toFixed(0)}%</Typography>
                <Typography variant="caption" sx={{ color: '#2196f3' }}>C:{(d.avgClickRate * 100).toFixed(0)}%</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{d.count.toLocaleString()}</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${d.percentage * 100 * 3}%`, borderRadius: 4, bgcolor: d.color, transition: 'width 0.6s ease' }} />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
