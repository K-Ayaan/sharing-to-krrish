// <StatusTracker steps={[{ label: 'Requested', state: 'done', detail: '12 Aug' }, { label: 'Confirmed', state: 'current' }]} />
// <StatusTracker orientation="vertical" steps={[{ label: 'Submitted', state: 'done', detail: '10 Aug, 2:15 PM', description: 'Received.' }]} />
// <StatusTracker variant="guide" steps={[{ label: '1. Go to Kendra', icon: 'walk', state: 'current', description: '…' }]} />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import theme, { Palette } from '../../theme';
import { useAppearance } from './Appearance';

export type StepState = 'done' | 'current' | 'upcoming';

export type Step = {
  label: string;
  state: StepState;
  /** Short meta under the label, e.g. a timestamp. */
  detail?: string;
  /** Longer explanatory line. Shown in vertical orientation and the guide variant. */
  description?: string;
  /** Guide variant: the icon drawn in the step's circle. */
  icon?: keyof typeof Ionicons.glyphMap;
};

export type StatusTrackerProps = {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  /**
   * `progress` (default) tracks a request's stages. `guide` explains what happens next: large icon
   * circles joined by dashed lines, with centred titles and descriptions (horizontal only).
   */
  variant?: 'progress' | 'guide';
  style?: ViewStyle;
};

const DOT_SIZE = theme.space.l;
const GUIDE_DOT_SIZE = theme.space.xl + theme.space.s;
const CURRENT_CORE = theme.space.s + theme.space.xs;
const CONNECTOR_THICKNESS = theme.space.xs / 2;
const DASH_HEIGHT = theme.space.xs / 2;

export default function StatusTracker({
  steps,
  orientation = 'horizontal',
  variant = 'progress',
  style,
}: StatusTrackerProps) {
  const { color } = useAppearance();
  if (variant === 'guide') return <GuideTracker steps={steps} color={color} style={style} />;
  return orientation === 'vertical' ? (
    <VerticalTracker steps={steps} color={color} style={style} />
  ) : (
    <HorizontalTracker steps={steps} color={color} style={style} />
  );
}

type TrackerProps = { steps: Step[]; color: Palette; style?: ViewStyle };

function StepDot({ state, color }: { state: StepState; color: Palette }) {
  return (
    <View style={[styles.dot, dotStyle(state, color)]}>
      {state === 'done' ? (
        <Ionicons name="checkmark" size={theme.type.caption.fontSize} color={theme.color.background} />
      ) : null}
      {state === 'current' ? <View style={[styles.currentCore, { backgroundColor: color.primary }]} /> : null}
    </View>
  );
}

function HorizontalTracker({ steps, color, style }: TrackerProps) {
  return (
    <View accessibilityRole="progressbar" style={[styles.row, style]}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        // The connector belongs to the gap after this step, so it is filled
        // only once this step itself is complete.
        const connectorDone = step.state === 'done';

        return (
          <View key={step.label} style={[styles.step, isLast && styles.stepLast]}>
            <View style={styles.track}>
              <StepDot state={step.state} color={color} />
              {isLast ? null : (
                <View
                  style={[
                    styles.hConnector,
                    { backgroundColor: connectorDone ? color.primary : color.border },
                  ]}
                />
              )}
            </View>
            <Text
              numberOfLines={2}
              style={[styles.label, step.state === 'upcoming' && styles.labelUpcoming]}
            >
              {step.label}
            </Text>
            {step.detail ? (
              <Text numberOfLines={2} style={[styles.detail, styles.hDetail]}>
                {step.detail}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function VerticalTracker({ steps, color, style }: TrackerProps) {
  return (
    <View accessibilityRole="progressbar" style={style}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.label} style={styles.vStep}>
            <View style={styles.vRail}>
              <StepDot state={step.state} color={color} />
              {isLast ? null : (
                <View
                  style={[
                    styles.vConnector,
                    { backgroundColor: step.state === 'done' ? color.primary : color.border },
                  ]}
                />
              )}
            </View>
            <View style={[styles.vBody, !isLast && styles.vBodySpaced]}>
              <Text style={[styles.vLabel, step.state === 'upcoming' && styles.labelUpcoming]}>
                {step.label}
              </Text>
              {step.detail ? <Text style={styles.detail}>{step.detail}</Text> : null}
              {step.description ? <Text style={styles.vDescription}>{step.description}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// Each column is a third of the row; the dashed line runs from this circle's edge to the next one's.
function GuideTracker({ steps, color, style }: TrackerProps) {
  return (
    <View style={[styles.row, style]}>
      {steps.map((step, index) => {
        const active = step.state !== 'upcoming';
        return (
          <View
            key={step.label}
            accessible
            accessibilityLabel={[step.label, step.description].filter(Boolean).join('. ')}
            style={styles.guideStep}
          >
            <View style={styles.guideTrack}>
              {index > 0 ? <Dashes color={color.border} /> : <View style={styles.flex} />}
              <View
                style={[
                  styles.guideDot,
                  active
                    ? { backgroundColor: color.primary }
                    : [styles.guideDotUpcoming, { backgroundColor: color.surfaceMuted, borderColor: color.border }],
                ]}
              >
                {step.icon ? (
                  <Ionicons
                    name={step.icon}
                    size={theme.type.title.fontSize + theme.space.xs}
                    color={active ? theme.color.background : color.textSecondary}
                  />
                ) : null}
              </View>
              {index < steps.length - 1 ? (
                <Dashes color={color.border} />
              ) : (
                <View style={styles.flex} />
              )}
            </View>
            <Text style={[styles.guideLabel, active && { color: color.primary }]}>{step.label}</Text>
            {step.description ? <Text style={styles.guideDescription}>{step.description}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

// iOS draws a one-sided dashed border as solid, so the guide's dashes are an SVG line.
function Dashes({ color }: { color: string }) {
  return (
    <View style={styles.dashed}>
      <Svg width="100%" height={DASH_HEIGHT}>
        <Line
          x1="0"
          y1={DASH_HEIGHT / 2}
          x2="100%"
          y2={DASH_HEIGHT / 2}
          stroke={color}
          strokeWidth={DASH_HEIGHT / 2}
          strokeDasharray="4 4"
        />
      </Svg>
    </View>
  );
}

function dotStyle(state: StepState, color: Palette) {
  if (state === 'done') return { backgroundColor: color.primary };
  if (state === 'current')
    return { backgroundColor: color.primaryTint, borderWidth: CONNECTOR_THICKNESS, borderColor: color.primary };
  return {
    backgroundColor: color.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: color.border,
  };
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  step: {
    flex: 1,
  },
  stepLast: {
    flex: 0,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentCore: {
    width: CURRENT_CORE,
    height: CURRENT_CORE,
    borderRadius: theme.radius.pill,
  },
  hConnector: {
    flex: 1,
    height: CONNECTOR_THICKNESS,
    marginHorizontal: theme.space.xs,
  },
  label: {
    ...theme.type.caption,
    color: theme.color.textPrimary,
    marginTop: theme.space.s,
    paddingRight: theme.space.s,
  },
  labelUpcoming: {
    color: theme.color.textSecondary,
  },
  detail: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  hDetail: {
    paddingRight: theme.space.s,
  },
  vStep: {
    flexDirection: 'row',
    gap: theme.space.m,
  },
  vRail: {
    width: DOT_SIZE,
    alignItems: 'center',
  },
  vConnector: {
    flex: 1,
    width: CONNECTOR_THICKNESS,
    marginVertical: theme.space.xs,
  },
  vBody: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  vBodySpaced: {
    paddingBottom: theme.space.l,
  },
  vLabel: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  vDescription: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  guideStep: {
    flex: 1,
    alignItems: 'center',
    gap: theme.space.xs,
  },
  guideTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: theme.space.s,
  },
  dashed: {
    flex: 1,
    marginHorizontal: theme.space.xs,
  },
  guideDot: {
    width: GUIDE_DOT_SIZE,
    height: GUIDE_DOT_SIZE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideDotUpcoming: {
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  guideLabel: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textPrimary,
    textAlign: 'center',
  },
  guideDescription: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.space.xs,
  },
});
