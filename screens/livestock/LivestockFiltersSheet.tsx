import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppIconName } from '../../components/ui/AppIcon';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import FilterChip from '../../components/ui/FilterChip';
import {
  sexOptions,
  speciesOptions,
  weightBandOptions,
  type Sex,
  type Species,
  type WeightBand,
} from '../../data/mock/mockLivestock';
import theme from '../../theme';
import { sexIcon, speciesIcon, WEIGHT_ICON } from './livestockFormat';

export type LivestockFilters = { species: Species[]; sexes: Sex[]; weights: WeightBand[] };

export const NO_FILTERS: LivestockFilters = { species: [], sexes: [], weights: [] };

export const filterCount = (filters: LivestockFilters) =>
  filters.species.length + filters.sexes.length + filters.weights.length;

type Section<K extends keyof LivestockFilters> = {
  key: K;
  title: string;
  options: { id: LivestockFilters[K][number]; name: string; icon: AppIconName }[];
};

const SECTIONS = [
  {
    key: 'species',
    title: 'Species',
    options: speciesOptions.map((option) => ({ ...option, icon: speciesIcon[option.id] })),
  } satisfies Section<'species'>,
  {
    key: 'sexes',
    title: 'Sex',
    options: sexOptions.map((option) => ({ ...option, icon: sexIcon[option.id] })),
  } satisfies Section<'sexes'>,
  {
    key: 'weights',
    title: 'Weight',
    options: weightBandOptions.map((option) => ({ ...option, icon: WEIGHT_ICON })),
  } satisfies Section<'weights'>,
];

type LivestockFiltersSheetProps = {
  visible: boolean;
  value: LivestockFilters;
  onApply: (next: LivestockFilters) => void;
  onClose: () => void;
};

// Screen-local layout for Livestock's single filter sheet, composed from components/ui. Species, sex and
// weight are sections of pills; any number of pills can be on in every section at once. Edits are a
// draft — "Done" applies them all, × or the backdrop discards them. (Replaces the per-filter sheets in
// SelectSpeciesSheet.png / SelectSexSheet.png / SelectWeightSheet.png: user's decision.)
export default function LivestockFiltersSheet({ visible, value, onApply, onClose }: LivestockFiltersSheetProps) {
  const [draft, setDraft] = useState<LivestockFilters>(value);

  // Re-seed from the applied filters each time the sheet opens (keyed on `visible` only, so parent
  // re-renders can't wipe an in-progress draft).
  useEffect(() => {
    if (visible) setDraft(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const toggle = <K extends keyof LivestockFilters>(key: K, id: LivestockFilters[K][number]) =>
    setDraft((current) => {
      const values = current[key] as LivestockFilters[K][number][];
      const next = values.includes(id) ? values.filter((item) => item !== id) : [...values, id];
      return { ...current, [key]: next };
    });

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filters" onDone={() => onApply(draft)}>
      <View style={styles.content}>
        {SECTIONS.map((section) => (
          <View key={section.key} style={styles.section}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              {section.title}
            </Text>
            <View style={styles.pills}>
              {section.options.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.name}
                  icon={option.icon}
                  selected={(draft[section.key] as string[]).includes(option.id)}
                  onPress={() => toggle(section.key, option.id)}
                />
              ))}
            </View>
          </View>
        ))}
        {filterCount(draft) > 0 ? (
          <Button label="Clear all" variant="text" onPress={() => setDraft(NO_FILTERS)} />
        ) : null}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.l,
  },
  section: {
    gap: theme.space.s,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.s,
  },
});
