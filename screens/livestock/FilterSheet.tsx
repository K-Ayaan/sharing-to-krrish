import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppIconName } from '../../components/ui/AppIcon';
import BottomSheet from '../../components/ui/BottomSheet';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import Radio from '../../components/ui/Radio';
import TextField from '../../components/ui/TextField';
import theme from '../../theme';

export type FilterSheetOption<T extends string> = {
  id: T;
  name: string;
  icon: AppIconName;
  iconColor?: string;
  iconBackground?: string;
};

/** Props shared by the three Livestock filter sheets. */
export type MultiSelectSheetProps<T extends string> = {
  visible: boolean;
  selected: T[];
  onApply: (selected: T[]) => void;
  onClose: () => void;
};

type FilterSheetProps<T extends string> = MultiSelectSheetProps<T> & {
  title: string;
  options: FilterSheetOption<T>[];
  searchPlaceholder?: string;
};

// Screen-local layout for the Livestock filter sheets, composed from components/ui.
// Multi-select drawn with round marks (as in the Livestock redesign): a filled mark on each selected
// row, an empty ring on the rest. Several values per filter can still be chosen.
// Edits are a draft — "Done" applies them, × or the backdrop discards them.
export default function FilterSheet<T extends string>({
  visible,
  selected,
  onApply,
  onClose,
  title,
  options,
  searchPlaceholder,
}: FilterSheetProps<T>) {
  const [draft, setDraft] = useState<T[]>(selected);
  const [query, setQuery] = useState('');

  // Re-seed from the applied selection each time the sheet opens (keyed on
  // `visible` only, so parent re-renders can't wipe an in-progress draft).
  useEffect(() => {
    if (!visible) return;
    setDraft(selected);
    setQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const toggle = (id: T) =>
    setDraft((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = normalizedQuery
    ? options.filter((option) => option.name.toLowerCase().includes(normalizedQuery))
    : options;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title} onDone={() => onApply(draft)}>
      <View style={styles.content}>
        {searchPlaceholder ? (
          <TextField
            accessibilityLabel={searchPlaceholder}
            autoCorrect={false}
            icon="search"
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            value={query}
            variant="search"
          />
        ) : null}
        <Card padded={false}>
          {visibleOptions.length === 0 ? (
            <Text style={styles.empty}>No matches.</Text>
          ) : (
            visibleOptions.map((option, index) => {
              const checked = draft.includes(option.id);
              return (
                <ListRow
                  key={option.id}
                  title={option.name}
                  icon={option.icon}
                  iconColor={option.iconColor ?? theme.color.textSecondary}
                  iconBackground={option.iconBackground ?? theme.color.surfaceMuted}
                  selected={checked}
                  divider={index < visibleOptions.length - 1}
                  onPress={() => toggle(option.id)}
                  trailing={<Radio selected={checked} />}
                />
              );
            })
          )}
        </Card>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  empty: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    padding: theme.space.l,
  },
});
