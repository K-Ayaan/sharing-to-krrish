// vandhan-submit-collection.png, completed against SDD S-11/S-16: the Kendra it goes to, today's
// rate for an estimate, and a read-back before sending ("a wrong entry has to be corrected at the
// Kendra"). Works offline — the entry waits on the phone and sends when the network returns.
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  ArrowRight,
  CalendarDays,
  Clock,
  FileText,
  Leaf,
  MapPin,
  Medal,
  Scale,
  Truck,
} from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import DetailRow from '../../components/ui/DetailRow';
import OptionCard from '../../components/ui/OptionCard';
import PickerField from '../../components/ui/PickerField';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import SelectField from '../../components/ui/SelectField';
import { SkeletonList } from '../../components/ui/Skeleton';
import TextField, { FieldTrailingText } from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import ErrorState from '../../components/ui/ErrorState';
import type { DeliveryType } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import { getRates, submitCollection, validateCollection, type CollectionInput } from '../../services/vanDhanService';
import theme from '../../theme';
import { formatDate, formatDateTime, formatINR, formatQuantity, formatTime } from '../../utils/format';

const NOTES_LIMIT = 500;

type FieldErrors = Partial<Record<keyof CollectionInput, string>>;

export default function SubmitCollection({ navigation, route }: VanDhanScreenProps<'SubmitCollection'>) {
  const toast = useToast();
  const rates = useQuery('vandhan:rates', getRates);
  const profile = useQuery('profile', getProfile);

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('today');
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [produceId, setProduceId] = useState<string | null>(route.params?.produceId ?? null);
  const [grade, setGrade] = useState<string | null>(null);
  const [quantityText, setQuantityText] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);

  const produce = rates.data?.find((item) => item.id === produceId) ?? null;
  const quantity = Number(quantityText.replace(/,/g, ''));
  const kendraName = profile.data?.kendra.name ?? 'your Kendra';

  const input: CollectionInput = {
    produceId: produceId ?? '',
    grade: grade ?? '',
    quantity,
    deliveryType,
    scheduledFor: deliveryType === 'scheduled' && scheduledFor ? scheduledFor.toISOString() : null,
    notes,
  };

  const estimate = useMemo(
    () => (produce && quantity > 0 ? produce.rate * quantity : null),
    [produce, quantity]
  );

  const clear = (field: keyof CollectionInput) => setErrors((current) => ({ ...current, [field]: undefined }));

  const pickDate = () => {
    const base = scheduledFor ?? new Date(Date.now() + 24 * 60 * 60 * 1000);
    DateTimePickerAndroid.open({
      value: base,
      mode: 'date',
      minimumDate: new Date(),
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return;
        const next = new Date(base);
        next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        if (!scheduledFor) next.setHours(10, 0, 0, 0);
        setScheduledFor(next);
        clear('scheduledFor');
      },
    });
  };

  const pickTime = () => {
    const base = scheduledFor ?? new Date(Date.now() + 24 * 60 * 60 * 1000);
    DateTimePickerAndroid.open({
      value: base,
      mode: 'time',
      is24Hour: false,
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return;
        const next = new Date(base);
        next.setHours(date.getHours(), date.getMinutes(), 0, 0);
        setScheduledFor(next);
        clear('scheduledFor');
      },
    });
  };

  const review = () => {
    const found = validateCollection(input);
    setErrors(found);
    if (Object.keys(found).length === 0) setConfirming(true);
  };

  const send = async () => {
    setSending(true);
    try {
      const result = await submitCollection(input);
      setConfirming(false);
      if (result.queued) {
        toast.show({ message: 'Saved on this phone. It sends when you’re back online.', tone: 'queued' });
      } else {
        toast.show({ message: `Collection submitted · ${result.value.reference}`, tone: 'success' });
      }
      // The filled-in form is finished — land on My Collections, not back in the form.
      navigation.popTo('VanDhanHub', { tab: 'collections' });
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSending(false);
    }
  };

  const deliveryLabel =
    deliveryType === 'today' ? `Today, at ${kendraName}` : scheduledFor ? formatDateTime(scheduledFor.toISOString()) : '—';

  return (
    <Screen
      header={
        <ScreenHeader
          layout="inline"
          onBack={navigation.goBack}
          title="Submit Collection"
          subtitle="Share the details of your collection"
          landscape="green"
        />
      }
      contentStyle={styles.content}
    >
      {!rates.data ? (
        rates.error ? (
          <ErrorState error={rates.error} onRetry={rates.refetch} what="the produce list" />
        ) : (
          <SkeletonList count={4} thumb={44} lines={2} />
        )
      ) : (
        <>
          <SectionHeader
            title="Delivery Type"
            required
            subtitle="Choose when you want to deliver your collection."
          />
          <View style={styles.choiceRow}>
            <OptionCard
              layout="compact"
              indicator="radio"
              icon={Truck}
              title="Deliver Today"
              description="I will deliver to the Kendra today"
              selected={deliveryType === 'today'}
              onPress={() => {
                setDeliveryType('today');
                clear('scheduledFor');
              }}
              style={styles.choice}
            />
            <OptionCard
              layout="compact"
              indicator="radio"
              icon={CalendarDays}
              title="Schedule Delivery"
              description="Choose a date and time for later"
              selected={deliveryType === 'scheduled'}
              onPress={() => setDeliveryType('scheduled')}
              style={styles.choice}
            />
          </View>
          <View style={styles.choiceRow}>
            <PickerField
              icon={CalendarDays}
              label="Select Date"
              placeholder="Choose date"
              value={scheduledFor ? formatDate(scheduledFor.toISOString()) : null}
              onPress={pickDate}
              disabled={deliveryType !== 'scheduled'}
              error={!!errors.scheduledFor}
              style={styles.choice}
            />
            <PickerField
              icon={Clock}
              label="Select Time"
              placeholder="Choose time"
              value={scheduledFor ? formatTime(scheduledFor.toISOString()) : null}
              onPress={pickTime}
              disabled={deliveryType !== 'scheduled'}
              error={!!errors.scheduledFor}
              style={styles.choice}
            />
          </View>
          {errors.scheduledFor ? <Text style={styles.error}>{errors.scheduledFor}</Text> : null}
          <View style={styles.kendra}>
            <MapPin size={15} color={theme.color.textSecondary} strokeWidth={2} />
            <Text style={styles.kendraText}>
              Delivering to <Text style={styles.kendraName}>{kendraName}</Text>
            </Text>
          </View>

          <View style={styles.divider} />

          <SectionHeader title="Product Details" required subtitle="Tell us more about the product you are submitting." />
          <SelectField
            icon={Leaf}
            label="Select Product"
            required
            placeholder="Choose produce"
            sheetTitle="Select product"
            value={produceId}
            options={rates.data.map((item) => ({
              value: item.id,
              label: item.name,
              description: `${formatINR(item.rate)} per ${item.unit}`,
            }))}
            onChange={(value) => {
              setProduceId(value);
              clear('produceId');
            }}
            error={errors.produceId}
          />
          <SelectField
            icon={Medal}
            label="Grade/Quality"
            required
            placeholder="Choose grade"
            sheetTitle="Grade / quality"
            sheetSubtitle="The Kendra confirms the grade when it checks your produce."
            value={grade}
            options={(produce?.grades ?? ['A Grade', 'B Grade', 'C Grade']).map((g) => ({ value: g, label: g }))}
            onChange={(value) => {
              setGrade(value);
              clear('grade');
            }}
            error={errors.grade}
          />

          <View style={styles.divider} />

          <SectionHeader title="Quantity" required subtitle="Enter the total quantity of your collection." />
          <TextField
            icon={Scale}
            label="Quantity"
            required
            placeholder="0"
            value={quantityText}
            onChangeText={(text) => {
              setQuantityText(text.replace(/[^\d.]/g, ''));
              clear('quantity');
            }}
            keyboardType="decimal-pad"
            maxLength={7}
            trailing={<FieldTrailingText>{produce?.unit ?? 'kg'}</FieldTrailingText>}
            error={errors.quantity}
            helper={
              estimate && produce
                ? `About ${formatINR(estimate)} at today’s rate of ${formatINR(produce.rate)} per ${produce.unit}`
                : undefined
            }
          />

          <View style={styles.divider} />

          <SectionHeader
            title="Additional Info"
            optionalHint="(Optional)"
            subtitle="Add any additional details (e.g. source location, notes)."
          />
          <TextField
            icon={FileText}
            placeholder="e.g. collection site, forest area, special notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={NOTES_LIMIT}
            showCount
          />

          <Button label="Submit Collection" trailingIcon={ArrowRight} onPress={review} style={styles.submit} />
        </>
      )}

      <BottomSheet
        visible={confirming}
        onClose={() => setConfirming(false)}
        title="Check before you send"
        footer={
          <>
            <Button label="Confirm and send" onPress={send} loading={sending} />
            <Button label="Edit" variant="text" onPress={() => setConfirming(false)} />
          </>
        }
      >
        <Banner
          tone="info"
          title="Read this back before you confirm"
          body="A wrong entry has to be corrected at the Kendra."
        />
        <View style={styles.readBack}>
          <DetailRow icon={Leaf} label="Produce" value={produce?.name ?? '—'} />
          <DetailRow icon={Medal} label="Grade" value={grade ?? '—'} />
          <DetailRow
            icon={Scale}
            label="Quantity"
            value={produce && quantity ? formatQuantity(quantity, produce.unit) : '—'}
          />
          <DetailRow icon={Truck} label="Delivery" value={deliveryLabel} />
          <DetailRow icon={MapPin} label="Kendra" value={kendraName} divider={false} />
        </View>
        {profile.data ? <Text style={styles.sentUnder}>Sent under MARCOFED ID {profile.data.uid}</Text> : null}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: theme.space.m,
  },
  choice: {
    flex: 1,
  },
  error: {
    ...theme.type.caption,
    color: theme.color.alert.fg,
  },
  kendra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  kendraText: {
    ...theme.type.caption,
    fontSize: 13,
    color: theme.color.textSecondary,
  },
  kendraName: {
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.borderStrong,
    marginVertical: theme.space.s,
  },
  submit: {
    marginTop: theme.space.m,
  },
  readBack: {
    marginTop: theme.space.s,
  },
  sentUnder: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: theme.space.s,
  },
});
