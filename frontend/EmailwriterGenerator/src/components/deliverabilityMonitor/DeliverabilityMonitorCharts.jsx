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
// ReputationTrend — multi-series line chart
// ============================================================================

export function ReputationTrend({ data, title, height = 220 }: {
  data: { date: string; senderScore: number; inboxRate: number; bounceRate: number; spamRate: number }[];
  title: string; height?: number;
}) {
  const chartH = height - 40;
  const chartW = 600;
  const maxVal = 100;

  const makePath = (key: string, scale: number = 1) => {
    return data.map((d, i) => {
      const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
      const val = (Number(d[key]) || 0) * scale;
      const y = 20 + chartH * (1 - val / maxVal);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  const series = [
    { key: 'senderScore', label: 'Sender Score', color: '#00e5ff', scale: 1 },
    { key: 'inboxRate', label: 'Inbox Rate', color: '#4caf50', scale: 100 },
    { key: 'bounceRate', label: 'Bounce Rate', color: '#ff9800', scale: 1000 },
  ];

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${chartW + 70} ${height + 10}`} style={{ width: '100%' }}>
          {[0, 25, 50, 75, 100].map(f => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f / 100)} x2={chartW + 50} y2={20 + chartH * (1 - f / 100)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f / 100)} textAnchor="end" fill="#666" fontSize="9">{f}</text>
            </g>
          ))}
          {series.map(s => (
            <path key={s.key} d={makePath(s.key, s.scale)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {data.filter((_, i) => i % 5 === 0).map((d, i) => (
            <text key={i} x={50 + (i * 5 / Math.max(data.length - 1, 1)) * chartW} y={height + 5} textAnchor="middle" fill="#666" fontSize="7">
              {d.date.substring(5)}
            </text>
          ))}
          {series.map((s, i) => (
            <g key={s.key} transform={`translate(${60 + i * 100}, 0)`}>
              <line x1="0" y1="7" x2="14" y2="7" stroke={s.color} strokeWidth="2.5" />
              <text x="18" y="11" fill="#aaa" fontSize="9">{s.label}</text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BounceTrendBar — stacked hard/soft bounce bars
// ============================================================================

export function BounceTrendBar({ data, title, height = 200 }: {
  data: { date: string; hardBounces: number; softBounces: number; total: number; rate: number }[];
  title: string; height?: number;
}) {
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const barW = Math.floor(560 / data.length);
  const chartH = height - 40;

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${data.length * barW + 60} ${height + 20}`} style={{ width: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={data.length * barW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="9">{Math.round(maxVal * f)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const hardH = (d.hardBounces / maxVal) * chartH;
            const softH = (d.softBounces / maxVal) * chartH;
            return (
              <g key={i} transform={`translate(${50 + i * barW}, 0)`}>
                <rect x={2} y={20 + chartH - hardH - softH} width={barW - 4} height={softH} rx="2" fill="#ff9800" opacity="0.8" />
                <rect x={2} y={20 + chartH - hardH} width={barW - 4} height={hardH} rx="2" fill="#f44336" opacity="0.8" />
                {i % 3 === 0 && (
                  <text x={barW / 2} y={height + 12} textAnchor="middle" fill="#666" fontSize="7">
                    {d.date.substring(5)}
                  </text>
                )}
              </g>
            );
          })}
          <g transform="translate(60, 0)">
            <rect x="0" y="2" width="10" height="10" rx="2" fill="#f44336" />
            <text x="14" y="11" fill="#aaa" fontSize="9">Hard</text>
            <rect x="50" y="2" width="10" height="10" rx="2" fill="#ff9800" />
            <text x="64" y="11" fill="#aaa" fontSize="9">Soft</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DomainComparisonBar — horizontal bars comparing domains
// ============================================================================

export function DomainComparisonBar({ data, title }: {
  data: { domain: string; senderScore: number; inboxRate: number; bounceRate: number; dailyVolume: number; reputationLevel: string }[];
  title: string;
}) {
  const maxScore = 100;
  const repColors: Record<string, string> = { excellent: '#4caf50', good: '#8bc34a', fair: '#ff9800', poor: '#ff5722', critical: '#f44336' };

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map(d => (
          <Box key={d.domain} mb={1.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#ccc', fontSize: '0.7rem' }}>{d.domain.split('.')[0]}</Typography>
              <Box display="flex" gap={1.5}>
                <Typography variant="caption" sx={{ color: repColors[d.reputationLevel], fontWeight: 600 }}>{d.senderScore}</Typography>
                <Typography variant="caption" sx={{ color: '#4caf50' }}>{(d.inboxRate * 100).toFixed(0)}%</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{(d.dailyVolume / 1000).toFixed(0)}K</Typography>
              </Box>
            </Box>
            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <Box sx={{
                height: '100%', width: `${d.senderScore}%`, borderRadius: 5,
                bgcolor: repColors[d.reputationLevel], transition: 'width 0.6s ease',
              }} />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// WarmupLine — IP warmup volume progression
// ============================================================================

export function WarmupLine({ data, title, targetVolume, height = 180 }: {
  data: { day: number; volume: number; bounceRate: number }[];
  title: string; targetVolume: number; height?: number;
}) {
  const chartH = height - 40;
  const chartW = 500;
  const maxVal = targetVolume * 1.1;

  const volPath = data.map((d, i) => {
    const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = 20 + chartH * (1 - d.volume / maxVal);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const bouncePath = data.map((d, i) => {
    const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = 20 + chartH * (1 - d.bounceRate * 10);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const targetY = 20 + chartH * (1 - targetVolume / maxVal);

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${chartW + 70} ${height + 10}`} style={{ width: '100%' }}>
          <line x1="50" y1={targetY} x2={chartW + 50} y2={targetY} stroke="#4caf50" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          <text x={chartW + 55} y={targetY + 4} fill="#4caf50" fontSize="8">Target</text>
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={chartW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="8">{Math.round(maxVal * f)}</text>
            </g>
          ))}
          <path d={volPath} fill="none" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" />
          <path d={bouncePath} fill="none" stroke="#f44336" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {data.map((d, i) => {
            const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
            const y = 20 + chartH * (1 - d.volume / maxVal);
            return <circle key={i} cx={x} cy={y} r="3" fill="#00e5ff" />;
          })}
          <g transform="translate(60, 0)">
            <line x1="0" y1="7" x2="14" y2="7" stroke="#00e5ff" strokeWidth="2.5" />
            <text x="18" y="11" fill="#aaa" fontSize="9">Volume</text>
            <line x1="80" y1="7" x2="94" y2="7" stroke="#f44336" strokeWidth="2" opacity="0.7" />
            <text x="98" y="11" fill="#aaa" fontSize="9">Bounce %</text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DonutChart
// ============================================================================

export function DonutChart({ segments, title, centerLabel, centerValue, size = 180 }: {
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
                <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">{centerValue}</text>
                <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fill="#888" fontSize="9">{centerLabel}</text>
              </>
            )}
          </svg>
          <Box>
            {arcs.map((arc, i) => (
              <Box key={i} display="flex" alignItems="center" gap={1} mb={0.5}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: arc.color }} />
                <Typography variant="caption" sx={{ color: '#ccc', fontSize: '0.7rem' }}>{arc.label}</Typography>
                <Typography variant="caption" sx={{ color: '#888', ml: 'auto', fontSize: '0.7rem' }}>{arc.pct}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
