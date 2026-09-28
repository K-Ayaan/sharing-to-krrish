// <TabBar activeKey="home" onTabPress={(key) => setTab(key)} />
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderEvent, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import theme from '../../theme';

export type TabKey = 'home' | 'services' | 'records' | 'notices' | 'askus';

export type TabBarProps = {
  activeKey: TabKey;
  onTabPress: (key: TabKey) => void;
  /** Active-tab colour and capsule tint; defaults to the app's blue and the glass highlight. */
  accent?: { color: string; tint: string };
  style?: ViewStyle;
};

type TabDef = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'services', label: 'Services', icon: 'grid-outline', iconActive: 'grid' },
  { key: 'records', label: 'Records', icon: 'document-text-outline', iconActive: 'document-text' },
  { key: 'notices', label: 'Notices', icon: 'notifications-outline', iconActive: 'notifications' },
  { key: 'askus', label: 'Ask Us', icon: 'chatbubble-outline', iconActive: 'chatbubble' },
];

const ICON_SIZE = theme.space.l;
/** How much the capsule swells, like a lens, while a finger is on the bar. */
const LENS_SCALE = 1.22;
/** Icons under the lens are magnified, as if seen through it. */
const MAGNIFY = 1.18;
/** Fast drags stretch the capsule sideways and flatten it slightly, like a droplet in motion. */
const STRETCH_X = 0.28;
const STRETCH_Y = 0.1;
/** Drag speed (px/ms) that produces full stretch. */
const STRETCH_SPEED = 1.6;
const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };
/** Looser spring for letting go, so the glass settles with a small jelly wobble. */
const SETTLE = { damping: 11, stiffness: 190, mass: 0.8 };

const { liquid } = theme.material;
/** Width of the glass rim. */
const RIM = StyleSheet.hairlineWidth * 3;

// Real Liquid Glass (iOS 26's UIGlassEffect, via expo-glass-effect) when the OS and the build have it;
// otherwise glassmorphism drawn with expo-blur. Checked once — it can't change while the app runs.
const NATIVE_GLASS = (() => {
  try {
    return isLiquidGlassAvailable();
  } catch {
    return false;
  }
})();

// Floating Liquid Glass pill. On iOS 26 the bar is native Liquid Glass (refraction, specular edge,
// interactive response). Elsewhere it's glassmorphism: a strong background blur behind a nearly clear
// fill, a corner-lit rim (see GlassRim) and a sheen along the top edge — see-through, never a solid pill.
// The active tab sits in its own lighter pill of glass with the same corner-lit rim.
// Touching the bar swells that capsule under the finger and magnifies the icon beneath it; dragging
// slides it across the tabs, stretching with speed like a droplet, and lifting selects the tab beneath
// it, settling with a slight wobble. VoiceOver users activate each tab directly.
export default function TabBar({ activeKey, onTabPress, accent, style }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const rowRef = useRef<View>(null);
  const rowLeft = useRef(0);
  const [rowWidth, setRowWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [glassSize, setGlassSize] = useState({ width: 0, height: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);

  const activeIndex = Math.max(0, TABS.findIndex((tab) => tab.key === activeKey));
  const position = useRef(new Animated.Value(activeIndex)).current;
  const lens = useRef(new Animated.Value(0)).current;
  const stretch = useRef(new Animated.Value(0)).current;
  const lastMove = useRef<{ x: number; t: number } | null>(null);
  const relaxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabWidth = rowWidth / TABS.length;

  useEffect(
    () => () => {
      if (relaxTimer.current) clearTimeout(relaxTimer.current);
    },
    [],
  );

  useEffect(() => {
    Animated.spring(position, { toValue: activeIndex, useNativeDriver: true, ...SPRING }).start();
  }, [activeIndex, position]);

  const setHover = (index: number | null) => {
    if (hoverRef.current === index) return;
    hoverRef.current = index;
    setHoverIndex(index);
  };

  const relaxStretch = () => {
    if (relaxTimer.current) clearTimeout(relaxTimer.current);
    relaxTimer.current = null;
    Animated.spring(stretch, { toValue: 0, useNativeDriver: true, ...SETTLE }).start();
  };

  const trackSpeed = (pageX: number, timestamp: number) => {
    const previous = lastMove.current;
    lastMove.current = { x: pageX, t: timestamp };
    if (!previous || timestamp <= previous.t) return;
    const speed = Math.abs(pageX - previous.x) / (timestamp - previous.t);
    Animated.spring(stretch, {
      toValue: Math.min(1, speed / STRETCH_SPEED),
      useNativeDriver: true,
      ...SPRING,
    }).start();
    // Holding still lets the droplet round out again.
    if (relaxTimer.current) clearTimeout(relaxTimer.current);
    relaxTimer.current = setTimeout(relaxStretch, 90);
  };

  const followFinger = (event: GestureResponderEvent) => {
    if (!tabWidth) return;
    trackSpeed(event.nativeEvent.pageX, event.nativeEvent.timestamp);
    const exact = (event.nativeEvent.pageX - rowLeft.current) / tabWidth - 0.5;
    const clamped = Math.min(TABS.length - 1, Math.max(0, exact));
    position.setValue(clamped);
    setHover(Math.round(clamped));
  };

  const release = (select: boolean) => {
    const index = hoverRef.current;
    setHover(null);
    lastMove.current = null;
    relaxStretch();
    Animated.spring(lens, { toValue: 0, useNativeDriver: true, ...SETTLE }).start();
    const target = select && index !== null ? index : activeIndex;
    Animated.spring(position, { toValue: target, useNativeDriver: true, ...SETTLE }).start();
    if (select && index !== null) onTabPress(TABS[index].key);
  };

  const highlighted = hoverIndex ?? activeIndex;
  const lensScale = lens.interpolate({ inputRange: [0, 1], outputRange: [1, LENS_SCALE] });
  const capsuleScaleX = Animated.add(lensScale, Animated.multiply(stretch, STRETCH_X));
  const capsuleScaleY = Animated.subtract(lensScale, Animated.multiply(stretch, STRETCH_Y));
  const magnify = lens.interpolate({ inputRange: [0, 1], outputRange: [1, MAGNIFY] });
  const restOpacity = lens.interpolate({ inputRange: [0, 1], outputRange: [1, 0], extrapolate: 'clamp' });
  const { width: glassW, height: glassH } = glassSize;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: Math.max(insets.bottom - theme.space.m, theme.space.s) }, style]}
    >
      <View style={styles.shadow}>
        <View
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setGlassSize({ width, height });
          }}
          style={styles.glass}
        >
          {/* Only the bar's material is clipped to the pill, so the lens can swell out past its edge. */}
          <View pointerEvents="none" style={[styles.glassClip, !NATIVE_GLASS && styles.glassFallback]}>
            {NATIVE_GLASS ? (
              // "clear" is iOS 26's most see-through glass; a faint white tint keeps the labels legible.
              <GlassView
                glassEffectStyle="clear"
                tintColor={liquid.nativeTint}
                isInteractive
                colorScheme="light"
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <>
                <BlurView
                  intensity={liquid.blurIntensity}
                  tint="systemUltraThinMaterialLight"
                  style={StyleSheet.absoluteFill}
                />
                {/* Specular sheen: light catching the top of the glass. */}
                <Svg pointerEvents="none" width="100%" height="45%" style={styles.sheen}>
                  <Defs>
                    <LinearGradient id="tabSheen" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={liquid.sheenTop} />
                      <Stop offset="1" stopColor={liquid.sheenBottom} />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width="100%" height="100%" fill="url(#tabSheen)" />
                </Svg>
                <EdgeBand width={glassW} height={glassH} />
                <GlassRim id="tabRim" width={glassW} height={glassH} lit={liquid.rim} dim={liquid.rimDim} />
                {/* Inner bevel: a second, fainter rim catching light from the opposite corner. */}
                <GlassRim
                  id="tabBevel"
                  width={glassW}
                  height={glassH}
                  lit={liquid.bevel}
                  dim={liquid.sheenBottom}
                  inset={RIM * 1.5}
                  mirrored
                />
              </>
            )}
          </View>
          <View
            ref={rowRef}
            accessibilityRole="tablist"
            onLayout={(event) => {
              setRowWidth(event.nativeEvent.layout.width);
              setRowHeight(event.nativeEvent.layout.height);
              rowRef.current?.measureInWindow((x) => {
                rowLeft.current = x;
              });
            }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
            onResponderGrant={(event) => {
              Animated.spring(lens, { toValue: 1, useNativeDriver: true, ...SPRING }).start();
              followFinger(event);
            }}
            onResponderMove={followFinger}
            onResponderRelease={() => release(true)}
            onResponderTerminate={() => release(false)}
            style={styles.row}
          >
            {tabWidth > 0 ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.capsule,
                  {
                    width: tabWidth,
                    transform: [
                      { translateX: Animated.multiply(position, tabWidth) },
                      { scaleX: capsuleScaleX },
                      { scaleY: capsuleScaleY },
                    ],
                  },
                ]}
              >
                {/* Touched: the lens lifts off the bar, casting a soft shadow. */}
                <Animated.View style={[styles.lensLift, { opacity: lens }]} />

                {/* At rest: a lighter pill of glass sitting in the bar. */}
                <Animated.View style={[styles.capsuleLayer, styles.capsuleRest, { opacity: restOpacity }]}>
                  {/* A pillar's tint washes over the pill rather than filling it, so it stays glass. */}
                  {accent ? (
                    <View style={[StyleSheet.absoluteFill, styles.capsuleTint, { backgroundColor: accent.tint }]} />
                  ) : null}
                  {/* Faint sheen on the pill itself, so it reads as its own piece of glass. */}
                  <Svg width="100%" height="55%">
                    <Defs>
                      <LinearGradient id="capsuleSheen" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={liquid.capsuleSheen} />
                        <Stop offset="1" stopColor={liquid.sheenBottom} />
                      </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#capsuleSheen)" />
                  </Svg>
                  <GlassRim
                    id="capsuleRim"
                    width={tabWidth}
                    height={rowHeight}
                    lit={liquid.capsuleRim}
                    dim={liquid.capsuleRimDim}
                  />
                </Animated.View>

                {/* Touched: a clear droplet of glass — bright rim, a specular spot where light enters,
                    a caustic glint where it leaves, and a shaded lower edge that gives it thickness. */}
                <Animated.View style={[styles.capsuleLayer, { opacity: lens }]}>
                  <LensHighlights width={tabWidth} height={rowHeight} />
                </Animated.View>
              </Animated.View>
            ) : null}

            {TABS.map((tab, index) => {
              const active = index === activeIndex;
              const tone =
                index === highlighted ? (accent?.color ?? theme.color.primary) : theme.color.textPrimary;

              return (
                <View
                  key={tab.key}
                  accessible
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={tab.label}
                  onAccessibilityTap={() => onTabPress(tab.key)}
                  style={styles.tab}
                >
                  <Animated.View
                    style={[styles.tabContent, index === highlighted && { transform: [{ scale: magnify }] }]}
                  >
                    <Ionicons name={active ? tab.iconActive : tab.icon} size={ICON_SIZE} color={tone} />
                    <Text numberOfLines={1} style={[styles.label, active && styles.labelActive, { color: tone }]}>
                      {tab.label}
                    </Text>
                  </Animated.View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

type GlassRimProps = {
  id: string;
  width: number;
  height: number;
  lit: string;
  dim: string;
  /** Distance in from the pill's outer edge. */
  inset?: number;
  /** Light from the top-right instead of the top-left (an inner bevel catches the opposite corner). */
  mirrored?: boolean;
};

// A pill's glass edge lit from one corner: bright at the top-left and bottom-right, where light enters
// and leaves the glass, and nearly gone along the sides between them.
function GlassRim({ id, width, height, lit, dim, inset = 0, mirrored = false }: GlassRimProps) {
  const edge = inset + RIM / 2;
  if (width <= edge * 2 || height <= edge * 2) return null;
  return (
    <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={id} x1={mirrored ? '1' : '0'} y1="0" x2={mirrored ? '0' : '1'} y2="1">
          <Stop offset="0" stopColor={lit} />
          <Stop offset="0.3" stopColor={dim} />
          <Stop offset="0.7" stopColor={dim} />
          <Stop offset="1" stopColor={lit} />
        </LinearGradient>
      </Defs>
      <Rect
        x={edge}
        y={edge}
        width={width - edge * 2}
        height={height - edge * 2}
        rx={(height - edge * 2) / 2}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={RIM}
      />
    </Svg>
  );
}

// The thickness of the glass: a soft band just inside the edge, brighter at the top and bottom where
// the curved edge bends the most light, and clear through the middle of the pill.
function EdgeBand({ width, height }: { width: number; height: number }) {
  const band = liquid.edgeBandWidth;
  if (width <= band * 2 || height <= band * 2) return null;
  return (
    <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="tabEdgeBand" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={liquid.edgeBand} />
          <Stop offset="0.5" stopColor={liquid.sheenBottom} />
          <Stop offset="1" stopColor={liquid.edgeBand} />
        </LinearGradient>
      </Defs>
      <Rect
        x={band / 2}
        y={band / 2}
        width={width - band}
        height={height - band}
        rx={(height - band) / 2}
        fill="none"
        stroke="url(#tabEdgeBand)"
        strokeWidth={band}
      />
    </Svg>
  );
}

// The touched lens's light: a full bright rim, a specular spot at the top-left where light enters, a
// softer caustic glint at the bottom-right where it leaves, and a shaded inner lower edge.
function LensHighlights({ width, height }: { width: number; height: number }) {
  if (width <= 0 || height <= 0) return null;
  return (
    <>
      <Svg pointerEvents="none" width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="lensSpecular" cx="0.3" cy="0.18" rx="0.4" ry="0.45">
            <Stop offset="0" stopColor={liquid.lensSpecular} />
            <Stop offset="1" stopColor={liquid.sheenBottom} />
          </RadialGradient>
          <RadialGradient id="lensCaustic" cx="0.72" cy="0.92" rx="0.35" ry="0.3">
            <Stop offset="0" stopColor={liquid.lensCaustic} />
            <Stop offset="1" stopColor={liquid.sheenBottom} />
          </RadialGradient>
          <LinearGradient id="lensShade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.55" stopColor={liquid.lensShade} stopOpacity={0} />
            <Stop offset="1" stopColor={liquid.lensShade} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#lensSpecular)" />
        <Rect x="0" y="0" width={width} height={height} fill="url(#lensCaustic)" />
        <Rect
          x={RIM * 1.5}
          y={RIM * 1.5}
          width={width - RIM * 3}
          height={height - RIM * 3}
          rx={(height - RIM * 3) / 2}
          fill="none"
          stroke="url(#lensShade)"
          strokeWidth={RIM * 2}
        />
      </Svg>
      <GlassRim id="lensRim" width={width} height={height} lit={liquid.lensRim} dim={liquid.lensRimDim} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: theme.space.m,
  },
  shadow: {
    borderRadius: theme.radius.pill,
    shadowColor: liquid.shadowColor,
    shadowOpacity: liquid.shadowOpacity,
    shadowRadius: liquid.shadowRadius,
    shadowOffset: { width: 0, height: liquid.shadowOffsetY },
  },
  glass: {
    borderRadius: theme.radius.pill,
    padding: theme.space.xs,
  },
  glassClip: {
    ...StyleSheet.absoluteFill,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  glassFallback: {
    // A thin dark outline keeps the edge legible over white content; the bright rim is drawn inside it.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: liquid.edge,
    backgroundColor: liquid.fill,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  row: {
    flexDirection: 'row',
  },
  capsule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  capsuleLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  capsuleRest: {
    backgroundColor: liquid.capsuleFill,
  },
  lensLift: {
    ...StyleSheet.absoluteFill,
    borderRadius: theme.radius.pill,
    backgroundColor: liquid.lensFill,
    shadowColor: liquid.shadowColor,
    shadowOpacity: liquid.lensShadowOpacity,
    shadowRadius: liquid.lensShadowRadius,
    shadowOffset: { width: 0, height: liquid.lensShadowOffsetY },
  },
  capsuleTint: {
    opacity: liquid.capsuleTintOpacity,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.space.s,
  },
  tabContent: {
    alignItems: 'center',
    gap: theme.space.xs / 2,
  },
  label: {
    ...theme.type.caption,
    fontSize: theme.type.caption.fontSize - 2,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});
