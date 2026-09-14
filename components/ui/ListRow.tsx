// <ListRow icon="leaf-outline" title="Ginger" subtitle="₹42/kg" trailing={<StatusPill .../>} onPress={open} />
// <ListRow icon="megaphone" title="Subsidy update" unread onPress={open} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type ListRowProps = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  subtitle?: string;
  /** Chevron, StatusPill or plain text. Omit for a chevron (or the unread dot); pass <></> for nothing. */
  trailing?: ReactNode;
  /** Sits at the end of the title line, e.g. a StatusPill. */
  titleAccessory?: ReactNode;
  size?: 'default' | 'large';
  iconColor?: string;
  iconBackground?: string;
  /** Hairline under the row, for stacked rows inside a Card. */
  divider?: boolean;
  /** For rows in a multi-select list; exposed to accessibility as selected. */
  selected?: boolean;
  /**
   * Unread item: shows a dot in place of the default chevron and prefixes the
   * accessibility label with "Unread" so VoiceOver announces it.
   */
  unread?: boolean;
  style?: ViewStyle;
};

const ICON_BOX = theme.space.xl;
const ICON_BOX_LARGE = theme.space.xl + theme.space.l;
const UNREAD_DOT = theme.space.s + theme.space.xs / 2;

export default function ListRow({
  title,
  onPress,
  icon,
  subtitle,
  trailing,
  titleAccessory,
  size = 'default',
  iconColor = theme.color.primary,
  iconBackground = theme.color.primaryTint,
  divider = false,
  selected,
  unread = false,
  style,
}: ListRowProps) {
  const large = size === 'large';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={unread ? ['Unread', title, subtitle].filter(Boolean).join(', ') : undefined}
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        large && styles.rowLarge,
        divider && styles.divider,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <View style={[styles.iconBox, large && styles.iconBoxLarge, { backgroundColor: iconBackground }]}>
          <Ionicons
            name={icon}
            size={large ? theme.space.xl - theme.space.s : theme.type.title.fontSize}
            color={iconColor}
          />
        </View>
      ) : null}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[styles.title, large && styles.titleLarge]}>
            {title}
          </Text>
          {titleAccessory}
        </View>
        {subtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.trailing}>
        {trailing ??
          (unread ? (
            <View style={styles.unreadDot} />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={theme.type.headline.fontSize}
              color={theme.color.textSecondary}
            />
          ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
  },
  rowLarge: {
    paddingVertical: theme.space.m,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  pressed: {
    backgroundColor: theme.color.surfaceMuted,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: theme.radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLarge: {
    width: ICON_BOX_LARGE,
    height: ICON_BOX_LARGE,
    borderRadius: theme.radius.card,
  },
  body: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
    flex: 1,
  },
  titleLarge: {
    ...theme.type.title,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  trailing: {
    alignItems: 'flex-end',
  },
  unreadDot: {
    width: UNREAD_DOT,
    height: UNREAD_DOT,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.primary,
  },
});
