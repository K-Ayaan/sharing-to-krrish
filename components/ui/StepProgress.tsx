// <StepProgress current={1} total={5} />
// Segmented progress bar for one-question-at-a-time forms (SDD S-11 / S-20 / S-50 "Step 1 of 5").
import { StyleSheet, Text, View } from 'react-native';
import theme, { type PillarToken } from '../../theme';

export default function StepProgress({
  current,
  total,
  pillar = 'vandhan',
}: {
  current: number;
  total: number;
  // Filled segments take the pillar's own colour — LPG's forms are blue throughout.
  pillar?: PillarToken;
}) {
  return (
    <View accessible accessibilityLabel={`Step ${current} of ${total}`}>
      <View style={styles.track}>
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            style={[styles.segment, index < current && { backgroundColor: theme.pillarTint[pillar].icon }]}
          />
        ))}
      </View>
      <Text style={styles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.color.border,
  },
  label: {
    ...theme.type.label,
    color: theme.color.textSecondary,
    marginTop: theme.space.s,
  },
});
