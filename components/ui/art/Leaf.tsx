import { G, Path } from 'react-native-svg';

export type LeafProps = {
  /** Where the stalk attaches. */
  x: number;
  y: number;
  length: number;
  /** Degrees; 0 points straight up, positive leans right. */
  angle: number;
  fill: string;
  vein?: string;
  /** Width as a fraction of length. */
  width?: number;
  opacity?: number;
};

// A single almond-shaped leaf with a midrib, drawn pointing up from its stalk and rotated into place.
// Shared by the onboarding illustrations (Landscape, OnboardingBackdrop, SuccessBadge).
export default function Leaf({ x, y, length, angle, fill, vein, width = 0.34, opacity = 1 }: LeafProps) {
  const w = length * width;
  const l = length;
  const outline = `M0 0 C ${w} ${-l * 0.25}, ${w} ${-l * 0.7}, 0 ${-l} C ${-w} ${-l * 0.7}, ${-w} ${-l * 0.25}, 0 0 Z`;
  return (
    <G transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacity}>
      <Path d={outline} fill={fill} />
      {vein ? (
        <Path d={`M0 ${-l * 0.05} Q ${w * 0.15} ${-l * 0.5}, 0 ${-l * 0.92}`} stroke={vein} strokeWidth={1} fill="none" />
      ) : null}
    </G>
  );
}
