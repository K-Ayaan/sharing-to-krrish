// <SelectField label="District" required icon="location" placeholder="Select district" options={districts} selectedId={id} onSelect={setId} />
// <SelectField label="Kendra" options={kendras} sheetSubtitle="Choose…" optionIcon="location" confirmLabel="Select kendra" … />
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import BottomSheet from './BottomSheet';
import Button from './Button';
import ListRow from './ListRow';
import Radio from './Radio';
import { FieldShell, fieldTextStyles } from './TextField';

export type SelectOption = {
  id: string;
  name: string;
  /** Second line in the sheet, e.g. an address. */
  description?: string;
};

export type SelectFieldProps = {
  label: string;
  /** Keep the label for VoiceOver and the sheet title, but don't draw it above the field. */
  labelHidden?: boolean;
  placeholder: string;
  options: SelectOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Draw the field's icon in a tinted tile (see FieldShell). */
  iconTinted?: boolean;
  disabled?: boolean;
  error?: string;
  sheetTitle?: string;
  /** Explanatory line under the sheet title. */
  sheetSubtitle?: string;
  /** Icon for each option card in the sheet (card list only). */
  optionIcon?: keyof typeof Ionicons.glyphMap;
  /**
   * Turns the sheet into a card list with radio marks: tapping stages a choice, and this button
   * confirms it. Without it, tapping a row selects and closes at once.
   */
  confirmLabel?: string;
};

const LIST_MAX_HEIGHT = Dimensions.get('window').height / 2;

export default function SelectField({
  label,
  labelHidden = false,
  placeholder,
  options,
  selectedId,
  onSelect,
  required,
  icon,
  iconTinted,
  disabled = false,
  error,
  sheetTitle,
  sheetSubtitle,
  optionIcon,
  confirmLabel,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | undefined>(selectedId);
  const { appearance, color } = useAppearance();
  const selected = options.find((option) => option.id === selectedId);

  const openSheet = () => {
    setPending(selectedId);
    setOpen(true);
  };

  const confirm = () => {
    if (pending) onSelect(pending);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.name ?? placeholder }}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={openSheet}
        style={disabled && styles.disabled}
      >
        <FieldShell
          label={labelHidden ? undefined : label}
          required={required}
          icon={icon}
          iconTinted={iconTinted}
          error={error}
          focused={open}
          trailing={
            <Ionicons
              name="chevron-down"
              size={theme.type.headline.fontSize + (appearance === 'onboarding' ? theme.space.xs : 0)}
              color={appearance === 'onboarding' ? color.primary : color.textSecondary}
            />
          }
        >
          <Text
            numberOfLines={1}
            style={[
              fieldTextStyles.value,
              styles.value,
              { color: selected ? color.textPrimary : color.textSecondary },
            ]}
          >
            {selected?.name ?? placeholder}
          </Text>
        </FieldShell>
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)} title={sheetTitle ?? label}>
        {sheetSubtitle ? <Text style={styles.subtitle}>{sheetSubtitle}</Text> : null}
        {confirmLabel ? (
          <View style={styles.cardSheet}>
            <ScrollView style={styles.list} contentContainerStyle={styles.cards}>
              {options.map((option) => {
                const isPending = option.id === pending;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isPending, checked: isPending }}
                    accessibilityLabel={[option.name, option.description].filter(Boolean).join(', ')}
                    onPress={() => setPending(option.id)}
                    style={({ pressed }) => [
                      styles.card,
                      isPending
                        ? { backgroundColor: color.primaryTint, borderColor: color.primary }
                        : { backgroundColor: color.surface, borderColor: color.border },
                      pressed && styles.pressed,
                    ]}
                  >
                    {optionIcon ? (
                      <View style={[styles.tile, { backgroundColor: color.primaryTint }]}>
                        <Ionicons name={optionIcon} size={theme.type.title.fontSize} color={color.primary} />
                      </View>
                    ) : null}
                    <View style={styles.cardText}>
                      <Text numberOfLines={1} style={styles.cardTitle}>
                        {option.name}
                      </Text>
                      {option.description ? (
                        <Text numberOfLines={1} style={styles.cardDescription}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    <Radio selected={isPending} />
                  </Pressable>
                );
              })}
            </ScrollView>
            <Button label={confirmLabel} disabled={!pending} onPress={confirm} />
          </View>
        ) : (
          <ScrollView style={styles.list}>
            {options.map((option) => (
              <ListRow
                key={option.id}
                title={option.name}
                subtitle={option.description}
                onPress={() => {
                  onSelect(option.id);
                  setOpen(false);
                }}
                trailing={
                  option.id === selectedId ? (
                    <Ionicons name="checkmark" size={theme.type.title.fontSize} color={color.primary} />
                  ) : (
                    <></>
                  )
                }
              />
            ))}
          </ScrollView>
        )}
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
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: -theme.space.s,
    marginBottom: theme.space.m,
  },
  cardSheet: {
    gap: theme.space.m,
    paddingBottom: theme.space.s,
  },
  cards: {
    gap: theme.space.s,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    padding: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  pressed: {
    opacity: 0.8,
  },
  tile: {
    width: theme.space.xl,
    height: theme.space.xl,
    borderRadius: theme.radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  cardTitle: {
    ...theme.type.headline,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  cardDescription: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
