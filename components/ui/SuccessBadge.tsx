// <SuccessBadge />
import { View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop } from 'react-native-svg';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import Leaf from './art/Leaf';

export type SuccessBadgeProps = {
  /** `primary` draws the rings in the palette's primary tint (LPG) instead of the success tint. */
  tone?: 'success' | 'primary';
  style?: ViewStyle;
};

const art = theme.onboarding.art;
const WIDTH = 220;
const HEIGHT = 190;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

// Confetti dashes around the badge: [x1, y1, x2, y2, gold?]
const CONFETTI: [number, number, number, number, boolean][] = [
  [48, 16, 54, 26, false],
  [146, 12, 140, 22, true],
  [26, 56, 36, 62, true],
  [18, 106, 26, 106, false],
  [186, 128, 194, 132, false],
  [148, 176, 140, 168, true],
  [60, 182, 70, 176, true],
];

// The "done" illustration on RegistrationComplete: a large tick in two soft green rings, with leaves
// and confetti around it. SVG approximation of the reference artwork. Decorative only.
export default function SuccessBadge({ tone = 'success', style }: SuccessBadgeProps) {
  const { color } = useAppearance();
  const primaryTone = tone === 'primary';
  const ring = primaryTone ? color.primaryTint : color.successTint;
  // The primary tone (LPG) swaps the green leaves and gold confetti for the page's blues.
  const leaf = primaryTone ? theme.lpg.art.leaf : art.leaf;
  const vein = primaryTone ? theme.lpg.art.leafLight : art.leafLight;
  const accent = primaryTone ? theme.lpg.art.leaf : art.confettiGold;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={style}
    >
      <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Defs>
          <RadialGradient id="outerRing" cx="50%" cy="50%" r="50%">
            <Stop offset="0.7" stopColor={ring} />
            <Stop offset="1" stopColor={ring} stopOpacity="0.6" />
          </RadialGradient>
        </Defs>

        {/* Leaves behind the rings */}
        <Leaf x={150} y={70} length={44} angle={30} fill={leaf} vein={vein} />
        <Leaf x={158} y={98} length={42} angle={70} fill={leaf} vein={vein} />
        <Path d="M74 150 C 66 156, 56 160, 44 164" stroke={accent} strokeWidth={3} strokeLinecap="round" fill="none" />
        <Leaf x={78} y={146} length={42} angle={-120} fill={leaf} vein={vein} />

        <Circle cx={CX} cy={CY} r={58} fill="url(#outerRing)" />
        <Circle cx={CX} cy={CY} r={40} fill={color.surface} opacity={0.85} />
        <Path
          d={`M${CX - 17} ${CY + 1} L ${CX - 5} ${CY + 13} L ${CX + 19} ${CY - 12}`}
          stroke={color.primary}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <G strokeWidth={4} strokeLinecap="round">
          {CONFETTI.map(([x1, y1, x2, y2, gold]) => (
            <Line
              key={`${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={gold ? accent : color.primary}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}
