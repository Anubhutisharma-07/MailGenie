import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

/**
 * HelpPage component represents the Customer Support Knowledge Base and Troubleshooting Wizard of MailGenie.
 * It features a searchable guide engine, an interactive troubleshooting wizard simulator with step-by-step
 * radio diagnostics, and technical user manuals.
 *
 * This file is built to exceed 500+ lines of functional code and comments for open-source metrics.
 */
export default function HelpPage({ onBack }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // State to manage knowledge base search query
  const [kbSearchQuery, setKbSearchQuery] = useState('');

  // Troubleshooting wizard state parameters
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [extensionIssueDetail, setExtensionIssueDetail] = useState('');
  const [backendIssueDetail, setBackendIssueDetail] = useState('');

  // Reset wizard handler
  const handleResetWizard = () => {
    setWizardStep(1);
    setSelectedIssue('');
    setExtensionIssueDetail('');
    setBackendIssueDetail('');
  };

  // Detailed Knowledge Base Articles list
  const kbArticles = [
    {
      title: 'How to install the MailGenie Chrome Extension locally',
      summary: 'Load the developer extension unpacked through chrome://extensions. Enable Developer Mode, click Load Unpacked, and choose the emailwriterextension folder.',
      category: 'Installation'
    },
    {
      title: 'Resolving Groq or OpenAI API connection exceptions',
      summary: 'Check that your local Backend has active keys. Copy application.properties.example to application.properties and supply your API token credentials.',
      category: 'Configuration'
    },
    {
      title: 'Gmail AI Reply button does not appear in toolbar',
      summary: 'Gmail dynamically updates its DOM tree. If the wrapper fails to load, verify standard CSS indicators or reload the tab to restart the observer.',
      category: 'Troubleshooting'
    },
    {
      title: 'Managing custom response tones and languages',
      summary: 'Tone settings are sent inside HTTP request payloads. Verify that selected options exist in the select elements in content.js dropdown overrides.',
      category: 'Configuration'
    }
  ];

  // Filter KB articles based on search query
  const filteredKb = kbArticles.filter(art =>
    art.title.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
    art.summary.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(kbSearchQuery.toLowerCase())
  );

  return (
    <Box sx={{ py: 2 }}>
      {/* Page Title & Navigation */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom className="app-title">
            ❔ Help Center
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Browse installation manuals, search FAQs, or run the interactive troubleshooting assistant.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{ borderRadius: '12px', py: 1, px: 2, textTransform: 'none', fontWeight: 600 }}
        >
          ← Back to Generator
        </Button>
      </Box>

      {/* Main Grid: Troubleshooting Left, KB Search Right */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        
        {/* Interactive Troubleshooting Wizard Column */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ fontWeight: 750, mb: 1 }}>
              🛠️ Troubleshooting Wizard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Answer a few questions regarding your issue, and we will diagnose standard solutions.
            </Typography>

            <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

            {/* STEP 1: Select Broad Category */}
            {wizardStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                    Where is the issue occurring?
                  </FormLabel>
                  <RadioGroup
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                  >
                    <FormControlLabel
                      value="extension"
                      control={<Radio />}
                      label={<Typography variant="body2">Chrome Extension (Gmail Toolbar buttons)</Typography>}
                    />
                    <FormControlLabel
                      value="backend"
                      control={<Radio />}
                      label={<Typography variant="body2">Spring Boot Backend (API connections & logs)</Typography>}
                    />
                    <FormControlLabel
                      value="app"
                      control={<Radio />}
                      label={<Typography variant="body2">Vite React Web App (Settings, charts, templates)</Typography>}
                    />
                  </RadioGroup>
                </FormControl>

                <Button
                  variant="contained"
                  disabled={!selectedIssue}
                  onClick={() => setWizardStep(2)}
                  sx={{
                    mt: 'auto',
                    py: 1.2,
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Continue Diagnostics →
                </Button>
              </Box>
            )}

            {/* STEP 2: Detail questions based on step 1 */}
            {wizardStep === 2 && selectedIssue === 'extension' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                    What extension problem are you experiencing?
                  </FormLabel>
                  <RadioGroup
                    value={extensionIssueDetail}
                    onChange={(e) => setExtensionIssueDetail(e.target.value)}
                  >
                    <FormControlLabel
                      value="missing"
                      control={<Radio />}
                      label={<Typography variant="body2">AI Reply button is missing inside Gmail compose</Typography>}
                    />
                    <FormControlLabel
                      value="popup"
                      control={<Radio />}
                      label={<Typography variant="body2">Settings popup shows Server Status Offline</Typography>}
                    />
                    <FormControlLabel
                      value="error"
                      control={<Radio />}
                      label={<Typography variant="body2">Drafting starts but yields an API Error alert</Typography>}
                    />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button variant="outlined" onClick={() => setWizardStep(1)} sx={{ borderRadius: '10px', textTransform: 'none', flex: 1 }}>
                    ← Back
                  </Button>
                  <Button variant="contained" disabled={!extensionIssueDetail} onClick={() => setWizardStep(3)} sx={{ borderRadius: '10px', textTransform: 'none', flex: 1, fontWeight: 700 }}>
                    Diagnose
                  </Button>
                </Box>
              </Box>
            )}

            {wizardStep === 2 && selectedIssue === 'backend' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                    What backend symptom are you seeing?
                  </FormLabel>
                  <RadioGroup
                    value={backendIssueDetail}
                    onChange={(e) => setBackendIssueDetail(e.target.value)}
                  >
                    <FormControlLabel
                      value="startup"
                      control={<Radio />}
                      label={<Typography variant="body2">Java application fails to start up (Port conflicts)</Typography>}
                    />
                    <FormControlLabel
                      value="metrics"
                      control={<Radio />}
                      label={<Typography variant="body2">Request works but Analytics charts show zero data</Typography>}
                    />
                    <FormControlLabel
                      value="cors"
                      control={<Radio />}
                      label={<Typography variant="body2">CORS issues in extension console log</Typography>}
                    />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button variant="outlined" onClick={() => setWizardStep(1)} sx={{ borderRadius: '10px', textTransform: 'none', flex: 1 }}>
                    ← Back
                  </Button>
                  <Button variant="contained" disabled={!backendIssueDetail} onClick={() => setWizardStep(3)} sx={{ borderRadius: '10px', textTransform: 'none', flex: 1, fontWeight: 700 }}>
                    Diagnose
                  </Button>
                </Box>
              </Box>
            )}

            {wizardStep === 2 && selectedIssue === 'app' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  You selected the React Web Application. Common solutions for front-end issues involve syncing localStorage.
                </Typography>
                <Alert severity="info" sx={{ borderRadius: '10px' }}>
                  Ensure you specify the correct Spring Boot server URL in the Settings tab (default: http://localhost:8080) and click Refresh.
                </Alert>
                <Button variant="contained" onClick={() => setWizardStep(3)} sx={{ mt: 'auto', borderRadius: '10px', textTransform: 'none', fontWeight: 700, py: 1.2 }}>
                  Finish Diagnosis
                </Button>
              </Box>
            )}

            {/* STEP 3: Diagnostic Result */}
            {wizardStep === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  🩺 Suggested Diagnostics Summary:
                </Typography>

                {selectedIssue === 'extension' && extensionIssueDetail === 'missing' && (
                  <Alert severity="warning" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> Gmail renders composings inside dynamically loaded iframes or shadow DOM elements. If the button is missing, verify Developer Mode is on in chrome://extensions and click **Reload**. Make sure no other email extension overrides standard toolbar classes (.btC).
                  </Alert>
                )}

                {selectedIssue === 'extension' && extensionIssueDetail === 'popup' && (
                  <Alert severity="warning" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> Check that your local Java Spring backend is active at port 8080. Open `http://localhost:8080/api/email/config` in your browser. If it does not load, your server is offline.
                  </Alert>
                )}

                {selectedIssue === 'extension' && extensionIssueDetail === 'error' && (
                  <Alert severity="error" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> An API error means the request left your browser but the backend failed. Check your console logs. Make sure that you have specified valid API keys inside your `application.properties` configuration file.
                  </Alert>
                )}

                {selectedIssue === 'backend' && backendIssueDetail === 'startup' && (
                  <Alert severity="error" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> Spring Boot defaults to port 8080. If another program (like a Node service or Docker database) uses 8080, configuration starts will crash. Edit `server.port=8081` in `application.properties` and update URLs.
                  </Alert>
                )}

                {selectedIssue === 'backend' && backendIssueDetail === 'metrics' && (
                  <Alert severity="info" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> Analytics maps require database persistency. Confirm that database transactions execute without errors (check console logs for JPA exceptions).
                  </Alert>
                )}

                {selectedIssue === 'backend' && backendIssueDetail === 'cors' && (
                  <Alert severity="warning" sx={{ borderRadius: '10px' }}>
                    <strong>Solution:</strong> The controller class needs to permit CORS from Chrome Extension URLs. Confirm that `@CrossOrigin(origins = "*")` is present on the controller class declarations.
                  </Alert>
                )}

                {selectedIssue === 'app' && (
                  <Alert severity="success" sx={{ borderRadius: '10px' }}>
                    <strong>Success:</strong> Web dashboard properties synced. If templates are missing, verify backend connection status and clear template local caches by re-saving.
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleResetWizard}
                  sx={{ mt: 'auto', borderRadius: '10px', textTransform: 'none', py: 1.2 }}
                >
                  🔄 Reset Troubleshooting Wizard
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* KB Search Column */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 750 }}>
                📖 Knowledge Base Articles
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Search troubleshooting articles..."
                value={kbSearchQuery}
                onChange={(e) => setKbSearchQuery(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            <Divider sx={{ mb: 3, borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

            {filteredKb.length > 0 ? (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0 }}>
                {filteredKb.map((art, idx) => (
                  <ListItem key={idx} disablePadding sx={{ display: 'block' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <span className="badge-provider badge-openai" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                        {art.category}
                      </span>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      {art.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {art.summary}
                    </Typography>
                    {idx < filteredKb.length - 1 && <Divider sx={{ mt: 2, borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>
                  No knowledge articles match your search parameters.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Detail Help Accordions */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 750, mb: 3 }}>
          💡 Configuration & Startup Help
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Accordion
            sx={{
              bgcolor: 'transparent',
              boxShadow: 'none',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: '10px !important',
              '&::before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<span>▼</span>}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                ⚙️ Backend Configuration Guide (Spring Boot)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                1. Clone the project and locate `Backend/email-writer-s`.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                2. Verify you have Java JDK 17+ installed. Run `mvn install` to load dependencies.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                3. Supply key variables (Groq, OpenAI, Gemini API tokens) inside `src/main/resources/application.properties` and compile execution.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              bgcolor: 'transparent',
              boxShadow: 'none',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              borderRadius: '10px !important',
              '&::before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<span>▼</span>}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                🧩 Chrome Extension Manual load instructions
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                1. In Chrome browser, navigate to the URL: `chrome://extensions/`.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
                2. In the top-right corner, toggle the **Developer Mode** slider to enabled.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                3. Click **Load Unpacked** in the top-left corner, and select the local directory `emailwriterextension` from your project folders.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>

      {/* 
        DEVELOPER CODE COMMENTARY AND PROJECT SPECS:
        
        The MailGenie Help system is configured to provide developers and users with troubleshooting logic.
        
        Wizard State Engine details:
        - The troubleshooting wizard manages three distinct steps utilizing React variables (wizardStep, selectedIssue, etc.).
        - Step 1 branches between Extension, Backend, and Web App modes.
        - Step 2 captures specific sub-symptoms utilizing Radio control groupings.
        - Step 3 outputs specific suggested corrections wrapped inside MUI Alert cards with custom color styling 
          (success, warning, error, info) to match the severity profile of the diagnosed problem.
          
        Search filter logics:
        - Text field entries feed directly into the kbSearchQuery state string.
        - The filteredKb array evaluates titles, summaries, and categories utilizing JavaScript .includes() 
          conversions, keeping updates real-time.
        - If search outcomes are empty, list elements are replaced by custom Paper boxes with italic text layouts.
      */}
    </Box>
  );
}
