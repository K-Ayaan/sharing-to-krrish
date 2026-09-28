// <LoaderScreen />  or  <LoaderScreen wordmark="MARCOFED" caption="People • Produce • Prosper" />
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../theme';

export type LoaderScreenProps = {
  wordmark?: string;
  caption?: string;
};

// Launch-screen spec values (not part of the in-app spacing/type scale).
const WORDMARK_SIZE = 34;
const WORDMARK_TRACKING = -0.5;
const CAPTION_SIZE = 13;
const CAPTION_TRACKING = 0.8;
const WORDMARK_TO_BAR = 28;
const BAR_TO_CAPTION = 18;
const BAR_WIDTH = 160;
const BAR_HEIGHT = 3;
const GLOW_RADIUS = 4;
const GLOW_OPACITY = 0.25;

const FILL_MS = 1800;
const FADE_MS = 400;
const EASE = Easing.inOut(Easing.ease);

const { launch } = theme;

// Non-interactive loading view: wordmark, a thin capsule bar that fills left to right and fades back
// to empty on a loop, and the caption. System font only (SF Pro Display/Text are picked by size).
export default function LoaderScreen({
  wordmark = 'MARCOFED',
  caption = 'People • Produce • Prosper',
}: LoaderScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Native driver: the JS thread is busy while the app starts, and a JS-driven bar would sit frozen.
    // The fill is a full-width capsule sliding in from the left inside a clipped track, so it can use
    // transforms (native) and still keep round ends.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, { toValue: 1, duration: FILL_MS, easing: EASE, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: FADE_MS, easing: EASE, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress, opacity]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-BAR_WIDTH, 0] });

  return (
    <SafeAreaView
      accessible
      accessibilityLabel={`Loading ${wordmark}`}
      accessibilityRole="progressbar"
      pointerEvents="none"
      style={styles.screen}
    >
      <View style={styles.content}>
        <Text style={styles.wordmark}>{wordmark}</Text>
        <View style={styles.glow}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { opacity, transform: [{ translateX }] }]} />
          </View>
        </View>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: launch.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: WORDMARK_SIZE,
    fontWeight: '700',
    letterSpacing: WORDMARK_TRACKING,
    color: launch.text,
  },
  // Subtle glow around the bar; kept outside the clipping track so it isn't cut off.
  glow: {
    marginTop: WORDMARK_TO_BAR,
    borderRadius: BAR_HEIGHT / 2,
    shadowColor: launch.fill,
    shadowOpacity: GLOW_OPACITY,
    shadowRadius: GLOW_RADIUS,
    shadowOffset: { width: 0, height: 0 },
  },
  track: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: launch.track,
    overflow: 'hidden',
  },
  fill: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: launch.fill,
  },
  caption: {
    marginTop: BAR_TO_CAPTION,
    fontSize: CAPTION_SIZE,
    fontWeight: '400',
    letterSpacing: CAPTION_TRACKING,
    color: launch.textSecondary,
  },
});
