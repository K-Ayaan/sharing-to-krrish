// <StepProgress step={2} total={6} onBack={navigation.goBack} />
import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type StepProgressProps = {
  /** 1-based. */
  step: number;
  total: number;
  onBack?: () => void;
  style?: ViewStyle;
};

const DOT = theme.space.s + theme.space.xs / 2;
const DOT_CURRENT = theme.space.s + theme.space.xs;
const BACK_SLOT = theme.space.xl;

export default function StepProgress({ step, total, onBack, style }: StepProgressProps) {
  return (
    <View style={[styles.row, style]}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={theme.space.s}
          onPress={onBack}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={theme.type.largeTitle.fontSize} color={theme.color.primary} />
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: total, now: step }}
        style={styles.track}
      >
        {Array.from({ length: total }, (_, index) => {
          const n = index + 1;
          return (
            <Fragment key={n}>
              {index > 0 ? <View style={[styles.line, n <= step && styles.lineDone]} /> : null}
              <View
                style={[
                  styles.dot,
                  n < step && styles.dotDone,
                  n === step && styles.dotCurrent,
                ]}
              />
            </Fragment>
          );
        })}
      </View>
      <Text style={styles.count}>
        Step {step} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.space.xl + theme.space.xs,
  },
  back: {
    width: BACK_SLOT,
    justifyContent: 'center',
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.space.m,
  },
  line: {
    flex: 1,
    height: theme.space.xs / 2,
    backgroundColor: theme.color.border,
  },
  lineDone: {
    backgroundColor: theme.color.primary,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.border,
  },
  dotDone: {
    backgroundColor: theme.color.primary,
  },
  dotCurrent: {
    width: DOT_CURRENT,
    height: DOT_CURRENT,
    backgroundColor: theme.color.primary,
  },
  count: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
