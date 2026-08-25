import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import {
    Box, Typography, CircularProgress, Card, CardContent, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

const EnterpriseSecurityHub = () => {
    const backendUrl = useStore((state) => state.backendUrl);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dlpResult, setDlpResult] = useState(null);
    const [testPrompt, setTestPrompt] = useState('My phone is 555-123-4567 and my credit card is 4111-2222-3333-4444.');
    const [testing, setTesting] = useState(false);

    // Modal state
    const [openAdd, setOpenAdd] = useState(false);
    const [newPolicy, setNewPolicy] = useState({
        policyName: '', prohibitedKeywords: '', enforceDataLossPrevention: true, 
        requireAuditLog: true, strictnessLevel: 'HIGH'
    });
    const [saving, setSaving] = useState(false);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/security/policies');
            const data = await res.json();
            setPolicies(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleSavePolicy = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:8080/api/security/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPolicy)
            });
            if (res.ok) {
                fetchPolicies();
                setOpenAdd(false);
                setNewPolicy({
                    policyName: '', prohibitedKeywords: '', enforceDataLossPrevention: true, 
                    requireAuditLog: true, strictnessLevel: 'HIGH'
                });
            }
        } catch (err) {
            console.error("Failed to save policy", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this security policy?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/security/policies/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchPolicies();
        } catch (err) {
            console.error(err);
        }
    };

    const handleTestDlp = async () => {
        if (!testPrompt.trim()) return;
        setTesting(true);
        try {
            const res = await fetch('http://localhost:8080/api/security/dlp/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: testPrompt })
            });
            const data = await res.json();
            setDlpResult(data);
        } catch (err) {
            console.error("Failed to run DLP scan", err);
        } finally {
            setTesting(false);
        }
    };

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: '#e0e0e0',
        padding: '24px'
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #09090b 0%, #1c152a 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 4px 20px rgba(138, 43, 226, 0.5)' }}>
                    Enterprise Security & DLP Hub
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => setOpenAdd(true)}
                    sx={{ background: 'linear-gradient(45deg, #8a2be2, #ff007f)', fontWeight: 'bold', px: 4, py: 1.5, borderRadius: '8px' }}
                >
                    + Create Policy Guardrail
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Policy List */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Active Access Policies</Typography>
                    
                    {loading ? (
                        <CircularProgress sx={{ color: '#ff007f' }} />
                    ) : (
                        <TableContainer component={Paper} sx={{ ...glassStyle, padding: 0 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>POLICY NAME</TableCell>
                                        <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>STRICTNESS</TableCell>
                                        <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>DLP ACTIVE</TableCell>
                                        <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>KEYWORDS</TableCell>
                                        <TableCell align="right" sx={{ color: '#888', fontWeight: 'bold' }}>ACTION</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {policies.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{row.policyName}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={row.strictnessLevel} 
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: row.strictnessLevel === 'HIGH' ? 'rgba(255,0,127,0.2)' : 'rgba(138,43,226,0.2)',
                                                        color: row.strictnessLevel === 'HIGH' ? '#ff007f' : '#b266ff',
                                                        fontWeight: 'bold' 
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.enforceDataLossPrevention ? '🟢 Enforced' : '⚪ Disabled'}
                                            </TableCell>
                                            <TableCell sx={{ color: '#aaa', fontStyle: 'italic', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.prohibitedKeywords || 'None'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button size="small" variant="text" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {policies.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ color: '#666', py: 4 }}>
                                                No active security policies. Click "Create Policy Guardrail" to add one.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>

                {/* DLP Simulator */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Live DLP Sandbox Engine</Typography>
                    <Card sx={{ ...glassStyle, mb: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: '#ccc', mb: 2 }}>
                                Test prompts against active security policies to ensure Data Loss Prevention (PII Redaction) works correctly before allowing LLC execution.
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={testPrompt}
                                onChange={(e) => setTestPrompt(e.target.value)}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                            />
                            <Button 
                                variant="outlined" 
                                onClick={handleTestDlp}
                                disabled={testing || !testPrompt.trim()}
                                fullWidth
                                sx={{ color: '#00e5ff', borderColor: '#00e5ff', py: 1.5, '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)' } }}
                            >
                                {testing ? 'Scanning Profile...' : 'Run Simulation Scan'}
                            </Button>
                        </CardContent>
                    </Card>

                    {dlpResult && (
                        <Card sx={{ ...glassStyle, border: dlpResult.isBlocked ? '2px solid #ff1744' : '2px solid #00e676' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6" sx={{ color: dlpResult.isBlocked ? '#ff1744' : '#00e676', fontWeight: 800 }}>
                                        {dlpResult.isBlocked ? '🚫 GENERATION BLOCKED' : '✅ SAFE TO GENERATE'}
                                    </Typography>
                                    <Chip label={`Threat: ${dlpResult.threatScore}/100`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }} />
                                </Box>
                                <Typography variant="subtitle2" color="gray">Scan Time: {dlpResult.scanTimeMs}ms</Typography>
                                
                                {dlpResult.violations.length > 0 && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" color="#ff1744" fontWeight="bold">Policy Violations:</Typography>
                                        <ul style={{ color: '#ff5252', paddingLeft: '20px', marginTop: '4px' }}>
                                            {dlpResult.violations.map((v, i) => <li key={i}>{v}</li>)}
                                        </ul>
                                    </Box>
                                )}
                                
                                <Box mt={3} p={2} sx={{ bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 'bold' }}>SANITIZED PAYLOAD OUTPUT</Typography>
                                    <Typography variant="body2" sx={{ color: '#fff', mt: 1, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                        {dlpResult.sanitizedPayload}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>

            {/* Create Policy Modal */}
            <Dialog 
                open={openAdd} 
                onClose={() => setOpenAdd(false)}
                PaperProps={{
                    sx: { bgcolor: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, width: '500px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Create Security Guardrail</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth label="Policy Rule Name" 
                        variant="outlined" 
                        margin="dense" sx={{ mt: 2 }}
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={newPolicy.policyName}
                        onChange={(e) => setNewPolicy({ ...newPolicy, policyName: e.target.value })}
                    />
                    <TextField 
                        fullWidth label="Blocked Keywords (comma-separated)" 
                        variant="outlined" 
                        margin="dense"
                        multiline rows={2}
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={newPolicy.prohibitedKeywords}
                        onChange={(e) => setNewPolicy({ ...newPolicy, prohibitedKeywords: e.target.value })}
                    />
                    
                    <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: '#888' }}>Enforcement Strictness</InputLabel>
                        <Select
                            value={newPolicy.strictnessLevel}
                            onChange={(e) => setNewPolicy({ ...newPolicy, strictnessLevel: e.target.value })}
                            sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                        >
                            <MenuItem value="LOW">Low (Monitor)</MenuItem>
                            <MenuItem value="MODERATE">Moderate (Warn)</MenuItem>
                            <MenuItem value="HIGH">High (Block/Redact)</MenuItem>
                        </Select>
                    </FormControl>

                    <Box mt={2}>
                        <FormControlLabel
                            control={<Switch checked={newPolicy.enforceDataLossPrevention} onChange={(e) => setNewPolicy({ ...newPolicy, enforceDataLossPrevention: e.target.checked })} color="secondary" />}
                            label="Enforce DLP Scanning (Credit Cards, SSN)"
                        />
                        <FormControlLabel
                            control={<Switch checked={newPolicy.requireAuditLog} onChange={(e) => setNewPolicy({ ...newPolicy, requireAuditLog: e.target.checked })} color="primary" />}
                            label="Require Audit Documentation"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setOpenAdd(false)} sx={{ color: '#aaa' }}>Cancel</Button>
                    <Button 
                        onClick={handleSavePolicy} 
                        disabled={saving || !newPolicy.policyName}
                        variant="contained" 
                        sx={{ background: 'linear-gradient(45deg, #8a2be2, #ff007f)', fontWeight: 'bold' }}
                    >
                        {saving ? 'Saving...' : 'Deploy Policy'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnterpriseSecurityHub;
