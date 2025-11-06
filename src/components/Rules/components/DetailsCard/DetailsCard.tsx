import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Link } from '@backstage/core-components';
import * as S from './style';
import type { ICommonEventInfo, IEventTracking } from '../../../../event-types';
import Box from '@mui/material/Box';

type DetailsCardProps = {
  title: string;
  description?: string;
  link: string;
  pointer?: string;
  type: string;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  isViolation?: boolean;
};

export function DetailsCard({
  title,
  type,
  description,
  link,
  pointer,
  sendEvent,
  event,
  isViolation,
}: DetailsCardProps) {
  const cardType = isViolation ? 'violation' : 'rule';
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: 2,
        backgroundColor: theme =>
          theme.palette.mode === 'light'
            ? theme.palette.grey.A200
            : theme.palette.background.default,
      }}
      onClick={() =>
        sendEvent?.({
          ...(event as ICommonEventInfo),
          eventLabel: `on click ${cardType} card`,
          eventAction: `clicks on ${cardType} card`,
        })
      }
    >
      <CardContent key={title} data-testid={cardType}>
        <S.Chip
          label={type.toLocaleLowerCase()}
          onClick={() =>
            sendEvent?.({
              ...(event as ICommonEventInfo),
              eventLabel: `on click ${cardType} card tag: ${type.toLocaleLowerCase()}`,
              eventAction: `clicks on ${cardType} card tag`,
            })
          }
        />
        <Typography variant="h6">{title}</Typography>

        {description && (
          <S.CardText variant="subtitle1">{description}</S.CardText>
        )}

        <Typography
          variant="subtitle1"
          component="div"
          onClick={() =>
            sendEvent?.({
              ...(event as ICommonEventInfo),
              eventLabel: `on click ${cardType} card link`,
              eventAction: `clicks on ${cardType} card ${link}`,
            })
          }
        >
          <Box component={Link} sx={{ wordBreak: 'break-all' }} to={link}>
            Rule: {link}
          </Box>
        </Typography>

        {pointer && (
          <S.CardText sx={{ wordBreak: 'break-all' }} variant="subtitle1">
            Location: {pointer}
          </S.CardText>
        )}
      </CardContent>
    </Card>
  );
}
