import { styled } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

type ColorStyles = {
  [x: string]: string;
};

export const Badge = styled(ErrorIcon)<{ paint: string }>(({
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
});
