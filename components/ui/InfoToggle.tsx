// <InfoToggle label="Why do we need this?" expanded={open} onPress={() => setOpen(!open)} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type InfoToggleProps = {
  label: string;
  onPress: () => void;
  /** Flips the chevron when the parent shows its content inline; omit when it opens a sheet. */
  expanded?: boolean;
  style?: ViewStyle;
};

const BADGE_SIZE = theme.space.xl - theme.space.xs;

// An info badge, a short question and a chevron — the "Why do we need this?" link on
// onboarding fields. The parent decides what it reveals (inline text or a BottomSheet).
export default function InfoToggle({ label, onPress, expanded, style }: InfoToggleProps) {
  const { color } = useAppearance();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      hitSlop={theme.space.s}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      <View style={[styles.badge, { backgroundColor: color.primaryTint }]}>
        <Ionicons name="information-circle" size={theme.type.title.fontSize + theme.space.xs} color={color.primary} />
      </View>
      <Text style={[styles.label, { color: color.textPrimary }]}>{label}</Text>
      <Ionicons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={theme.type.headline.fontSize + theme.space.xs}
        color={color.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.space.m,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...theme.type.headline,
    fontWeight: '400',
  },
});
