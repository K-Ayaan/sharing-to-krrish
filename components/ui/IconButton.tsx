// <IconButton icon="notifications-outline" badgeCount={3} accessibilityLabel="Notifications" onPress={openNotices} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  badgeCount?: number;
  color?: string;
  style?: ViewStyle;
};

const HIT_SIZE = theme.space.xl + theme.space.xs;
const BADGE_SIZE = theme.space.m + theme.space.xs;
const MAX_BADGE = 99;

export default function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  badgeCount = 0,
  color = theme.color.textPrimary,
  style,
}: IconButtonProps) {
  const hasBadge = badgeCount > 0;
  const badgeLabel = badgeCount > MAX_BADGE ? `${MAX_BADGE}+` : String(badgeCount);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasBadge ? `${accessibilityLabel}, ${badgeCount} unread` : accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Ionicons name={icon} size={theme.space.l + theme.space.xs} color={color} />
      {hasBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{badgeLabel}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: HIT_SIZE,
    height: HIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: theme.space.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    ...theme.type.caption,
    fontSize: theme.type.caption.fontSize - 2,
    fontWeight: '700',
    color: theme.color.background,
  },
});
