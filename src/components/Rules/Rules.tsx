import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { zallyApiRef } from '../../api';
import { Box, Button, Typography } from '@material-ui/core';
import { Loading } from '../Loading';
import { DetailsCard } from './components/DetailsCard';
import * as S from './styles';
import { Rule } from '../../api/types';
import { ICommonEventInfo, IEventTracking } from '../../event-types';

type RulesProps = {
  openRules: boolean;
  toggleDrawer: () => void;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
};

export const Rules: React.FC<RulesProps> = ({
  openRules,
  toggleDrawer,
  sendEvent,
  event,
}) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const zally = useApi(zallyApiRef);

  useEffect(() => {
    const fetchData = async () => {
      const response = await zally.getRules();
      const filterdRules = response.filter(item => item.type !== 'HINT');
      setRules(filterdRules);
    };
    fetchData();
  }, [zally]);

  return (
    <S.Drawer
      anchor="right"
      open={openRules}
      onClose={toggleDrawer}
      className="rules-drawer"
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">Zalando's API Rules</Typography>
        <Button onClick={toggleDrawer}>X</Button>
      </Box>

      {rules.map(({ code, type, url, title }) => (
        <Box key={code} data-testid="rule">
          <DetailsCard
            key={code}
            title={title}
            type={type}
            link={url}
            sendEvent={sendEvent}
            event={event}
          />
        </Box>
      ))}

      {!rules.length && <Loading />}
    </S.Drawer>
  );
};
