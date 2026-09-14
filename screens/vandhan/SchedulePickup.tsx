import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import { mockUser } from '../../data/mock/mockUser';
import {
  availablePickupDates,
  pickupAddressOptions,
  requestPickup,
} from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatWeekdayDate } from '../formatDate';

const NOTES_MAX_LENGTH = 280;

export default function SchedulePickup({ navigation }: VanDhanScreenProps<'SchedulePickup'>) {
  const addresses = useMemo(() => pickupAddressOptions(), []);
  const dates = useMemo(() => availablePickupDates(), []);

  const [addressId, setAddressId] = useState(
    () => addresses.find((option) => option.address.village === mockUser.village)?.id
  );
  const [date, setDate] = useState<string>();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const address = addresses.find((option) => option.id === addressId)?.address;
  const canSubmit = !!address && !!date && !submitting;

  const handleSubmit = async () => {
    if (!address || !date || submitting) return;
    setSubmitting(true);
    try {
      const pickup = await requestPickup({ address, date, notes: notes.trim() || null });
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.color.background,
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
