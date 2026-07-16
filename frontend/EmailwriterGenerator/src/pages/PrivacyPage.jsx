import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme
} from '@mui/material';

export default function PrivacyPage({ onBack }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const sections = [
    {
      icon: '📌',
      title: '1. Overview',
      content: `MailGenie ("we", "our", "the Application") is committed to protecting your privacy. This Privacy Policy explains what information MailGenie collects, how it is used, and your rights with respect to your data. As an open-source project, we operate with full transparency regarding data handling.`
    },
    {
      icon: '📥',
      title: '2. Information We Collect',
      content: `MailGenie itself does not collect or store any personal information on external servers. The Application operates primarily on your local machine. The following data is processed locally: email thread context you paste into the generator, your selected AI provider preferences, tone and language preferences, generated reply history (stored in your local Spring Boot database), and API keys (stored only in your local browser or configuration file).`
    },
    {
      icon: '🔄',
      title: '3. How Your Data Is Used',
      content: `Email content you submit is sent directly to the third-party LLM API you have configured (Groq, OpenAI, Gemini, or Claude). This data is used solely to generate email reply drafts. MailGenie does not retain, analyze, or transmit your email content to any MailGenie-operated servers. All processing happens between your local backend and the LLM provider's API.`
    },
    {
      icon: '🌐',
      title: '4. Third-Party AI Providers',
      content: `When you use MailGenie to generate replies, your email content is transmitted to your selected AI provider's API. Each provider operates under their own privacy policy:\n• Groq: groq.com/privacy\n• OpenAI: openai.com/privacy\n• Google Gemini: policies.google.com/privacy\n• Anthropic Claude: anthropic.com/privacy\n\nWe strongly recommend reviewing each provider's policy before using their model for sensitive communications.`
    },
    {
      icon: '🍪',
      title: '5. Cookies and Local Storage',
      content: `MailGenie uses your browser's localStorage to persist your preferences including dark/light theme selection, configured backend server URL, and custom email templates you have saved. No tracking cookies, analytics scripts, or fingerprinting technologies are used by MailGenie. The Chrome Extension uses chrome.storage.local to store your API key overrides and default settings.`
    },
    {
      icon: '🔒',
      title: '6. Data Security',
      content: `Because MailGenie is a fully local application, your security posture depends largely on the security of your own machine and the LLM providers you use. We recommend: using environment variables or secure vault tools for API key management in production, not pasting highly sensitive or classified email content into the generator, and keeping your local Spring Boot server port (default 8080) firewalled from public access.`
    },
    {
      icon: '👤',
      title: '7. Your Rights',
      content: `Since MailGenie does not collect data on external servers, traditional data deletion or access requests are not applicable to MailGenie itself. All your data (history, templates, preferences) can be deleted directly from your local database or by clearing your browser's localStorage. You retain full control over your data at all times.`
    },
    {
      icon: '🔄',
      title: '8. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. Changes will be documented in the MailGenie GitHub repository changelog. We encourage you to periodically review this policy. Continued use of MailGenie after any policy changes constitutes acceptance of the updated policy.`
    }
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom className="app-title">
            🔏 Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Last updated: July 2026 · Your privacy matters — here's exactly how MailGenie handles your data.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ borderRadius: '12px', py: 1, px: 2, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          ← Back to Generator
        </Button>
      </Box>

      {/* Privacy Promise Banner */}
      <Paper
        className="glass-card"
        sx={{
          p: 3,
          mb: 5,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(99,102,241,0.08) 100%)'
            : 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(99,102,241,0.04) 100%)',
          borderLeft: '4px solid #10b981'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>🛡️</Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#10b981' }}>
              Privacy-First Architecture
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              MailGenie runs entirely on your own machine. No personal data, email content, or API credentials are ever sent to MailGenie-operated servers. Your data stays with you.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* At-a-glance cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { icon: '🚫', label: 'No Tracking', desc: 'Zero analytics, cookies, or fingerprinting scripts.' },
          { icon: '🏠', label: 'Local First', desc: 'All history and templates stored on your own machine.' },
          { icon: '🔑', label: 'Key Safety', desc: 'API keys stored locally in browser storage or config files.' },
          { icon: '🤝', label: 'Open Source', desc: 'Full codebase publicly auditable on GitHub.' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Paper
              className="glass-card"
              sx={{ p: 3, textAlign: 'center', height: '100%' }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>{item.icon}</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{item.label}</Typography>
              <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sections */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {sections.map((section) => (
          <Grid item xs={12} key={section.title}>
            <Paper className="glass-card" sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h5" sx={{ lineHeight: 1 }}>{section.icon}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {section.title}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2.5, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                {section.content}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Third-party links quick reference */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          🔗 Third-Party Provider Privacy Policies
        </Typography>
        <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
        <List sx={{ p: 0 }}>
          {[
            { provider: '⚡ Groq', url: 'https://groq.com/privacy' },
            { provider: '🧠 OpenAI', url: 'https://openai.com/privacy' },
            { provider: '♊ Google Gemini', url: 'https://policies.google.com/privacy' },
            { provider: '🦉 Anthropic Claude', url: 'https://www.anthropic.com/privacy' },
          ].map((item) => (
            <ListItem key={item.provider} sx={{ px: 0, py: 0.8 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', mr: 2, flexShrink: 0 }} />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 140 }}>{item.provider}</Typography>
                    <Typography
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {item.url}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Footer CTA */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Have a privacy concern or question? Reach out to the MailGenie maintainers.
        </Typography>
        <Button
          variant="contained"
          className="gradient-btn"
          onClick={() => onBack && onBack('contact')}
          sx={{ mr: 2 }}
        >
          Contact Us
        </Button>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
        >
          Back to Generator
        </Button>
      </Box>
    </Box>
  );
}
