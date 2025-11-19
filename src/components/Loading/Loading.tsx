import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const Loading = () => (
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
