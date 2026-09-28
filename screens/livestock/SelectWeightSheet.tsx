import { weightBandOptions, type WeightBand } from '../../data/mock/mockLivestock';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import FilterSheet, { type MultiSelectSheetProps } from './FilterSheet';
import { WEIGHT_ICON } from './livestockFormat';

// Pink tiles with a dark weight glyph, as in SelectWeightSheet.png.
const options = weightBandOptions.map((option) => ({
  ...option,
  icon: WEIGHT_ICON,
  iconColor: theme.color.textPrimary,
  iconBackground: pillarMeta.livestock.colors.tint,
}));

// <SelectWeightSheet visible={open} selected={weights} onApply={applyWeights} onClose={close} />
export default function SelectWeightSheet(props: MultiSelectSheetProps<WeightBand>) {
  return <FilterSheet {...props} title="Select weight category" options={options} />;
}
