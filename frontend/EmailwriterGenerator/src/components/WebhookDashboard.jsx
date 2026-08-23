import React, { useEffect, useState } from 'react';
import {
    Box, Typography, CircularProgress, Card, CardContent, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Select, MenuItem, InputLabel, FormControl, Tooltip, IconButton
} from '@mui/material';

const WebhookDashboard = () => {
    const [stats, setStats] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [simulating, setSimulating] = useState(false);
    const [simForm, setSimForm] = useState({ eventType: 'EMAIL_GENERATED', content: '{"userId": "123", "action": "GENERATION"}' });

    const [openAdd, setOpenAdd] = useState(false);
    const [newSub, setNewSub] = useState({ endpointUrl: '', eventType: 'EMAIL_GENERATED' });
    const [saving, setSaving] = useState(false);

    const fetchDashboardState = async () => {
        try {
            setLoading(true);
            const [stRes, subRes, logRes] = await Promise.all([
                fetch('http://localhost:8080/api/webhooks/stats'),
                fetch('http://localhost:8080/api/webhooks/subscriptions'),
                fetch('http://localhost:8080/api/webhooks/logs')
            ]);

            setStats(await stRes.json());
            setSubscriptions(await subRes.json());
            setLogs(await logRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardState();
    }, []);

    const handleSaveSub = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:8080/api/webhooks/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSub)
            });
            if (res.ok) {
                setOpenAdd(false);
                setNewSub({ endpointUrl: '', eventType: 'EMAIL_GENERATED' });
                fetchDashboardState();
            }
        } catch (err) {
            console.error("Failed to map webhook integration", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Disconnect this integration? Routing will fail silently immediately.")) return;
        try {
            await fetch(`http://localhost:8080/api/webhooks/subscriptions/${id}`, { method: 'DELETE' });
            fetchDashboardState();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSimulateDispatch = async () => {
        setSimulating(true);
        try {
            await fetch('http://localhost:8080/api/webhooks/dispatch/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(simForm)
            });
            fetchDashboardState();
        } catch (err) {
            console.error("Simulation engine failed", err);
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

    if (loading && !stats) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} sx={{ color: '#00e5ff' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #172554 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 4px 20px rgba(0, 229, 255, 0.5)' }}>
                    Enterprise Application Webhooks
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenAdd(true)}
                    sx={{ background: 'linear-gradient(45deg, #3b82f6, #00e5ff)', fontWeight: 'bold', px: 4, py: 1.5, borderRadius: '8px' }}
                >
                    + Add Integration Route
                </Button>
            </Box>

            {stats && (
                <Grid container spacing={4} mb={6}>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Active Subscriptions</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#00e5ff' }}>
                                    {stats.activeSubscriptions} / {stats.totalEndpoints}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Total Dispatches</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff' }}>
                                    {stats.dispatchCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Dispatch Failure Rate</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: stats.failureRate > 10 ? '#ef4444' : '#22c55e' }}>
                                    {stats.failureRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Avg Network Latency</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#a855f7' }}>
                                    {stats.averageLatencyMs} ms
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Live Subscriptions Matrix</Typography>
                    <TableContainer component={Paper} sx={{ ...glassStyle, padding: 0, mb: 6 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>EVENT TOPIC</TableCell>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>TARGET ENDPOINT</TableCell>
                                    <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>HMAC SECRET (TRUNC)</TableCell>
                                    <TableCell align="right" sx={{ color: '#888', fontWeight: 'bold' }}>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subscriptions.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                                            <Chip label={row.eventType} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.2)', color: '#60a5fa' }} />
                                        </TableCell>
                                        <TableCell sx={{ color: '#ccc' }}>{row.endpointUrl}</TableCell>
                                        <TableCell sx={{ color: '#888', fontFamily: 'monospace' }}>
                                            {row.secretKey?.substring(0, 8)}********
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button size="small" color="error" onClick={() => handleDelete(row.id)}>Revoke</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {subscriptions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ color: '#666', py: 4 }}>
                                            No endpoints configured. Data will not route externally.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Delivery Logs & Latency Audit</Typography>
                    <TableContainer component={Paper} sx={{ ...glassStyle, padding: 0, maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#172554', color: '#888', fontWeight: 'bold' }}>STATUS</TableCell>
                                    <TableCell sx={{ bgcolor: '#172554', color: '#888', fontWeight: 'bold' }}>CODE</TableCell>
                                    <TableCell sx={{ bgcolor: '#172554', color: '#888', fontWeight: 'bold' }}>LATENCY</TableCell>
                                    <TableCell sx={{ bgcolor: '#172554', color: '#888', fontWeight: 'bold' }}>RESPONSE SIGNATURE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <Chip
                                                label={log.deliveryStatus}
                                                size="small"
                                                sx={{
                                                    bgcolor: log.deliveryStatus === 'DELIVERED' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                                                    color: log.deliveryStatus === 'DELIVERED' ? '#22c55e' : '#ef4444'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{log.httpStatusCode || 'N/A'}</TableCell>
                                        <TableCell sx={{ color: '#a855f7' }}>{log.latencyMs}ms</TableCell>
                                        <TableCell sx={{ color: '#aaa', fontSize: '0.85rem' }}>{log.responseMessage}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>System Event Simulator</Typography>
                    <Card sx={glassStyle}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: '#ccc', mb: 3 }}>
                                Trigger synthetic events into the pipeline to test endpoint configurations, cryptographic signing, and latency tolerances.
                            </Typography>

                            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#888' }}>Event Topic</InputLabel>
                                <Select
                                    value={simForm.eventType}
                                    onChange={(e) => setSimForm({ ...simForm, eventType: e.target.value })}
                                    sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                    <MenuItem value="EMAIL_GENERATED">EMAIL_GENERATED</MenuItem>
                                    <MenuItem value="DB_MIGRATION_LOCKED">DB_MIGRATION_LOCKED</MenuItem>
                                    <MenuItem value="DLP_VIOLATION_BLOCKED">DLP_VIOLATION_BLOCKED</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth label="JSON Payload Dump"
                                multiline rows={8}
                                variant="outlined"
                                value={simForm.content}
                                onChange={(e) => setSimForm({ ...simForm, content: e.target.value })}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: '#fff', fontFamily: 'monospace', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleSimulateDispatch}
                                disabled={simulating || subscriptions.length === 0}
                                fullWidth
                                sx={{ background: 'linear-gradient(45deg, #00e5ff, #3b82f6)', fontWeight: 'bold', py: 1.5 }}
                            >
                                {simulating ? 'Broadcasting...' : 'Broadcast Test Event'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Create Integration Modal */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff' } }}>
                <DialogTitle>Add API Webhook Target</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Destination URL (HTTPS ONLY)"
                        variant="outlined"
                        margin="dense" sx={{ mt: 2 }}
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={newSub.endpointUrl}
                        onChange={(e) => setNewSub({ ...newSub, endpointUrl: e.target.value })}
                    />

                    <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                        <InputLabel sx={{ color: '#888' }}>Target Event Type</InputLabel>
                        <Select
                            value={newSub.eventType}
                            onChange={(e) => setNewSub({ ...newSub, eventType: e.target.value })}
                            sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                        >
                            <MenuItem value="EMAIL_GENERATED">EMAIL_GENERATED</MenuItem>
                            <MenuItem value="DB_MIGRATION_LOCKED">DB_MIGRATION_LOCKED</MenuItem>
                            <MenuItem value="DLP_VIOLATION_BLOCKED">DLP_VIOLATION_BLOCKED</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAdd(false)} sx={{ color: '#aaa' }}>Cancel</Button>
                    <Button onClick={handleSaveSub} disabled={saving || !newSub.endpointUrl} variant="contained" color="primary">
                        Link Endpoint
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WebhookDashboard;
