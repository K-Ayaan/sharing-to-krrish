// <BottomSheet visible={open} onClose={() => setOpen(false)}><ProduceDetail /></BottomSheet>
// <BottomSheet visible={open} title="Select species" onClose={cancel} onDone={apply}>…</BottomSheet>
// <BottomSheet visible={open} title="Why do we need this?" showClose onClose={close}>…</BottomSheet>
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';
import { isPillarAppearance, useAppearance } from './Appearance';
import Button from './Button';
import IconButton from './IconButton';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Adds a × (calls onClose) on the left and a "Done" action on the right of a centred title. */
  onDone?: () => void;
  doneLabel?: string;
  /** Adds a × (calls onClose) to the right of a left-aligned title. Ignored when onDone is set. */
  showClose?: boolean;
  /** Called once the sheet has finished sliding in — e.g. to focus a field only then. */
  onOpened?: () => void;
  children: ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BACKDROP_OPEN_MS = 280;
const CLOSE_MS = 240;
// A soft spring that settles without a visible bounce.
const OPEN_SPRING = { damping: 26, stiffness: 260, mass: 1, overshootClamping: true } as const;
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);
const EASE_IN = Easing.bezier(0.55, 0, 0.75, 0.2);
const DISMISS_DISTANCE = theme.space.xl * 2;
const HANDLE_WIDTH = theme.space.xl;

export default function BottomSheet({
  visible,
  onClose,
  title,
  onDone,
  doneLabel = 'Done',
  showClose = false,
  onOpened,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { appearance, color } = useAppearance();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  // The Modal stays mounted until the slide-down finishes, so closing animates instead of vanishing.
  const [mounted, setMounted] = useState(visible);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onOpenedRef = useRef(onOpened);
  onOpenedRef.current = onOpened;
  /** True while the Modal is presented (from onShow until the close animation unmounts it). */
  const shown = useRef(false);

  // Opening starts from the Modal's onShow, once it's actually on screen — starting earlier drops
  // the first frames and the sheet appears to jump in.
  const animateOpen = () => {
    shown.current = true;
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, ...OPEN_SPRING }),
      Animated.timing(backdrop, {
        toValue: 1,
        duration: BACKDROP_OPEN_MS,
        easing: EASE_OUT,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onOpenedRef.current?.();
    });
  };

  useEffect(() => {
    if (visible) {
      // Reopened mid-close: the Modal is still up (no new onShow), so slide straight back in from
      // wherever the sheet is.
      if (shown.current) animateOpen();
      else {
        translateY.setValue(SCREEN_HEIGHT);
        backdrop.setValue(0);
        setMounted(true);
      }
      return;
    }
    if (!mounted) return;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: CLOSE_MS,
        easing: EASE_IN,
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, { toValue: 0, duration: CLOSE_MS, easing: EASE_IN, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished) return;
      shown.current = false;
      setMounted(false);
    });
    // `mounted` is deliberately not a dependency: only a change in `visible` starts an animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, translateY, backdrop]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > theme.space.s,
      onPanResponderMove: (_e, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy > DISMISS_DISTANCE) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, ...OPEN_SPRING }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onShow={animateOpen}
      onRequestClose={onClose}
    >
      {/* Lifts the sheet above the keyboard when it holds a text field (e.g. Settings' editors). */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <Animated.View style={[styles.backdropFill, { opacity: backdrop }]}>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            // Pillar sheets sit on the pillar's warm cream page colour (Van Dhan kendra, Livestock filters).
            isPillarAppearance(appearance) && { backgroundColor: color.background },
            { paddingBottom: insets.bottom + theme.space.m, transform: [{ translateY }] },
          ]}
        >
          <View {...pan.panHandlers} style={styles.grabArea}>
            <View style={styles.handle} />
            {onDone ? (
              <View style={styles.actionHeader}>
                <IconButton
                  icon="close"
                  color={theme.color.textPrimary}
                  accessibilityLabel="Cancel"
                  onPress={onClose}
                />
                <Text accessibilityRole="header" numberOfLines={1} style={styles.centeredTitle}>
                  {title}
                </Text>
                <Button label={doneLabel} variant="text" onPress={onDone} />
              </View>
            ) : title || showClose ? (
              <View style={styles.titleRow}>
                <Text accessibilityRole="header" style={styles.title}>
                  {title}
                </Text>
                {showClose ? (
                  <IconButton
                    icon="close"
                    color={theme.color.textPrimary}
                    accessibilityLabel="Close"
                    onPress={onClose}
                  />
                ) : null}
              </View>
            ) : null}
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.color.scrim,
  },
  sheet: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    maxHeight: '90%',
  },
  grabArea: {
    alignItems: 'center',
    paddingTop: theme.space.s + theme.space.xs,
    paddingHorizontal: theme.space.m,
  },
  handle: {
    width: HANDLE_WIDTH,
    height: theme.space.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: theme.space.s,
    marginTop: theme.space.m,
  },
  title: {
    ...theme.type.title,
    color: theme.color.textPrimary,
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: theme.space.s,
    marginTop: theme.space.s,
  },
  centeredTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.m,
  },
});
