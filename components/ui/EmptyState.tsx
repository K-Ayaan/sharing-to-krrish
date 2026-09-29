// <EmptyState icon={Inbox} title="No collections yet" body="…" actionLabel="Submit your first collection" onAction={…} />
// SDD S-60: a list with nothing in it yet, and the action that creates the first entry.
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import Button from './Button';
import IconTile from './IconTile';
import type { IconComponent } from './icons';

export type EmptyStateProps = {
  icon: IconComponent;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export default function EmptyState({ icon, title, body, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.wrap, style]}>
      <IconTile icon={icon} size="xlarge" shape="rounded" bg={theme.color.surfaceMuted} color={theme.color.textSecondary} />
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} size="medium" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: theme.space.xxxl,
    paddingHorizontal: theme.space.xl,
  },
  title: {
    ...theme.type.headline,
    fontSize: 16,
    color: theme.color.textPrimary,
    textAlign: 'center',
    marginTop: theme.space.l,
  },
  body: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: theme.space.s,
  },
  action: {
    marginTop: theme.space.xl,
    alignSelf: 'stretch',
  },
});
