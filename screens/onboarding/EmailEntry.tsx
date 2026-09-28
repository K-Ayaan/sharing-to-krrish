import { useState } from 'react';
import { LayoutAnimation, StyleSheet, Text } from 'react-native';
import Button from '../../components/ui/Button';
import InfoToggle from '../../components/ui/InfoToggle';
import TextField from '../../components/ui/TextField';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout from './OnboardingLayout';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email) return 'Email address is required.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return undefined;
}

export default function EmailEntry({ navigation, route }: OnboardingScreenProps<'EmailEntry'>) {
  const { identity, phone } = route.params;
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const trimmed = email.trim();
  const error = validateEmail(trimmed);

  const handleContinue = () => {
    setTouched(true);
    if (error) return;
    navigation.navigate('ProfileDetails', { identity, phone, email: trimmed });
  };

  const toggleWhy = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWhyOpen((open) => !open);
  };

  return (
    <OnboardingLayout
      step={4}
      title="Your email address"
      onBack={() => navigation.goBack()}
      footer={
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!!error}
          onPress={handleContinue}
        />
      }
    >
      <TextField
        accessibilityLabel="Email address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        autoFocus
        error={touched ? error : undefined}
        icon="mail-outline"
        keyboardType="email-address"
        onBlur={() => setTouched(true)}
        onChangeText={setEmail}
        onSubmitEditing={handleContinue}
        placeholder="you@example.com"
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />

      <InfoToggle label="Why do we need this?" expanded={whyOpen} onPress={toggleWhy} />
      {whyOpen ? (
        <Text style={styles.why}>We'll send confirmations and service updates here.</Text>
      ) : null}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  why: {
    ...theme.type.body,
    color: theme.onboarding.color.textSecondary,
    marginTop: -theme.space.s,
  },
});
