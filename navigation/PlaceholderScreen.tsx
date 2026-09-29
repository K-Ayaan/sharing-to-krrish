// Temporary navigation-shell scaffold — each screen replaces it with real content. The tag and
// reference say whether a mockup exists for this route, so an unbuilt screen states what it's
// waiting on rather than looking broken.
import { ReactNode } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button, { type ButtonVariant } from '../components/ui/Button';
import theme from '../theme';

export type PlaceholderAction = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
};

export function placeholderAlert(title: string, detail: string, onDismiss?: () => void) {
  Alert.alert(title, `${detail}\n\nPlaceholder only.`, [{ text: 'OK', onPress: onDismiss }]);
}

export function PlaceholderActions({ actions }: { actions: PlaceholderAction[] }) {
  return (
    <View style={styles.actions}>
      {actions.map((action) => (
        <Button key={action.label} label={action.label} onPress={action.onPress} variant={action.variant ?? 'primary'} />
      ))}
    </View>
  );
}

type PlaceholderScreenProps = {
  name: string;
  tag?: 'MOCKUP' | 'SPEC-ONLY';
  reference?: string;
  actions?: PlaceholderAction[];
  children?: ReactNode;
};

export default function PlaceholderScreen({
  name,
  tag,
  reference,
  actions = [],
  children,
}: PlaceholderScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.name}>{name}</Text>
      {tag ? <Text style={styles.tag}>{tag}</Text> : null}
      {reference ? <Text style={styles.reference}>{reference}</Text> : null}
      <PlaceholderActions actions={actions} />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.l,
  },
  name: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  tag: {
    ...theme.type.label,
    color: theme.color.textSecondary,
    marginTop: -theme.space.m,
  },
  reference: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: -theme.space.m,
  },
  actions: {
    gap: theme.space.s,
    paddingBottom: theme.space.m,
  },
});
