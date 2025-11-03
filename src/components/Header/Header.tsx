import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Banner } from '../Banner';
import type { ICommonEventInfo, IEventTracking } from '../../event-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link } from '@backstage/core-components';

type HeaderProps = {
  sendEvent: ((args: IEventTracking) => void) | undefined;
  toggleDrawer: VoidFunction;
  eventInfo: ICommonEventInfo;
};

export function Header({ sendEvent, toggleDrawer, eventInfo }: HeaderProps) {
  const [showBanner, setShowBanner] = useState(false);
  const isRedirected = location.pathname.split('/').includes('redirected');

  useEffect(() => {
    if (isRedirected) {
      setShowBanner(true);

      sendEvent?.({
        ...eventInfo,
        eventLabel: 'redirect to api-linter',
        eventAction: "user redirected from zally-ui to sunrise's api-linter",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showBanner && (
        <Banner
          variant="outlined"
          severity="info"
          id="redirect_banner"
          sendEvent={sendEvent}
        >
          You've just been redirected to the interface for the API Linter in
          Sunrise as the old Zally UI has been deprecated.
        </Banner>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: 2.75,
            fontWeight: 500,
          }}
        >
          Check if your Swagger Schema conforms to{' '}
          <Link
            to="https://opensource.zalando.com/restful-api-guidelines/"
            onClick={() =>
              sendEvent?.({
                ...eventInfo,
                eventLabel: "onClick to Zalando's guidelines",
                eventAction: "Clicks on Zalando's guidelines link",
              })
            }
          >
            Zalando's RESTful API and Event Guidelines
          </Link>
        </Typography>
        <Button
          startIcon={<MenuBookIcon />}
          onClick={() => {
            toggleDrawer();
            sendEvent?.({
              ...eventInfo,
              eventLabel: 'onClick to view rules',
              eventAction: 'clicks on view rules link',
            });
          }}
        >
          VIEW THE RULES
        </Button>
      </Box>
    </>
  );
}
