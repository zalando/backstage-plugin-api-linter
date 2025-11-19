import { styled } from '@mui/material/styles';
import ChipUI from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const CardText = styled(Typography)({
  color: '#101419',
});

type ViolationType = 'must' | 'should' | 'may';
type ChipColorStyles = Record<ViolationType, string>;

export const Chip = styled(ChipUI)<{ label: string }>(({ theme, label }) => {
  const type = label.split(':')[0] as ViolationType;
  const isLight = theme.palette.mode === 'light';

  const colorForViolation: ChipColorStyles = {
    must: theme.palette.error.main,
    should: theme.palette.warning.dark,
    may: theme.palette.success.main,
  };

  return {
    border: `1px solid ${colorForViolation[type]}`,
    color: isLight ? '#212121' : undefined,
    backgroundColor: isLight ? '#fff' : undefined,
    textTransform: 'capitalize',
    fontSize: '12px',
  };
});
