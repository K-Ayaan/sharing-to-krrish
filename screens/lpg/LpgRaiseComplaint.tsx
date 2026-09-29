// SPEC-ONLY — SDD §4.3.4 / S-33. No mockup was supplied; built from the shared components in the
// LPG mockups' visual language (blue, like the rest of the pillar). One question at a time:
// what it's about → what's wrong → describe it → check and send. The complaint goes to the
// distributor first and moves to the Federation's LPG Section if it isn't resolved.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, CalendarDays, FileText, MessageSquareWarning, Route } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import OptionCard from '../../components/ui/OptionCard';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StepProgress from '../../components/ui/StepProgress';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { CylinderIcon } from '../../components/ui/icons';
import {
  COMPLAINT_CATEGORIES,
  CYLINDER_LABEL,
  type ComplaintCategory,
  type ComplaintTarget,
} from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { getLpgOverview, raiseComplaint } from '../../services/lpgService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

const STEPS = 4;
const QUESTION = ['What is the complaint about?', 'What is wrong?', 'Tell us what happened', 'Check and send'];
const MIN_DESCRIPTION = 10;
// Older refills are rarely the subject of a complaint; the rest are reachable from Records.
const BOOKINGS_SHOWN = 4;

export default function LpgRaiseComplaint({ navigation, route }: LpgScreenProps<'LpgRaiseComplaint'>) {
  const toast = useToast();
  const overview = useQuery('lpg:overview', getLpgOverview);
  const bookings = (overview.data?.bookings ?? []).slice(0, BOOKINGS_SHOWN);

  const [step, setStep] = useState(1);
  const [target, setTarget] = useState<ComplaintTarget>('booking');
  const [bookingReference, setBookingReference] = useState<string | null>(route.params?.bookingReference ?? null);
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const categoryLabel = COMPLAINT_CATEGORIES.find((c) => c.value === category)?.label ?? '';
  const distributor = overview.data?.connection?.distributor ?? 'your distributor';

  const canContinue =
    step === 1 ? target === 'connection' || bookingReference !== null : step === 2 ? category !== null : true;

  const next = () => {
    if (step === 3 && description.trim().length < MIN_DESCRIPTION) {
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
      const created = await raiseComplaint({
        target,
        bookingReference: target === 'booking' ? bookingReference : null,
        category,
        description,
      });
      toast.show({ message: `Complaint raised · ${created.reference}`, tone: 'success' });
      navigation.replace('LpgMyComplaints');
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen
      background={theme.pillarTint.lpg.canvas}
      header={<ScreenHeader layout="bar" title="Raise a Complaint" onBack={back} />}
      footer={
        step < STEPS ? (
          <Button
            label="Continue"
            trailingIcon={ArrowRight}
            variant="pillar"
            pillarColor="lpg"
            onPress={next}
            disabled={!canContinue}
          />
        ) : (
          <Button label="Send complaint" variant="pillar" pillarColor="lpg" onPress={send} loading={sending} />
        )
      }
      contentStyle={styles.content}
    >
      <StepProgress current={step} total={STEPS} pillar="lpg" />
      <Text accessibilityRole="header" style={styles.question}>
        {QUESTION[step - 1]}
      </Text>

      {step === 1 ? (
        <AsyncContent query={overview} what="your refills" skeleton={<SkeletonCards count={3} height={72} />}>
          {() => (
            <View style={styles.options}>
              <OptionCard
                title="A refill I booked"
                description="Not delivered, delayed, underweight or overcharged"
                indicator="radio"
                layout="compact"
                selected={target === 'booking'}
                onPress={() => setTarget('booking')}
              />
              {target === 'booking' ? (
                <View style={styles.bookings}>
                  {bookings.map((booking) => (
                    <OptionCard
                      key={booking.id}
                      icon={CylinderIcon}
                      title={`${booking.reference} · ${formatDate(booking.bookedAt)}`}
                      description={CYLINDER_LABEL[booking.cylinder]}
                      indicator="radio"
                      layout="compact"
                      selected={bookingReference === booking.reference}
                      onPress={() => setBookingReference(booking.reference)}
                    />
                  ))}
                  {bookings.length === 0 ? (
                    <Text style={styles.note}>You have no refills yet — pick your connection instead.</Text>
                  ) : null}
                </View>
              ) : null}
              <OptionCard
                title="My connection"
                description="Consumer number, distributor or the connection itself"
                indicator="radio"
                layout="compact"
                selected={target === 'connection'}
                onPress={() => setTarget('connection')}
              />
            </View>
          )}
        </AsyncContent>
      ) : null}

      {step === 2 ? (
        <View style={styles.options}>
          {COMPLAINT_CATEGORIES.map((option) => (
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

      {step === 3 ? (
        <TextField
          icon={FileText}
          placeholder="e.g. The cylinder booked on 2 September still hasn’t arrived."
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
          helper="Write as much as you need. Mention the date and the booking reference if you have one."
        />
      ) : null}

      {step === 4 ? (
        <>
          <Card style={styles.review}>
            <DetailRow icon={MessageSquareWarning} label="Problem" value={categoryLabel} />
            <DetailRow
              icon={CalendarDays}
              label="About"
              value={target === 'booking' ? (bookingReference ?? '—') : 'My connection'}
            />
            <DetailRow icon={CylinderIcon} label="Distributor" value={distributor} divider={false} />
            <Text style={styles.description}>{description.trim()}</Text>
          </Card>
          <Banner
            tone="info"
            icon={Route}
            title="Where it goes"
            body={`To ${distributor} first. If it isn’t resolved in 7 days it moves to the Federation’s LPG Section, and you can escalate it yourself from My Complaints.`}
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
  bookings: {
    gap: theme.space.s,
    paddingLeft: theme.space.l,
  },
  note: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.color.textSecondary,
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
