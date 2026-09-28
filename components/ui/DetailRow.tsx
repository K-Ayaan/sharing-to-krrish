// <DetailRow icon="location" label="Applicable area" value="All districts in Nagaland" divider />
// <DetailRow icon="call" value="+91 98765 43210" trailing={<IconButton icon="call" … />} />
import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import AppIcon, { type AppIconName } from './AppIcon';
import { useAppearance } from './Appearance';

export type DetailRowProps = {
  icon: AppIconName;
  value: string;
  /** Left-hand caption; omit for a value-only row. */
  label?: string;
  /** Secondary line under the value. */
  detail?: string;
  trailing?: ReactNode;
  divider?: boolean;
  /** Label as a caption above a bold value, icon in a tinted tile (Van Dhan detail cards). */
  stacked?: boolean;
  /** Side-by-side layout with the icon in a tinted tile (LPG detail cards). `stacked` implies it. */
  iconTinted?: boolean;
  style?: ViewStyle;
};

// Read-only fact row — unlike ListRow it is not pressable and has no chevron.
export default function DetailRow({
  icon,
  value,
  label,
  detail,
  trailing,
  divider = false,
  stacked = false,
  iconTinted = false,
  style,
}: DetailRowProps) {
  const { color } = useAppearance();

  if (stacked) {
    return (
      <View
        accessible={!trailing}
        accessibilityLabel={[label, value, detail].filter(Boolean).join(', ')}
        style={[styles.row, styles.stackedRow, divider && styles.divider, style]}
      >
        <View style={[styles.tile, { backgroundColor: color.primaryTint }]}>
          <AppIcon name={icon} size={theme.type.title.fontSize + theme.space.xs} color={color.primary} />
        </View>
        <View style={styles.valueAlone}>
          {label ? <Text style={styles.caption}>{label}</Text> : null}
          <Text style={styles.valueStrong}>{value}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        </View>
        {trailing}
      </View>
    );
  }

  return (
    <View
      accessible={!trailing}
      accessibilityLabel={[label, value, detail].filter(Boolean).join(', ')}
      style={[styles.row, divider && styles.divider, style]}
    >
      {iconTinted ? (
        <View style={[styles.smallTile, { backgroundColor: color.primaryTint }]}>
          <AppIcon name={icon} size={theme.type.title.fontSize} color={color.primary} />
        </View>
      ) : (
        <AppIcon name={icon} size={theme.type.title.fontSize} color={theme.color.textSecondary} />
      )}
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
  stackedRow: {
    paddingVertical: theme.space.m,
  },
  tile: {
    width: theme.space.xl + theme.space.s,
    height: theme.space.xl + theme.space.s,
    borderRadius: theme.radius.field + theme.space.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  smallTile: {
    width: theme.space.xl,
    height: theme.space.xl,
    borderRadius: theme.radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueStrong: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
});
