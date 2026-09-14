// <StatusTracker steps={[{ label: 'Requested', state: 'done', detail: '12 Aug' }, { label: 'Confirmed', state: 'current' }]} />
// <StatusTracker orientation="vertical" steps={[{ label: 'Submitted', state: 'done', detail: '10 Aug, 2:15 PM', description: 'Received.' }]} />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type StepState = 'done' | 'current' | 'upcoming';

export type Step = {
  label: string;
  state: StepState;
  /** Short meta under the label, e.g. a timestamp. */
  detail?: string;
  /** Longer explanatory line. Shown in vertical orientation only. */
  description?: string;
};

export type StatusTrackerProps = {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
};

const DOT_SIZE = theme.space.l;
const CURRENT_CORE = theme.space.s + theme.space.xs;
const CONNECTOR_THICKNESS = theme.space.xs / 2;

export default function StatusTracker({ steps, orientation = 'horizontal', style }: StatusTrackerProps) {
  return orientation === 'vertical' ? (
    <VerticalTracker steps={steps} style={style} />
  ) : (
    <HorizontalTracker steps={steps} style={style} />
  );
}

function StepDot({ state }: { state: StepState }) {
  return (
    <View style={[styles.dot, dotStyle(state)]}>
      {state === 'done' ? (
        <Ionicons name="checkmark" size={theme.type.caption.fontSize} color={theme.color.background} />
      ) : null}
      {state === 'current' ? <View style={styles.currentCore} /> : null}
    </View>
  );
}

function HorizontalTracker({ steps, style }: Omit<StatusTrackerProps, 'orientation'>) {
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
              <StepDot state={step.state} />
              {isLast ? null : (
                <View
                  style={[
                    styles.hConnector,
                    connectorDone ? styles.connectorDone : styles.connectorUpcoming,
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

function VerticalTracker({ steps, style }: Omit<StatusTrackerProps, 'orientation'>) {
  return (
    <View accessibilityRole="progressbar" style={style}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <View key={step.label} style={styles.vStep}>
            <View style={styles.vRail}>
              <StepDot state={step.state} />
              {isLast ? null : (
                <View
                  style={[
                    styles.vConnector,
                    step.state === 'done' ? styles.connectorDone : styles.connectorUpcoming,
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

function dotStyle(state: StepState) {
  if (state === 'done') return styles.dotDone;
  if (state === 'current') return styles.dotCurrent;
  return styles.dotUpcoming;
}

const styles = StyleSheet.create({
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
  dotDone: {
    backgroundColor: theme.color.primary,
  },
  dotCurrent: {
    backgroundColor: theme.color.primaryTint,
    borderWidth: CONNECTOR_THICKNESS,
    borderColor: theme.color.primary,
  },
  dotUpcoming: {
    backgroundColor: theme.color.surfaceMuted,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.border,
  },
  currentCore: {
    width: CURRENT_CORE,
    height: CURRENT_CORE,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.primary,
  },
  hConnector: {
    flex: 1,
    height: CONNECTOR_THICKNESS,
    marginHorizontal: theme.space.xs,
  },
  connectorDone: {
    backgroundColor: theme.color.primary,
  },
  connectorUpcoming: {
    backgroundColor: theme.color.border,
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
});
