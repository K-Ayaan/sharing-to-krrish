import { weightBandOptions, type WeightBand } from '../../data/mock/mockLivestock';
import FilterSheet, { type MultiSelectSheetProps } from './FilterSheet';
import { WEIGHT_ICON } from './livestockFormat';

const options = weightBandOptions.map((option) => ({ ...option, icon: WEIGHT_ICON }));

// <SelectWeightSheet visible={open} selected={weights} onApply={applyWeights} onClose={close} />
export default function SelectWeightSheet(props: MultiSelectSheetProps<WeightBand>) {
  return <FilterSheet {...props} title="Select weight category" options={options} />;
}
