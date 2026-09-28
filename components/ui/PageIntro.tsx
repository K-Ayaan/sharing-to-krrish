// <PageIntro text="Select a category for your issue." art={<DocumentIllustration badge="alert" />} />
import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type PageIntroProps = {
  text: string;
  /** Illustration on the right. */
  art?: ReactNode;
  style?: ViewStyle;
};

// The subtitle line under a native large title, with the screen's illustration beside it (LPG's
// inner screens keep the iOS large title, so the reference images' in-page title becomes this row).
export default function PageIntro({ text, art, style }: PageIntroProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.text}>{text}</Text>
      {art}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  text: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textSecondary,
    flex: 1,
  },
});
