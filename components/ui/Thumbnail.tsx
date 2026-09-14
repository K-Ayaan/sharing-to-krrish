// <Thumbnail uri={produce.imageUrl} fallbackIcon="leaf" />  or  <Thumbnail uri={kendra.photoUrl} fallbackIcon="business" size="banner" />
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type ThumbnailProps = {
  uri: string | null;
  /** Shown when there is no image or it fails to load. */
  fallbackIcon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  tint?: string;
  /** 'm' and 'l' are squares; 'banner' fills the width at 16:9. */
  size?: 'm' | 'l' | 'banner';
  accessibilityLabel?: string;
  style?: ViewStyle;
};

const SQUARE = {
  m: theme.space.xl + theme.space.s,
  l: theme.space.xl * 2,
} as const;

const BANNER_ASPECT_RATIO = 16 / 9;

export default function Thumbnail({
  uri,
  fallbackIcon,
  iconColor = theme.color.textSecondary,
  tint = theme.color.surfaceMuted,
  size = 'm',
  accessibilityLabel,
  style,
}: ThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const isBanner = size === 'banner';
  const iconSize = isBanner ? theme.space.xl + theme.space.m : SQUARE[size] / 2;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      style={[
        styles.frame,
        isBanner ? styles.banner : { width: SQUARE[size], height: SQUARE[size] },
        size === 'm' ? styles.radiusField : styles.radiusCard,
        { backgroundColor: tint },
        style,
      ]}
    >
      {uri && !failed ? (
        <Image
          onError={() => setFailed(true)}
          resizeMode="cover"
          source={{ uri }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Ionicons name={fallbackIcon} size={iconSize} color={iconColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    aspectRatio: BANNER_ASPECT_RATIO,
  },
  radiusField: {
    borderRadius: theme.radius.field,
  },
  radiusCard: {
    borderRadius: theme.radius.card,
  },
});
