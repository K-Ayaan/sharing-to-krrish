// <BottomSheet visible={open} onClose={() => setOpen(false)}><ProduceDetail /></BottomSheet>
// <BottomSheet visible={open} title="Select species" onClose={cancel} onDone={apply}>…</BottomSheet>
import { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';
import Button from './Button';
import IconButton from './IconButton';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Adds a × (calls onClose) on the left and a "Done" action on the right of a centred title. */
  onDone?: () => void;
  doneLabel?: string;
  children: ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const OPEN_MS = 240;
const CLOSE_MS = 180;
const DISMISS_DISTANCE = theme.space.xl * 2;
const HANDLE_WIDTH = theme.space.xl;

export default function BottomSheet({
  visible,
  onClose,
  title,
  onDone,
  doneLabel = 'Done',
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : SCREEN_HEIGHT,
        duration: visible ? OPEN_MS : CLOSE_MS,
        easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: visible ? 1 : 0,
        duration: visible ? OPEN_MS : CLOSE_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateY, backdrop]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > theme.space.s,
      onPanResponderMove: (_e, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy > DISMISS_DISTANCE) {
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: CLOSE_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
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
            ) : title ? (
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
            ) : null}
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
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
  title: {
    ...theme.type.title,
    color: theme.color.textPrimary,
    alignSelf: 'flex-start',
    marginTop: theme.space.m,
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
