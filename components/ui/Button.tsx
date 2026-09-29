// <Button label="Continue" trailingIcon={ArrowRight} onPress={next} />
// <Button label="Book Refill" variant="pillar" pillarColor="lpg" icon={CalendarDays} onPress={book} />
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

// 'pillar' fills with the pillar's own primary (LPG is blue — see design-tokens.md).
// 'tonal' is the light-green filled button (Enquire, WhatsApp).
// 'danger' is the outlined red Log Out treatment from settings.png.
export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'text' | 'pillar' | 'danger';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  pillarColor?: 'lpg';
  size?: 'large' | 'medium' | 'small';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconComponent;
  trailingIcon?: IconComponent;
  style?: ViewStyle;
  accessibilityHint?: string;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  pillarColor,
  size = 'large',
  disabled = false,
  loading = false,
  icon: Icon,
  trailingIcon: TrailingIcon,
  style,
  accessibilityHint,
}: ButtonProps) {
  const filled = variant === 'primary' || variant === 'pillar';
  const fill = pillarColor === 'lpg' ? theme.pillarTint.lpg.primary : theme.color.primary;
  const fillPressed =
    pillarColor === 'lpg' ? theme.pillarTint.lpg.primaryPressed : theme.color.primaryPressed;
  const inactive = disabled || loading;

  const contentColor = disabled
    ? theme.color.textTertiary
    : filled
      ? theme.color.onPrimary
      : variant === 'danger'
        ? theme.color.alert.fg
        : fill;

  const iconSize = size === 'small' ? theme.size.iconSmall : theme.size.icon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant !== 'text' && styles[size],
        filled && { backgroundColor: fill },
        filled && pressed && { backgroundColor: fillPressed },
        variant === 'secondary' && [styles.secondary, { borderColor: fill }],
        variant === 'tonal' && styles.tonal,
        variant === 'danger' && styles.danger,
        !filled && pressed && styles.tintPressed,
        disabled && filled && styles.filledDisabled,
        disabled && !filled && variant !== 'text' && styles.quietDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {Icon ? (
            <View style={styles.icon}>
              <Icon size={iconSize} color={contentColor} strokeWidth={2} />
            </View>
          ) : null}
          <Text
            numberOfLines={1}
            style={[size === 'small' ? styles.labelSmall : styles.label, { color: contentColor }]}
          >
            {label}
          </Text>
          {TrailingIcon ? (
            <View style={styles.trailingIcon}>
              <TrailingIcon size={iconSize} color={contentColor} strokeWidth={2} />
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  large: {
    minHeight: theme.size.button,
    paddingHorizontal: theme.space.xl,
  },
  medium: {
    minHeight: theme.size.touch,
    paddingHorizontal: theme.space.l,
  },
  small: {
    minHeight: 40,
    paddingHorizontal: theme.space.l,
  },
  secondary: {
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
  },
  tonal: {
    backgroundColor: theme.color.primaryTint,
  },
  danger: {
    backgroundColor: theme.color.alert.bg,
    borderWidth: 1,
    borderColor: theme.color.alert.border,
    borderRadius: theme.radius.field,
    justifyContent: 'flex-start',
  },
  tintPressed: {
    opacity: 0.75,
  },
  filledDisabled: {
    backgroundColor: theme.color.surfaceMuted,
  },
  quietDisabled: {
    borderColor: theme.color.border,
  },
  label: {
    ...theme.type.bodyStrong,
    fontSize: 14,
  },
  labelSmall: {
    ...theme.type.captionStrong,
    fontSize: 12,
  },
  icon: {
    marginRight: theme.space.s + 2,
  },
  trailingIcon: {
    marginLeft: theme.space.s + 2,
  },
});
