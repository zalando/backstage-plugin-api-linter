import { styled, Typography } from '@material-ui/core';
import { DismissableBanner, Link } from '@backstage/core-components';
import MenuBookIcon from '@material-ui/icons/MenuBook';

export const SubtitleLink = styled(Link)({
  display: 'inline',
  opacity: 0.9,
  marginTop: 8,
  marginLeft: 4,
  textDecoration: 'underline',
  color: '#DE7C02',
});

export const Title = styled(Typography)({
  marginBottom: 22,
  fontWeight: 500,
});

export const RulesLink = styled('div')({
  marginTop: 5,
  marginLeft: 5,
});

export const RulesLinkWrapper = styled('div')({
  color: '#DE7C02',
  display: 'flex',
  alignContent: 'center',
  cursor: 'pointer',
  fontWeight: 500,
});

export const BookIcon = styled(MenuBookIcon)({
  width: 18,
  marginTop: 2,
});

export const Banner = styled(DismissableBanner)({
  backgroundColor: 'red',
  border: '1px solid red',
});
