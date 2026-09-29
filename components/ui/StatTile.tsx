// <StatTile icon={CalendarDays} label="Age" value="3 years" />
// Compact fact tile from livestock-enquiry.png (Age / Weight / Quantity Available).
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export default function StatTile({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: string }) {
  return (
    <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.tile}>
      <View style={styles.icon}>
        <Icon size={22} color={theme.color.primary} strokeWidth={1.75} />
      </View>
      <View style={styles.text}>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.tile,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  label: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  value: {
    ...theme.type.bodyStrong,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
});
