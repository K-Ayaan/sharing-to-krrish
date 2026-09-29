// <ServiceScene pillar="livestock" width={cardWidth} height={52} />
// The illustrated strip along the foot of each Services card (services-page.png). Each service has
// its own scene in its own colour family, on a 400×80 scene anchored bottom-right; wider boxes
// extend the ground to the left rather than cropping anything.
//   vandhan      — forest hills and trees
//   livestock    — pasture, a wooden fence and hay bales
//   lpg          — soft rounded shapes (as drawn in the mockup)
//   commgrid     — village houses and a signal mast
//   microfinance — terraced fields and stacked coins
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import theme, { type PillarToken } from '../../theme';

const SCENE_W = 400;
const SCENE_H = 80;

export default function ServiceScene({ pillar, width, height }: { pillar: PillarToken; width: number; height: number }) {
  const canvasW = Math.max(SCENE_W, (SCENE_H * width) / Math.max(height, 1));
  const x0 = SCENE_W - canvasW;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`${x0} 0 ${canvasW} ${SCENE_H}`}
      preserveAspectRatio="xMaxYMax meet"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {pillar === 'vandhan' ? <Forest x0={x0} /> : null}
      {pillar === 'livestock' ? <Pasture x0={x0} /> : null}
      {pillar === 'lpg' ? <Shapes x0={x0} /> : null}
      {pillar === 'microfinance' ? <Terraces x0={x0} /> : null}
    </Svg>
  );
}

type SceneProps = { x0: number };

const TREES: [number, number, number][] = [
  [30, 60, 0.8],
  [58, 62, 0.6],
  [300, 50, 1],
  [330, 54, 0.8],
  [362, 48, 1.1],
];

function Forest({ x0 }: SceneProps) {
  const c = theme.illustration.green;
  return (
    <G>
      <Path d={`M${x0} 80 L${x0} 52 L0 52 C60 40 110 30 170 42 C230 22 320 18 400 34 L400 80 Z`} fill={c.back} />
      <Path d={`M${x0} 80 L${x0} 64 L0 64 C80 52 160 50 240 58 C300 46 360 44 400 52 L400 80 Z`} fill={c.mid} />
      {TREES.map(([cx, base, s]) => (
        <G key={cx}>
          <Rect x={cx - 1.5} y={base - 2} width={3} height={14 * s} fill={c.treeDark} />
          <Path
            d={`M${cx} ${base - 26 * s} Q${cx + 10 * s} ${base - 10 * s} ${cx + 8 * s} ${base} Q${cx} ${base + 4 * s} ${cx - 8 * s} ${base} Q${cx - 10 * s} ${base - 10 * s} ${cx} ${base - 26 * s} Z`}
            fill={cx > 320 ? c.treeDark : c.tree}
          />
        </G>
      ))}
      <Path d={`M${x0} 80 L${x0} 74 L0 74 C120 68 260 68 400 72 L400 80 Z`} fill={c.front} />
    </G>
  );
}

function Pasture({ x0 }: SceneProps) {
  const c = theme.illustration.peach;
  return (
    <G>
      <Path d={`M${x0} 80 L${x0} 50 L0 50 C90 36 170 40 250 48 C320 38 370 38 400 44 L400 80 Z`} fill={c.back} />
      <Path d={`M${x0} 80 L${x0} 66 L0 66 C120 58 240 58 400 62 L400 80 Z`} fill={c.mid} />
      <Line x1={252} y1={54} x2={392} y2={54} stroke={c.treeDark} strokeWidth={3} strokeLinecap="round" />
      <Line x1={252} y1={64} x2={392} y2={64} stroke={c.treeDark} strokeWidth={3} strokeLinecap="round" />
      {[262, 292, 322, 352, 382].map((x) => (
        <Rect key={x} x={x - 2.5} y={46} width={5} height={26} rx={1.5} fill={c.treeDark} />
      ))}
      <Ellipse cx={200} cy={66} rx={16} ry={11} fill={c.front} />
      <Ellipse cx={226} cy={68} rx={12} ry={9} fill={c.tree} />
      {[40, 120, 160].map((x) => (
        <Path key={x} d={`M${x} 72 l3 -8 l3 8 M${x + 4} 72 l3 -6 l3 6`} stroke={c.tree} strokeWidth={1.5} fill="none" />
      ))}
      <Path d={`M${x0} 80 L${x0} 74 L0 74 C140 70 280 70 400 74 L400 80 Z`} fill={c.front} />
    </G>
  );
}

// A gas cylinder, base at (x, base): body, shoulder, valve collar and carry ring.
function Cylinder({ x, base, h, fill, detail }: { x: number; base: number; h: number; fill: string; detail: string }) {
  const w = h * 0.52;
  return (
    <G>
      <Rect x={x - w / 2} y={base - h} width={w} height={h} rx={w * 0.32} fill={fill} />
      <Rect x={x - w * 0.22} y={base - h - h * 0.12} width={w * 0.44} height={h * 0.14} rx={2} fill={detail} />
      <Rect x={x - w * 0.34} y={base - h - h * 0.22} width={w * 0.68} height={h * 0.08} rx={2} fill={fill} />
      <Rect x={x - w / 2} y={base - h * 0.62} width={w} height={h * 0.08} fill={detail} opacity={0.6} />
    </G>
  );
}

function Shapes({ x0 }: SceneProps) {
  const c = theme.illustration.blue;
  return (
    <G>
      <Rect x={x0 - 20} y={46} width={-x0 + 150} height={60} rx={30} fill={c.back} />
      <Circle cx={80} cy={78} r={34} fill={c.mid} />
      <Rect x={x0 - 10} y={58} width={-x0 + 70} height={40} rx={18} fill={c.front} opacity={0.7} />
      <Circle cx={360} cy={86} r={44} fill={c.back} />
      <Circle cx={392} cy={62} r={14} fill={c.mid} />
      <Cylinder x={318} base={76} h={30} fill={c.treeDark} detail={c.back} />
      <Cylinder x={346} base={76} h={24} fill={c.tree} detail={c.back} />
    </G>
  );
}

const HOUSES: [number, number, number][] = [
  [250, 56, 22],
  [282, 60, 18],
  [306, 58, 20],
];


const COIN_STACKS: [number, number][] = [
  [330, 5],
  [360, 7],
  [388, 4],
];

function Terraces({ x0 }: SceneProps) {
  const c = theme.illustration.gold;
  return (
    <G>
      <Path d={`M${x0} 80 L${x0} 44 L0 44 C80 38 150 42 220 46 L400 46 L400 80 Z`} fill={c.back} />
      <Path d={`M${x0} 80 L${x0} 56 L0 56 C90 52 170 54 260 58 L400 58 L400 80 Z`} fill={c.mid} />
      <Path d={`M${x0} 80 L${x0} 68 L0 68 C100 64 200 66 400 70 L400 80 Z`} fill={c.front} />
      {COIN_STACKS.map(([x, count]) => (
        <G key={x}>
          {Array.from({ length: count }, (_, i) => (
            <Ellipse
              key={i}
              cx={x}
              cy={68 - i * 5}
              rx={11}
              ry={3.6}
              fill={i === count - 1 ? c.tree : c.treeDark}
              stroke={theme.illustration.house}
              strokeWidth={0.8}
            />
          ))}
        </G>
      ))}
    </G>
  );
}
