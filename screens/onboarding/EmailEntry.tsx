import { useState } from 'react';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import type { OnboardingScreenProps } from '../../navigation/types';
import OnboardingLayout from './OnboardingLayout';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email) return 'Email address is required.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return undefined;
}

export default function EmailEntry({ navigation, route }: OnboardingScreenProps<'EmailEntry'>) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const trimmed = email.trim();
  const error = validateEmail(trimmed);

  const handleContinue = () => {
    setTouched(true);
    if (error) return;
    navigation.navigate('ProfileDetails', { phone: route.params.phone, email: trimmed });
  };

  return (
    <OnboardingLayout
      step={3}
      title="Enter your email address"
      subtitle="Used to recover your account if your phone number changes."
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
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        autoFocus
        error={touched ? error : undefined}
        icon="mail-outline"
        keyboardType="email-address"
        label="Email address"
        onBlur={() => setTouched(true)}
        onChangeText={setEmail}
        onSubmitEditing={handleContinue}
        placeholder="you@example.com"
        required
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />
    </OnboardingLayout>
  );
}
