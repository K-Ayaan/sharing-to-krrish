// <Toast visible={!!message} message={message ?? ''} onHide={() => setMessage(null)} />
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

export type ToastProps = {
  visible: boolean;
  message: string;
  onHide: () => void;
  /** Extra lift above the safe area, e.g. the tab bar height. */
  bottomOffset?: number;
};

const VISIBLE_MS = 2000;
const FADE_MS = 180;
const SLIDE_DISTANCE = theme.space.m;

export default function Toast({ visible, message, onHide, bottomOffset = 0 }: ToastProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  // Held in a ref so a parent re-render (e.g. a ticking countdown) doesn't restart the timer.
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  useEffect(() => {
    if (!visible) return;

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => finished && onHideRef.current());
    }, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [visible, message, progress]);

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: insets.bottom + bottomOffset + theme.space.m,
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [SLIDE_DISTANCE, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text numberOfLines={2} style={styles.message}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: theme.space.m,
    right: theme.space.m,
    alignItems: 'center',
  },
  message: {
    ...theme.type.body,
    color: theme.color.background,
    backgroundColor: theme.color.textPrimary,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
    textAlign: 'center',
  },
});
