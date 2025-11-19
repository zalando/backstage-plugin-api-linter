import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const ViolationsEmpty = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400,
  wordBreak: 'break-word',
  padding: '0 24px',
  textAlign: 'center',
});

export const ViolationsWrapper = styled('div')({
  marginLeft: 12,
  marginRight: 12,
  paddingBottom: 32,
});

export const ViolationsPlaceholder = styled(Typography)({
  margin: 52,
  textAlign: 'center',
});
