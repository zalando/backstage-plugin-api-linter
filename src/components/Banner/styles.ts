import { BackstageTheme } from '@backstage/theme';
import { styled } from '@material-ui/core';

export const BannerWrapper = styled('div')(
  ({ theme }: { theme: BackstageTheme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2),
    '& > * + *': {
      marginTop: theme.spacing(2),
    },

    '& [class*=MuiAlert-root]': {
      borderColor: 'var(--mui-info-border)',
      color: 'var(--mui-info-text)',
    },
  }),
);
