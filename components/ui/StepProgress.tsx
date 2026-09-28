// <StepProgress step={2} total={7} onBack={navigation.goBack} title="Create your account" />
import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type StepProgressProps = {
  /** 1-based. */
  step: number;
  total: number;
  onBack?: () => void;
  /** Centred heading beside the back chevron; the step dots then move to a row below. */
  title?: string;
  style?: ViewStyle;
};

const DOT = theme.space.s + theme.space.xs / 2;
const DOT_CURRENT = theme.space.s + theme.space.xs;
const BACK_SLOT = theme.space.xl;

// Onboarding appearance: a thick bar with a knob at the end of the fill, on every step — the last
// step shows it full, so the bar reads as one continuous progress line through the flow.
const BAR_HEIGHT = theme.space.s;
const KNOB = theme.space.m;

export default function StepProgress({ step, total, onBack, title, style }: StepProgressProps) {
  const { appearance, color } = useAppearance();
  const onboarding = appearance === 'onboarding';

  const back = onBack ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={theme.space.s}
      onPress={onBack}
      style={styles.back}
    >
      <Ionicons
        name="chevron-back"
        size={theme.type.largeTitle.fontSize}
        color={onboarding ? color.textPrimary : color.primary}
      />
    </Pressable>
  ) : (
    <View style={styles.back} />
  );

  const dots = (dotStyle: ViewStyle, lineStyle: ViewStyle) =>
    Array.from({ length: total }, (_, index) => {
      const n = index + 1;
      return (
        <Fragment key={n}>
          {index > 0 ? (
            <View
              style={[styles.line, lineStyle, { backgroundColor: n <= step ? color.primary : color.border }]}
            />
          ) : null}
          <View
            style={[
              styles.dot,
              dotStyle,
              { backgroundColor: n <= step ? color.primary : color.border },
              !onboarding && n === step && styles.dotCurrent,
            ]}
          />
        </Fragment>
      );
    });

  const fill = `${Math.min(step / total, 1) * 100}%` as const;

  const track = (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: step }}
      style={styles.track}
    >
      {!onboarding ? (
        dots({}, {})
      ) : (
        <View style={[styles.bar, { backgroundColor: color.border }]}>
          <View style={[styles.barFill, { width: fill, backgroundColor: color.primary }]}>
            <View style={[styles.knob, { backgroundColor: color.primary }]} />
          </View>
        </View>
      )}
    </View>
  );

  const count = (
    <Text style={[styles.count, { color: color.textSecondary }, onboarding && styles.countOnboarding]}>
      Step {step} of {total}
    </Text>
  );

  if (!title) {
    return (
      <View style={[styles.row, style]}>
        {back}
        {track}
        {count}
      </View>
    );
  }

  return (
    <View style={[styles.stacked, style]}>
      <View style={styles.row}>
        {back}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.title, { color: color.textPrimary }, onboarding && theme.onboarding.type.header]}
        >
          {title}
        </Text>
        <View style={styles.back} />
      </View>
      <View style={styles.row}>
        <View style={styles.back} />
        {track}
        {count}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stacked: {
    gap: theme.space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.space.xl + theme.space.xs,
  },
  back: {
    width: BACK_SLOT,
    justifyContent: 'center',
  },
  title: {
    ...theme.type.headline,
    flex: 1,
    textAlign: 'center',
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
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: theme.radius.pill,
  },
  dotCurrent: {
    width: DOT_CURRENT,
    height: DOT_CURRENT,
  },
  count: {
    ...theme.type.body,
  },
  countOnboarding: {
    fontSize: theme.type.headline.fontSize,
  },
  bar: {
    flex: 1,
    height: BAR_HEIGHT,
    borderRadius: theme.radius.pill,
  },
  barFill: {
    height: BAR_HEIGHT,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: theme.radius.pill,
    marginRight: -KNOB / 4,
  },
});
