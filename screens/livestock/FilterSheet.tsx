// Livestock catalogue filters. Opened from one chip (just that filter) or from the filter button
// (all of them together).
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import FilterChip from '../../components/ui/FilterChip';
import { SPECIES_LABEL } from '../../data/mock/mockLivestock';
import theme from '../../theme';
import {
  NO_FILTERS,
  SEX_OPTIONS,
  SPECIES_ORDER,
  WEIGHT_OPTIONS,
  type LivestockFilters,
} from './livestockFilters';
import { speciesIcon } from './livestockFormat';

export type FilterSection = 'species' | 'sex' | 'weight' | 'all';

const TITLE: Record<FilterSection, string> = {
  species: 'Species',
  sex: 'Sex',
  weight: 'Weight',
  all: 'Filters',
};

export default function FilterSheet({
  section,
  filters,
  onApply,
  onClose,
}: {
  section: FilterSection | null;
  filters: LivestockFilters;
  onApply: (filters: LivestockFilters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (section) setDraft(filters);
  }, [section, filters]);

  const show = (part: Exclude<FilterSection, 'all'>) => section === 'all' || section === part;
  const heading = (label: string) => (section === 'all' ? <Text style={styles.groupLabel}>{label}</Text> : null);

  return (
    <BottomSheet
      visible={section !== null}
      onClose={onClose}
      title={section ? TITLE[section] : undefined}
      scrollable
      footer={
        <View style={styles.footer}>
          <Button
            label="Clear"
            variant="secondary"
            onPress={() => {
              onApply(NO_FILTERS);
              onClose();
            }}
            style={styles.clear}
          />
          <Button
            label="Show results"
            onPress={() => {
              onApply(draft);
              onClose();
            }}
            style={styles.apply}
          />
        </View>
      }
    >
      {show('species') ? (
        <View style={styles.group}>
          {heading('Species')}
          <View style={styles.chips}>
            <FilterChip label="All" selected={draft.species === 'any'} onPress={() => setDraft({ ...draft, species: 'any' })} />
            {SPECIES_ORDER.map((species) => (
              <FilterChip
                key={species}
                label={SPECIES_LABEL[species]}
                icon={speciesIcon[species]}
                selected={draft.species === species}
                onPress={() => setDraft({ ...draft, species })}
              />
            ))}
          </View>
        </View>
      ) : null}
      {show('sex') ? (
        <View style={styles.group}>
          {heading('Sex')}
          <View style={styles.chips}>
            {SEX_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draft.sex === option.value}
                onPress={() => setDraft({ ...draft, sex: option.value })}
              />
            ))}
          </View>
        </View>
      ) : null}
      {show('weight') ? (
        <View style={styles.group}>
          {heading('Weight')}
          <View style={styles.chips}>
            {WEIGHT_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={draft.weight === option.value}
                onPress={() => setDraft({ ...draft, weight: option.value })}
              />
            ))}
          </View>
        </View>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: theme.space.s,
    marginBottom: theme.space.l,
  },
  groupLabel: {
    ...theme.type.label,
    color: theme.color.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.s,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  clear: {
    flex: 1,
  },
  apply: {
    flex: 2,
  },
});
