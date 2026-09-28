import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConsentCard from '../../components/ui/ConsentCard';
import { ConsentItem, consentDocument, submitRegistration } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout from './OnboardingLayout';

const { color } = theme.onboarding;

type Consents = Record<ConsentItem['id'], boolean>;

const NONE_GIVEN = Object.fromEntries(consentDocument.items.map((item) => [item.id, false])) as Consents;

// Step 6. Each consent statement is ticked on its own card; every one is required to continue.
export default function Consent({ navigation, route }: OnboardingScreenProps<'Consent'>) {
  const { draft } = route.params;
  const [consents, setConsents] = useState<Consents>(NONE_GIVEN);
  const [submitting, setSubmitting] = useState(false);

  const allGiven = consentDocument.items.every((item) => consents[item.id]);
  const canContinue = allGiven && !submitting;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    try {
      // Registration maps the new account to the verified Aadhaar reference.
      const { uid } = await submitRegistration(draft);
      navigation.navigate('RegistrationComplete', {
        uid,
        maskedAadhaar: draft.identity.maskedAadhaar,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      step={6}
      title="Consent for use"
      subtitle="We use your information to create your MARCOFED account and provide you with government and cooperative services."
      onBack={() => navigation.goBack()}
      footer={
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!canContinue}
          onPress={handleContinue}
        />
      }
    >
      <View style={styles.cards}>
        {consentDocument.items.map((item) => (
          <ConsentCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
            checked={consents[item.id]}
            onChange={(checked) => setConsents((current) => ({ ...current, [item.id]: checked }))}
          />
        ))}
        <Card tone="info" style={styles.note}>
          <Avatar icon="information-circle" />
          <Text style={styles.noteText}>{consentDocument.note}</Text>
        </Card>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: theme.space.m,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
  },
  noteText: {
    ...theme.type.body,
    color: color.textSecondary,
    flex: 1,
  },
});
