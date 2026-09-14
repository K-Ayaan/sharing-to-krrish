// <PhotoCarousel photos={[{ id: 'p1', url: null }]} fallbackIcon="paw" accessibilityLabel="Stock photos" />
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import Thumbnail from './Thumbnail';

export type CarouselPhoto = {
  id: string;
  url: string | null;
};

export type PhotoCarouselProps = {
  photos: CarouselPhoto[];
  fallbackIcon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  tint?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

const DOT = theme.space.s;
const DOT_ACTIVE_WIDTH = theme.space.l;

// Paging horizontal ScrollView of 16:9 Thumbnails with page dots. Pages are sized
// from the measured width, so it adapts to any container.
export default function PhotoCarousel({
  photos,
  fallbackIcon,
  iconColor,
  tint,
  accessibilityLabel,
  style,
}: PhotoCarouselProps) {
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const pages = photos.length > 0 ? photos : [{ id: 'fallback', url: null }];

  return (
    <View
      accessibilityLabel={
        accessibilityLabel ? `${accessibilityLabel}, photo ${page + 1} of ${pages.length}` : undefined
      }
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.wrapper, style]}
    >
      {width > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {pages.map((photo) => (
            <View key={photo.id} style={{ width }}>
              <Thumbnail
                uri={photo.url}
                fallbackIcon={fallbackIcon}
                iconColor={iconColor}
                tint={tint}
                size="banner"
              />
            </View>
          ))}
        </ScrollView>
      ) : null}
      {pages.length > 1 ? (
        <View style={styles.dots}>
          {pages.map((photo, index) => (
            <View key={photo.id} style={[styles.dot, index === page && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.space.s,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.space.xs,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.border,
  },
  dotActive: {
    width: DOT_ACTIVE_WIDTH,
    backgroundColor: theme.color.primary,
  },
});
