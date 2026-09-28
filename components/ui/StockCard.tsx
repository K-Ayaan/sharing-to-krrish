// <StockCard title="Pig" subtitle="Female · 20 – 30 kg" quantityLabel="12 available" locationLabel="Dimapur Kendra" imageUrl={null} fallbackIcon="paw" onPress={open} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import type { AppIconName } from './AppIcon';
import Thumbnail from './Thumbnail';

export type StockCardProps = {
  title: string;
  subtitle: string;
  quantityLabel: string;
  locationLabel: string;
  imageUrl: string | null;
  fallbackIcon: AppIconName;
  fallbackIconColor?: string;
  fallbackTint?: string;
  onPress: () => void;
  style?: ViewStyle;
};

// Grid tile for browsable stock; lay out two per row and let each flex.
export default function StockCard({
  title,
  subtitle,
  quantityLabel,
  locationLabel,
  imageUrl,
  fallbackIcon,
  fallbackIconColor,
  fallbackTint,
  onPress,
  style,
}: StockCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}, ${quantityLabel}, ${locationLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.top}>
        <Thumbnail
          uri={imageUrl}
          fallbackIcon={fallbackIcon}
          iconColor={fallbackIconColor}
          tint={fallbackTint}
        />
        <View style={styles.flex}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={2} style={styles.caption}>
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={theme.type.headline.fontSize} color={theme.color.textSecondary} />
      </View>
      <Text style={styles.quantity}>{quantityLabel}</Text>
      <View style={styles.location}>
        <Ionicons name="location" size={theme.type.body.fontSize} color={theme.color.textSecondary} />
        <Text numberOfLines={1} style={[styles.caption, styles.flex]}>
          {locationLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: theme.space.s,
    padding: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.border,
    backgroundColor: theme.color.surface,
  },
  pressed: {
    backgroundColor: theme.color.surfaceMuted,
  },
  flex: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  quantity: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
  },
});
