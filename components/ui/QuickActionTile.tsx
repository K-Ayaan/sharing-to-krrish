// <QuickActionTile icon="leaf" label="Van Dhan" iconColor={theme.pillarTint.vandhan.icon} tint={theme.pillarTint.vandhan.tint} onPress={open} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type QuickActionTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  iconColor: string;
  tint: string;
  style?: ViewStyle;
};

const MIN_LABEL_SCALE = 0.8;

export default function QuickActionTile({
  icon,
  label,
  onPress,
  iconColor,
  tint,
  style,
}: QuickActionTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed, style]}
    >
      <View style={[styles.tile, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={theme.space.xl - theme.space.s} color={iconColor} />
      </View>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={MIN_LABEL_SCALE}
        numberOfLines={1}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: theme.space.s,
  },
  pressed: {
    opacity: 0.7,
  },
  tile: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    textAlign: 'center',
  },
});
