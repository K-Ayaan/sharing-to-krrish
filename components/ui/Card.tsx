// <Card tone="danger"><Text>…</Text></Card>
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type CardTone = 'default' | 'info' | 'warning' | 'danger';

export type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  /** Set false when the content (e.g. a ListRow) brings its own padding. */
  padded?: boolean;
  style?: ViewStyle;
};

const TONE_BACKGROUNDS: Record<CardTone, string> = {
  default: theme.color.surface,
  info: theme.color.primaryTint,
  warning: theme.color.warningTint,
  danger: theme.color.dangerTint,
};

export default function Card({ children, tone = 'default', padded = true, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: TONE_BACKGROUNDS[tone] },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.border,
    overflow: 'hidden',
  },
  padded: {
    padding: theme.space.m,
  },
});
