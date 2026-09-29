// <IconButton icon={ArrowLeft} label="Back" variant="tinted" onPress={goBack} />
// <IconButton icon={Bell} label="Notifications" badge onPress={openNotices} />
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type IconButtonProps = {
  icon: IconComponent;
  label: string;
  onPress: () => void;
  // 'plain' — bare glyph (bell, search, header back arrow).
  // 'tinted' — light-green circle (onboarding back button, sheet close).
  // 'overlay' — translucent white circle over photos (livestock-enquiry.png).
  variant?: 'plain' | 'tinted' | 'overlay';
  color?: string;
  badge?: boolean;
  size?: number;
  style?: ViewStyle;
};

export default function IconButton({
  icon: Icon,
  label,
  onPress,
  variant = 'plain',
  color = theme.color.textPrimary,
  badge = false,
  size = theme.size.iconLarge,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, new items` : label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        variant === 'tinted' && styles.tinted,
        variant === 'overlay' && styles.overlay,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon size={size} color={variant === 'tinted' ? theme.color.primary : color} strokeWidth={2} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: theme.size.touch,
    height: theme.size.touch,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinted: {
    backgroundColor: theme.color.primaryTint,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  pressed: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.color.alert.fg,
    borderWidth: 2,
    borderColor: theme.color.surface,
  },
});
