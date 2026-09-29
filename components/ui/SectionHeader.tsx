// <SectionHeader title="Recent activity" actionLabel="View all" onAction={openRecords} />
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import theme from '../../theme';

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  required?: boolean;
  optionalHint?: string;
  style?: ViewStyle;
};

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  required = false,
  optionalHint,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
          {required ? <Text style={styles.required}> *</Text> : null}
          {optionalHint ? <Text style={styles.optional}> {optionalHint}</Text> : null}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <ChevronRight size={20} color={theme.color.primary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.m,
  },
  text: {
    flex: 1,
  },
  title: {
    ...theme.type.headline,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
  },
  required: {
    color: theme.color.required,
  },
  optional: {
    fontFamily: 'Poppins_600SemiBold',
    color: theme.color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    ...theme.type.body,
    fontSize: 14,
    color: theme.color.primary,
    fontWeight: '500',
  },
});
