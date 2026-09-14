// <SelectField label="District" required icon="location" placeholder="Select district" options={districts} selectedId={id} onSelect={setId} />
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import theme from '../../theme';
import BottomSheet from './BottomSheet';
import ListRow from './ListRow';
import { FieldShell, fieldTextStyles } from './TextField';

export type SelectOption = {
  id: string;
  name: string;
};

export type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  error?: string;
  sheetTitle?: string;
};

const LIST_MAX_HEIGHT = Dimensions.get('window').height / 2;

export default function SelectField({
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  required,
  icon,
  disabled = false,
  error,
  sheetTitle,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === selectedId);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.name ?? placeholder }}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={disabled && styles.disabled}
      >
        <FieldShell
          label={label}
          required={required}
          icon={icon}
          error={error}
          focused={open}
          trailing={
            <Ionicons
              name="chevron-down"
              size={theme.type.headline.fontSize}
              color={theme.color.textSecondary}
            />
          }
        >
          <Text
            numberOfLines={1}
            style={[fieldTextStyles.value, styles.value, !selected && fieldTextStyles.placeholder]}
          >
            {selected?.name ?? placeholder}
          </Text>
        </FieldShell>
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={sheetTitle ?? label}>
        <ScrollView style={styles.list}>
          {options.map((option) => (
            <ListRow
              key={option.id}
              title={option.name}
              onPress={() => {
                onSelect(option.id);
                setOpen(false);
              }}
              trailing={
                option.id === selectedId ? (
                  <Ionicons
                    name="checkmark"
                    size={theme.type.title.fontSize}
                    color={theme.color.primary}
                  />
                ) : (
                  <></>
                )
              }
            />
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  value: {
    paddingVertical: theme.space.m,
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
});
