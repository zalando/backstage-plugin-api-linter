import { styled, type Theme } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

type ColorStyles = {
  [x: string]: string;
};

export const Badge = styled(ErrorIcon)<Theme, { paint: string }>(({
  theme,
  paint,
}) => {
  const colorForViolation: ColorStyles = {
    must: theme.palette.error.main,
    should: theme.palette.warning.dark,
    may: theme.palette.success.main,
  };
  return {
    color: colorForViolation[paint],
    fontSize: 60,
    marginRight: 10,
  };
});

export const PerfectApiBadge = styled(CheckCircleRoundedIcon)(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: 60,
  marginRight: 10,
}));

export const BadgeWrapper = styled('div')({
  paddingBottom: 12,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  color: '#101419',
});
