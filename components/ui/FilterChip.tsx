// <FilterChip label="Species" trailingIcon="chevron-down" selected={species.length > 0} onPress={openSheet} />
// <FilterChip label="Pig" selected onPress={openSheet} onRemove={() => removeSpecies('pig')} />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Pressable, Text, ViewStyle } from 'react-native';
import theme from '../../theme';
import AppIcon, { type AppIconName } from './AppIcon';
import { useAppearance } from './Appearance';

type IconName = keyof typeof Ionicons.glyphMap;

export type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: AppIconName;
  /** Defaults to the chip's label color. */
  iconColor?: string;
  /** e.g. "chevron-down" for a chip that opens a picker. */
  trailingIcon?: IconName;
  /** Adds a × that removes this value. */
  onRemove?: () => void;
  style?: ViewStyle;
};

export default function FilterChip({
  label,
  selected,
  onPress,
  icon,
  iconColor,
  trailingIcon,
  onRemove,
  style,
}: FilterChipProps) {
  const { color } = useAppearance();
  const labelColor = selected ? color.primary : color.textSecondary;
  const iconSize = theme.type.body.fontSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: color.primaryTint, borderColor: color.primary }
          : { backgroundColor: color.surfaceMuted, borderColor: color.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <AppIcon name={icon} size={iconSize} color={iconColor ?? labelColor} /> : null}
      <Text numberOfLines={1} style={[styles.label, { color: labelColor }]}>
        {label}
      </Text>
      {trailingIcon ? <Ionicons name={trailingIcon} size={iconSize} color={labelColor} /> : null}
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          hitSlop={theme.space.s}
          onPress={onRemove}
        >
          <Ionicons name="close" size={iconSize} color={labelColor} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.space.xs,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...theme.type.body,
    fontWeight: '600',
  },
});
