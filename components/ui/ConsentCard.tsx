// <ConsentCard icon="card-outline" title="Use my Aadhaar information" description="…" checked={ok} onChange={setOk} />
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';
import Avatar from './Avatar';
import Card from './Card';
import { CheckboxBox } from './Checkbox';

export type ConsentCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  style?: ViewStyle;
};

// One tickable consent statement: icon badge, title and description, with the checkbox on the
// right. The whole card toggles it. Unlike OptionCard (single choice), each card stands alone.
export default function ConsentCard({ icon, title, description, checked, onChange, style }: ConsentCardProps) {
  const { color } = useAppearance();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={`${title}. ${description}`}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <Card style={styles.card}>
        <Avatar icon={icon} size="l" />
        <View style={styles.text}>
          <Text style={[styles.title, { color: color.textPrimary }]}>{title}</Text>
          <Text style={[styles.description, { color: color.textSecondary }]}>{description}</Text>
        </View>
        <CheckboxBox checked={checked} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  text: {
    flex: 1,
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.headline,
    fontSize: theme.type.headline.fontSize + 1,
    fontWeight: '500',
  },
  description: {
    ...theme.type.body,
  },
});
