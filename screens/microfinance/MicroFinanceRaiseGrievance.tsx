// SPEC-ONLY — SDD S-54. No mockup was supplied. Two steps: what went wrong → describe it, then
// send. Grievances sit with the Federation's Micro-Finance cell and are listed back on the
// application screen.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, FileText, Route } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import OptionCard from '../../components/ui/OptionCard';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import StepProgress from '../../components/ui/StepProgress';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { MF_GRIEVANCE_CATEGORIES } from '../../data/mock/mockMicroFinance';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { raiseMfGrievance } from '../../services/microFinanceService';
import theme from '../../theme';

const STEPS = 2;
const QUESTION = ['What went wrong?', 'Tell us what happened'];
const MIN_DESCRIPTION = 10;

type Category = (typeof MF_GRIEVANCE_CATEGORIES)[number]['value'];

export default function MicroFinanceRaiseGrievance({
  navigation,
}: MicroFinanceScreenProps<'MicroFinanceRaiseGrievance'>) {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const title = MF_GRIEVANCE_CATEGORIES.find((c) => c.value === category)?.label ?? '';

  const back = () => {
    if (step === 1) navigation.goBack();
    else setStep((s) => s - 1);
  };

  const send = async () => {
    if (description.trim().length < MIN_DESCRIPTION) {
      setError('Tell us what happened — ten words or so is enough');
      return;
    }
    setSending(true);
    try {
      const created = await raiseMfGrievance({ title, description });
      toast.show({ message: `Grievance raised · ${created.reference}`, tone: 'success' });
      navigation.replace('MicroFinanceApplicationStatus');
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader layout="bar" title="Raise a Grievance" onBack={back} />}
      footer={
        step < STEPS ? (
          <Button
            label="Continue"
            trailingIcon={ArrowRight}
            onPress={() => setStep(2)}
            disabled={!category}
          />
        ) : (
          <Button label="Send grievance" onPress={send} loading={sending} />
        )
      }
      contentStyle={styles.content}
    >
      <StepProgress current={step} total={STEPS} pillar="microfinance" />
      <Text accessibilityRole="header" style={styles.question}>
        {QUESTION[step - 1]}
      </Text>

      {step === 1 ? (
        <View style={styles.options}>
          {MF_GRIEVANCE_CATEGORIES.map((option) => (
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
      ) : (
        <>
          <TextField
            icon={FileText}
            placeholder="e.g. My society certificate was rejected and no reason was given."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setError(null);
            }}
            multiline
            maxLength={2000}
            showCount
            autoFocus
            error={error ?? undefined}
            helper="Write as much as you need. Mention your application reference if you have one."
          />
          <Banner
            tone="info"
            icon={Route}
            title="Where it goes"
            body="To the Federation's Micro-Finance cell. You can follow it from your application screen."
          />
        </>
      )}
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
});
