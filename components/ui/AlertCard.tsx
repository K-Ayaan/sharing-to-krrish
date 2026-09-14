// <AlertCard title="Movement ban in force" body="No livestock movement..." onAcknowledge={dismiss} />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import Button from './Button';

export type AlertCardProps = {
  title: string;
  body: string;
  onAcknowledge: () => void;
  style?: ViewStyle;
};

// Demands action: an inset rounded card with a full danger border, a left accent
// bar, a stacked title/body block and its own footer button — structurally a box,
// not the flat single-line strip RunningBanner uses.
export default function AlertCard({ title, body, onAcknowledge, style }: AlertCardProps) {
  return (
    <View accessibilityRole="alert" style={[styles.card, style]}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.heading}>
          <Ionicons
            name="warning"
            size={theme.type.title.fontSize}
            color={theme.color.danger}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.body}>{body}</Text>
        <Button label="Acknowledge" variant="secondary" onPress={onAcknowledge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.color.dangerTint,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.danger,
    overflow: 'hidden',
  },
  accent: {
    width: theme.space.xs,
    backgroundColor: theme.color.danger,
  },
  content: {
    flex: 1,
    padding: theme.space.m,
    gap: theme.space.s,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.title,
    color: theme.color.textPrimary,
    flex: 1,
  },
  body: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginBottom: theme.space.xs,
  },
});
