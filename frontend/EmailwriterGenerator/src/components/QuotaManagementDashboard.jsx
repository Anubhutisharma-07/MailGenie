import React, { useEffect, useState } from 'react';
import {
    Box, Typography, CircularProgress, Card, CardContent, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

const QuotaManagementDashboard = () => {
    const [rules, setRules] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    const [simForm, setSimForm] = useState({ userId: '', requestedTokens: 1000 });
    const [simResult, setSimResult] = useState(null);
    const [simulating, setSimulating] = useState(false);

    const fetchState = async () => {
        try {
            setLoading(true);
            const [rulesRes, memRes] = await Promise.all([
                fetch('http://localhost:8080/api/quotas/rules'),
                fetch('http://localhost:8080/api/quotas/metrics')
            ]);

            const rData = await rulesRes.json();

            if (rData.length === 0) {
                // Seed if empty
                await fetch('http://localhost:8080/api/quotas/seed', { method: 'POST' });
                const rRetry = await fetch('http://localhost:8080/api/quotas/rules');
                setRules(await rRetry.json());
            } else {
                setRules(rData);
            }
            setMetrics(await memRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchState();
    }, []);

    const handleSimulate = async () => {
        setSimulating(true);
        try {
            const res = await fetch('http://localhost:8080/api/quotas/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(simForm)
            });
            const data = await res.json();
            setSimResult(data);
            fetchState(); // refresh metrics table
        } catch (err) {
            console.error(err);
        } finally {
            setSimulating(false);
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} sx={{ color: '#fbbf24' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #4c0519 0%, #020617 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 4px 20px rgba(251, 191, 36, 0.4)' }}>
                    Quota & Rate Limiting Engine
                </Typography>
                <Button
                    variant="contained"
                    onClick={fetchState}
                    sx={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', fontWeight: 'bold', color: '#000' }}
                >
                    Refresh Global State
                </Button>
            </Box>

            <Grid container spacing={4} mb={6}>
                {rules.map(rule => (
                    <Grid item xs={12} md={4} key={rule.id}>
                        <Card sx={{ ...glassStyle, borderTop: `4px solid ${rule.tierName === 'ENTERPRISE' ? '#a855f7' : rule.tierName === 'PRO' ? '#3b82f6' : '#22c55e'}` }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>{rule.tierName} TIER</Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="gray">Daily Limits:</Typography>
                                    <Typography variant="body1" fontWeight="bold" color="#fff">{rule.dailyGenerationLimit} reqs</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="gray">Monthly Tokens:</Typography>
                                    <Typography variant="body1" fontWeight="bold" color="#fff">{(rule.maxTokensPerMonth / 1000000).toFixed(1)}M</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" color="gray">Bandwidth Throttling:</Typography>
                                    <Typography variant="body1" fontWeight="bold" color={rule.bandwidthThrottleKbps > 0 ? '#fbbf24' : '#22c55e'}>
                                        {rule.bandwidthThrottleKbps > 0 ? `${rule.bandwidthThrottleKbps} kbps` : 'UNLIMITED'}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Typography variant="body2" color="gray">Enforce Hard 429s:</Typography>
                                    <Chip label={rule.enforceHardLimits ? 'ACTIVE' : 'SOFT CAP'} size="small" sx={{ bgcolor: rule.enforceHardLimits ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: rule.enforceHardLimits ? '#ef4444' : '#22c55e' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Active User Metrics</Typography>
                    <TableContainer component={Paper} sx={{ ...glassStyle, padding: 0 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>USER ID</TableCell>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>TIER</TableCell>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>REQS TODAY</TableCell>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>TOKENS/MONTH</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {metrics.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}>{row.userId}</TableCell>
                                        <TableCell>
                                            <Chip label={row.assignedTier} size="small" />
                                        </TableCell>
                                        <TableCell sx={{ color: '#fbbf24', fontWeight: 'bold' }}>{row.generationsToday}</TableCell>
                                        <TableCell sx={{ color: '#a855f7', fontWeight: 'bold' }}>{row.tokensUsedThisMonth.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {metrics.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ color: '#666', py: 4 }}>
                                            No active metrics. Generate load via sandbox.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Intercept & Simulate Load</Typography>
                    <Card sx={glassStyle}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: '#ccc', mb: 3 }}>
                                Generate simulated traffic against specific user IDs to test DB table constraints and rate-limit circuit breakers.
                            </Typography>

                            <TextField
                                fullWidth label="User ID (Leave empty for random)"
                                variant="outlined"
                                margin="normal"
                                value={simForm.userId}
                                onChange={(e) => setSimForm({ ...simForm, userId: e.target.value })}
                                sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                                InputLabelProps={{ style: { color: '#888' } }}
                            />

                            <TextField
                                fullWidth label="Tokens to Consume"
                                variant="outlined"
                                margin="normal"
                                type="number"
                                value={simForm.requestedTokens}
                                onChange={(e) => setSimForm({ ...simForm, requestedTokens: e.target.value })}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                                InputLabelProps={{ style: { color: '#888' } }}
                            />

                            <Button
                                variant="outlined"
                                onClick={handleSimulate}
                                disabled={simulating}
                                fullWidth
                                sx={{ color: '#fbbf24', borderColor: '#fbbf24', py: 1.5, '&:hover': { bgcolor: 'rgba(251, 191, 36, 0.1)' } }}
                            >
                                {simulating ? 'Processing Transaction...' : 'Consume Quota'}
                            </Button>

                            {simResult && (
                                <Box mt={4} p={3} sx={{ bgcolor: simResult.allowed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `2px solid ${simResult.allowed ? '#22c55e' : '#ef4444'}`, borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight="bold" color={simResult.allowed ? '#22c55e' : '#ef4444'} mb={1}>
                                        {simResult.allowed ? '✅ API ALLOWED (HTTP 200)' : '🚫 API REJECTED (HTTP 429)'}
                                    </Typography>
                                    <Typography variant="body1" color="#ccc" mb={2}>Applied Tier Rule: <strong>{simResult.rule}</strong></Typography>

                                    {!simResult.allowed ? (
                                        <Typography variant="body2" color="#ff8a80" fontWeight="bold">REASON: {simResult.blockReason}</Typography>
                                    ) : (
                                        <>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="caption" color="gray">Tokens Remaining:</Typography>
                                                <Typography variant="caption" color="#fff" fontWeight="bold">{simResult.tokensRemaining.toLocaleString()}</Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="caption" color="gray">Generations Remaining:</Typography>
                                                <Typography variant="caption" color="#fff" fontWeight="bold">{simResult.generationsRemaining}</Typography>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default QuotaManagementDashboard;
