// SPEC-ONLY — SDD §4.1.3 / S-13. No mockup was supplied; built from the shared components in the
// mockups' visual language. One question at a time: what's wrong → describe it → check and send.
// Routed to the Kendra coordinator, escalating if unanswered. Works offline.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, FileText, MapPin, MessageSquareWarning, Route } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import OptionCard from '../../components/ui/OptionCard';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import StepProgress from '../../components/ui/StepProgress';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { GRIEVANCE_CATEGORIES, type GrievanceCategory } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import { raiseGrievance } from '../../services/vanDhanService';
import theme from '../../theme';

const STEPS = 3;
const QUESTION = ['What is wrong?', 'Tell us what happened', 'Check and send'];
const MIN_DESCRIPTION = 10;

export default function RaiseGrievance({ navigation }: VanDhanScreenProps<'VanDhanRaiseGrievance'>) {
  const toast = useToast();
  const profile = useQuery('profile', getProfile);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<GrievanceCategory | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const kendra = profile.data?.kendra;
  const categoryLabel = GRIEVANCE_CATEGORIES.find((c) => c.value === category)?.label ?? '';

  const next = () => {
    if (step === 2 && description.trim().length < MIN_DESCRIPTION) {
      setError('Tell us what happened — ten words or so is enough');
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 1) navigation.goBack();
    else setStep((s) => s - 1);
  };

  const send = async () => {
    if (!category) return;
    setSending(true);
    try {
      const result = await raiseGrievance({ category, description });
      toast.show(
        result.queued
          ? { message: 'Saved on this phone. It sends when you’re back online.', tone: 'queued' }
          : { message: `Grievance raised · ${result.value.reference}`, tone: 'success' }
      );
      navigation.replace('VanDhanGrievanceStatus');
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader layout="inline" title="Raise a Grievance" subtitle="Van Dhan" onBack={back} />}
      footer={
        step < STEPS ? (
          <Button
            label="Continue"
            trailingIcon={ArrowRight}
            onPress={next}
            disabled={step === 1 && !category}
          />
        ) : (
          <Button label="Send grievance" onPress={send} loading={sending} />
        )
      }
      contentStyle={styles.content}
    >
      <StepProgress current={step} total={STEPS} />
      <Text accessibilityRole="header" style={styles.question}>
        {QUESTION[step - 1]}
      </Text>

      {step === 1 ? (
        <View style={styles.options}>
          {GRIEVANCE_CATEGORIES.map((option) => (
            <OptionCard
              key={option.value}
              title={option.label}
              indicator="radio"
              layout="compact"
              selected={category === option.value}
              onPress={() => setCategory(option.value)}
            />
          ))}
        </View>
      ) : null}

      {step === 2 ? (
        <TextField
          icon={FileText}
          placeholder="e.g. I delivered 25 kg of honey on 12 September and haven’t been paid."
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setError(null);
          }}
          multiline
          maxLength={2000}
          showCount
          autoFocus
          error={error}
          helper="Write as much as you need. Mention the date and the collection reference if you have one."
        />
      ) : null}

      {step === 3 ? (
        <>
          <Card style={styles.review}>
            <DetailRow icon={MessageSquareWarning} label="Problem" value={categoryLabel} />
            <DetailRow icon={MapPin} label="Kendra" value={kendra?.name ?? '—'} divider={false} />
            <Text style={styles.description}>{description.trim()}</Text>
          </Card>
          <Banner
            tone="info"
            icon={Route}
            title="Where it goes"
            body="To your Kendra coordinator first. If it isn’t answered in time, it moves to the district implementation unit, then the district nodal officer, then the state Van Dhan cell."
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.l,
  },
  question: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  options: {
    gap: theme.space.s + 2,
  },
  review: {
    paddingVertical: theme.space.xs,
  },
  description: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    paddingVertical: theme.space.m,
  },
});
