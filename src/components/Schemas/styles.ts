import BoxUI from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const Box = styled(BoxUI)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr .5fr',
  gridTemplateRows: 'auto',
  columnGap: '8px',
  gridTemplateAreas: `
    'editor swagger violations'
  `,
  height: '58vh',
  [theme.breakpoints.down('lg')]: {
    height: '54vh',
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr  1fr',
    rowGap: '8px',
    gridTemplateAreas: `
    'editor'
    'swagger'
    'violations'
  `,
  },
}));

export const EditorWrapper = styled(Paper)(({ theme }) => ({
  flexDirection: 'column',
  marginTop: 12,
  borderRadius: 2,
  gridArea: 'editor',
  overflowY: 'scroll',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
}));

export const SwaggerUIWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  color: 'rgb(87, 90, 94)',
  gridArea: 'swagger',
  marginTop: 12,
  height: '100%',
  overflowY: 'scroll',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
  '& h3': {
    textAlign: 'center',
    paddingTop: 42,
    fontSize: 14,
  },
}));

export const ViolationsWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  justifyContent: 'center',
  marginTop: 12,
  color: 'rgb(87, 90, 94)',
  gridArea: 'violations',
  height: '100%',
  overflowY: 'scroll',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
  },
}));
