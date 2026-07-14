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
  Tooltip, 
  Grid,
  InputAdornment
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [provider, setProvider] = useState('groq');
  const [model, setModel] = useState('');
  const [language, setLanguage] = useState('English');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // History and config states
  const [historyList, setHistoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempComment, setTempComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [providerConfig, setProviderConfig] = useState({ groq: true, openai: false, gemini: false, claude: false });

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
        default: isDarkMode ? '#0b0f19' : '#f1f5f9',
        paper: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#1e293b',
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

  // Sync theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    fetchConfig();
    fetchHistory();
  }, []);

  // Fetch API Provider settings
  const fetchConfig = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/email/config");
      setProviderConfig(response.data);
      // Auto select first configured provider
      if (response.data) {
        if (response.data.groq) setProvider( 'groq' );
        else if (response.data.openai) setProvider( 'openai' );
        else if (response.data.gemini) setProvider( 'gemini' );
        else if (response.data.claude) setProvider( 'claude' );
      }
    } catch (err) {
      console.error("Failed to fetch provider config:", err);
    }
  };

  // Fetch email reply history from backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/history");
      setHistoryList(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
        provider,
        model,
        language
      });
      const reply = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(reply);
      fetchHistory();
    } catch (err) {
      setError('Failed to generate email reply. Please verify connection and configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/history/${id}/comment`, tempComment, {
        headers: { 'Content-Type': 'application/json' }
      });
      setEditingId(null);
      fetchHistory();
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (window.confirm("Are you sure you want to delete this history record?")) {
      try {
        await axios.delete(`http://localhost:8080/api/history/${id}`);
        fetchHistory();
      } catch (err) {
        console.error("Failed to delete history:", err);
      }
    }
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant='h3' component="h1" className="app-title" sx={{ m: 0 }}>
              💌 MailGenie
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'text.secondary', fontWeight: 500 }}>
              AI-Powered Email Writer & Gmail Assistant
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch checked={isDarkMode} onChange={toggleTheme} color="primary" />
            }
            label={isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            sx={{ color: 'text.secondary' }}
          />
        </Box>

        {/* Generate Box */}
        <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField 
              fullWidth
              multiline
              rows={5}
              variant='outlined'
              label="Original Email"
              placeholder="Paste the email thread or content you received here..."
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
                    <MenuItem value="groq" disabled={!providerConfig.groq}>
                      ⚡ Groq {providerConfig.groq ? ' (Active)' : ' (Not configured)'}
                    </MenuItem>
                    <MenuItem value="openai" disabled={!providerConfig.openai}>
                      🧠 OpenAI {providerConfig.openai ? ' (Active)' : ' (Not configured)'}
                    </MenuItem>
                    <MenuItem value="gemini" disabled={!providerConfig.gemini}>
                      ♊ Gemini {providerConfig.gemini ? ' (Active)' : ' (Not configured)'}
                    </MenuItem>
                    <MenuItem value="claude" disabled={!providerConfig.claude}>
                      🦉 Claude {providerConfig.claude ? ' (Active)' : ' (Not configured)'}
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
                  <InputLabel>Reply Language</InputLabel>
                  <Select
                    value={language}
                    label="Reply Language"
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

            {/* Custom Model input (Optional) */}
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Custom Model Name (Optional)"
              placeholder="e.g. llama-3.3-70b-versatile, gpt-4o-mini, gemini-2.5-flash"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="glow-input"
            />

            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              size="large"
              className="gradient-btn"
              sx={{ py: 1.8, fontSize: '1rem' }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Drafting Response...</span>
                </Box>
              ) : "Generate AI Reply"}
            </Button>
          </Box>

          {error && (
            <Typography color='error' sx={{ mt: 3, textAlign: 'center', fontWeight: 500 }}>
              ⚠️ {error}
            </Typography>
          )}

          {generatedReply && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' gutterBottom sx={{ color: 'primary.main', mb: 1.5 }}>
                ✨ Drafted AI Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={7}
                variant='outlined'
                value={generatedReply}
                inputProps={{ readOnly: true }}
                sx={{ 
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : '#f8fafc', 
                  borderRadius: 2 
                }}
              />
              
              <Button
                variant={copied ? 'contained' : 'outlined'}
                color={copied ? 'success' : 'primary'}
                sx={{ mt: 2, textTransform: 'none', borderRadius: 2.5, px: 3, py: 1 }}
                onClick={handleCopy}
              >
                {copied ? '✅ Copied to Clipboard!' : '📋 Copy Reply'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* History Section */}
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant='h4' component="h2" sx={{ m: 0, fontWeight: 'bold' }}>
              📜 History & Saved Notes
            </Typography>
            
            <TextField
              size="small"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    🔍
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {filteredHistory.length === 0 ? (
            <Paper className="glass-card" sx={{ py: 6, px: 3, textAlign: 'center' }}>
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
                      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
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

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                    ✉️ Original Email:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    whiteSpace: 'pre-wrap', 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2, 
                    color: 'text.secondary',
                    fontSize: '0.875rem' 
                  }}>
                    {item.originalContent}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                    🤖 Generated Reply:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    whiteSpace: 'pre-wrap', 
                    backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.08)' : '#eef2ff', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2, 
                    color: 'text.primary',
                    fontSize: '0.875rem'
                  }}>
                    {item.generatedReply}
                  </Typography>

                  <Divider sx={{ my: 2, opacity: 0.4 }} />

                  {/* Comment/Note section */}
                  <Box>
                    {editingId === item.id ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Edit your private comments/notes for this email..."
                          value={tempComment}
                          onChange={(e) => setTempComment(e.target.value)}
                          className="glow-input"
                        />
                        <Button variant="contained" size="small" onClick={() => handleUpdateComment(item.id)}>
                          Save
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          💬 <strong>Note:</strong> {item.userComment ? item.userComment : <span style={{ fontStyle: 'italic', opacity: 0.7 }}>No notes saved</span>}
                        </Typography>
                        <Button variant="text" size="small" onClick={() => startEditing(item.id, item.userComment)} sx={{ textTransform: 'none' }}>
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
      </Container>
    </ThemeProvider>
  );
}

export default App;