// <DetailRow icon="location" label="Applicable area" value="All districts in Nagaland" divider />
// <DetailRow icon="call" value="+91 98765 43210" trailing={<IconButton icon="call" … />} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  /** Left-hand caption; omit for a value-only row. */
  label?: string;
  /** Secondary line under the value. */
  detail?: string;
  trailing?: ReactNode;
  divider?: boolean;
  style?: ViewStyle;
};

// Read-only fact row — unlike ListRow it is not pressable and has no chevron.
export default function DetailRow({ icon, value, label, detail, trailing, divider = false, style }: DetailRowProps) {
  return (
    <View
      accessible={!trailing}
      accessibilityLabel={[label, value, detail].filter(Boolean).join(', ')}
      style={[styles.row, divider && styles.divider, style]}
    >
      <Ionicons name={icon} size={theme.type.title.fontSize} color={theme.color.textSecondary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={label ? styles.valueWithLabel : styles.valueAlone}>
        <Text style={label ? styles.value : styles.valueProminent}>{value}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

const LABEL_FLEX = 1;
const VALUE_FLEX = 1.4;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  label: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    flex: LABEL_FLEX,
  },
  valueWithLabel: {
    flex: VALUE_FLEX,
    gap: theme.space.xs / 2,
  },
  valueAlone: {
    flex: 1,
    gap: theme.space.xs / 2,
  },
  value: {
    ...theme.type.body,
    color: theme.color.textPrimary,
  },
  valueProminent: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  detail: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
