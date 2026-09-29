// <SelectField icon={MapPin} placeholder="District" value={district} options={DISTRICTS} onChange={setDistrict} />
// <SelectField appearance="chip" icon={CalendarDays} value={range} options={RANGES} onChange={setRange} />
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AlertCircle, Check, ChevronDown, Search } from 'lucide-react-native';
import theme from '../../theme';
import BottomSheet from './BottomSheet';
import TextField from './TextField';
import type { IconComponent } from './icons';

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type SelectFieldProps<V extends string> = {
  value: V | null;
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  label?: string;
  placeholder?: string;
  sheetTitle?: string;
  sheetSubtitle?: string;
  icon?: IconComponent;
  required?: boolean;
  error?: string | null;
  disabled?: boolean;
  // 'field' — full-width form row. 'chip' — compact filter chip ("Updated today ⌄", "Species ⌄").
  appearance?: 'field' | 'chip';
  style?: ViewStyle;
};

const SEARCH_THRESHOLD = 8;

export default function SelectField<V extends string>({
  value,
  options,
  onChange,
  label,
  placeholder = 'Select',
  sheetTitle,
  sheetSubtitle,
  icon: Icon,
  required = false,
  error,
  disabled = false,
  appearance = 'field',
  style,
}: SelectFieldProps<V>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value) ?? null;

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const trigger =
    appearance === 'chip' ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? placeholder}: ${selected?.label ?? 'not set'}`}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.chip, pressed && styles.pressed, style]}
      >
        {Icon ? <Icon size={20} color={theme.color.primary} strokeWidth={1.9} /> : null}
        <Text numberOfLines={1} style={styles.chipText}>
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={theme.color.textPrimary} strokeWidth={2} />
      </Pressable>
    ) : (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label ?? placeholder}: ${selected?.label ?? 'not selected'}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          { borderColor: error ? theme.color.alert.fg : theme.color.borderStrong },
          disabled && styles.fieldDisabled,
          pressed && styles.pressed,
          style,
        ]}
      >
        {Icon ? (
          <View style={styles.fieldIcon}>
            <Icon
              size={theme.size.iconLarge}
              color={disabled ? theme.color.textTertiary : theme.color.textPrimary}
              strokeWidth={1.75}
            />
          </View>
        ) : null}
        <View style={styles.fieldText}>
          {label ? (
            <Text style={[styles.fieldLabel, disabled && styles.textDisabled]}>
              {label}
              {required ? <Text style={styles.required}> *</Text> : null}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            style={[
              selected ? styles.fieldValue : styles.fieldPlaceholder,
              disabled && styles.textDisabled,
              !label && styles.fieldValueAlone,
            ]}
          >
            {selected?.label ?? placeholder}
          </Text>
        </View>
        <ChevronDown
          size={22}
          color={disabled ? theme.color.textTertiary : theme.color.textPrimary}
          strokeWidth={2}
        />
      </Pressable>
    );

  return (
    <View>
      {trigger}
      {error && appearance === 'field' ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <AlertCircle size={14} color={theme.color.alert.fg} strokeWidth={2} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}
      <BottomSheet
        visible={open}
        onClose={close}
        title={sheetTitle ?? label ?? placeholder}
        subtitle={sheetSubtitle}
        scrollable
      >
        {options.length > SEARCH_THRESHOLD ? (
          <TextField
            icon={Search}
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            containerStyle={styles.search}
          />
        ) : null}
        {visibleOptions.length === 0 ? (
          <Text style={styles.noMatch}>No matches for “{query.trim()}”</Text>
        ) : null}
        {visibleOptions.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled: option.disabled }}
              disabled={option.disabled}
              onPress={() => {
                onChange(option.value);
                close();
              }}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, option.disabled && styles.textDisabled]}>
                  {option.label}
                </Text>
                {option.description ? (
                  <Text style={styles.optionDescription}>{option.description}</Text>
                ) : null}
              </View>
              {isSelected ? <Check size={20} color={theme.color.primary} strokeWidth={2.5} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.size.field + 8,
    borderRadius: theme.radius.field,
    borderWidth: 1,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.l,
  },
  fieldDisabled: {
    backgroundColor: theme.color.surfaceMuted,
    borderColor: theme.color.border,
  },
  fieldIcon: {
    marginRight: theme.space.m + 2,
  },
  fieldText: {
    flex: 1,
    paddingVertical: theme.space.s,
  },
  fieldLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    fontWeight: '500',
  },
  required: {
    color: theme.color.required,
  },
  fieldValue: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textPrimary,
    marginTop: 2,
  },
  fieldValueAlone: {
    marginTop: 0,
  },
  fieldPlaceholder: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textTertiary,
    marginTop: 2,
  },
  textDisabled: {
    color: theme.color.textTertiary,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    minHeight: theme.size.touch,
    paddingHorizontal: theme.space.l,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.primarySoft,
    borderWidth: 1,
    borderColor: theme.pillarTint.vandhan.border,
  },
  chipText: {
    ...theme.type.captionStrong,
    fontSize: 12,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  pressed: {
    opacity: 0.75,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.space.s,
    paddingLeft: theme.space.xs,
  },
  error: {
    ...theme.type.caption,
    color: theme.color.alert.fg,
  },
  search: {
    marginBottom: theme.space.m,
  },
  noMatch: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    paddingVertical: theme.space.l,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.size.touch + 4,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.field,
    marginBottom: 2,
  },
  optionSelected: {
    backgroundColor: theme.color.primarySoft,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...theme.type.body,
    fontSize: 14,
    color: theme.color.textPrimary,
  },
  optionDescription: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
});
