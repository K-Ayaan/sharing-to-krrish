// <Tag label="Rate updated today" pillar="vandhan" />
// Informational chip in a pillar's own tint ("12 available", "Available: 5", "OFFICIAL NOTICE").
// Never use for status — that's StatusPill.
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme, { type PillarToken } from '../../theme';

export type TagProps = {
  label: string;
  pillar?: PillarToken;
  variant?: 'soft' | 'surface';
  style?: ViewStyle;
};

export default function Tag({ label, pillar = 'vandhan', variant = 'soft', style }: TagProps) {
  const tint = theme.pillarTint[pillar];
  return (
    <View
      style={[
        styles.tag,
        { backgroundColor: variant === 'surface' ? 'rgba(255,255,255,0.85)' : tint.tint },
        style,
      ]}
    >
      <Text numberOfLines={1} style={[styles.label, { color: pillar === 'vandhan' ? theme.color.primary : tint.icon }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.m,
    paddingVertical: 5,
  },
  label: {
    ...theme.type.caption,
    fontWeight: '500',
  },
});
