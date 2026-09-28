// <Button label="Send OTP" variant="primary" trailingIcon="arrow-forward" onPress={handlePress} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { onboardingShadow, useAppearance } from './Appearance';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

type IconName = keyof typeof Ionicons.glyphMap;

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: IconName;
  trailingIcon?: IconName;
  /** Action-row layout: icon and label on the left, a chevron on the right (LPG home actions). */
  chevron?: boolean;
  style?: ViewStyle;
};

const ICON_SIZE = theme.type.headline.fontSize;
const ONBOARDING_ICON_SIZE = theme.type.title.fontSize + theme.space.xs;
const ONBOARDING_DISABLED_OPACITY = 0.5;

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  trailingIcon,
  chevron = false,
  style,
}: ButtonProps) {
  const { appearance, color } = useAppearance();
  const onboarding = appearance === 'onboarding';
  // Onboarding keeps a disabled button in its own colour and fades it, as in the reference images;
  // elsewhere a disabled button turns grey.
  const fadeWhenDisabled = onboarding;

  const contentColor =
    disabled && !fadeWhenDisabled
      ? color.textSecondary
      : variant === 'primary'
        ? // White on the filled button in every appearance (onboarding's background is sage, not white).
          theme.color.background
        : variant === 'danger'
          ? color.danger
          : color.primary;
  const iconSize = onboarding && variant !== 'text' ? ONBOARDING_ICON_SIZE : ICON_SIZE;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'text' ? styles.text : styles.sized,
        chevron && styles.row,
        variant === 'primary' && { backgroundColor: color.primary },
        variant === 'primary' && onboarding && styles.raised,
        variant === 'secondary' && {
          backgroundColor: color.background,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: color.primary,
        },
        variant === 'danger' && {
          backgroundColor: color.background,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: color.danger,
        },
        variant === 'primary' && pressed && !disabled && { backgroundColor: color.primaryPressed },
        variant === 'danger' && pressed && !disabled && { backgroundColor: color.dangerTint },
        (variant === 'secondary' || variant === 'text') && pressed && !disabled && {
          backgroundColor: color.primaryTint,
        },
        disabled &&
          (fadeWhenDisabled
            ? styles.faded
            : variant === 'primary'
              ? { backgroundColor: color.surfaceMuted }
              : { borderColor: color.border }),
        style,
      ]}
    >
      {icon ? (
        <View style={styles.icon}>
          <Ionicons name={icon} size={iconSize} color={contentColor} />
        </View>
      ) : null}
      <Text
        style={[
          styles.label,
          onboarding && variant !== 'text' && styles.labelLight,
          chevron && styles.rowLabel,
          { color: contentColor },
        ]}
      >
        {label}
      </Text>
      {trailingIcon ? (
        <View style={styles.trailingIcon}>
          <Ionicons name={trailingIcon} size={iconSize} color={contentColor} />
        </View>
      ) : null}
      {chevron ? <Ionicons name="chevron-forward" size={ICON_SIZE} color={contentColor} /> : null}
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
  row: {
    justifyContent: 'flex-start',
    minHeight: theme.space.xl + theme.space.m,
    borderRadius: theme.radius.card + theme.space.xs,
  },
  rowLabel: {
    flex: 1,
    textAlign: 'left',
    marginLeft: theme.space.s,
  },
  raised: {
    ...onboardingShadow,
    minHeight: theme.space.xl + theme.space.m,
  },
  faded: {
    opacity: ONBOARDING_DISABLED_OPACITY,
  },
  label: {
    ...theme.type.headline,
    // Wrap inside the button when space runs short, instead of spilling past its edges.
    flexShrink: 1,
    textAlign: 'center',
  },
  labelLight: {
    fontSize: theme.type.title.fontSize,
    fontWeight: '500',
  },
  icon: {
    marginRight: theme.space.s,
  },
  trailingIcon: {
    marginLeft: theme.space.s,
  },
});
