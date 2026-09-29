// <Screen header={<ScreenHeader … />} footer={<Button … />} onRefresh={refresh} refreshing={refreshing}>…</Screen>
// Page shell: canvas colour, keyboard handling, optional pull-to-refresh, and a footer pinned above
// the safe area (the full-width CTA at the bottom of most mockups).
import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';
import ScreenHeader, { type ScreenHeaderProps } from './ScreenHeader';
import { ScrollIntoViewContext, type ScrollIntoView } from './scrollIntoView';

// Breathing room left between the field being typed into and the top of the keyboard.
const KEYBOARD_GAP = 24;

export type ScreenProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  // false when the body is its own list (FlatList/SectionList) — never nest lists in a ScrollView.
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  background?: string;
  // Content that sits behind everything (decorative leaves/waves on registration screens).
  backdrop?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  // Tab-root screens sit above the tab bar, so they don't pad for the bottom inset.
  inTabs?: boolean;
  // Lets an illustration show through behind the pinned button (aadhaar login.png).
  footerTransparent?: boolean;
};

export default function Screen({
  children,
  header,
  footer,
  scroll = true,
  refreshing = false,
  onRefresh,
  background = theme.color.background,
  backdrop,
  contentStyle,
  inTabs = false,
  footerTransparent = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = footer || inTabs ? theme.space.xl : Math.max(insets.bottom, theme.space.l) + theme.space.l;
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  // Where the scrolling area sits on screen, so we can tell what's below the fold.
  const viewportRef = useRef<{ y: number; height: number } | null>(null);
  // How much room the keyboard is taking. The page grows by that much while it's open, so even a
  // short screen has somewhere to scroll to and the field being typed into can come into view.
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      const input = TextInput.State.currentlyFocusedInput();
      const scroll = scrollRef.current;
      if (!input || !scroll) return;
      // Let the taller content take effect before scrolling into it.
      requestAnimationFrame(() => {
        input.measureInWindow((_x, y, _width, height) => {
          const keyboardTop = Dimensions.get('window').height - event.endCoordinates.height;
          const overlap = y + height + KEYBOARD_GAP - keyboardTop;
          if (overlap > 0) scroll.scrollTo({ y: offset.current + overlap, animated: true });
        });
      });
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Something inside the page grew (an accordion answer) and wants to be seen in full. Measured
  // twice: once on the next frame so the page starts moving with the expansion rather than after
  // it, and again once the layout animation has settled, in case the first pass fell short.
  const scrollIntoView = useCallback<ScrollIntoView>((target) => {
    const pass = () => {
      const node = target.current;
      const scroll = scrollRef.current;
      const viewport = viewportRef.current;
      if (!node || !scroll || !viewport) return;
      node.measureInWindow((_x, y, _width, height) => {
        const overlap = y + height + KEYBOARD_GAP - (viewport.y + viewport.height);
        if (overlap > 0) scroll.scrollTo({ y: offset.current + overlap, animated: true });
      });
    };
    requestAnimationFrame(pass);
    const id = setTimeout(pass, theme.motion.base + 40);
    return () => clearTimeout(id);
  }, []);

  // A ScreenHeader is split in two: the title row and back button are pinned, while the scenery
  // is drawn at the top of the page body so it scrolls away like any other content.
  const headerElement = header as ReactElement<ScreenHeaderProps>;
  const isSplittable =
    scroll &&
    isValidElement(header) &&
    header.type === ScreenHeader &&
    Boolean(headerElement.props.landscape || headerElement.props.scene);
  const headerBar = isSplittable ? cloneElement(headerElement, { part: 'bar' }) : header;
  const headerArt = isSplittable ? cloneElement(headerElement, { part: 'art' }) : null;

  return (
    <ScrollIntoViewContext.Provider value={scrollIntoView}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { backgroundColor: background }]}
    >
      {backdrop ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {backdrop}
        </View>
      ) : null}
      {/* The title row stays put: the screen title and back button never scroll away. */}
      {headerBar}
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          onLayout={(event) =>
            event.target.measureInWindow((_x: number, y: number, _width: number, height: number) => {
              viewportRef.current = { y, height };
            })
          }
          onScroll={(e) => {
            offset.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[{ paddingBottom: bottomPad + keyboardHeight }, styles.grow]}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.color.primary]}
                progressBackgroundColor={theme.color.surface}
              />
            ) : undefined
          }
        >
          {headerArt}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.root, styles.content, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: footerTransparent ? 'transparent' : background,
              paddingBottom: Math.max(insets.bottom, theme.space.l) + theme.space.xs,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
    </ScrollIntoViewContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: theme.size.screenPadding,
    gap: theme.space.l,
  },
  footer: {
    paddingHorizontal: theme.size.screenPadding,
    paddingTop: theme.space.m,
    gap: theme.space.s,
  },
});
