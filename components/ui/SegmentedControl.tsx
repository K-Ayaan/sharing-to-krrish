// <SegmentedControl value={tab} onChange={setTab} segments={[{ value: 'rates', label: 'Price Check', icon: BarChart3 }, …]} />
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type Segment<V extends string> = { value: V; label: string; icon?: IconComponent };

export type SegmentedControlProps<V extends string> = {
  value: V;
  segments: Segment<V>[];
  onChange: (value: V) => void;
  style?: ViewStyle;
};

export default function SegmentedControl<V extends string>({
  value,
  segments,
  onChange,
  style,
}: SegmentedControlProps<V>) {
  return (
    <View accessibilityRole="tablist" style={[styles.track, style]}>
      {segments.map((segment) => {
        const active = segment.value === value;
        const Icon = segment.icon;
        const tone = active ? theme.color.primary : theme.color.textSecondary;
        return (
          <Pressable
            key={segment.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(segment.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            {Icon ? <Icon size={20} color={tone} strokeWidth={2} /> : null}
            <Text numberOfLines={1} style={[styles.label, { color: active ? theme.color.primary : theme.color.textSecondary }]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: theme.color.surfaceMuted,
    borderRadius: theme.radius.field + 2,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.s,
    minHeight: theme.size.touch + 4,
    borderRadius: theme.radius.field,
  },
  segmentActive: {
    backgroundColor: theme.color.primaryTint,
    borderWidth: 1,
    borderColor: theme.pillarTint.vandhan.border,
  },
  label: {
    ...theme.type.bodyStrong,
    fontSize: 14,
    fontWeight: '500',
  },
});
