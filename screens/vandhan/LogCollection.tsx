import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import OptionCard from '../../components/ui/OptionCard';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import {
  logCollection,
  mockProduce,
  produceUnits,
  type CollectionType,
  type ProduceUnit,
} from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';

const NOTE_MAX_LENGTH = 280;

const produceOptions = mockProduce.map((item) => ({ id: item.id, name: item.name }));

export default function LogCollection({ navigation }: VanDhanScreenProps<'LogCollection'>) {
  const [type, setType] = useState<CollectionType>('bringing_now');
  const [produceId, setProduceId] = useState<string>();
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<ProduceUnit>('kg');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const amount = Number(quantity.replace(',', '.'));
  const quantityValid = quantity.trim() !== '' && Number.isFinite(amount) && amount > 0;
  const canSubmit = !!produceId && quantityValid && !submitting;

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
    if (!produceId || !quantityValid || submitting) return;
    setSubmitting(true);
    try {
      await logCollection({ type, produceId, quantity: amount, unit, note: note.trim() || null });
      // popTo takes the form out of history; VanDhanHome shows the Toast and clears the param.
      navigation.popTo('VanDhanHome', { confirmation: 'collection_logged' });
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
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>1. Collection type</Text>
        <View style={styles.options}>
          <OptionCard
            icon="car"
            title="I'm bringing this now"
            description="Produce is with me and will be delivered at the kendra."
            selected={type === 'bringing_now'}
            onPress={() => setType('bringing_now')}
          />
          <OptionCard
            icon="calendar-outline"
            title="Pre-logging for later"
            description="Record this now, I will deliver it later."
            selected={type === 'pre_logged'}
            onPress={() => setType('pre_logged')}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>2. Produce details</Text>
        <SelectField
          icon="leaf"
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
            icon="scale-outline"
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

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>3. Additional information (optional)</Text>
        <TextField
          accessibilityLabel="Note"
          icon="create-outline"
          maxLength={NOTE_MAX_LENGTH}
          multiline
          onChangeText={setNote}
          placeholder="Add a note (e.g. quality, grade)…"
          value={note}
        />
      </Card>

      <Button
        label="Submit collection"
        icon="document-attach"
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  section: {
    gap: theme.space.m,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  options: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.s,
  },
  unit: {
    width: theme.space.xl * 3,
  },
});
