// <DetailRow icon={Hash} label="Reference ID" value="VD-2026-0912-4587" />
// Label/value row with a leading icon, used in record-detail.png § Details and
// livestock-enquiry.png § Additional Details.
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type DetailRowProps = {
  icon?: IconComponent;
  label: string;
  value: string;
  // 'circle' puts the icon in a muted circle (record detail); 'bare' is a plain glyph (livestock).
  iconStyle?: 'circle' | 'bare';
  // 'split' — value right-aligned; 'column' — value starts mid-row (livestock additional details).
  layout?: 'split' | 'column';
  divider?: boolean;
};

export default function DetailRow({
  icon: Icon,
  label,
  value,
  iconStyle = 'circle',
  layout = 'split',
  divider = true,
}: DetailRowProps) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={[styles.row, divider && styles.divider]}>
      {Icon ? (
        <View style={iconStyle === 'circle' ? styles.iconCircle : styles.iconBare}>
          <Icon size={18} color={theme.color.textPrimary} strokeWidth={1.75} />
        </View>
      ) : null}
      <Text style={[styles.label, layout === 'column' && styles.labelColumn]}>{label}</Text>
      <Text style={[styles.value, layout === 'split' && styles.valueSplit]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: 50,
    paddingVertical: theme.space.s + 2,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBare: {
    width: 26,
    alignItems: 'center',
  },
  label: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  labelColumn: {
    width: '40%',
  },
  value: {
    ...theme.type.body,
    flex: 1,
    color: theme.color.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  valueSplit: {
    textAlign: 'right',
  },
});
