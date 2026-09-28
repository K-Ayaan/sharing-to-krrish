// <OnboardingBackdrop />  — first child of a full-screen container
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import theme from '../../theme';
import Leaf from './art/Leaf';

const art = theme.onboarding.art;

const CORNER_W = 130;
const CORNER_H = 180;
const WAVE_W = 390;
const WAVE_H = 420;

// Decorative layer behind every onboarding step: leaves hanging from the top-left corner, soft pale
// waves drifting across the sage background, and a leaf tip in the bottom-left corner. SVG
// approximation of the reference artwork. Non-interactive and hidden from VoiceOver.
export default function OnboardingBackdrop() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Svg
        width="100%"
        height={WAVE_H}
        viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
        preserveAspectRatio="none"
        style={styles.waves}
      >
        <Path d="M170 120 C 260 60, 340 90, 390 70 V 260 C 330 250, 260 280, 190 250 C 150 230, 140 150, 170 120 Z" fill={art.wave} opacity={0.6} />
        <Path d="M0 300 C 90 260, 200 330, 300 300 S 390 280, 390 280 V 420 H 0 Z" fill={art.wave} opacity={0.5} />
      </Svg>

      <Svg width={CORNER_W} height={CORNER_H} viewBox={`0 0 ${CORNER_W} ${CORNER_H}`} style={styles.topLeft}>
        <Path d="M-4 20 C 20 30, 40 40, 64 30" stroke={art.leaf} strokeWidth={1.5} fill="none" opacity={0.7} />
        <Leaf x={-6} y={24} length={70} angle={62} fill={art.leafLight} opacity={0.85} />
        <Leaf x={10} y={34} length={80} angle={118} fill={art.leaf} vein={art.leafLight} opacity={0.75} />
        <Leaf x={-4} y={110} length={78} angle={58} fill={art.leaf} vein={art.leafLight} opacity={0.7} />
        <Leaf x={-8} y={160} length={64} angle={72} fill={art.leafLight} opacity={0.8} />
      </Svg>

      <Svg width={CORNER_W} height={CORNER_H / 2} viewBox={`0 0 ${CORNER_W} ${CORNER_H / 2}`} style={styles.bottomLeft}>
        <Leaf x={-10} y={70} length={120} angle={78} width={0.3} fill={art.leafLight} opacity={0.7} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  waves: {
    position: 'absolute',
    top: theme.space.xl * 5,
    left: 0,
    right: 0,
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
