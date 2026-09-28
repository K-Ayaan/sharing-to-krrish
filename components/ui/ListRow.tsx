// <ListRow icon="leaf-outline" title="Ginger" subtitle="₹42/kg" trailing={<StatusPill .../>} onPress={open} />
// <ListRow icon="megaphone" title="Subsidy update" unread onPress={open} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import AppIcon, { type AppIconName } from './AppIcon';
import { useAppearance } from './Appearance';

export type ListRowProps = {
  title: string;
  onPress: () => void;
  icon?: AppIconName;
  subtitle?: string;
  /** Chevron, StatusPill or plain text. Omit for a chevron (or the unread dot); pass <></> for nothing. */
  trailing?: ReactNode;
  /** Sits at the end of the title line, e.g. a StatusPill. */
  titleAccessory?: ReactNode;
  size?: 'default' | 'large';
  iconColor?: string;
  iconBackground?: string;
  /** `circle` draws the icon in a round badge (Settings, Home's activity list). */
  iconShape?: 'rounded' | 'circle';
  /** Replaces the icon box, e.g. an Avatar with initials. */
  leading?: ReactNode;
  /** Short text before the chevron, e.g. a date or "Light". */
  meta?: string;
  /**
   * Time shown top-right with the unread dot beneath it; the chevron then always shows (Notices).
   * Without it, an unread row shows the dot in place of the chevron.
   */
  timestamp?: string;
  /** `danger` colours the title for destructive rows such as "Log out". */
  tone?: 'default' | 'danger';
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
  iconColor: iconColorProp,
  iconBackground: iconBackgroundProp,
  iconShape = 'rounded',
  leading,
  meta,
  timestamp,
  tone = 'default',
  divider = false,
  selected,
  unread = false,
  style,
}: ListRowProps) {
  const large = size === 'large';
  const { color } = useAppearance();
  const iconColor = iconColorProp ?? color.primary;
  const iconBackground = iconBackgroundProp ?? color.primaryTint;

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
      {leading ??
        (icon ? (
          <View
            style={[
              styles.iconBox,
              large && styles.iconBoxLarge,
              iconShape === 'circle' && styles.iconCircle,
              { backgroundColor: iconBackground },
            ]}
          >
            <AppIcon
              name={icon}
              size={large ? theme.space.xl - theme.space.s : theme.type.title.fontSize}
              color={iconColor}
            />
          </View>
        ) : null)}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[styles.title, large && styles.titleLarge, tone === 'danger' && styles.titleDanger]}
          >
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
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      {timestamp ? (
        <View style={styles.stamp}>
          <Text style={styles.stampText}>{timestamp}</Text>
          {unread ? <View style={[styles.unreadDot, { backgroundColor: color.primary }]} /> : null}
        </View>
      ) : null}
      <View style={styles.trailing}>
        {trailing ??
          (unread && !timestamp ? (
            <View style={[styles.unreadDot, { backgroundColor: color.primary }]} />
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
  titleDanger: {
    color: theme.color.danger,
  },
  iconCircle: {
    borderRadius: theme.radius.pill,
  },
  meta: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  stamp: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  stampText: {
    ...theme.type.caption,
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
