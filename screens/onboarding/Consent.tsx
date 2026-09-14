import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Checkbox from '../../components/ui/Checkbox';
import { consentDocument, submitRegistration } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout from './OnboardingLayout';

const END_TOLERANCE = theme.space.m;
const SCROLL_THROTTLE_MS = 16;

export default function Consent({ navigation, route }: OnboardingScreenProps<'Consent'>) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);

  // reachedEnd only ever flips to true here: when the visible window touches the
  // end of the copy, or the copy is short enough to fit without scrolling.
  const markEndIfVisible = (offsetY: number) => {
    if (viewportHeight.current === 0 || contentHeight.current === 0) return;
    if (offsetY + viewportHeight.current >= contentHeight.current - END_TOLERANCE) {
      setReachedEnd(true);
    }
  };

  const canAgree = reachedEnd && agreed && !submitting;

  const hint = !reachedEnd
    ? 'Please scroll to the end to enable this button.'
    : !agreed
      ? 'Tick the box above to give your consent.'
      : null;

  const handleAgree = async () => {
    if (!canAgree) return;
    setSubmitting(true);
    try {
      const { uid } = await submitRegistration(route.params.draft);
      navigation.navigate('RegistrationComplete', { uid });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      step={5}
      title="Consent to use your data"
      subtitle="Please read the information below carefully."
      onBack={() => navigation.goBack()}
      scroll={false}
      footer={
        <>
          <Button
            label="I agree"
            trailingIcon="arrow-forward"
            disabled={!canAgree}
            onPress={handleAgree}
          />
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </>
      }
    >
      <Card padded={false} style={styles.document}>
        <ScrollView
          contentContainerStyle={styles.documentContent}
          onContentSizeChange={(_, height) => {
            contentHeight.current = height;
            markEndIfVisible(0);
          }}
          onLayout={(e) => {
            viewportHeight.current = e.nativeEvent.layout.height;
            markEndIfVisible(0);
          }}
          onScroll={(e) => markEndIfVisible(e.nativeEvent.contentOffset.y)}
          scrollEventThrottle={SCROLL_THROTTLE_MS}
        >
          {consentDocument.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </ScrollView>
      </Card>
      <Checkbox
        checked={agreed}
        onChange={setAgreed}
        label="I have read and understood the above and agree to give my consent."
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  document: {
    flex: 1,
  },
  documentContent: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  paragraph: {
    ...theme.type.body,
    color: theme.color.textPrimary,
  },
  hint: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    textAlign: 'center',
  },
});
