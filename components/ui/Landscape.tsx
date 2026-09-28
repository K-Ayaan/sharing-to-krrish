// <Landscape />
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import Leaf from './art/Leaf';

export type LandscapeProps = {
  style?: ViewStyle;
};

const VIEW_W = 390;
const VIEW_H = 230;
export const LANDSCAPE_ASPECT_RATIO = VIEW_W / VIEW_H;

const art = theme.onboarding.art;

// Onboarding's rolling-hills scene: sun, layered hills, two houses, trees and a leafy branch in the
// foreground, fading into the screen background at the bottom so a footer button can sit over it.
// Drawn in SVG as an approximation of the raster artwork in design/screens/onboarding — the
// watercolour texture and soft blurs of the reference can't be reproduced exactly. Decorative only.
export default function Landscape({ style }: LandscapeProps) {
  const { color } = useAppearance();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.frame, style]}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMax slice">
        <Defs>
          <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0.55" stopColor={art.sunGlow} stopOpacity="0.9" />
            <Stop offset="1" stopColor={art.sunGlow} stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={art.sun} />
            <Stop offset="1" stopColor={art.sunGlow} />
          </LinearGradient>
          <LinearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.background} stopOpacity="0" />
            <Stop offset="1" stopColor={color.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Sun */}
        <Circle cx={292} cy={78} r={70} fill="url(#sunGlow)" />
        <Circle cx={292} cy={80} r={44} fill="url(#sun)" />

        {/* Far hills */}
        <Path d="M0 70 C 50 40, 110 38, 170 66 S 260 70, 300 72 S 360 56, 390 50 V230 H0 Z" fill={art.hillFar} />
        <Path d="M120 92 C 170 70, 215 72, 255 90 S 330 96, 390 80 V230 H120 Z" fill={art.hillFar} opacity={0.8} />

        {/* Middle hills */}
        <Path d="M0 108 C 60 82, 140 86, 210 118 S 300 140, 330 150 V230 H0 Z" fill={art.hillMid} />
        <Path d="M200 170 C 260 128, 330 88, 390 70 V230 H200 Z" fill={art.hillMid} />

        {/* Tall tree, far right */}
        <Path d="M368 150 V 108" stroke={art.treeDark} strokeWidth={2.5} />
        <Ellipse cx={368} cy={98} rx={15} ry={32} fill={art.tree} />
        <Ellipse cx={386} cy={116} rx={10} ry={22} fill={art.treeDark} opacity={0.8} />

        {/* Bushes on the left */}
        <G fill={art.treeDark} opacity={0.75}>
          <Circle cx={55} cy={128} r={18} />
          <Circle cx={80} cy={124} r={22} />
          <Circle cx={112} cy={132} r={16} />
          <Circle cx={140} cy={136} r={20} />
        </G>

        {/* Houses */}
        <G>
          {/* Big house */}
          <Rect x={262} y={128} width={62} height={40} fill={art.wall} />
          <Rect x={262} y={128} width={16} height={40} fill={art.wallShade} />
          <Path d="M252 130 L 280 106 L 332 106 L 342 130 Z" fill={art.roof} />
          <Rect x={318} y={96} width={7} height={14} fill={art.roof} />
          <Rect x={288} y={140} width={7} height={8} fill={art.window} />
          <Rect x={305} y={140} width={7} height={8} fill={art.window} />
          {/* Small house */}
          <Rect x={222} y={146} width={40} height={26} fill={art.wall} />
          <Path d="M216 148 L 236 132 L 262 132 L 268 148 Z" fill={art.roof} />
          <Rect x={230} y={154} width={6} height={7} fill={art.window} />
          <Rect x={246} y={154} width={6} height={7} fill={art.window} />
        </G>

        {/* Bushes around the houses */}
        <G fill={art.tree}>
          <Circle cx={210} cy={170} r={11} />
          <Circle cx={250} cy={176} r={10} />
          <Circle cx={272} cy={170} r={12} />
          <Circle cx={336} cy={168} r={10} />
        </G>

        {/* Near meadow */}
        <Path d="M0 160 C 70 140, 150 150, 220 172 S 330 176, 390 158 V230 H0 Z" fill={art.hillNear} />
        <Path d="M0 186 C 90 170, 190 176, 260 190 S 360 192, 390 186 V230 H0 Z" fill={art.meadow} />

        {/* Foreground branch */}
        <Path d="M6 230 C 22 190, 40 150, 72 104" stroke={art.leafDark} strokeWidth={2} fill="none" />
        <Path d="M24 196 C 30 170, 34 150, 30 130" stroke={art.leafDark} strokeWidth={1.5} fill="none" />
        <Leaf x={70} y={108} length={62} angle={40} fill={art.leafDark} vein={art.leafLight} />
        <Leaf x={52} y={140} length={56} angle={62} fill={art.leaf} vein={art.leafLight} />
        <Leaf x={40} y={160} length={54} angle={-38} fill={art.leafDark} vein={art.leafLight} />
        <Leaf x={30} y={132} length={50} angle={-12} fill={art.leaf} vein={art.leafLight} />
        <Leaf x={20} y={196} length={48} angle={-58} fill={art.leaf} vein={art.leafLight} opacity={0.9} />
        <Leaf x={34} y={186} length={52} angle={70} fill={art.leafDark} vein={art.leafLight} />

        {/* Fade into the page */}
        <Rect x={0} y={170} width={VIEW_W} height={60} fill="url(#groundFade)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: LANDSCAPE_ASPECT_RATIO,
  },
});
