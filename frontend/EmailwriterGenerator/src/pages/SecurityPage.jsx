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

export default function SecurityPage({ onBack }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const sections = [
    {
      icon: '🏗️',
      title: '1. Security Architecture Overview',
      content: `MailGenie is designed with a security-first, local-deployment architecture. The application does not operate any cloud-hosted services that store user data. All components — the Spring Boot backend API, the Chrome Extension, and the React frontend — run on your own infrastructure. This design minimizes the attack surface by eliminating centralized data stores.`
    },
    {
      icon: '🔑',
      title: '2. API Key Management',
      content: `API keys for LLM providers (Groq, OpenAI, Google Gemini, Anthropic Claude) are managed entirely on your local machine:\n\n• Spring Boot Backend: Keys are stored in application.properties (git-ignored) and loaded as environment variables at runtime. They are never committed to version control.\n• Chrome Extension: If you provide a key override in the extension popup, it is stored in chrome.storage.local — a sandboxed, browser-managed storage that is not accessible by web pages.\n\nBest practice: Use environment variables or a secrets manager (e.g. HashiCorp Vault) rather than hardcoding keys in config files.`
    },
    {
      icon: '🌐',
      title: '3. Network Communication',
      content: `MailGenie's Chrome Extension uses Manifest V3, which enforces strict Content Security Policies and eliminates the use of remotely hosted code. All network requests made by the extension are declared in host_permissions in manifest.json (currently mail.google.com and localhost:8080). No external tracking or analytics endpoints are contacted. The extension communicates only with your locally running Spring Boot server.`
    },
    {
      icon: '🔐',
      title: '4. CORS and API Security',
      content: `The Spring Boot backend enables CORS only for the origins explicitly configured. In development mode (default), localhost origins are allowed. For any production or shared deployment, you should restrict CORS origins to specific trusted domains. Additionally, consider adding API authentication middleware (e.g. Bearer token validation) to the Spring Boot controller endpoints before exposing the backend on any non-localhost network interface.`
    },
    {
      icon: '💾',
      title: '5. Data at Rest',
      content: `Reply history is stored in a local embedded database (H2 by default, configurable to PostgreSQL or MySQL). This database contains email content snippets and generated replies. It is your responsibility to secure this database. Recommendations:\n• Use a password-protected PostgreSQL or MySQL instance for production.\n• Enable disk-level encryption on the machine hosting the backend.\n• Do not expose the database port publicly.\n• Regularly back up and audit the stored history data.`
    },
    {
      icon: '🛡️',
      title: '6. Chrome Extension Sandbox Security',
      content: `The MailGenie Chrome Extension operates within Chrome's isolated extension context. Content scripts run in an isolated JavaScript environment separate from the page's JavaScript context. The extension uses DOM mutation observers to inject UI controls — it does not extract or transmit any email content without explicit user action (clicking "✨ AI Reply"). The extension's permissions are scoped minimally to activeTab, storage, and the mail.google.com host pattern.`
    },
    {
      icon: '🔄',
      title: '7. Dependency and Supply Chain Security',
      content: `MailGenie uses well-established open-source dependencies: Spring Boot (Java), React + Vite (frontend), and Material UI (component library). To maintain supply chain security:\n• Regularly run npm audit and update npm dependencies.\n• Review Maven dependency updates via mvn versions:display-dependency-updates.\n• Pin dependency versions in package.json and pom.xml rather than using wildcard ranges.\n• Monitor the GitHub repository for security advisories via Dependabot.`
    },
    {
      icon: '🚨',
      title: '8. Vulnerability Reporting',
      content: `If you discover a security vulnerability in MailGenie, please report it responsibly. Do not publicly disclose security issues before they have been addressed. You can report security vulnerabilities by opening a GitHub security advisory on the repository or by contacting the maintainers directly. We aim to acknowledge reports within 48 hours and provide a patch within 14 days for confirmed vulnerabilities.`
    }
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom className="app-title">
            🔒 Security
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Last updated: July 2026 · Learn how MailGenie protects your data and how to deploy it securely.
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

      {/* Security Posture Banner */}
      <Paper
        className="glass-card"
        sx={{
          p: 3,
          mb: 5,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(245,80,54,0.08) 0%, rgba(99,102,241,0.10) 100%)'
            : 'linear-gradient(135deg, rgba(245,80,54,0.05) 0%, rgba(99,102,241,0.06) 100%)',
          borderLeft: '4px solid #f55036'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>🔐</Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#f55036' }}>
              Local-First Security Model
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              MailGenie is built with a zero-trust, local-deployment model. No external servers receive your credentials or email content — everything runs on your own infrastructure under your control.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Security Highlights */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { icon: '🚫', label: 'No Cloud Storage', desc: 'No MailGenie servers store your data.' },
          { icon: '🔑', label: 'Local Key Storage', desc: 'API keys stay in your browser or config file.' },
          { icon: '📋', label: 'MV3 Extension', desc: 'Manifest V3 for strict CSP compliance.' },
          { icon: '🔎', label: 'Open Source Audit', desc: 'Full source is publicly auditable on GitHub.' },
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

      {/* Detailed Sections */}
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

      {/* Security Checklist */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          🛡️ Security Deployment Checklist
        </Typography>
        <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
        <Grid container spacing={2}>
          {[
            { check: 'Store API keys in environment variables, not plain config files', severity: 'critical' },
            { check: 'Add application.properties to .gitignore (already included in template)', severity: 'critical' },
            { check: 'Restrict Spring Boot CORS to your trusted frontend origin only', severity: 'high' },
            { check: 'Firewall port 8080 to localhost-only traffic in production', severity: 'high' },
            { check: 'Use PostgreSQL with password authentication for production history DB', severity: 'medium' },
            { check: 'Run npm audit and mvn dependency-check regularly', severity: 'medium' },
            { check: 'Enable disk encryption on the machine running the backend', severity: 'medium' },
            { check: 'Monitor GitHub Dependabot alerts for the repository', severity: 'low' },
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.check}>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      mt: '5px',
                      mr: 1.5,
                      flexShrink: 0,
                      bgcolor: item.severity === 'critical' ? '#f55036' : item.severity === 'high' ? '#f59e0b' : item.severity === 'medium' ? '#6366f1' : '#10b981'
                    }}
                  />
                  <ListItemText
                    primary={item.check}
                    secondary={item.severity.toUpperCase()}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', lineHeight: 1.6 }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      sx: {
                        fontWeight: 700,
                        color: item.severity === 'critical' ? '#f55036' : item.severity === 'high' ? '#f59e0b' : item.severity === 'medium' ? '#6366f1' : '#10b981'
                      }
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Footer CTA */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Found a security issue? Please report it responsibly to the MailGenie team.
        </Typography>
        <Button
          variant="contained"
          className="gradient-btn"
          onClick={() => onBack && onBack('contact')}
          sx={{ mr: 2 }}
        >
          Report a Vulnerability
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
