import { Button, Collapse } from "@material-ui/core";
import React, { useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import * as S from "./styles";

type ViolationsDetailsProps = {
  paths: string[];
  pointer: string;
  description: string | string[];
};

export const ViolationsDetails: React.VFC<ViolationsDetailsProps> = ({
  paths,
  pointer,
  description,
}) => {
  const hasMoreThanOnePath = (violat: string[]) => violat.length > 1;
  const [collapse, setCollapse] = useState(false);

  const shouldDisplayDescription =
    Array.isArray(description) && description.length > 0;

  return (
    <>
      {hasMoreThanOnePath(paths) ? (
        <>
          <Button
            onClick={() => setCollapse((prev) => !prev)}
            color="primary"
            style={{ padding: "6px 0px" }}
          >
            {collapse ? "hide" : "show"} {paths.length} violation's details{" "}
            {collapse ? <ArrowDropUp /> : <ArrowDropDownIcon />}
          </Button>
          <Collapse in={collapse}>
            {shouldDisplayDescription && (
              <S.DetailsTitle>
                <strong>Descriptions:</strong>
              </S.DetailsTitle>
            )}
            {shouldDisplayDescription &&
              (description as string[]).map((item: string, i: number) => (
                <>
                  <S.CardText variant="subtitle1">
                    <strong>{i + 1} - </strong> {item}
                  </S.CardText>
                </>
              ))}

            <>
              <S.DetailsTitle>
                <strong>Locations:</strong>
              </S.DetailsTitle>
              {paths.map((path) => (
                <S.ContentWrapper>
                  <S.CardText variant="subtitle1">{path}</S.CardText>
                </S.ContentWrapper>
              ))}
            </>
          </Collapse>
        </>
      ) : (
        <>
          {pointer && (
            <S.CardText variant="subtitle1">
              <strong>Location:</strong> {pointer}
            </S.CardText>
          )}
        </>
      )}
    </>
  );
};
