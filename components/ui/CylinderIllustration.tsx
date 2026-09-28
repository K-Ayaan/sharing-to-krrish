// <CylinderIllustration />
import { View, ViewStyle } from 'react-native';
import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';
import theme from '../../theme';
import Leaf from './art/Leaf';

export type CylinderIllustrationProps = {
  /** Rendered width; height follows the drawing's aspect ratio. */
  width?: number;
  style?: ViewStyle;
};

const VIEW_W = 200;
const VIEW_H = 190;
const DEFAULT_WIDTH = theme.space.xl * 5;

const { cylinder, art } = theme.lpg;

// A red LPG cylinder with a flame mark, among blue-green leaves on a pale cloud — LpgHome's and
// LpgRegistration's hero. SVG approximation of the reference artwork; decorative only.
export default function CylinderIllustration({ width = DEFAULT_WIDTH, style }: CylinderIllustrationProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={style}
    >
      <Svg width={width} height={(width * VIEW_H) / VIEW_W} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
        {/* Cloud behind */}
        <Path
          d="M20 150 C 10 110, 40 80, 70 88 C 80 50, 140 40, 160 80 C 190 80, 200 120, 185 150 Z"
          fill={art.hillFar}
        />
        {/* Leaves */}
        <Leaf x={62} y={172} length={70} angle={-25} fill={art.leaf} vein={art.leafLight} />
        <Leaf x={58} y={172} length={54} angle={-60} fill={theme.onboarding.art.leaf} opacity={0.8} />
        <Leaf x={150} y={172} length={66} angle={28} fill={art.leaf} vein={art.leafLight} />
        <Leaf x={156} y={172} length={50} angle={62} fill={theme.onboarding.art.leaf} opacity={0.8} />

        {/* Ground shadow */}
        <Ellipse cx={105} cy={176} rx={48} ry={6} fill={art.hillMid} />

        <G>
          {/* Valve guard */}
          <Rect x={82} y={28} width={46} height={10} rx={4} fill={cylinder.shade} />
          <Rect x={86} y={30} width={6} height={22} rx={2} fill={cylinder.shade} />
          <Rect x={118} y={30} width={6} height={22} rx={2} fill={cylinder.shade} />
          <Rect x={97} y={40} width={16} height={14} rx={3} fill={cylinder.shade} />
          {/* Shoulder and body */}
          <Path d="M70 76 C 70 58, 86 50, 105 50 C 124 50, 140 58, 140 76 Z" fill={cylinder.body} />
          <Rect x={70} y={74} width={70} height={92} rx={14} fill={cylinder.body} />
          <Rect x={124} y={80} width={10} height={80} rx={5} fill={cylinder.shade} opacity={0.45} />
          <Rect x={76} y={80} width={6} height={74} rx={3} fill={cylinder.highlight} opacity={0.7} />
          <Rect x={70} y={96} width={70} height={3} fill={cylinder.shade} opacity={0.5} />
          <Rect x={70} y={146} width={70} height={3} fill={cylinder.shade} opacity={0.5} />
          {/* Foot ring */}
          <Rect x={74} y={164} width={62} height={10} rx={3} fill={cylinder.shade} />
          {/* Flame mark */}
          <Path
            d="M105 104 C 112 112, 118 118, 116 128 C 114 136, 108 140, 105 140 C 98 140, 93 134, 94 126 C 95 120, 99 118, 100 112 C 102 116, 104 118, 105 118 C 106 112, 105 108, 105 104 Z"
            fill={cylinder.flame}
          />
        </G>
      </Svg>
    </View>
  );
}
