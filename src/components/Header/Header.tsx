import { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import * as S from './styles';

import { Banner } from '../Banner';
import { ICommonEventInfo, IEventTracking } from '../../event-types';

type HeaderProps = {
  sendEvent: ((args: IEventTracking) => void) | undefined;
  toggleDrawer: VoidFunction;
  eventInfo: ICommonEventInfo;
};

export const Header: React.FC<HeaderProps> = ({
  sendEvent,
  toggleDrawer,
  eventInfo,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const isRedirected = !!location.pathname.split('/').includes('redirected');

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
      <Box display="flex" justifyContent="space-between">
        <S.Title variant="subtitle1">
          Check if your Swagger Schema conforms to
          <S.SubtitleLink
            to="https://sunrise.zalando.net/docs/default/Component/api/"
            onClick={() =>
              sendEvent?.({
                ...eventInfo,
                eventLabel: "onClick to Zalando's guidelines",
                eventAction: "Clicks on Zalando's guidelines link",
              })
            }
          >
            Zalando's RESTful API and Event Guidelines
          </S.SubtitleLink>
        </S.Title>
        <S.RulesLinkWrapper onClick={toggleDrawer}>
          <S.BookIcon />
          <S.RulesLink
            onClick={() =>
              sendEvent?.({
                ...eventInfo,
                eventLabel: 'onClick to view rules',
                eventAction: 'clicks on view rules link',
              })
            }
          >
            VIEW THE RULES
          </S.RulesLink>
        </S.RulesLinkWrapper>
      </Box>
    </>
  );
};
