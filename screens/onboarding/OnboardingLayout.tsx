import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepProgress from '../../components/ui/StepProgress';
import theme from '../../theme';

export const ONBOARDING_STEPS = 6;

type OnboardingLayoutProps = {
  step: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hero?: ReactNode;
  centered?: boolean;
  /** Set false when the body manages its own scrolling. */
  scroll?: boolean;
  footer?: ReactNode;
  overlay?: ReactNode;
  children?: ReactNode;
};

// Shared frame for the six onboarding steps. Layout only — every visual piece
// inside it comes from components/ui.
export default function OnboardingLayout({
  step,
  title,
  subtitle,
  onBack,
  hero,
  centered = false,
  scroll = true,
  footer,
  overlay,
  children,
}: OnboardingLayoutProps) {
  const body = (
    <>
      {hero ? <View style={styles.hero}>{hero}</View> : null}
      <View style={[styles.heading, centered && styles.centered]}>
        <Text accessibilityRole="header" style={[styles.title, centered && styles.textCentered]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, centered && styles.textCentered]}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </>
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <StepProgress
          step={step}
          total={ONBOARDING_STEPS}
          onBack={onBack}
          style={styles.progress}
        />
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.flex}
            contentContainerStyle={styles.content}
          >
            {body}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content]}>{body}</View>
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
      {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  flex: {
    flex: 1,
  },
  progress: {
    paddingHorizontal: theme.space.m,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.l,
  },
  hero: {
    alignItems: 'center',
  },
  heading: {
    gap: theme.space.s,
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textSecondary,
  },
  textCentered: {
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.s,
    paddingBottom: theme.space.m,
    gap: theme.space.s,
  },
});
