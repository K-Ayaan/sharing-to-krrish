// SPEC-ONLY — SDD S-50. No mockup was supplied. One question at a time: what the money is for →
// how much and for how long → check and send. Amounts are validated against the scheme ceiling;
// nothing here sanctions a loan.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, CalendarClock, IndianRupee, Info, Target } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import OptionCard from '../../components/ui/OptionCard';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SegmentedControl from '../../components/ui/SegmentedControl';
import StepProgress from '../../components/ui/StepProgress';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { LOAN_PURPOSES, MAX_LOAN_AMOUNT, TENURES, type LoanPurpose } from '../../data/mock/mockMicroFinance';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { applyForLoan, validateAmount } from '../../services/microFinanceService';
import theme from '../../theme';
import { formatINR, groupIndian } from '../../utils/format';

const STEPS = 3;
const QUESTION = ['What is the money for?', 'How much, and for how long?', 'Check and send'];

export default function MicroFinanceApply({ navigation }: MicroFinanceScreenProps<'MicroFinanceApply'>) {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<LoanPurpose | null>(null);
  const [amountText, setAmountText] = useState('');
  const [tenure, setTenure] = useState<(typeof TENURES)[number]>(12);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const amount = Number(amountText.replace(/[^0-9]/g, ''));
  const purposeLabel = LOAN_PURPOSES.find((p) => p.value === purpose)?.label ?? '';
  // Indicative only — the real instalment depends on terms the lending partner sets.
  const monthly = amount > 0 ? Math.round(amount / tenure) : 0;

  const next = () => {
    if (step === 2) {
      const amountError = validateAmount(amount);
      if (amountError) {
        setError(amountError);
        return;
      }
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 1) navigation.goBack();
    else setStep((s) => s - 1);
  };

  const send = async () => {
    if (!purpose) return;
    setSending(true);
    try {
      const created = await applyForLoan({ purpose, amount, tenureMonths: tenure });
      toast.show({ message: `Application sent · ${created.reference}`, tone: 'success' });
      navigation.replace('MicroFinanceDocuments');
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader layout="bar" title="Apply" onBack={back} />}
      footer={
        step < STEPS ? (
          <Button
            label="Continue"
            trailingIcon={ArrowRight}
            onPress={next}
            disabled={step === 1 && !purpose}
          />
        ) : (
          <Button
            label="Send application"
            onPress={send}
            loading={sending}
          />
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
          {LOAN_PURPOSES.map((option) => (
            <OptionCard
              key={option.value}
              title={option.label}
              indicator="radio"
              layout="compact"
              selected={purpose === option.value}
              onPress={() => setPurpose(option.value)}
            />
          ))}
        </View>
      ) : null}

      {step === 2 ? (
        <>
          <TextField
            label="Amount needed"
            labelPosition="above"
            icon={IndianRupee}
            placeholder="50,000"
            value={amountText}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              setAmountText(digits ? groupIndian(Number(digits)) : '');
              setError(null);
            }}
            keyboardType="number-pad"
            error={error ?? undefined}
            helper={`Between ₹5,000 and ${formatINR(MAX_LOAN_AMOUNT)}`}
            autoFocus
          />
          <View>
            <Text style={styles.fieldLabel}>Repayment period</Text>
            <SegmentedControl
              value={String(tenure)}
              segments={TENURES.map((months) => ({ value: String(months), label: `${months} months` }))}
              onChange={(value) => setTenure(Number(value) as (typeof TENURES)[number])}
            />
          </View>
          {amount > 0 ? (
            <Card tone="microfinance">
              <Text style={styles.estimateLabel}>Roughly per month</Text>
              <Text style={styles.estimate}>{formatINR(monthly)}</Text>
              <Text style={styles.estimateNote}>
                Before any interest or fees. The lending partner sets the real instalment.
              </Text>
            </Card>
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Card style={styles.review}>
            <DetailRow icon={Target} label="Purpose" value={purposeLabel} />
            <DetailRow icon={IndianRupee} label="Amount" value={formatINR(amount)} />
            <DetailRow icon={CalendarClock} label="Repayment period" value={`${tenure} months`} divider={false} />
          </Card>
          <Banner
            tone="info"
            icon={Info}
            title="What happens next"
            body="Your society is asked to recommend you, and you’ll be asked for documents. This application does not sanction or promise a loan."
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
  fieldLabel: {
    ...theme.type.label,
    color: theme.color.textSecondary,
    marginBottom: theme.space.s,
  },
  estimateLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  estimate: {
    ...theme.type.largeTitle,
    fontSize: 24,
    lineHeight: 31,
    color: theme.color.textPrimary,
  },
  estimateNote: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    marginTop: 2,
  },
  review: {
    paddingVertical: theme.space.xs,
  },
});
