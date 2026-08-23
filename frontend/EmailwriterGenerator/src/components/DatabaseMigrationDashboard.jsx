import React, { useEffect, useState } from 'react';
import {
    Box, Typography, CircularProgress, Card, CardContent, Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Tooltip, Alert
} from '@mui/material';

const DatabaseMigrationDashboard = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state for triggering new migrations
    const [openDeploy, setOpenDeploy] = useState(false);
    const [executeForm, setExecuteForm] = useState({ versionId: '', description: '', scriptName: '' });
    const [executing, setExecuting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Initial load
    const fetchDashboardState = async () => {
        try {
            setLoading(true);
            const resStats = await fetch('http://localhost:8080/api/db/migrations/stats');
            const dataStats = await resStats.json();
            setStats(dataStats);

            const resHist = await fetch('http://localhost:8080/api/db/migrations');
            const dataHist = await resHist.json();
            setHistory(dataHist);
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to connect to backend migration service.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardState();
    }, []);

    // Form Handlers
    const handleExecuteDeploy = async () => {
        setExecuting(true);
        setErrorMsg(null);
        try {
            const res = await fetch('http://localhost:8080/api/db/migrations/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(executeForm)
            });
            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(`Migration Failed: ${data.errorDetails}`);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Network failure during script execution.");
        } finally {
            setExecuting(false);
            setOpenDeploy(false);
            setExecuteForm({ versionId: '', description: '', scriptName: '' });
            fetchDashboardState();
        }
    };

    const handleRollback = async (versionId) => {
        if (!window.confirm(`Are you sure you want to forcibly rollback failed migration state for ${versionId}?`)) return;

        try {
            const res = await fetch(`http://localhost:8080/api/db/migrations/rollback/${versionId}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                alert("Failed to rollback (cannot rollback active successful migrations).");
            } else {
                fetchDashboardState();
            }
        } catch (err) {
            console.error(err);
            alert("Rollback failed due to network error.");
        }
    };

    // Styling
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        color: '#e0e0e0',
        padding: '24px'
    };

    const getHealthColor = (healthFlag) => {
        if (healthFlag === 'GREEN') return '#00e676';
        if (healthFlag === 'YELLOW') return '#ffea00';
        return '#ff1744';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress size={60} sx={{ color: '#ff6d00' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 4px 20px rgba(255, 109, 0, 0.4)' }}>
                    Enterprise Database Migrations
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenDeploy(true)}
                    sx={{
                        background: 'linear-gradient(45deg, #ff6d00, #ff1744)',
                        fontWeight: 'bold',
                        px: 4, py: 1.5, borderRadius: '8px'
                    }}
                >
                    Deploy New Schema Script
                </Button>
            </Box>

            {errorMsg && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{errorMsg}</Alert>
            )}

            {stats && (
                <Grid container spacing={4} mb={6}>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Database State Health</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: getHealthColor(stats.overallHealth) }}>
                                    {stats.overallHealth} SECURE
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Total Deployments</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff' }}>
                                    {stats.totalMigrations}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Failed / Stuck States</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: stats.failedMigrations > 0 ? '#ff1744' : '#00e676' }}>
                                    {stats.failedMigrations}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={glassStyle}>
                            <CardContent>
                                <Typography variant="subtitle1" color="gray" gutterBottom>Avg DDL Execution</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: '#00e5ff' }}>
                                    {stats.averageExecutionTime} ms
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Typography variant="h5" sx={{ color: '#fff', mb: 3 }}>Deployment Audit Timeline</Typography>
            <TableContainer component={Paper} sx={{ ...glassStyle, padding: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>VERSION ID</TableCell>
                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>SCRIPT TARGET</TableCell>
                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>DESCRIPTION</TableCell>
                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>TIME (MS)</TableCell>
                            <TableCell sx={{ color: '#888', fontWeight: 'bold' }}>STATUS</TableCell>
                            <TableCell align="right" sx={{ color: '#888', fontWeight: 'bold' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: '#666', py: 4 }}>
                                    No database migrations have been executed yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map(row => (
                                <TableRow key={row.versionId} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}>{row.versionId}</TableCell>
                                    <TableCell sx={{ color: '#ccc' }}>{row.scriptName}</TableCell>
                                    <TableCell sx={{ color: '#aaa', fontStyle: 'italic' }}>{row.description}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{row.executionTimeMs}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            sx={{
                                                bgcolor: row.status === 'SUCCESS' ? 'rgba(0,230,118,0.2)' : 'rgba(255,23,68,0.2)',
                                                color: row.status === 'SUCCESS' ? '#00e676' : '#ff1744',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        {row.status === 'ERROR' && (
                                            <Typography variant="caption" display="block" color="error" mt={1} sx={{ maxWidth: 200 }}>
                                                {row.errorDetails}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.status === 'ERROR' && (
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleRollback(row.versionId)}>
                                                Rollback
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Deploy Modal */}
            <Dialog
                open={openDeploy}
                onClose={() => setOpenDeploy(false)}
                PaperProps={{
                    sx: { bgcolor: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, width: '500px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Execute Schema Migration</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Version ID (e.g. V1_0_5)"
                        variant="outlined"
                        margin="dense" sx={{ mt: 2 }}
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={executeForm.versionId}
                        onChange={(e) => setExecuteForm({ ...executeForm, versionId: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Script Target File"
                        variant="outlined"
                        margin="dense"
                        placeholder="e.g. scripts/V1_0_5__add_users.sql"
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={executeForm.scriptName}
                        onChange={(e) => setExecuteForm({ ...executeForm, scriptName: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Migration Description"
                        variant="outlined"
                        margin="dense"
                        multiline rows={3}
                        InputLabelProps={{ style: { color: '#888' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        value={executeForm.description}
                        onChange={(e) => setExecuteForm({ ...executeForm, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setOpenDeploy(false)} sx={{ color: '#aaa' }}>Cancel</Button>
                    <Button
                        onClick={handleExecuteDeploy}
                        disabled={executing || !executeForm.versionId || !executeForm.scriptName}
                        variant="contained"
                        sx={{ background: 'linear-gradient(45deg, #ff6d00, #ff1744)', fontWeight: 'bold' }}
                    >
                        {executing ? 'Applying...' : 'Deploy Script'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DatabaseMigrationDashboard;
