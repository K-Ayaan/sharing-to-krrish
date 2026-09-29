// <Landscape width={screenWidth} height={120} spread="right" />
// The soft Nagaland hills-and-sun motif (aadhaar login.png, login-info.png, allset page.png,
// home.png). It's drawn on a 400×200 scene anchored to the bottom-right and never cropped: when
// the box is wider than 2:1 the drawing area grows to the left instead of scaling up, so the sun,
// birds and trees always show in full.
//   'right' — hills rise gently from nothing on the left, for headers with text on the left.
//   'full'  — rolling hills across the whole width, for the foot of onboarding screens.
// Decorative only — hidden from screen readers.
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import theme, { type IllustrationTone } from '../../theme';

export type LandscapeProps = {
  width: number;
  height: number;
  tone?: IllustrationTone;
  spread?: 'right' | 'full';
  sun?: boolean;
  birds?: boolean;
  trees?: boolean;
  houses?: boolean;
};

const SCENE_W = 400;
const SCENE_H = 200;

// Hills are written for the 400-wide scene; `ext` is how far the canvas extends left of x=0.
// 'full' hills continue flat into that extension so they still reach the left edge.
function hills(spread: 'right' | 'full', ext: number) {
  if (spread === 'right') {
    return {
      back: 'M0 200 L90 200 C150 196 190 150 250 122 C300 100 350 96 400 104 L400 200 Z',
      mid: 'M150 200 C210 196 250 160 300 150 C340 142 370 146 400 150 L400 200 Z',
      front: 'M230 200 C280 194 320 176 360 172 C380 170 392 172 400 174 L400 200 Z',
    };
  }
  const x = -ext;
  return {
    back: `M${x} 200 L${x} 146 L0 146 C70 118 130 124 190 138 C260 90 330 84 400 104 L400 200 Z`,
    mid: `M${x} 200 L${x} 172 L0 172 C90 150 170 150 250 162 C310 140 360 134 400 144 L400 200 Z`,
    front: `M${x} 200 L${x} 188 L0 188 C110 172 220 170 300 182 C350 176 380 176 400 180 L400 200 Z`,
  };
}

export default function Landscape({
  width,
  height,
  tone = 'green',
  spread = 'right',
  sun = true,
  birds = true,
  trees = true,
  houses = false,
}: LandscapeProps) {
  const palette = theme.illustration[tone];
  // Canvas width in scene units at the height we've been given.
  const canvasW = Math.max(SCENE_W, (SCENE_H * width) / Math.max(height, 1));
  const ext = canvasW - SCENE_W;
  const shape = hills(spread, ext);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`${-ext} 0 ${canvasW} ${SCENE_H}`}
      preserveAspectRatio="xMaxYMax meet"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {sun ? <Circle cx={296} cy={64} r={24} fill={theme.illustration.sun} opacity={0.85} /> : null}
      {birds ? (
        <G stroke={theme.illustration.bird} strokeWidth={2} fill="none" strokeLinecap="round">
          <Path d="M338 46 q6 -6 12 0 q6 -6 12 0" />
          <Path d="M322 66 q4 -4 8 0 q4 -4 8 0" />
        </G>
      ) : null}
      <Path d={shape.back} fill={palette.back} />
      <Path d={shape.mid} fill={palette.mid} />
      <Path d={shape.front} fill={palette.front} />
      {houses ? (
        <G>
          <Rect x={236} y={160} width={28} height={20} fill={theme.illustration.house} />
          <Path d="M232 162 L250 147 L268 162 Z" fill={theme.illustration.roof} />
          <Rect x={272} y={154} width={36} height={26} fill={theme.illustration.house} />
          <Path d="M268 156 L290 137 L312 156 Z" fill={theme.illustration.roof} />
          <Rect x={245} y={167} width={6} height={7} fill={palette.treeDark} opacity={0.5} />
          <Rect x={285} y={163} width={8} height={8} fill={palette.treeDark} opacity={0.5} />
        </G>
      ) : null}
      {trees ? (
        <G>
          <Rect x={346} y={140} width={3} height={32} fill={palette.treeDark} />
          <Path d="M347.5 100 Q361 122 359 144 Q347 151 336 144 Q334 122 347.5 100 Z" fill={palette.treeDark} />
          <Rect x={371} y={148} width={3} height={26} fill={palette.treeDark} />
          <Path d="M372.5 116 Q383 134 381 152 Q372 157 364 152 Q362 134 372.5 116 Z" fill={palette.tree} />
        </G>
      ) : null}
    </Svg>
  );
}

// Faint leaf sprig for the corners of registration screens
// (vandhan-registration.png, lpg-registration.png).
export function LeafSprig({ size, tone = 'green' }: { size: number; tone?: IllustrationTone }) {
  const palette = theme.illustration[tone];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path d="M190 200 Q120 120 60 40" stroke={palette.mid} strokeWidth={3} fill="none" />
      <Path d="M150 150 Q90 150 70 100 Q130 96 150 150 Z" fill={palette.back} />
      <Path d="M112 104 Q60 90 50 36 Q108 46 112 104 Z" fill={palette.back} />
      <Path d="M150 148 Q184 104 176 60 Q140 92 150 148 Z" fill={palette.mid} opacity={0.7} />
      <Path d="M100 82 Q120 40 110 0 Q84 38 100 82 Z" fill={palette.mid} opacity={0.6} />
    </Svg>
  );
}

// Gentle wave behind the bottom of registration screens.
export function WaveBackdrop({
  width,
  height,
  tone = 'green',
}: {
  width: number;
  height: number;
  tone?: IllustrationTone;
}) {
  const palette = theme.illustration[tone];
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path d="M0 60 Q120 0 240 50 Q320 84 400 40 L400 200 L0 200 Z" fill={palette.back} opacity={0.55} />
      <Path d="M0 120 Q140 70 260 110 Q340 136 400 100 L400 200 L0 200 Z" fill={palette.back} opacity={0.8} />
    </Svg>
  );
}
