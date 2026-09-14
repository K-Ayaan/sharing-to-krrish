// <OptionCard icon="car" title="I'm bringing this now" description="…" selected={type === 'now'} onPress={() => setType('now')} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type OptionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

const ICON_CIRCLE = theme.space.xl - theme.space.s;
const BORDER_WIDTH = theme.space.xs / 2;

// One choice in a single-select group; render siblings side by side and drive
// `selected` from shared state.
export default function OptionCard({ icon, title, description, selected, onPress, style }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
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
  selected: {
    backgroundColor: theme.color.primaryTint,
    borderColor: theme.color.primary,
  },
  unselected: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
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
  iconCircleSelected: {
    backgroundColor: theme.color.primary,
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
