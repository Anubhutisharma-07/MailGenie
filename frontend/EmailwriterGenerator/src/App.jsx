import { useState, useEffect } from 'react';
import './App.css';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Divider, 
  IconButton, 
  Switch, 
  FormControlLabel, 
  Grid,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

// Sidebar Drawer Width
const drawerWidth = 260;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('generator');

  // Backend connection state
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('mailgenie_backend_url') || 'http://localhost:8080';
  });
  const [backendOnline, setBackendOnline] = useState(false);

  // Email generator states
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [provider, setProvider] = useState('groq');
  const [model, setModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // History and config states
  const [historyList, setHistoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempComment, setTempComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [providerConfig, setProviderConfig] = useState({ groq: false, openai: false, gemini: false, claude: false });

  // Custom and preset templates
  const [customTemplates, setCustomTemplates] = useState(() => {
    const saved = localStorage.getItem('mailgenie_custom_templates');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', title: '💼 Professional Follow-up', body: 'Dear [Name],\n\nI wanted to follow up on our discussion regarding [Topic]. Please let me know if you have had a chance to review the details.\n\nBest regards,\n[Your Name]' },
      { id: 'p2', title: '📅 Schedule Meeting', body: 'Hi [Name],\n\nI would love to schedule a quick 15-minute call to align on our next steps. Please let me know your availability this week.\n\nThanks,\n[Your Name]' },
      { id: 'p3', title: '☕ Casual Check-in', body: 'Hey [Name],\n\nHope you are doing well! Just wanted to check in and see how things are going with [Project]. Let me know when you are free to catch up.\n\nCheers,\n[Your Name]' }
    ];
  });

  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');

  // Mobile responsiveness
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Material UI Custom Theme
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#6366f1', // Indigo
      },
      secondary: {
        main: '#c084fc', // Purple
      },
      background: {
        default: isDarkMode ? '#090d16' : '#f8fafc',
        paper: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#0f172a',
        secondary: isDarkMode ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h3: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
      },
      h4: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
      },
      h5: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 650,
      },
      h6: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
      },
    },
  });

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  };

  // Sync theme and data on mount / backendUrl change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    checkBackendHealth();
  }, [backendUrl]);

  // Check health and load data
  const checkBackendHealth = async () => {
    try {
      // Test server connection
      const response = await axios.get(`${backendUrl}/api/email/config`);
      setProviderConfig(response.data);
      setBackendOnline(true);
      
      // Auto select first configured provider
      if (response.data) {
        if (response.data.groq) setProvider('groq');
        else if (response.data.openai) setProvider('openai');
        else if (response.data.gemini) setProvider('gemini');
        else if (response.data.claude) setProvider('claude');
      }

      // Fetch history if online
      const historyResponse = await axios.get(`${backendUrl}/api/history`);
      setHistoryList(historyResponse.data);
    } catch (err) {
      console.error("Backend health check failed:", err);
      setBackendOnline(false);
    }
  };

  const handleBackendUrlChange = (newUrl) => {
    setBackendUrl(newUrl);
    localStorage.setItem('mailgenie_backend_url', newUrl);
  };

  // Generate Email Reply
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');
    try {
      const response = await axios.post(`${backendUrl}/api/email/generate`, {
        emailContent,
        tone,
        provider,
        model,
        language
      });
      const reply = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(reply);
      
      // Refresh history list
      const histRes = await axios.get(`${backendUrl}/api/history`);
      setHistoryList(histRes.data);
    } catch (err) {
      setError('Failed to generate email reply. Please check your backend connection and API configurations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save history comments
  const handleUpdateComment = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/history/${id}/comment`, tempComment, {
        headers: { 'Content-Type': 'application/json' }
      });
      setEditingId(null);
      // Reload history
      const histRes = await axios.get(`${backendUrl}/api/history`);
      setHistoryList(histRes.data);
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  // Delete history entry
  const handleDeleteHistory = async (id) => {
    if (window.confirm("Are you sure you want to delete this history record?")) {
      try {
        await axios.delete(`${backendUrl}/api/history/${id}`);
        // Reload history
        const histRes = await axios.get(`${backendUrl}/api/history`);
        setHistoryList(histRes.data);
      } catch (err) {
        console.error("Failed to delete history:", err);
      }
    }
  };

  // Templates CRUD
  const handleAddTemplate = () => {
    if (!newTemplateTitle.trim() || !newTemplateBody.trim()) return;
    const newTpl = {
      id: Date.now().toString(),
      title: newTemplateTitle,
      body: newTemplateBody
    };
    const updated = [...customTemplates, newTpl];
    setCustomTemplates(updated);
    localStorage.setItem('mailgenie_custom_templates', JSON.stringify(updated));
    setNewTemplateTitle('');
    setNewTemplateBody('');
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm("Delete this template?")) {
      const updated = customTemplates.filter(t => t.id !== id);
      setCustomTemplates(updated);
      localStorage.setItem('mailgenie_custom_templates', JSON.stringify(updated));
    }
  };

  const handleUseTemplate = (body) => {
    setEmailContent(body);
    setActiveTab('generator');
  };

  const startEditing = (id, comment) => {
    setEditingId(id);
    setTempComment(comment || '');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter history based on search term
  const filteredHistory = historyList.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.originalContent && item.originalContent.toLowerCase().includes(term)) ||
      (item.generatedReply && item.generatedReply.toLowerCase().includes(term)) ||
      (item.userComment && item.userComment.toLowerCase().includes(term)) ||
      (item.tone && item.tone.toLowerCase().includes(term)) ||
      (item.provider && item.provider.toLowerCase().includes(term))
    );
  });

  // Computed Analytics Metrics
  const totalGenerated = historyList.length;
  const timeSavedMinutes = totalGenerated * 2; // Estimate 2 minutes saved per draft
  const toneUsage = historyList.reduce((acc, curr) => {
    const t = curr.tone || 'default';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const favoriteTone = Object.keys(toneUsage).reduce((a, b) => toneUsage[a] > toneUsage[b] ? a : b, 'default');
  const providerUsage = historyList.reduce((acc, curr) => {
    const p = curr.provider || 'unknown';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  const primaryProvider = Object.keys(providerUsage).reduce((a, b) => providerUsage[a] > providerUsage[b] ? a : b, 'groq');

  const navigationItems = [
    { id: 'generator', label: '⚡ Email Generator', icon: '📝' },
    { id: 'history', label: '📜 History Logs', icon: '⏳' },
    { id: 'templates', label: '📂 Saved Templates', icon: '📁' },
    { id: 'analytics', label: '📊 Usage Analytics', icon: '📈' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  // Drawer layout for sidebar
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Typography variant="h5" component="div" className="app-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          💌 MailGenie
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 650 }}>
          AI EMAIL WRITING SUITE
        </Typography>
      </Box>
      
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              className={activeTab === item.id ? "sidebar-item-active" : "sidebar-item"}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, fontSize: '1.2rem' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: activeTab === item.id ? 700 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={toggleTheme} color="primary" />}
          label={isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          sx={{ color: 'text.secondary', '.MuiTypography-root': { fontSize: '0.85rem', fontWeight: 600 } }}
        />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: backendOnline ? 'success.main' : 'error.main' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {backendOnline ? 'Backend Connected' : 'Backend Disconnected'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        
        {/* Responsive Mobile Drawer */}
        {isMobile && (
          <IconButton 
            onClick={() => setMobileOpen(true)}
            sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1100, bgcolor: 'background.paper', boxShadow: 1 }}
          >
            ☰
          </IconButton>
        )}

        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              background: isDarkMode ? 'linear-gradient(180deg, #090d16 0%, #0e1628 100%)' : '#ffffff'
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 4, width: { md: `calc(100% - ${drawerWidth}px)` }, pt: isMobile ? 8 : 4 }}>
          <Container maxWidth="lg">
            
            {/* TAB: GENERATOR */}
            {activeTab === 'generator' && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" component="h1" gutterBottom className="app-title">
                    ⚡ Email Generator
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Generate tailored drafts using advanced artificial intelligence models.
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* Left Form */}
                  <Grid item xs={12} md={7}>
                    <Paper className="glass-card" sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <TextField 
                          fullWidth
                          multiline
                          rows={6}
                          variant='outlined'
                          label="Original Email Context"
                          placeholder="Paste details of the thread or reply context here..."
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                          className="glow-input"
                        />

                        <Grid container spacing={2}>
                          {/* Provider Selection */}
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>LLM Provider</InputLabel>
                              <Select
                                value={provider}
                                label="LLM Provider"
                                onChange={(e) => {
                                  setProvider(e.target.value);
                                  setModel('');
                                }}
                              >
                                <MenuItem value="groq" disabled={!providerConfig.groq && backendOnline}>
                                  ⚡ Groq {providerConfig.groq ? ' (Active)' : ''}
                                </MenuItem>
                                <MenuItem value="openai" disabled={!providerConfig.openai && backendOnline}>
                                  🧠 OpenAI {providerConfig.openai ? ' (Active)' : ''}
                                </MenuItem>
                                <MenuItem value="gemini" disabled={!providerConfig.gemini && backendOnline}>
                                  ♊ Gemini {providerConfig.gemini ? ' (Active)' : ''}
                                </MenuItem>
                                <MenuItem value="claude" disabled={!providerConfig.claude && backendOnline}>
                                  🦉 Claude {providerConfig.claude ? ' (Active)' : ''}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Tone Selection */}
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Tone</InputLabel>
                              <Select
                                value={tone}
                                label="Tone"
                                onChange={(e) => setTone(e.target.value)}
                              >
                                <MenuItem value="">Default ⚙️</MenuItem>
                                <MenuItem value="professional">Professional 👔</MenuItem>
                                <MenuItem value="casual">Casual ☕</MenuItem>
                                <MenuItem value="friendly">Friendly 😊</MenuItem>
                                <MenuItem value="persuasive">Persuasive 🎯</MenuItem>
                                <MenuItem value="urgent">Urgent ⏰</MenuItem>
                                <MenuItem value="empathetic">Empathetic ❤️</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          {/* Language Selection */}
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Language</InputLabel>
                              <Select
                                value={language}
                                label="Language"
                                onChange={(e) => setLanguage(e.target.value)}
                              >
                                <MenuItem value="English">English 🇺🇸</MenuItem>
                                <MenuItem value="Spanish">Spanish 🇪🇸</MenuItem>
                                <MenuItem value="French">French 🇫🇷</MenuItem>
                                <MenuItem value="German">German 🇩🇪</MenuItem>
                                <MenuItem value="Italian">Italian 🇮🇹</MenuItem>
                                <MenuItem value="Japanese">Japanese 🇯🇵</MenuItem>
                                <MenuItem value="Chinese">Chinese 🇨🇳</MenuItem>
                                <MenuItem value="Hindi">Hindi 🇮🇳</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          label="Custom Model Override (Optional)"
                          placeholder="e.g. llama-3.3-70b-versatile, gpt-4o-mini"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="glow-input"
                        />

                        <Button
                          variant='contained'
                          onClick={handleSubmit}
                          disabled={!emailContent || loading || !backendOnline}
                          fullWidth
                          size="large"
                          className="gradient-btn"
                          sx={{ py: 1.8 }}
                        >
                          {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <CircularProgress size={20} color="inherit" />
                              <span>Drafting Reply...</span>
                            </Box>
                          ) : !backendOnline ? "Backend Offline" : "Generate AI Reply"}
                        </Button>
                      </Box>

                      {error && (
                        <Typography color='error' sx={{ mt: 3, textAlign: 'center', fontWeight: 600 }}>
                          ⚠️ {error}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Right Output */}
                  <Grid item xs={12} md={5}>
                    <Paper className="glass-card" sx={{ p: 4, height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        ✨ Generated Reply Draft
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      {generatedReply ? (
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={10}
                            variant='outlined'
                            value={generatedReply}
                            inputProps={{ readOnly: true }}
                            sx={{ 
                              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.25)' : '#f8fafc',
                              borderRadius: 3,
                              flexGrow: 1
                            }}
                          />
                          <Button
                            variant={copied ? 'contained' : 'outlined'}
                            color={copied ? 'success' : 'primary'}
                            fullWidth
                            onClick={handleCopy}
                            sx={{ borderRadius: 3, py: 1.5 }}
                          >
                            {copied ? '✅ Copied to Clipboard!' : '📋 Copy Draft'}
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1, opacity: 0.6 }}>
                          <Typography variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                            Configure inputs on the left and tap "Generate AI Reply" to craft your draft response here.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="h3" component="h2" className="app-title">
                      📜 History & Logs
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      View, search, edit annotations, and manage your past AI-generated replies.
                    </Typography>
                  </Box>
                  <TextField
                    size="small"
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 280 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                    }}
                  />
                </Box>

                {!backendOnline ? (
                  <Paper className="glass-card" sx={{ py: 6, px: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="error" sx={{ fontWeight: 650 }}>
                      ⚠️ Connection Offline. Unable to load history from backend.
                    </Typography>
                  </Paper>
                ) : filteredHistory.length === 0 ? (
                  <Paper className="glass-card" sx={{ py: 8, px: 3, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      {searchTerm ? "No matching records found." : "Your generated email records will be shown here."}
                    </Typography>
                  </Paper>
                ) : (
                  filteredHistory.map((item) => (
                    <Card key={item.id} className="history-card" sx={{ mb: 3, boxShadow: 'none' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                            <span className={`badge-provider badge-${item.provider ? item.provider.toLowerCase() : 'groq'}`}>
                              {item.provider ? item.provider : 'Groq'}
                            </span>
                            {item.tone && (
                              <span className="badge-tone">
                                🎭 {item.tone}
                              </span>
                            )}
                            <span className="badge-lang">
                              🌐 {item.language ? item.language : 'English'}
                            </span>
                            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, fontWeight: 600 }}>
                              {new Date(item.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <IconButton 
                            color="error" 
                            size="small" 
                            onClick={() => handleDeleteHistory(item.id)}
                            title="Delete entry"
                          >
                            🗑️
                          </IconButton>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                          ✉️ Original Context:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          whiteSpace: 'pre-wrap', 
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc', 
                          p: 2, 
                          borderRadius: 2.5, 
                          mb: 2, 
                          color: 'text.secondary',
                          fontSize: '0.85rem' 
                        }}>
                          {item.originalContent}
                        </Typography>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                          🤖 AI Reply Draft:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          whiteSpace: 'pre-wrap', 
                          backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.08)' : '#eef2ff', 
                          p: 2, 
                          borderRadius: 2.5, 
                          mb: 2, 
                          color: 'text.primary',
                          fontSize: '0.85rem'
                        }}>
                          {item.generatedReply}
                        </Typography>

                        <Divider sx={{ my: 2, opacity: 0.3 }} />

                        {/* Comment section */}
                        <Box>
                          {editingId === item.id ? (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Edit your private comments/notes..."
                                value={tempComment}
                                onChange={(e) => setTempComment(e.target.value)}
                                className="glow-input"
                              />
                              <Button variant="contained" size="small" onClick={() => handleUpdateComment(item.id)} sx={{ px: 3 }}>
                                Save
                              </Button>
                              <Button variant="outlined" size="small" onClick={() => setEditingId(null)}>
                                Cancel
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                💬 <strong>Annotation Note:</strong> {item.userComment ? item.userComment : <span style={{ fontStyle: 'italic', opacity: 0.7 }}>None saved</span>}
                              </Typography>
                              <Button variant="text" size="small" onClick={() => startEditing(item.id, item.userComment)} sx={{ textTransform: 'none', fontWeight: 650 }}>
                                ✏️ Edit Note
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            )}

            {/* TAB: TEMPLATES */}
            {activeTab === 'templates' && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" component="h2" className="app-title">
                    📂 Reply Templates
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Quickly launch pre-designed templates directly into the generator or save your own favorites.
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {/* Create Template */}
                  <Grid item xs={12} md={4}>
                    <Paper className="glass-card" sx={{ p: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        ➕ New Template
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField 
                          fullWidth
                          size="small"
                          label="Template Title"
                          placeholder="e.g. 🏢 Support Decline"
                          value={newTemplateTitle}
                          onChange={(e) => setNewTemplateTitle(e.target.value)}
                        />
                        <TextField 
                          fullWidth
                          multiline
                          rows={6}
                          label="Template Body"
                          placeholder="Write template email draft structure here..."
                          value={newTemplateBody}
                          onChange={(e) => setNewTemplateBody(e.target.value)}
                        />
                        <Button 
                          variant="contained" 
                          onClick={handleAddTemplate}
                          disabled={!newTemplateTitle || !newTemplateBody}
                          fullWidth
                          className="gradient-btn"
                        >
                          Save Template
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Templates List */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                      {customTemplates.map((template) => (
                        <Grid item xs={12} sm={6} key={template.id}>
                          <Card className="history-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                                  {template.title}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  🗑️
                                </IconButton>
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary', 
                                  whiteSpace: 'pre-wrap', 
                                  mb: 2.5,
                                  fontSize: '0.82rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 5,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {template.body}
                              </Typography>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                fullWidth 
                                onClick={() => handleUseTemplate(template.body)}
                                sx={{ textTransform: 'none', borderRadius: 2 }}
                              >
                                ⚡ Load into Generator
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" component="h2" className="app-title">
                    📊 Usage Analytics
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    View insights on generated volume, active API clients, preferred styles, and productivity gains.
                  </Typography>
                </Box>

                {/* Scorecards */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Total Generated
                      </Typography>
                      <Typography variant="h3" sx={{ mt: 1, color: 'primary.main', fontWeight: 800 }}>
                        {totalGenerated}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                        draft emails archived
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Time Saved (Est.)
                      </Typography>
                      <Typography variant="h3" sx={{ mt: 1, color: '#10b981', fontWeight: 800 }}>
                        {timeSavedMinutes}m
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                        estimated productivity gain
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Favorite Tone
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1.5, color: '#f59e0b', fontWeight: 800, textTransform: 'capitalize' }}>
                        {favoriteTone || 'None'}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
                        most frequently selected tone
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Primary Provider
                      </Typography>
                      <Typography variant="h4" sx={{ mt: 1.5, color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase' }}>
                        {primaryProvider}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
                        most requested API client
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Custom Charts Section */}
                <Grid container spacing={4}>
                  {/* Bar Chart */}
                  <Grid item xs={12} md={6}>
                    <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        🤖 LLM Provider Usage Distribution
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      {totalGenerated > 0 ? (
                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {['groq', 'openai', 'gemini', 'claude'].map(p => {
                            const count = providerUsage[p] || 0;
                            const pct = totalGenerated > 0 ? Math.round((count / totalGenerated) * 100) : 0;
                            return (
                              <Box key={p}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                                    {p} ({count})
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {pct}%
                                  </Typography>
                                </Box>
                                <Box sx={{ width: '100%', height: 12, bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                                  <Box 
                                    sx={{ 
                                      width: `${pct}%`, 
                                      height: '100%', 
                                      background: p === 'groq' ? '#f55036' : p === 'openai' ? '#10a37f' : p === 'gemini' ? '#1a73e8' : '#d97706',
                                      borderRadius: 6,
                                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} 
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Awaiting logs to populate metrics chart.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {/* Circular/Flex Chart */}
                  <Grid item xs={12} md={6}>
                    <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        🎭 Tone Usage Distribution
                      </Typography>
                      <Divider sx={{ my: 2 }} />

                      {totalGenerated > 0 ? (
                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {Object.entries(toneUsage).map(([toneName, val]) => {
                            const pct = Math.round((val / totalGenerated) * 100);
                            return (
                              <Box key={toneName} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                <Typography variant="body2" sx={{ minWidth: 100, textTransform: 'capitalize', fontWeight: 600 }}>
                                  {toneName || 'Default'}
                                </Typography>
                                <Box sx={{ flexGrow: 1, height: 8, bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                  <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: 'secondary.main', borderRadius: 4 }} />
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                                  {pct}%
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Awaiting logs to populate metrics chart.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" component="h2" className="app-title">
                    ⚙️ Settings & Connection
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Configure the location of your local Spring Boot backend and monitor API connectivity.
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper className="glass-card" sx={{ p: 4 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        🔗 Server Settings
                      </Typography>
                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField 
                          fullWidth
                          label="Spring Boot Server URL"
                          value={backendUrl}
                          onChange={(e) => handleBackendUrlChange(e.target.value)}
                          placeholder="e.g. http://localhost:8080"
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc', borderRadius: 3 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              Server Connection Status
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Verifying local Spring Boot health check
                            </Typography>
                          </Box>
                          <span className={`badge-provider ${backendOnline ? 'badge-openai' : 'badge-groq'}`} style={{ textTransform: 'capitalize' }}>
                            {backendOnline ? '🟢 Connected' : '🔴 Offline'}
                          </span>
                        </Box>

                        <Button 
                          variant="outlined" 
                          onClick={checkBackendHealth}
                          fullWidth
                          sx={{ py: 1.2, borderRadius: 2 }}
                        >
                          Refresh Status
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        🔑 Active API Keys
                      </Typography>
                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          These properties indicate whether the local backend has active credential configs loaded in its `application.properties`.
                        </Typography>

                        {['groq', 'openai', 'gemini', 'claude'].map(prov => (
                          <Box key={prov} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                              {prov === 'claude' ? '🦉 CLAUDE / ANTHROPIC' : prov === 'openai' ? '🧠 OPENAI' : prov === 'gemini' ? '♊ GEMINI' : '⚡ GROQ'}
                            </Typography>
                            <span className={`badge-provider ${providerConfig[prov] ? 'badge-openai' : 'badge-groq'}`}>
                              {providerConfig[prov] ? 'ACTIVE' : 'NOT CONFIGURED'}
                            </span>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;