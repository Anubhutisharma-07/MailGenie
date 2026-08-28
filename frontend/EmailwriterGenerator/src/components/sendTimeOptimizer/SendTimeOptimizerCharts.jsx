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
// HourlyBar — 24-hour engagement pattern
// ============================================================================

export function HourlyBar({ data, title, height = 220 }: {
  data: { hour: number; openRate: number; clickRate: number; sendVolume: number }[];
  title: string; height?: number;
}) {
  const maxOpen = Math.max(...data.map(d => d.openRate), 0.01);
  const barW = Math.floor(600 / 24);
  const chartH = height - 40;

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${24 * barW + 60} ${height + 20}`} style={{ width: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={24 * barW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="9">{(maxOpen * f * 100).toFixed(0)}%</text>
            </g>
          ))}
          {data.map((d, i) => {
            const barH = (d.openRate / maxOpen) * chartH;
            const clickH = (d.clickRate / maxOpen) * chartH;
            const isPeak = d.openRate === maxOpen;
            return (
              <g key={i} transform={`translate(${50 + i * barW}, 0)`}>
                <rect x={2} y={20 + chartH - barH} width={barW - 4} height={barH} rx="2"
                  fill={isPeak ? '#00e5ff' : 'rgba(0, 229, 255, 0.5)'} opacity={isPeak ? 1 : 0.6} />
                <rect x={2} y={20 + chartH - clickH} width={barW - 4} height={clickH} rx="2"
                  fill="#4caf50" opacity="0.7" />
                {i % 3 === 0 && (
                  <text x={barW / 2} y={height + 12} textAnchor="middle" fill="#666" fontSize="8">
                    {d.hour}h
                  </text>
                )}
              </g>
            );
          })}
          <g transform="translate(60, 0)">
            <rect x="0" y="2" width="10" height="10" rx="2" fill="#00e5ff" />
            <text x="14" y="11" fill="#aaa" fontSize="9">Opens</text>
            <line x1="70" y1="7" x2="86" y2="7" stroke="#4caf50" strokeWidth="3" />
            <text x="90" y="11" fill="#aaa" fontSize="9">Clicks</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DailyBar — day-of-week engagement
// ============================================================================

export function DailyBar({ data, title, height = 180 }: {
  data: { day: string; openRate: number; clickRate: number; sendVolume: number; bestHour: number }[];
  title: string; height?: number;
}) {
  const maxOpen = Math.max(...data.map(d => d.openRate), 0.01);
  const barW = Math.floor(600 / 7);
  const chartH = height - 40;

  const dayColors = ['#f44336', '#ff9800', '#ffd700', '#4caf50', '#2196f3', '#9c27b0', '#607d8b'];

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${7 * barW + 60} ${height + 20}`} style={{ width: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={7 * barW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="9">{(maxOpen * f * 100).toFixed(0)}%</text>
            </g>
          ))}
          {data.map((d, i) => {
            const barH = (d.openRate / maxOpen) * chartH;
            const clickH = (d.clickRate / maxOpen) * chartH;
            return (
              <g key={i} transform={`translate(${50 + i * barW}, 0)`}>
                <rect x={4} y={20 + chartH - barH} width={barW - 8} height={barH} rx="4"
                  fill={dayColors[i]} opacity="0.8" />
                <rect x={4} y={20 + chartH - clickH} width={barW - 8} height={clickH} rx="4"
                  fill="#fff" opacity="0.2" />
                <text x={barW / 2} y={height + 12} textAnchor="middle" fill="#888" fontSize="9">
                  {d.day}
                </text>
                <text x={barW / 2} y={20 + chartH - barH - 6} textAnchor="middle" fill={dayColors[i]} fontSize="8" fontWeight="600">
                  {(d.openRate * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// OverlapHeatmap — UTC hours vs timezone regions
// ============================================================================

export function OverlapHeatmap({ data, title }: {
  data: { hour: number; regions: { timezone: string; localHour: number; awake: boolean; optimal: boolean }[]; globalScore: number }[];
  title: string;
}) {
  const cellW = 60;
  const cellH = 24;
  const offsetX = 70;
  const offsetY = 25;
  const regions = data[0]?.regions.map(r => r.timezone) || [];

  const getColor = (score: number) => {
    if (score > 80) return 'rgba(76, 175, 80, 0.8)';
    if (score > 60) return 'rgba(139, 195, 74, 0.6)';
    if (score > 40) return 'rgba(255, 152, 0, 0.5)';
    if (score > 20) return 'rgba(255, 87, 34, 0.4)';
    return 'rgba(96, 125, 139, 0.3)';
  };

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${offsetX + data.length * cellW + 20} ${offsetY + (regions.length + 1) * cellH + 30}`} style={{ minWidth: 500 }}>
            {data.filter((_, i) => i % 2 === 0).map((d, i) => (
              <text key={i} x={offsetX + (i * 2) * cellW + cellW / 2} y={offsetY - 8} textAnchor="middle" fill="#666" fontSize="8">
                {d.hour}h
              </text>
            ))}
            {regions.map((region, ri) => (
              <text key={region} x={offsetX - 8} y={offsetY + ri * cellH + 16} textAnchor="end" fill="#aaa" fontSize="9">{region}</text>
            ))}
            {data.map((d, di) => (
              <g key={di}>
                {d.regions.map((r, ri) => (
                  <g key={ri}>
                    <rect x={offsetX + di * cellW} y={offsetY + ri * cellH}
                      width={cellW - 1} height={cellH - 1} rx="3"
                      fill={r.optimal ? '#4caf50' : r.awake ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.04)'}
                      opacity={r.optimal ? 0.9 : r.awake ? 0.6 : 0.2} />
                    <text x={offsetX + di * cellW + cellW / 2} y={offsetY + ri * cellH + 15}
                      textAnchor="middle" fill={r.awake ? '#fff' : '#555'} fontSize="8">
                      {r.localHour}
                    </text>
                  </g>
                ))}
                <text x={offsetX + di * cellW + cellW / 2} y={offsetY + regions.length * cellH + 16}
                  textAnchor="middle" fill="#00e5ff" fontSize="8" fontWeight="600">
                  {d.globalScore}
                </text>
              </g>
            ))}
            <text x={offsetX - 8} y={offsetY + regions.length * cellH + 16} textAnchor="end" fill="#00e5ff" fontSize="9" fontWeight="600">Score</text>
            <g transform={`translate(${offsetX + data.length * cellW + 10}, 0)`}>
              <rect x="0" y="5" width="10" height="8" rx="2" fill="#4caf50" opacity="0.9" />
              <text x="14" y="13" fill="#aaa" fontSize="8">Optimal</text>
              <rect x="0" y="18" width="10" height="8" rx="2" fill="rgba(0,229,255,0.3)" />
              <text x="14" y="26" fill="#aaa" fontSize="8">Awake</text>
            </g>
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// WindowBar — send window comparison
// ============================================================================

export function WindowBar({ data, title }: {
  data: { name: string; avgOpenRate: number; avgClickRate: number; color: string; durationMinutes: number }[];
  title: string;
}) {
  const maxVal = Math.max(...data.map(d => d.avgOpenRate), 0.01);
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map((d) => (
          <Box key={d.name} mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#ccc' }}>{d.name}</Typography>
              <Typography variant="caption" sx={{ color: d.color, fontWeight: 600 }}>{(d.avgOpenRate * 100).toFixed(0)}%</Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <Box sx={{
                  height: '100%', width: `${(d.avgOpenRate / maxVal) * 100}%`, borderRadius: 6,
                  bgcolor: d.color, transition: 'width 0.6s ease',
                }} />
              </Box>
              <Box sx={{
                position: 'absolute', left: `${(d.avgClickRate / maxVal) * 100}%`, top: 0,
                width: 2, height: 12, bgcolor: '#fff', opacity: 0.5,
              }} />
            </Box>
          </Box>
        ))}
        <Box display="flex" gap={2} mt={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 10, height: 6, borderRadius: 3, bgcolor: '#00e5ff' }} />
            <Typography variant="caption" sx={{ color: '#888' }}>Open Rate</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 2, height: 6, bgcolor: '#fff', opacity: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#888' }}>Click Rate</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TimezonePie — donut chart for timezone distribution
// ============================================================================

export function TimezonePie({ data, title, size = 200 }: {
  data: { label: string; value: number; color: string }[];
  title: string; size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = size * 0.35;
  const innerRadius = radius * 0.6;
  let startAngle = -Math.PI / 2;

  const arcs = data.map(seg => {
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
            <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">{data.length}</text>
            <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fill="#888" fontSize="9">Timezones</text>
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
