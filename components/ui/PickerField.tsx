// <PickerField icon={CalendarDays} label="Select Date" value={dateLabel} placeholder="Choose date" onPress={openDatePicker} />
// Field-shaped trigger for native pickers (date, time) — vandhan-submit-collection.png.
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type PickerFieldProps = {
  icon: IconComponent;
  label: string;
  value: string | null;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  error?: boolean;
  style?: ViewStyle;
};

export default function PickerField({
  icon: Icon,
  label,
  value,
  placeholder,
  onPress,
  disabled = false,
  error = false,
  style,
}: PickerFieldProps) {
  const tone = disabled ? theme.color.textTertiary : theme.color.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ?? placeholder}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.field,
        disabled && styles.disabled,
        error && styles.error,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon size={20} color={tone} strokeWidth={1.75} />
      <View style={styles.text}>
        <Text style={[styles.label, disabled && styles.muted]}>{label}</Text>
        <Text numberOfLines={1} style={[value ? styles.value : styles.placeholder, disabled && styles.muted]}>
          {value ?? placeholder}
        </Text>
      </View>
      <ChevronDown size={18} color={tone} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: theme.size.field + 6,
    paddingHorizontal: theme.space.m + 2,
    borderRadius: theme.radius.field,
    borderWidth: 1,
    borderColor: theme.color.borderStrong,
    backgroundColor: theme.color.surface,
  },
  disabled: {
    backgroundColor: theme.color.surfaceMuted,
    borderColor: theme.color.border,
  },
  error: {
    borderColor: theme.color.alert.fg,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    flex: 1,
  },
  label: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  value: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    marginTop: 1,
  },
  placeholder: {
    ...theme.type.body,
    color: theme.color.textTertiary,
    marginTop: 1,
  },
  muted: {
    color: theme.color.textTertiary,
  },
});
