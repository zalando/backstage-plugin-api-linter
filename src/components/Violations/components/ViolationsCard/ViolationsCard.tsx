import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { ViolationsResponse } from '../../../../api/types';
import LinkIcon from '@mui/icons-material/Link';
import * as S from './styles';
import Button from '@mui/material/Button';
import { addIdForPermalink } from '../../helpers';
import { APIBadge } from '../APIBadge';
import { aggregateByViolation } from '../../../../helpers';
import { ViolationsDetails } from './ViolationsDetails';
import { Chip } from '../../../Rules/components/DetailsCard/style';
import type { ICommonEventInfo, IEventTracking } from '../../../../event-types';

type ViolationsCardProps = ViolationsResponse & {
  onExternalIdChange: (v: string) => void;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
};

export function ViolationsCard({
  external_id,
  violations,
  violations_count,
  onExternalIdChange,
  sendEvent,
  event,
}: ViolationsCardProps) {
  const handleClick = () => {
    onExternalIdChange(external_id);
    addIdForPermalink(external_id);
  };

  const hasViolationType = (count: number) => count > 0;

  const aggregatedViolations = aggregateByViolation(violations);

  const getRuleNumberFromLink = (link: string) =>
    link.split('/')[link.split('/').length - 1];

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={handleClick}
          variant="text"
          endIcon={<LinkIcon />}
          size="large"
          sx={{
            fontWeight: 'normal',
            textTransform: 'none',
            marginBlock: 1.5,
            color: 'primary.dark',
          }}
        >
          Create permanent URL
        </Button>
      </Box>
      <APIBadge
        violations={violations_count}
        sendEvent={sendEvent}
        event={event}
      />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
        alignItems="center"
      >
        {hasViolationType(violations_count.must) && (
          <Chip label={`must: ${violations_count.must}`} />
        )}
        {hasViolationType(violations_count.should) && (
          <Chip label={`should: ${violations_count.should}`} />
        )}
        {hasViolationType(violations_count.may) && (
          <Chip label={`may: ${violations_count.may}`} />
        )}
      </Box>
      {aggregatedViolations.map(
        ({ violation_type, title, rule_link, paths, description, pointer }) => {
          return (
            <S.Card
              key={title}
              onClick={() =>
                sendEvent?.({
                  ...(event as ICommonEventInfo),
                  eventLabel: `on click violation card`,
                  eventAction: `clicks on violation card`,
                })
              }
            >
              <CardContent key={title} data-testid="violation">
                <Chip
                  label={violation_type.toLocaleLowerCase()}
                  onClick={() =>
                    sendEvent?.({
                      ...(event as ICommonEventInfo),
                      eventLabel: `on click violation card tag: ${'must'.toLocaleLowerCase()}`,
                      eventAction: `clicks on violation card tag`,
                    })
                  }
                />
                <S.CardText variant="h6">{title}</S.CardText>
                <Typography
                  variant="subtitle1"
                  component="div"
                  onClick={() =>
                    sendEvent?.({
                      ...(event as unknown as ICommonEventInfo),
                      eventLabel: `on click violation card link`,
                      eventAction: `clicks on violation card ${rule_link}`,
                    })
                  }
                >
                  <S.Link to={rule_link}>
                    Rule: {getRuleNumberFromLink(rule_link)}
                  </S.Link>
                </Typography>
                <S.CardText variant="subtitle1" key={pointer}>
                  {!Array.isArray(description) && (
                    <S.CardText variant="subtitle1" key={pointer}>
                      {description}
                    </S.CardText>
                  )}
                </S.CardText>
                <ViolationsDetails
                  paths={paths}
                  pointer={pointer}
                  description={description}
                />
              </CardContent>
            </S.Card>
          );
        },
      )}
    </Box>
  );
}
