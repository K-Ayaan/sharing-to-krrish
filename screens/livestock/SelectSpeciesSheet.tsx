import { speciesOptions, type Species } from '../../data/mock/mockLivestock';
import { pillarMeta } from '../pillarMeta';
import FilterSheet, { type MultiSelectSheetProps } from './FilterSheet';
import { speciesIcon } from './livestockFormat';

const options = speciesOptions.map((option) => ({
  ...option,
  icon: speciesIcon[option.id],
  iconColor: pillarMeta.livestock.colors.icon,
  iconBackground: pillarMeta.livestock.colors.tint,
}));

// <SelectSpeciesSheet visible={open} selected={species} onApply={applySpecies} onClose={close} />
export default function SelectSpeciesSheet(props: MultiSelectSheetProps<Species>) {
  return (
    <FilterSheet
      {...props}
      title="Select species"
      options={options}
      searchPlaceholder="Search species…"
    />
  );
}
