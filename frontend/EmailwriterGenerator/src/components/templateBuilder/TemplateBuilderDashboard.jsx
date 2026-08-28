import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, TextField, InputAdornment, Chip, Grid, Divider, Button,
} from '@mui/material';
import {
  mockTemplates, mockVersions, mockComponentLibrary, mockSavedStyles,
  mockABTests, mockTemplateAnalytics, mockBuilderSummary,
} from './templateBuilderService';
import {
  StatCard, TemplateCard, ComponentCard, VersionCard, StyleCard,
  ABTestCard, ActivityCard, BlockPreviewCard,
} from './TemplateBuilderCards';
import {
  BarChart, DonutChart, TrendLine, DeviceBreakdown, HorizontalBar,
} from './TemplateBuilderCharts';
import { TEMPLATE_STATUS_COLORS, BLOCK_TYPE_ICONS } from './templateBuilderTypes';

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ mt: 3 }}>{children}</Box>;
}

export default function TemplateBuilderDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0]);

  const summary = mockBuilderSummary;

  const filteredTemplates = mockTemplates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const filteredComponents = mockComponentLibrary.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.includes(searchQuery.toLowerCase()))
  );

  // Category donut data
  const categoryDonut = ['marketing', 'newsletter', 'onboarding', 'notification', 'cold-outreach', 'transactional'].map(cat => ({
    label: cat,
    value: mockTemplates.filter(t => t.category === cat).length,
    color: { marketing: '#ff6b35', newsletter: '#00e5ff', onboarding: '#4caf50', notification: '#f44336', 'cold-outreach': '#9c27b0', transactional: '#2196f3' }[cat],
  }));

  // Block type usage across all templates
  const blockTypeCounts: Record<string, number> = {};
  mockTemplates.forEach(t => t.blocks.forEach(b => { blockTypeCounts[b.type] = (blockTypeCounts[b.type] || 0) + 1; }));
  const blockTypeBarData = Object.entries(blockTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Template performance bar data
  const perfBarData = mockTemplates.filter(t => t.usageCount > 0).map(t => ({
    name: t.name.substring(0, 12),
    opens: t.avgOpenRate * 100,
    clicks: t.avgClickRate * 100,
  }));

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #17171d 100%)' }}>
      {/* Header */}
      <Typography variant="h3" sx={{
        color: '#fff', fontWeight: 800, mb: 1,
        textShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
      }}>
        🎨 Template Builder
      </Typography>
      <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
        Design, preview, and manage email templates with drag-and-drop blocks
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
        <Tab label="📄 Templates" />
        <Tab label="🔨 Builder" />
        <Tab label="🧩 Components" />
        <Tab label="📜 Versions" />
        <Tab label="🎨 Styles" />
        <Tab label="📈 Analytics" />
      </Tabs>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      {/* ===== OVERVIEW TAB ===== */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}><StatCard label="Total Templates" value={summary.totalTemplates} icon="📄" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Published" value={summary.publishedTemplates} icon="🚀" color="#4caf50" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Total Sends" value={`${(summary.totalSends / 1000).toFixed(0)}K`} icon="📧" color="#2196f3" /></Grid>
          <Grid item xs={12} md={3}><StatCard label="Avg Open Rate" value={`${(summary.avgOpenRate * 100).toFixed(1)}%`} icon="👁️" color="#ffd700" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <DonutChart title="Templates by Category" segments={categoryDonut} centerLabel="Templates" centerValue={String(summary.totalTemplates)} />
          </Grid>
          <Grid item xs={12} md={8}>
            <BarChart title="Template Performance" data={perfBarData} xKey="name" yKeys={['opens', 'clicks']} colors={['#4caf50', '#2196f3']} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <BarChart title="Block Type Usage" data={blockTypeBarData} xKey="type" yKeys={['count']} colors={['#00e5ff']} height={200} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={glassCard}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>⚡ Recent Activity</Typography>
                {summary.recentActivity.map((act, i) => (
                  <ActivityCard key={i} activity={act} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== TEMPLATES TAB ===== */}
      <TabPanel value={activeTab} index={1}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            size="small" placeholder="Search templates..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#00e5ff' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
          />
          {['all', 'marketing', 'newsletter', 'onboarding', 'notification', 'cold-outreach', 'transactional'].map(cat => (
            <Chip key={cat} label={cat} onClick={() => setCategoryFilter(cat)}
              sx={{
                bgcolor: categoryFilter === cat ? '#00e5ff' : 'rgba(255,255,255,0.06)',
                color: categoryFilter === cat ? '#000' : '#aaa',
                fontWeight: 600, cursor: 'pointer',
              }}
            />
          ))}
        </Box>
        <Grid container spacing={2}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <TemplateCard template={template} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== BUILDER TAB ===== */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {/* Block Palette */}
          <Grid item xs={12} md={3}>
            <Card sx={glassCard}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>📦 Block Palette</Typography>
                {Object.entries(BLOCK_TYPE_ICONS).map(([type, icon]) => (
                  <Box key={type} sx={{ p: 1, mb: 1, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.03)', cursor: 'grab', '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' } }}>
                    <Typography variant="caption" sx={{ color: '#ccc' }}>{icon} {type}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Canvas */}
          <Grid item xs={12} md={5}>
            <Card sx={glassCard}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff' }}>🔨 Canvas — {selectedTemplate.name}</Typography>
                  <Chip label={`${selectedTemplate.blocks.length} blocks`} size="small" sx={{ bgcolor: 'rgba(0,229,255,0.15)', color: '#00e5ff' }} />
                </Box>
                {selectedTemplate.blocks.map((block, i) => (
                  <Box key={block.id} mb={1}>
                    <BlockPreviewCard block={block} index={i} />
                  </Box>
                ))}
                <Box sx={{ p: 3, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#555' }}>+ Drop a block here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Properties */}
          <Grid item xs={12} md={4}>
            <Card sx={glassCard}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>⚙️ Properties</Typography>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Template Name</Typography>
                  <Typography variant="body2" sx={{ color: '#fff' }}>{selectedTemplate.name}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Subject Line</Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.85rem' }}>{selectedTemplate.subject}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Background Color</Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: selectedTemplate.globalStyles.backgroundColor, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <Typography variant="caption" sx={{ color: '#ccc', fontFamily: 'monospace' }}>{selectedTemplate.globalStyles.backgroundColor}</Typography>
                  </Box>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Font Family</Typography>
                  <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.85rem' }}>{selectedTemplate.globalStyles.fontFamily}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Max Width</Typography>
                  <Typography variant="body2" sx={{ color: '#ccc' }}>{selectedTemplate.globalStyles.maxWidth}px</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Link Color</Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: selectedTemplate.globalStyles.linkColor, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <Typography variant="caption" sx={{ color: '#ccc', fontFamily: 'monospace' }}>{selectedTemplate.globalStyles.linkColor}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />
                <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>Preview Device</Typography>
                <Box display="flex" gap={1}>
                  {['🖥️ Desktop', '📱 Mobile', '📋 Tablet'].map(d => (
                    <Chip key={d} label={d} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#aaa', cursor: 'pointer' }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== COMPONENT LIBRARY TAB ===== */}
      <TabPanel value={activeTab} index={3}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            size="small" placeholder="Search components..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#00e5ff' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start">🔍</InputAdornment> }}
          />
          {['beginner', 'intermediate', 'advanced'].map(d => (
            <Chip key={d} label={d} size="small" sx={{
              bgcolor: { beginner: 'rgba(76,175,80,0.2)', intermediate: 'rgba(255,152,0,0.2)', advanced: 'rgba(244,67,54,0.2)' }[d],
              color: { beginner: '#4caf50', intermediate: '#ff9800', advanced: '#f44336' }[d],
            }} />
          ))}
        </Box>
        <Grid container spacing={2}>
          {filteredComponents.map(item => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <ComponentCard item={item} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== VERSIONS TAB ===== */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card sx={glassCard}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>📜 Version History</Typography>
                {mockVersions.map(v => (
                  <Box key={v.id} mb={1}>
                    <VersionCard version={v} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={glassCard}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>🧪 A/B Tests</Typography>
                {mockABTests.map(test => (
                  <Box key={test.id} mb={1.5}>
                    <ABTestCard test={test} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ===== STYLES TAB ===== */}
      <TabPanel value={activeTab} index={5}>
        <Typography variant="body1" sx={{ color: '#888', mb: 3 }}>
          Saved style presets for consistent branding across templates
        </Typography>
        <Grid container spacing={2}>
          {mockSavedStyles.map(style => (
            <Grid item xs={12} md={6} lg={3} key={style.id}>
              <StyleCard style={style} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* ===== ANALYTICS TAB ===== */}
      <TabPanel value={activeTab} index={6}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}><StatCard label="Total Sends" value="442K" icon="📧" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Open Rate" value="48.0%" icon="👁️" color="#4caf50" /></Grid>
          <Grid item xs={12} md={4}><StatCard label="Avg Click Rate" value="18.0%" icon="🖱️" color="#2196f3" /></Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          {mockTemplateAnalytics.slice(0, 2).map(analytics => (
            <Grid item xs={12} md={6} key={analytics.templateId}>
              <Card sx={glassCard}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>{analytics.templateName}</Typography>
                  <TrendLine
                    title="Weekly Performance"
                    data={analytics.weeklyTrend}
                    xKey="week"
                    yKeys={['opens', 'clicks']}
                    colors={['#4caf50', '#2196f3']}
                    height={160}
                  />
                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}>
                      <DeviceBreakdown devices={analytics.devicesBreakdown} title="Devices" />
                    </Grid>
                    <Grid item xs={6}>
                      <HorizontalBar
                        title="Top Links"
                        data={analytics.topLinks.map(l => ({ label: l.url.split('/').pop() || l.url, value: l.clicks, color: '#00e5ff' }))}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  color: '#e0e0e0',
};
