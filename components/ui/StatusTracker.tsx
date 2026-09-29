// <StatusTracker steps={[{ label: 'Submitted', date: '12 Sep 2026', time: '10:24 AM', state: 'done' }, …]} />
// Horizontal milestone timeline from record-detail.png: filled check nodes joined by green lines,
// with the date and time under each completed step, and "In progress" / "Awaiting" under the rest
// so the line never looks unfinished. A vertical StepList covers longer processes (LPG booking,
// Micro-Finance application — SDD S-32 / S-52).
import { StyleSheet, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import theme from '../../theme';

export type StepState = 'done' | 'current' | 'upcoming' | 'failed';

export type TrackerStep = {
  label: string;
  date?: string | null;
  time?: string | null;
  state: StepState;
};

const reached = (state: StepState) => state !== 'upcoming';

function Node({ state, size }: { state: StepState; size: number }) {
  return (
    <View
      style={[
        styles.node,
        { width: size, height: size, borderRadius: size / 2 },
        state === 'done' && styles.nodeDone,
        state === 'failed' && styles.nodeFailed,
        state === 'current' && styles.nodeCurrent,
        state === 'upcoming' && styles.nodeUpcoming,
      ]}
    >
      {state === 'done' ? <Check size={size * 0.42} color={theme.color.onPrimary} strokeWidth={3} /> : null}
      {state === 'failed' ? <X size={size * 0.42} color={theme.color.onPrimary} strokeWidth={3} /> : null}
      {state === 'current' ? <View style={styles.currentDot} /> : null}
    </View>
  );
}

export default function StatusTracker({ steps }: { steps: TrackerStep[] }) {
  return (
    <View
      accessible
      accessibilityLabel={steps
        .map((step) => `${step.label}: ${step.state === 'done' ? `done ${step.date ?? ''} ${step.time ?? ''}` : step.state}`)
        .join('. ')}
      style={styles.row}
    >
      {steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const nextReached = !isLast && reached(steps[index + 1].state);
        return (
          <View key={step.label} style={styles.column}>
            <View style={styles.nodeRow}>
              <View style={[styles.line, isFirst ? styles.hidden : reached(step.state) ? styles.lineDone : styles.lineTodo]} />
              <Node state={step.state} size={38} />
              <View style={[styles.line, isLast ? styles.hidden : nextReached ? styles.lineDone : styles.lineTodo]} />
            </View>
            <Text
              numberOfLines={2}
              style={[
                styles.label,
                step.state === 'upcoming' && styles.muted,
                step.state === 'failed' && styles.failedText,
              ]}
            >
              {step.label}
            </Text>
            {step.date ? (
              <>
                <Text style={styles.meta}>{step.date}</Text>
                {step.time ? <Text style={styles.meta}>{step.time}</Text> : null}
              </>
            ) : step.state !== 'failed' ? (
              <Text style={[styles.meta, styles.muted]}>{step.state === 'current' ? 'In progress' : 'Awaiting'}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function StepList({ steps }: { steps: (TrackerStep & { detail?: string | null })[] }) {
  return (
    <View>
      {steps.map((step, index) => (
        <View key={step.label} style={styles.listRow}>
          <View style={styles.listRail}>
            <Node state={step.state} size={26} />
            {index < steps.length - 1 ? (
              <View style={[styles.listLine, step.state === 'done' ? styles.lineDone : styles.lineTodo]} />
            ) : null}
          </View>
          <View style={styles.listText}>
            <View style={styles.listHeader}>
              <Text style={[styles.listLabel, step.state === 'upcoming' && styles.muted]}>{step.label}</Text>
              <Text style={styles.listDate}>{step.date ?? '—'}</Text>
            </View>
            {step.detail ? <Text style={styles.listDetail}>{step.detail}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: theme.space.m,
  },
  line: {
    flex: 1,
    height: 3,
  },
  hidden: {
    opacity: 0,
  },
  lineDone: {
    backgroundColor: theme.pillarTint.vandhan.icon,
  },
  lineTodo: {
    backgroundColor: theme.color.border,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: theme.color.primary,
    borderWidth: 4,
    borderColor: theme.color.primaryTint,
  },
  nodeFailed: {
    backgroundColor: theme.color.alert.fg,
    borderWidth: 4,
    borderColor: theme.color.alert.bg,
  },
  nodeCurrent: {
    backgroundColor: theme.color.surface,
    borderWidth: 3,
    borderColor: theme.color.status.pendingFg,
  },
  nodeUpcoming: {
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.borderStrong,
  },
  currentDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.color.status.pendingFg,
  },
  label: {
    ...theme.type.bodyStrong,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textPrimary,
    textAlign: 'center',
    paddingHorizontal: theme.space.xs,
  },
  failedText: {
    color: theme.color.alert.fg,
  },
  muted: {
    color: theme.color.textTertiary,
  },
  meta: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  listRow: {
    flexDirection: 'row',
    gap: theme.space.m,
  },
  listRail: {
    alignItems: 'center',
    width: 28,
  },
  listLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginVertical: 4,
  },
  listText: {
    flex: 1,
    paddingBottom: theme.space.l,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 26,
    gap: theme.space.s,
  },
  listLabel: {
    ...theme.type.bodyStrong,
    color: theme.color.textPrimary,
    flex: 1,
  },
  listDate: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  listDetail: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
});
