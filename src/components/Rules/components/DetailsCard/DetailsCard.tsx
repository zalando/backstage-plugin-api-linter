import { CardContent, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "@backstage/core-components";
import * as S from "./style";

type DetailsCardProps = {
  key: string;
  title: string;
  description?: string;
  link: string;
  pointer?: string;
  type: string;
  sendEvent?: (args: IEventTracking) => void;
  event?: ICommonEventInfo;
  isViolation?: boolean;
};

export const DetailsCard: React.VFC<DetailsCardProps> = ({
  key,
  title,
  type,
  description,
  link,
  pointer,
  sendEvent,
  event,
  isViolation,
}) => {
  const cardType = isViolation ? "violation" : "rule";
  return (
    <S.Card
      key={key}
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
        <S.CardText variant="h6">{title}</S.CardText>

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
          <Link style={{ wordBreak: "break-all" }} to={link}>
            Rule: {link}
          </Link>
        </Typography>

        {pointer && (
          <S.CardText style={{ wordBreak: "break-all" }} variant="subtitle1">
            Location: {pointer}
          </S.CardText>
        )}
      </CardContent>
    </S.Card>
  );
};
