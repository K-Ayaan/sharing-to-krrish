// <DocumentIllustration badge="message" />
import { View, ViewStyle } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import Leaf from './art/Leaf';

export type DocumentIllustrationProps = {
  /**
   * The bubble on the page: `message` (SMS lines — booking reference), `typing` (dots — complaint
   * details) or `alert` (! — complaint category).
   */
  badge: 'message' | 'typing' | 'alert';
  /** Rendered width; height follows the drawing's aspect ratio. */
  width?: number;
  style?: ViewStyle;
};

const VIEW_W = 170;
const VIEW_H = 150;
const DEFAULT_WIDTH = theme.space.xl * 3 + theme.space.l;

const { art } = theme.lpg;

// A paper sheet with a coloured bubble, flanked by leaves on a pale cloud — the intro art on LPG's
// form screens. SVG approximation of the reference artwork; decorative only.
export default function DocumentIllustration({ badge, width = DEFAULT_WIDTH, style }: DocumentIllustrationProps) {
  const { color } = useAppearance();
  const white = theme.color.surface;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={style}
    >
      <Svg width={width} height={(width * VIEW_H) / VIEW_W} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        <Path d="M10 140 C 0 100, 30 70, 60 78 C 70 40, 130 30, 150 70 C 175 72, 178 118, 165 140 Z" fill={art.hillFar} />
        <Leaf x={40} y={140} length={62} angle={-28} fill={art.leaf} vein={art.leafLight} />
        <Leaf x={135} y={140} length={58} angle={30} fill={art.leaf} vein={art.leafLight} />

        {/* Sheet */}
        <Rect x={52} y={30} width={72} height={104} rx={10} fill={white} />
        <Rect x={62} y={78} width={52} height={6} rx={3} fill={art.hillMid} />
        <Rect x={62} y={92} width={52} height={6} rx={3} fill={art.hillMid} />
        <Rect x={62} y={106} width={36} height={6} rx={3} fill={art.hillMid} />
        <Rect x={62} y={46} width={20} height={6} rx={3} fill={art.hillMid} />

        {/* Bubble */}
        {badge === 'alert' ? (
          <>
            <Circle cx={118} cy={40} r={20} fill={color.primary} opacity={0.85} />
            <Line x1={118} y1={30} x2={118} y2={43} stroke={white} strokeWidth={4} strokeLinecap="round" />
            <Circle cx={118} cy={50} r={2.5} fill={white} />
          </>
        ) : (
          <>
            <Path d="M86 20 H 146 A 10 10 0 0 1 156 30 V 56 A 10 10 0 0 1 146 66 H 104 L 94 76 V 66 H 96 A 10 10 0 0 1 86 56 V 30 A 10 10 0 0 1 96 20 Z" fill={color.primary} />
            {badge === 'message' ? (
              <>
                <Line x1={100} y1={34} x2={142} y2={34} stroke={white} strokeWidth={4} strokeLinecap="round" />
                <Line x1={100} y1={44} x2={142} y2={44} stroke={white} strokeWidth={4} strokeLinecap="round" />
                <Line x1={100} y1={54} x2={126} y2={54} stroke={white} strokeWidth={4} strokeLinecap="round" />
              </>
            ) : (
              <>
                <Circle cx={108} cy={43} r={4} fill={white} />
                <Circle cx={121} cy={43} r={4} fill={white} />
                <Circle cx={134} cy={43} r={4} fill={white} />
              </>
            )}
          </>
        )}
      </Svg>
    </View>
  );
}
