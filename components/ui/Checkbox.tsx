// <Checkbox checked={agreed} onChange={setAgreed}>I agree…</Checkbox>
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../../theme';

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: boolean;
};

export default function Checkbox({ checked, onChange, children, error = false }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      hitSlop={6}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxOn, error && !checked && styles.boxError]}>
        {checked ? <Check size={15} color={theme.color.onPrimary} strokeWidth={3} /> : null}
      </View>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.color.textTertiary,
    backgroundColor: theme.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxOn: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  boxError: {
    borderColor: theme.color.alert.fg,
  },
  label: {
    flex: 1,
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
  },
});
