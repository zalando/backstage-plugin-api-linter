import { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { useLocalStorage } from 'react-use';
import type { IEventTracking } from '../../event-types';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

type BannerProps = {
  sendEvent: ((args: IEventTracking) => void) | undefined;
  variant: 'standard' | 'filled' | 'outlined';
  severity: 'success' | 'info' | 'warning' | 'error';
  id: string;
  children: ReactNode;
};

export function Banner({ variant, severity, id, children }: BannerProps) {
  const [open, setOpen] = useLocalStorage<boolean>(`${id}Dismissible`, true);

  return (
    <Box width="100%" mb={2}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{ fontSize: 'inherit' }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          variant={variant}
          severity={severity}
        >
          {children}
        </Alert>
      </Collapse>
    </Box>
  );
}
