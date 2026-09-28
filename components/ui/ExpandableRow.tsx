// <ExpandableRow title="How do I register?" body="Open the Services tab…" expanded={open} onToggle={toggle} divider />
// <ExpandableRow icon="document-text-outline" iconColor={c} iconBackground={t} title="…" subtitle="Step by step guide." body="…" … />
import { Ionicons } from '@expo/vector-icons';
import { LayoutAnimation, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import AppIcon, { type AppIconName } from './AppIcon';
import { useAppearance } from './Appearance';

export type ExpandableRowProps = {
  title: string;
  body: string;
  expanded: boolean;
  onToggle: () => void;
  /** Short line under the title, always visible (e.g. what the answer covers). */
  subtitle?: string;
  /** Leading icon in a tinted rounded tile. */
  icon?: AppIconName;
  iconColor?: string;
  iconBackground?: string;
  /** Hairline under the row, for stacked rows inside a Card. */
  divider?: boolean;
  style?: ViewStyle;
};

const ICON_TILE = theme.space.xl + theme.space.s;
const CHEVRON_CIRCLE = theme.space.xl;

// A question-and-answer row: the title wraps (unlike ListRow's single line) and the body
// shows below it when expanded. Expansion state is owned by the parent, so a list can
// keep one row open at a time. The chevron sits in a tinted circle and flips when open.
export default function ExpandableRow({
  title,
  body,
  expanded,
  onToggle,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  divider = false,
  style,
}: ExpandableRowProps) {
  const { color } = useAppearance();

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={[divider && styles.divider, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={[title, subtitle].filter(Boolean).join('. ')}
        onPress={handlePress}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        {icon ? (
          <View style={[styles.tile, { backgroundColor: iconBackground ?? color.primaryTint }]}>
            <AppIcon name={icon} size={theme.type.title.fontSize + theme.space.xs} color={iconColor ?? color.primary} />
          </View>
        ) : null}
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.chevron, { backgroundColor: color.primaryTint }]}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={theme.type.headline.fontSize}
            color={color.textPrimary}
          />
        </View>
      </Pressable>
      {expanded ? <Text style={[styles.body, !!icon && styles.bodyIndented]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    padding: theme.space.m,
  },
  pressed: {
    opacity: 0.7,
  },
  tile: {
    width: ICON_TILE,
    height: ICON_TILE,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  title: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  chevron: {
    width: CHEVRON_CIRCLE,
    height: CHEVRON_CIRCLE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    paddingHorizontal: theme.space.m,
    paddingBottom: theme.space.m,
  },
  bodyIndented: {
    paddingLeft: theme.space.m + ICON_TILE + theme.space.m,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
});
