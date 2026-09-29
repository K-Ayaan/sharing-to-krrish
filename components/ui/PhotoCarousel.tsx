// <PhotoCarousel photos={listing.photos} fallbackIcon={CowIcon} tint={tint} height={300} />
// Full-bleed paged photos with dots and an "n / total" counter (livestock-enquiry.png). With no
// photos yet it shows a single tinted placeholder slide.
import { useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type PhotoCarouselProps = {
  photos: string[];
  fallbackIcon: IconComponent;
  tint: { bg: string; fg: string };
  height?: number;
  accessibilityLabel: string;
};

export default function PhotoCarousel({
  photos,
  fallbackIcon: FallbackIcon,
  tint,
  height = 300,
  accessibilityLabel,
}: PhotoCarouselProps) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const slides = photos.length > 0 ? photos : [null];

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={{ height }} accessibilityLabel={accessibilityLabel} accessibilityRole="image">
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScrollEnd}>
        {slides.map((uri, slide) =>
          uri ? (
            <Image key={uri} source={{ uri }} style={{ width, height }} resizeMode="cover" />
          ) : (
            <View key={`placeholder-${slide}`} style={[styles.placeholder, { width, height, backgroundColor: tint.bg }]}>
              <FallbackIcon size={height * 0.42} color={tint.fg} />
            </View>
          )
        )}
      </ScrollView>
      {slides.length > 1 ? (
        <>
          <View style={styles.dots}>
            {slides.map((_, dot) => (
              <View key={dot} style={[styles.dot, dot === index && styles.dotActive]} />
            ))}
          </View>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {index + 1} / {slides.length}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: theme.space.xl,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.space.s,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    backgroundColor: theme.color.surface,
  },
  counter: {
    position: 'absolute',
    right: theme.space.l,
    bottom: theme.space.l,
    paddingHorizontal: theme.space.m,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(22,36,27,0.72)',
  },
  counterText: {
    ...theme.type.captionStrong,
    color: theme.color.textOnDark,
  },
});
