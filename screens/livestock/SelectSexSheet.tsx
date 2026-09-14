import { sexOptions, type Sex } from '../../data/mock/mockLivestock';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import FilterSheet, { type MultiSelectSheetProps } from './FilterSheet';
import { sexIcon } from './livestockFormat';

const SEX_COLORS: Record<Sex, { icon: string; tint: string }> = {
  male: { icon: theme.color.primary, tint: theme.color.primaryTint },
  female: pillarMeta.livestock.colors,
  unspecified: { icon: theme.color.textSecondary, tint: theme.color.surfaceMuted },
};

const options = sexOptions.map((option) => ({
  ...option,
  icon: sexIcon[option.id],
  iconColor: SEX_COLORS[option.id].icon,
  iconBackground: SEX_COLORS[option.id].tint,
}));

// <SelectSexSheet visible={open} selected={sexes} onApply={applySexes} onClose={close} />
export default function SelectSexSheet(props: MultiSelectSheetProps<Sex>) {
  return <FilterSheet {...props} title="Select sex" options={options} />;
}
