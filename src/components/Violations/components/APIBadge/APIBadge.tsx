import { Typography } from '@material-ui/core';
import React from 'react';
import { ViolationCount } from '../../../../api';
import {
  perfectApi,
  mayViolations,
  shouldViolations,
  mustViolations,
} from './texts';
import * as S from './styles';

type APIBadgeProps = {
  violations: ViolationCount;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
};

export const APIBadge: React.VFC<APIBadgeProps> = ({
  violations,
  sendEvent,
  event,
}) => {
  const handleEventEmitter = (context: string, value?: string) => {
    sendEvent?.({
      ...(event as ICommonEventInfo),
      eventLabel: `hover on ${context}`,
      eventAction: `hovers on ${context}: ${value}`,
    });
  };
  const getBadgeIcon = () => {
    switch (true) {
      case violations.must > 0:
        return {
          icon: (
            <S.Badge
              paint="must"
              data-testid="must"
              onMouseEnter={() => handleEventEmitter('api badge', 'must')}
            />
          ),
          text: mustViolations,
        };
      case violations.should > 0:
        return {
          icon: (
            <S.Badge
              paint="should"
              data-testid="should"
              onMouseEnter={() => handleEventEmitter('api badge', 'should')}
            />
          ),
          text: shouldViolations,
        };
      case violations.may > 0:
        return {
          icon: (
            <S.Badge
              paint="may"
              data-testid="may"
              onMouseEnter={() => handleEventEmitter('api badge', 'may')}
            />
          ),
          text: mayViolations,
        };
      default:
        return {
          icon: (
            <S.PerfectApiBadge
              data-testid="perfect"
              onMouseEnter={() => handleEventEmitter('api badge', 'perfect')}
            />
          ),
          text: perfectApi,
        };
    }
  };

  const { icon, text } = getBadgeIcon();
  return (
    <S.BadgeWrapper>
      {icon}
      <Typography
        variant="body2"
        onMouseEnter={() => handleEventEmitter('api badge text')}
      >
        {text}
      </Typography>
    </S.BadgeWrapper>
  );
};
