// <ScenicBackdrop />  — first child of a full-screen container
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import Leaf from './art/Leaf';

// Livestock recolours the scene in soft pinks; everywhere else it uses the green illustration fills.
const ROSE_ART = { ...theme.onboarding.art, ...theme.livestock.art };
const BLUE_ART = { ...theme.onboarding.art, ...theme.lpg.art };

const HILLS_W = 390;
const HILLS_H = 420;
const CORNER_W = 150;
const CORNER_H = 220;

// Faint rolling hills along the bottom of the screen and leaves at the corners, under a warm cream
// background (Services, Van Dhan; in pinks for Livestock). A quieter cousin of onboarding's Landscape: no sun or houses, low
// opacity so cards read clearly on top. SVG approximation of the reference art; decorative only.
export type ScenicBackdropProps = {
  /** Overrides the colours the appearance would pick (e.g. the blue list page in My Records). */
  tone?: 'green' | 'rose' | 'blue';
};

const ART_BY_TONE = { green: theme.onboarding.art, rose: ROSE_ART, blue: BLUE_ART };

export default function ScenicBackdrop({ tone }: ScenicBackdropProps) {
  const { appearance } = useAppearance();
  const art = tone
    ? ART_BY_TONE[tone]
    : appearance === 'livestock'
      ? ROSE_ART
      : appearance === 'lpg'
        ? BLUE_ART
        : theme.onboarding.art;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Svg
        width="100%"
        height={HILLS_H}
        viewBox={`0 0 ${HILLS_W} ${HILLS_H}`}
        preserveAspectRatio="none"
        style={styles.hills}
      >
        <Defs>
          <LinearGradient id="warmGlow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0.4" stopColor={art.sunGlow} stopOpacity="0" />
            <Stop offset="1" stopColor={art.sunGlow} stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={60} width={HILLS_W} height={200} fill="url(#warmGlow)" />
        <Path
          d="M0 170 C 80 120, 170 130, 250 170 S 360 150, 390 120 V420 H0 Z"
          fill={art.hillFar}
          opacity={0.45}
        />
        <Path
          d="M0 230 C 90 190, 200 210, 280 240 S 370 230, 390 220 V420 H0 Z"
          fill={art.hillMid}
          opacity={0.4}
        />
        <Path
          d="M0 300 C 110 270, 220 290, 300 310 S 380 300, 390 296 V420 H0 Z"
          fill={art.hillNear}
          opacity={0.35}
        />
      </Svg>

      <Svg width={CORNER_W} height={CORNER_H} viewBox={`0 0 ${CORNER_W} ${CORNER_H}`} style={styles.topRight}>
        <Leaf x={CORNER_W} y={40} length={80} angle={-60} fill={art.leafLight} opacity={0.6} />
        <Leaf x={CORNER_W - 10} y={90} length={70} angle={-100} fill={art.leafLight} opacity={0.5} />
        <Leaf x={CORNER_W} y={160} length={90} angle={-20} fill={art.leafLight} opacity={0.45} />
      </Svg>

      <Svg
        width={CORNER_W}
        height={CORNER_H}
        viewBox={`0 0 ${CORNER_W} ${CORNER_H}`}
        style={styles.leftSprig}
      >
        <Path
          d="M4 220 C 20 170, 30 110, 36 20"
          stroke={art.leaf}
          strokeWidth={1.5}
          fill="none"
          opacity={0.5}
        />
        <Leaf x={36} y={30} length={46} angle={30} fill={art.leafLight} opacity={0.65} />
        <Leaf x={32} y={70} length={48} angle={-50} fill={art.leafLight} opacity={0.6} />
        <Leaf x={28} y={110} length={50} angle={55} fill={art.leafLight} opacity={0.6} />
        <Leaf x={20} y={160} length={52} angle={-45} fill={art.leafLight} opacity={0.55} />
      </Svg>

      <Svg
        width={CORNER_W}
        height={CORNER_H}
        viewBox={`0 0 ${CORNER_W} ${CORNER_H}`}
        style={styles.rightSprig}
      >
        <Path
          d="M150 220 C 130 180, 110 140, 96 80"
          stroke={art.leaf}
          strokeWidth={1.5}
          fill="none"
          opacity={0.5}
        />
        <Leaf x={100} y={100} length={60} angle={-25} fill={art.leaf} opacity={0.45} />
        <Leaf x={116} y={150} length={64} angle={-70} fill={art.leafLight} opacity={0.6} />
        <Leaf x={130} y={190} length={56} angle={20} fill={art.leaf} opacity={0.4} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hills: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRight: {
    position: 'absolute',
    top: theme.space.xl,
    right: 0,
  },
  leftSprig: {
    position: 'absolute',
    left: 0,
    bottom: theme.space.xl * 5,
  },
  rightSprig: {
    position: 'absolute',
    right: 0,
    bottom: theme.space.xl * 2,
  },
});
