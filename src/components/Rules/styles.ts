import { Drawer as DrawerUI, styled } from '@material-ui/core';

export const Drawer = styled(DrawerUI)({
  '& [class*=MuiDrawer-paperAnchorRight-]': {
    width: '25%',
    padding: '24px',
  },
});
