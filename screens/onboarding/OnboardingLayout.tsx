import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppearanceProvider } from '../../components/ui/Appearance';
import Landscape from '../../components/ui/Landscape';
import OnboardingBackdrop from '../../components/ui/OnboardingBackdrop';
import StepProgress from '../../components/ui/StepProgress';
import theme from '../../theme';

/** Numbered steps: PhoneEntry through Consent. RegistrationComplete is the outcome, not a step. */
export const ONBOARDING_STEPS = 6;

const HEADER_TITLE = 'Create your account';
const GUTTER = theme.space.m + theme.space.xs;
/** Smallest slice of the landscape kept on screen when the keyboard or content leaves little room. */
const SCENERY_MIN_HEIGHT = theme.space.xl * 3;

const { color } = theme.onboarding;

type OnboardingLayoutProps = {
  /** 1-based; omit on a screen outside the numbered steps to drop the header and progress bar. */
  step?: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hero?: ReactNode;
  centered?: boolean;
  footer?: ReactNode;
  overlay?: ReactNode;
  children?: ReactNode;
};

// Shared frame for the six onboarding steps and RegistrationComplete (green-on-sage redesign): leafy backdrop, the
// "Create your account" header with its progress bar, the step's content, and the landscape
// between the content and the footer. Layout only — every visual piece comes from components/ui,
// and the AppearanceProvider switches those components to the onboarding palette.
export default function OnboardingLayout({
  step,
  title,
  subtitle,
  onBack,
  hero,
  centered = false,
  footer,
  overlay,
  children,
}: OnboardingLayoutProps) {
  return (
    <AppearanceProvider appearance="onboarding">
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <OnboardingBackdrop />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          {step !== undefined ? (
            <StepProgress
              step={step}
              total={ONBOARDING_STEPS}
              onBack={onBack}
              title={HEADER_TITLE}
              style={styles.progress}
            />
          ) : null}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
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
            </View>
            {/* Fills whatever height is left; when there's less than the full scene it crops the
                top (sky) so the houses and meadow stay visible above the footer. */}
            <View style={styles.scenery}>
              <Landscape />
            </View>
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </KeyboardAvoidingView>
        {overlay}
      </SafeAreaView>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.background,
  },
  flex: {
    flex: 1,
  },
  progress: {
    paddingHorizontal: theme.space.m,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.space.l,
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
    ...theme.onboarding.type.title,
    color: color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize + 1,
    color: color.textSecondary,
  },
  textCentered: {
    textAlign: 'center',
  },
  scenery: {
    flexGrow: 1,
    minHeight: SCENERY_MIN_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginTop: theme.space.m,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: theme.space.s,
    paddingBottom: theme.space.m,
    gap: theme.space.s,
  },
});
