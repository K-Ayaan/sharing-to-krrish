// <RateRow title="Broom Grass" subtitle="Yimchunger: Tsüngri" price="₹ 120" unit="per kg" trend="up" updatedLabel="12 Aug 2025" imageUrl={null} fallbackIcon="leaf" onPress={open} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import Thumbnail from './Thumbnail';

type IconName = keyof typeof Ionicons.glyphMap;

export type RateTrend = 'up' | 'down' | 'flat';

export const rateTrends: Record<RateTrend, { icon: IconName; label: string; fg: string; bg: string }> = {
  up: { icon: 'trending-up', label: 'Trending up', fg: theme.color.success, bg: theme.color.successTint },
  down: { icon: 'trending-down', label: 'Trending down', fg: theme.color.danger, bg: theme.color.dangerTint },
  flat: { icon: 'remove', label: 'Steady', fg: theme.color.textSecondary, bg: theme.color.surfaceMuted },
};

export type RateRowProps = {
  title: string;
  subtitle?: string;
  price: string;
  unit: string;
  trend: RateTrend;
  updatedLabel: string;
  onPress: () => void;
  imageUrl: string | null;
  fallbackIcon: IconName;
  fallbackIconColor?: string;
  fallbackTint?: string;
  /** Hairline under the row, for stacked rows inside a Card. */
  divider?: boolean;
  style?: ViewStyle;
};

const TREND_BADGE = theme.space.l + theme.space.xs;
const PRICE_MIN_WIDTH = theme.space.xl + theme.space.m;
const MIN_TITLE_SCALE = 0.85;

export default function RateRow({
  title,
  subtitle,
  price,
  unit,
  trend,
  updatedLabel,
  onPress,
  imageUrl,
  fallbackIcon,
  fallbackIconColor,
  fallbackTint,
  divider = false,
  style,
}: RateRowProps) {
  const trendMeta = rateTrends[trend];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${price} ${unit}, ${trendMeta.label}, updated ${updatedLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, divider && styles.divider, pressed && styles.pressed, style]}
    >
      <Thumbnail
        uri={imageUrl}
        fallbackIcon={fallbackIcon}
        iconColor={fallbackIconColor}
        tint={fallbackTint}
      />
      <View style={styles.name}>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={MIN_TITLE_SCALE}
          numberOfLines={1}
          style={styles.title}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.caption}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.price}>
        <Text numberOfLines={1} style={styles.priceValue}>
          {price}
        </Text>
        <Text numberOfLines={1} style={styles.caption}>
          {unit}
        </Text>
      </View>
      <View style={[styles.trend, { backgroundColor: trendMeta.bg }]}>
        <Ionicons name={trendMeta.icon} size={theme.type.body.fontSize} color={trendMeta.fg} />
      </View>
      <View style={styles.updated}>
        <Text style={styles.caption}>Updated</Text>
        <Text numberOfLines={1} style={styles.caption}>
          {updatedLabel}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={theme.type.headline.fontSize} color={theme.color.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  pressed: {
    backgroundColor: theme.color.surfaceMuted,
  },
  name: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  title: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  price: {
    minWidth: PRICE_MIN_WIDTH,
    gap: theme.space.xs / 2,
  },
  priceValue: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  trend: {
    width: TREND_BADGE,
    height: TREND_BADGE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updated: {
    gap: theme.space.xs / 2,
  },
});
