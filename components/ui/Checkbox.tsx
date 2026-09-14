// <Checkbox checked={agreed} onChange={setAgreed} label="I have read and understood the above" />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const BOX_SIZE = theme.space.l + theme.space.xs;

export default function Checkbox({ checked, onChange, label, disabled = false, style }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <View style={[styles.box, checked ? styles.boxChecked : styles.boxUnchecked]}>
        {checked ? (
          <Ionicons name="checkmark" size={theme.type.headline.fontSize} color={theme.color.background} />
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
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
  boxChecked: {
    backgroundColor: theme.color.primary,
  },
  boxUnchecked: {
    backgroundColor: theme.color.surface,
    borderWidth: theme.space.xs / 2,
    borderColor: theme.color.border,
  },
  label: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    flex: 1,
  },
});
