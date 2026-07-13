import { useState, useEffect } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Paper, Card, CardContent, Divider } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // History states
  const [historyList, setHistoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempComment, setTempComment] = useState('');

  // Fetch email reply history from backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/history");
      setHistoryList(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
       emailContent,
       tone 
      });
      const reply = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(reply);
      // Refresh history log to display new entry
      fetchHistory();
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, background: 'linear-gradient(145deg, #ffffff, #f5f7fa)' }}>
        <Typography variant='h3' component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a365d' }}>
          💌 MailGenie
        </Typography>
        <Typography variant='subtitle1' sx={{ color: '#4a5568', mb: 4 }}>
          AI-Powered Email Writer & Reply Assistant
        </Typography>

        <Box sx={{ mx: 0 }}>
          <TextField 
            fullWidth
            multiline
            rows={5}
            variant='outlined'
            label="Original Email Content"
            placeholder="Paste the email you received here..."
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}/>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional 👔</MenuItem>
                <MenuItem value="casual">Casual ☕</MenuItem>
                <MenuItem value="friendly">Friendly 😊</MenuItem>
                <MenuItem value="persuasive">Persuasive 🎯</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            size="large"
            sx={{ py: 1.5, fontSize: '1.1rem', textTransform: 'none', borderRadius: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Generate AI Reply"}
          </Button>
        </Box>

        {error && (
          <Typography color='error' sx={{ mt: 3, textAlign: 'center' }}>
            ⚠️ {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ my: 3 }} />
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: '#2b6cb0' }}>
              🤖 Generated AI Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              variant='outlined'
              value={generatedReply || ''}
              inputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#f7fafc', borderRadius: 1 }}/>
            
            <Button
              variant='outlined'
              sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}>
              📋 Copy to Clipboard
            </Button>
          </Box>
        )}
      </Paper>

      {/* History section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant='h4' component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#2d3748', mb: 3 }}>
          📜 Generation History & Notes
        </Typography>

        {historyList.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#718096', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
            No history records found. Generated emails will appear here.
          </Typography>
        ) : (
          historyList.map((item) => (
            <Card key={item.id} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    📅 {new Date(item.createdAt).toLocaleString()} | ⚙️ Tone: <strong>{item.tone || 'None'}</strong>
                  </Typography>
                  <Button 
                    variant="text" 
                    color="error" 
                    size="small" 
                    onClick={() => handleDeleteHistory(item.id)}
                    sx={{ textTransform: 'none' }}>
                    🗑️ Delete
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4a5568', mb: 1 }}>
                  ✉️ Original Email:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f7fafc', p: 1.5, borderRadius: 1, mb: 2, color: '#718096' }}>
                  {item.originalContent}
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2b6cb0', mb: 1 }}>
                  🤖 Generated Reply:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#ebf8ff', p: 1.5, borderRadius: 1, mb: 2, color: '#2d3748' }}>
                  {item.generatedReply}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                {/* Comment Section */}
                <Box>
                  {editingId === item.id ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment or note..."
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                      />
                      <Button variant="contained" size="small" onClick={() => handleUpdateComment(item.id)}>
                        💾 Save
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => setEditingId(null)}>
                        ❌ Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ color: '#4a5568' }}>
                        💬 <strong>Note:</strong> {item.userComment ? item.userComment : <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>No notes added yet</span>}
                      </Typography>
                      <Button variant="text" size="small" onClick={() => startEditing(item.id, item.userComment)}>
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
  )
}

export default App