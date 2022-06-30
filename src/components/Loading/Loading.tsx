import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

export const Loading: React.VFC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '50vh',
    }}
  >
    <CircularProgress size="1.5em" />
  </Box>
);
