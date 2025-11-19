import { useApi } from '@backstage/core-plugin-api';
import { zallyApiRef } from '../../api';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Loading } from '../Loading';
import { DetailsCard } from './components/DetailsCard';
import type { ICommonEventInfo, IEventTracking } from '../../event-types';
import { useAsync } from 'react-use';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type RulesProps = {
  openRules: boolean;
  toggleDrawer: () => void;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
};

export function Rules({
  openRules,
  toggleDrawer,
  sendEvent,
  event,
}: RulesProps) {
  const zally = useApi(zallyApiRef);

  const { value: rules, loading } = useAsync(async () => {
    const response = await zally.getRules();
    return response.filter(item => item.type !== 'HINT');
  }, [zally]);

  return (
    <Drawer
      anchor="right"
      open={openRules}
      onClose={toggleDrawer}
      className="rules-drawer"
      PaperProps={{ sx: { width: '25%', padding: '24px' } }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">Zalando's API Rules</Typography>
        <IconButton
          onClick={toggleDrawer}
          size="small"
          sx={{ aspectRatio: '1/1', height: 30 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {rules?.map(({ code, type, url, title }) => (
        <Box key={code} data-testid="rule">
          <DetailsCard
            title={title}
            type={type}
            link={url}
            sendEvent={sendEvent}
            event={event}
          />
        </Box>
      ))}

      {loading && <Loading />}
    </Drawer>
  );
}
