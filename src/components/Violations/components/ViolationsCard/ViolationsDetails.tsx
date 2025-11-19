import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import * as S from './styles';

type ViolationsDetailsProps = {
  paths: string[];
  pointer: string;
  description: string | string[];
};

export function ViolationsDetails({
  paths,
  pointer,
  description,
}: ViolationsDetailsProps) {
  const hasMoreThanOnePath = (violat: string[]) => violat.length > 1;
  const [collapse, setCollapse] = useState(false);

  const shouldDisplayDescription =
    Array.isArray(description) && description.length > 0;

  return (
    <>
      {hasMoreThanOnePath(paths) ? (
        <>
          <Button
            onClick={() => setCollapse(prev => !prev)}
            color="primary"
            sx={{ padding: '6px 0px' }}
          >
            {collapse ? 'hide' : 'show'} {paths.length} violation's details{' '}
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
                <S.CardText variant="subtitle1" key={i}>
                  <strong>{i + 1} - </strong> {item}
                </S.CardText>
              ))}

            <>
              <S.DetailsTitle>
                <strong>Locations:</strong>
              </S.DetailsTitle>
              {paths.map((path, i) => (
                <S.ContentWrapper key={i}>
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
}
