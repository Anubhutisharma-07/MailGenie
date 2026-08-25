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
// BarChart
// ============================================================================

export function BarChart({ data, title, xKey, yKeys, colors = ['#00e5ff', '#4caf50', '#ff9800'], height = 220 }: {
  data: Record<string, any>[]; title: string; xKey: string; yKeys: string[]; colors?: string[]; height?: number;
}) {
  const maxVal = Math.max(...data.flatMap(d => yKeys.map(k => Number(d[k]) || 0)), 1);
  const barGroupWidth = Math.floor(600 / Math.max(data.length, 1));
  const barWidth = Math.floor(barGroupWidth / (yKeys.length + 1));
  const chartH = height - 40;
  const chartW = data.length * barGroupWidth;

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${chartW + 60} ${height + 20}`} style={{ width: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={chartW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="10">{Math.round(maxVal * f)}</text>
            </g>
          ))}
          {data.map((d, i) => (
            <g key={i} transform={`translate(${50 + i * barGroupWidth}, 0)`}>
              {yKeys.map((key, ki) => {
                const val = Number(d[key]) || 0;
                const barH = (val / maxVal) * chartH;
                return <rect key={ki} x={ki * (barWidth + 2) + 4} y={20 + chartH - barH} width={barWidth} height={barH} rx="3" fill={colors[ki % colors.length]} opacity="0.85" />;
              })}
              <text x={barGroupWidth / 2} y={height + 15} textAnchor="middle" fill="#888" fontSize="9">{String(d[xKey]).substring(0, 8)}</text>
            </g>
          ))}
          {yKeys.map((key, ki) => (
            <g key={key} transform={`translate(${60 + ki * 100}, 0)`}>
              <rect x="0" y="2" width="10" height="10" rx="2" fill={colors[ki % colors.length]} />
              <text x="14" y="11" fill="#aaa" fontSize="9">{key}</text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}

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

  const arcs = segments.map((seg) => {
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
// TrendLine
// ============================================================================

export function TrendLine({ data, title, xKey, yKeys, colors = ['#00e5ff', '#4caf50'], height = 200 }: {
  data: Record<string, any>[]; title: string; xKey: string; yKeys: string[]; colors?: string[]; height?: number;
}) {
  const chartH = height - 40;
  const chartW = 600;
  const maxVal = Math.max(...data.flatMap(d => yKeys.map(k => Number(d[k]) || 0)), 1);

  const makePath = (key: string) => {
    return data.map((d, i) => {
      const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
      const y = 20 + chartH * (1 - (Number(d[key]) || 0) / maxVal);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        <svg viewBox={`0 0 ${chartW + 70} ${height + 10}`} style={{ width: '100%' }}>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="50" y1={20 + chartH * (1 - f)} x2={chartW + 50} y2={20 + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x="45" y={24 + chartH * (1 - f)} textAnchor="end" fill="#666" fontSize="10">{Math.round(maxVal * f)}</text>
            </g>
          ))}
          {yKeys.map((key, ki) => (
            <path key={key} d={makePath(key)} fill="none" stroke={colors[ki % colors.length]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {data.map((d, i) => (
            <g key={i}>
              {yKeys.map((key, ki) => {
                const x = 50 + (i / Math.max(data.length - 1, 1)) * chartW;
                const y = 20 + chartH * (1 - (Number(d[key]) || 0) / maxVal);
                return <circle key={ki} cx={x} cy={y} r="3.5" fill={colors[ki % colors.length]} />;
              })}
              <text x={50 + (i / Math.max(data.length - 1, 1)) * chartW} y={height + 5} textAnchor="middle" fill="#666" fontSize="8">{String(d[xKey])}</text>
            </g>
          ))}
          {yKeys.map((key, ki) => (
            <g key={key} transform={`translate(${60 + ki * 100}, 0)`}>
              <line x1="0" y1="7" x2="16" y2="7" stroke={colors[ki % colors.length]} strokeWidth="2.5" />
              <text x="20" y="11" fill="#aaa" fontSize="9">{key}</text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DeviceBreakdown — horizontal bars for desktop/mobile/tablet
// ============================================================================

export function DeviceBreakdown({ devices, title }: {
  devices: { desktop: number; mobile: number; tablet: number }; title: string;
}) {
  const data = [
    { label: '🖥️ Desktop', value: devices.desktop, color: '#00e5ff' },
    { label: '📱 Mobile', value: devices.mobile, color: '#4caf50' },
    { label: '📋 Tablet', value: devices.tablet, color: '#ff9800' },
  ];
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map((d) => (
          <Box key={d.label} mb={1.5}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#ccc' }}>{d.label}</Typography>
              <Typography variant="caption" sx={{ color: d.color, fontWeight: 600 }}>{(d.value * 100).toFixed(0)}%</Typography>
            </Box>
            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${d.value * 100}%`, borderRadius: 5, bgcolor: d.color, transition: 'width 0.6s ease' }} />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HorizontalBar — label + bar + value
// ============================================================================

export function HorizontalBar({ data, title, maxValue }: {
  data: { label: string; value: number; color: string }[]; title: string; maxValue?: number;
}) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <Card sx={glassCard}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>{title}</Typography>
        {data.map((d) => (
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
