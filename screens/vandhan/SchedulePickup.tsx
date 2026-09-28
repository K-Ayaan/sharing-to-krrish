import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import SelectField from '../../components/ui/SelectField';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import TextField from '../../components/ui/TextField';
import { getProfile } from '../../data/mock/mockUser';
import {
  availablePickupDates,
  mockProduce,
  pickupAddressOptions,
  produceUnits,
  requestPickup,
  type ProduceUnit,
} from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatWeekdayDate } from '../formatDate';

const NOTES_MAX_LENGTH = 280;

const produceOptions = mockProduce.map((item) => ({ id: item.id, name: item.name }));

export default function SchedulePickup({ navigation }: VanDhanScreenProps<'SchedulePickup'>) {
  const addresses = useMemo(() => pickupAddressOptions(), []);
  const dates = useMemo(() => availablePickupDates(), []);

  const [addressId, setAddressId] = useState(
    () => addresses.find((option) => option.address.village === getProfile().village)?.id
  );
  const [date, setDate] = useState<string>();
  const [produceId, setProduceId] = useState<string>();
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<ProduceUnit>('kg');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const address = addresses.find((option) => option.id === addressId)?.address;
  // Same quantity rule as LogCollection.
  const amount = Number(quantity.replace(',', '.'));
  const quantityValid = quantity.trim() !== '' && Number.isFinite(amount) && amount > 0;
  const canSubmit = !!address && !!date && !!produceId && quantityValid && !submitting;

  const selectProduce = (id: string) => {
    setProduceId(id);
    const match = mockProduce.find((item) => item.id === id);
    if (match) setUnit(match.rate.unit);
  };

  const selectUnit = (id: string) => {
    const match = produceUnits.find((option) => option.id === id);
    if (match) setUnit(match.id);
  };

  const handleSubmit = async () => {
    if (!address || !date || !produceId || !quantityValid || submitting) return;
    setSubmitting(true);
    try {
      const pickup = await requestPickup({
        address,
        date,
        produceId,
        quantity: amount,
        unit,
        notes: notes.trim() || null,
      });
      // Completing the form replaces it, so back from PickupDetails returns to VanDhanHome.
      navigation.replace('PickupDetails', { pickupId: pickup.id });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <ScenicBackdrop />
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>What is being collected?</Text>
        <SelectField
          icon="leaf"
          iconTinted
          label="Select produce"
          onSelect={selectProduce}
          options={produceOptions}
          placeholder="Choose produce"
          required
          selectedId={produceId}
          sheetTitle="Select produce"
        />
        <View style={styles.quantityRow}>
          <TextField
            error={quantity !== '' && !quantityValid ? 'Enter a quantity above 0.' : undefined}
            icon="cube-outline"
            iconTinted
            keyboardType="decimal-pad"
            label="Quantity"
            onChangeText={setQuantity}
            placeholder="0"
            required
            style={styles.flex}
            value={quantity}
          />
          <View style={styles.unit}>
            <SelectField
              label="Unit"
              onSelect={selectUnit}
              options={produceUnits}
              placeholder="Unit"
              selectedId={unit}
              sheetTitle="Select unit"
            />
          </View>
        </View>
      </Card>

      <Card>
        <SelectField
          icon="home"
          label="Collection address"
          onSelect={setAddressId}
          options={addresses.map((option) => ({
            id: option.id,
            name: `${option.address.village}, ${option.address.district}`,
          }))}
          placeholder="Select village"
          required
          selectedId={addressId}
          sheetTitle="Select village"
        />
      </Card>

      <Card>
        <SelectField
          icon="calendar"
          label="Preferred date"
          onSelect={setDate}
          options={dates.map((iso) => ({ id: iso, name: formatWeekdayDate(iso) }))}
          placeholder="Select date"
          required
          selectedId={date}
          sheetTitle="Preferred date"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Additional notes (optional)</Text>
        <TextField
          accessibilityLabel="Additional notes"
          icon="create-outline"
          maxLength={NOTES_MAX_LENGTH}
          multiline
          onChangeText={setNotes}
          placeholder="Any special instructions…"
          value={notes}
        />
      </Card>

      <View style={styles.spacer} />

      <Button label="Request pickup" icon="car" disabled={!canSubmit} onPress={handleSubmit} />
      <TabBarSpacer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.vandhan.color.background,
  },
  flex: {
    flex: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.s,
  },
  unit: {
    width: theme.space.xl * 3,
  },
  content: {
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  section: {
    gap: theme.space.m,
  },
  sectionTitle: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  spacer: {
    flex: 1,
  },
});
