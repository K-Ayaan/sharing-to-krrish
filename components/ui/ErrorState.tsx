// <ErrorState error={query.error} onRetry={query.refetch} />
// SDD S-61: says what happened in plain language, with a way to try again.
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CloudOff, RotateCw, WifiOff } from 'lucide-react-native';
import theme from '../../theme';
import { OfflineError } from '../../services/client';
import Button from './Button';
import IconTile from './IconTile';

export type ErrorStateProps = {
  error: Error;
  onRetry: () => void;
  what?: string;
  style?: ViewStyle;
};

export default function ErrorState({ error, onRetry, what = 'this', style }: ErrorStateProps) {
  const offline = error instanceof OfflineError;
  return (
    <View accessibilityLiveRegion="polite" style={[styles.wrap, style]}>
      <IconTile
        icon={offline ? WifiOff : CloudOff}
        size="xlarge"
        shape="rounded"
        bg={offline ? theme.color.status.pendingBg : theme.color.alert.bg}
        color={offline ? theme.color.status.pendingFg : theme.color.alert.fg}
      />
      <Text accessibilityRole="header" style={styles.title}>
        {offline ? 'You’re offline' : `Couldn’t load ${what}`}
      </Text>
      <Text style={styles.body}>
        {offline
          ? 'Connect to mobile data or Wi‑Fi to load this. Anything you submit offline is kept on this phone and sent when you reconnect.'
          : 'The MARCOFED server didn’t respond. Your information is safe — try again in a moment.'}
      </Text>
      <Button label="Try again" icon={RotateCw} onPress={onRetry} variant="secondary" size="medium" style={styles.action} />
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
    minWidth: 180,
  },
});
