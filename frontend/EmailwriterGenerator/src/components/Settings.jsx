import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Typography variant="body1">
        API Configuration and user preferences will be migrated here.
      </Typography>
    </Box>
  );
}
