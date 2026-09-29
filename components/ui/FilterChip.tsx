// <FilterChip label="Van Dhan" icon={Sprout} selected={filter === 'vandhan'} onPress={…} />
// Chips live in horizontal scrollers, so they never shrink or wrap their label.
import { Pressable, StyleSheet, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type FilterChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconComponent;
  iconColor?: string;
  // Dropdown-style chip (livestock-page.png's Species ⌄ / Sex ⌄ / Weight ⌄).
  dropdown?: boolean;
  // A dropdown chip with a value chosen.
  active?: boolean;
};

export default function FilterChip({
  label,
  selected = false,
  onPress,
  icon: Icon,
  iconColor,
  dropdown = false,
  active = false,
}: FilterChipProps) {
  const fg = selected ? theme.color.onPrimary : theme.color.textPrimary;
  return (
    <Pressable
      accessibilityRole={dropdown ? 'button' : 'radio'}
      accessibilityState={dropdown ? undefined : { selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        dropdown && styles.dropdown,
        dropdown && active && styles.dropdownActive,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {Icon ? <Icon size={18} color={selected ? fg : iconColor ?? theme.color.primary} strokeWidth={1.9} /> : null}
      <Text numberOfLines={1} style={[styles.label, { color: fg }]}>
        {label}
      </Text>
      {dropdown ? <ChevronDown size={16} color={fg} strokeWidth={2} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
    gap: theme.space.s,
    height: 40,
    paddingHorizontal: theme.space.l,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surfaceMuted,
  },
  dropdown: {
    backgroundColor: theme.color.primarySoft,
    borderWidth: 1,
    borderColor: theme.pillarTint.vandhan.border,
  },
  dropdownActive: {
    backgroundColor: theme.color.primaryTint,
    borderColor: theme.color.primary,
  },
  selected: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    ...theme.type.body,
    fontWeight: '500',
  },
});
