import { styled } from '@mui/material/styles';
import CardUI from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Link as LinkUI } from '@backstage/core-components';

export const Card = styled(CardUI)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 16,
});

export const CardText = styled(Typography)({
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
});

export const ContentWrapper = styled('div')({
  marginTop: 8,
  borderBottom: '1px solid #10141950',
  padding: 8,
  '&:last-child': {
    borderBottom: 'none',
  },
});

export const Link = styled(LinkUI)({
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
});

export const DetailsTitle = styled(Typography)({
  color: '#101419',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
  marginTop: 20,
});
