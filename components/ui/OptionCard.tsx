// <OptionCard icon="car" title="I'm bringing this now" description="…" selected={type === 'now'} onPress={() => setType('now')} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type OptionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  /** Shows a tick (selected) or an empty ring in the top-right corner. */
  indicator?: boolean;
  style?: ViewStyle;
};

const ICON_CIRCLE = theme.space.xl - theme.space.s;
const BORDER_WIDTH = theme.space.xs / 2;

// One choice in a single-select group; render siblings side by side and drive
// `selected` from shared state.
export default function OptionCard({
  icon,
  title,
  description,
  selected,
  onPress,
  indicator = false,
  style,
}: OptionCardProps) {
  const { color } = useAppearance();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected
          ? { backgroundColor: color.primaryTint, borderColor: color.primary }
          : { backgroundColor: color.surface, borderColor: color.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      {indicator ? (
        <View
          style={[
            styles.mark,
            selected ? { backgroundColor: color.primary } : [styles.markEmpty, { borderColor: color.border }],
          ]}
        >
          {selected ? (
            <Ionicons name="checkmark" size={theme.type.caption.fontSize} color={theme.color.background} />
          ) : null}
        </View>
      ) : null}
      <View style={[styles.iconCircle, selected && { backgroundColor: color.primary }]}>
        <Ionicons
          name={icon}
          size={theme.type.headline.fontSize}
          color={selected ? theme.color.background : theme.color.textSecondary}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: theme.space.s,
    padding: theme.space.m,
    borderRadius: theme.radius.card,
    borderWidth: BORDER_WIDTH,
  },
  pressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.surfaceMuted,
  },
  mark: {
    position: 'absolute',
    top: theme.space.s + theme.space.xs,
    right: theme.space.s + theme.space.xs,
    width: theme.space.l,
    height: theme.space.l,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markEmpty: {
    borderWidth: StyleSheet.hairlineWidth * 3,
  },
  title: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  description: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
