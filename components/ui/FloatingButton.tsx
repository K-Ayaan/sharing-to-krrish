// <FloatingButton label="Submit Collection" icon={Plus} onPress={openForm} />
// The extended floating action button pinned bottom-right on vandhan-page.png.
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export default function FloatingButton({
  label,
  icon: Icon,
  onPress,
}: {
  label: string;
  icon: IconComponent;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Icon size={24} color={theme.color.onPrimary} strokeWidth={2.25} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.size.screenPadding,
    bottom: theme.space.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: theme.size.button + 4,
    paddingHorizontal: theme.space.xl,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.primary,
    ...theme.elevation.raised,
  },
  pressed: {
    backgroundColor: theme.color.primaryPressed,
  },
  label: {
    ...theme.type.bodyStrong,
    fontSize: 14,
    fontWeight: '500',
    color: theme.color.onPrimary,
  },
});
