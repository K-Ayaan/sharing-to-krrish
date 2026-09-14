// <Button label="Send OTP" variant="primary" trailingIcon="arrow-forward" onPress={handlePress} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'text';

type IconName = keyof typeof Ionicons.glyphMap;

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: IconName;
  trailingIcon?: IconName;
  style?: ViewStyle;
};

const ICON_SIZE = theme.type.headline.fontSize;

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  trailingIcon,
  style,
}: ButtonProps) {
  const contentColor = disabled
    ? theme.color.textSecondary
    : variant === 'primary'
      ? theme.color.background
      : theme.color.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'text' ? styles.text : styles.sized,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'primary' && pressed && !disabled && styles.primaryPressed,
        variant !== 'primary' && pressed && !disabled && styles.tintPressed,
        disabled && (variant === 'primary' ? styles.primaryDisabled : styles.quietDisabled),
        style,
      ]}
    >
      {icon ? (
        <View style={styles.icon}>
          <Ionicons name={icon} size={ICON_SIZE} color={contentColor} />
        </View>
      ) : null}
      <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
      {trailingIcon ? (
        <View style={styles.trailingIcon}>
          <Ionicons name={trailingIcon} size={ICON_SIZE} color={contentColor} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sized: {
    minHeight: theme.space.xl + theme.space.s,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.pill,
  },
  text: {
    paddingHorizontal: theme.space.xs,
    paddingVertical: theme.space.xs,
  },
  primary: {
    backgroundColor: theme.color.primary,
  },
  primaryPressed: {
    backgroundColor: theme.color.primaryPressed,
  },
  secondary: {
    backgroundColor: theme.color.background,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.primary,
  },
  tintPressed: {
    backgroundColor: theme.color.primaryTint,
  },
  primaryDisabled: {
    backgroundColor: theme.color.surfaceMuted,
  },
  quietDisabled: {
    borderColor: theme.color.border,
  },
  label: {
    ...theme.type.headline,
  },
  icon: {
    marginRight: theme.space.s,
  },
  trailingIcon: {
    marginLeft: theme.space.s,
  },
});
