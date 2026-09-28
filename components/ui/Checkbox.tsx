// <Checkbox checked={agreed} onChange={setAgreed} label="I have read and understood the above" />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const BOX_SIZE = theme.space.l + theme.space.xs;
const SQUARE_RADIUS = theme.space.s - theme.space.xs / 2;

/** The box alone — round by default, a rounded square in the onboarding appearance. */
export function CheckboxBox({ checked }: { checked: boolean }) {
  const { appearance, color } = useAppearance();
  return (
    <View
      style={[
        styles.box,
        appearance === 'onboarding' && styles.square,
        checked
          ? { backgroundColor: color.primary }
          : [styles.boxUnchecked, { backgroundColor: color.surface, borderColor: color.border }],
      ]}
    >
      {checked ? (
        <Ionicons name="checkmark" size={theme.type.headline.fontSize} color={theme.color.background} />
      ) : null}
    </View>
  );
}

export default function Checkbox({ checked, onChange, label, disabled = false, style }: CheckboxProps) {
  const { color } = useAppearance();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <CheckboxBox checked={checked} />
      <Text style={[styles.label, { color: color.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    borderRadius: SQUARE_RADIUS,
  },
  boxUnchecked: {
    borderWidth: theme.space.xs / 2,
  },
  label: {
    ...theme.type.body,
    flex: 1,
  },
});
