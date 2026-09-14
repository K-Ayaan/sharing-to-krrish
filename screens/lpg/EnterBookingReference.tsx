import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import FilterChip from '../../components/ui/FilterChip';
import TextField from '../../components/ui/TextField';
import { submitBookingReference, type Urgency } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { urgencyOptions } from './lpgFormat';

const REFERENCE_PATTERN = /^[A-Z0-9]{6,10}$/;
const REFERENCE_INPUT_MAX_LENGTH = 12;

function validateReference(reference: string) {
  if (!reference) return 'Booking reference is required.';
  if (!REFERENCE_PATTERN.test(reference)) return 'Use the 6–10 letter or number code from your SMS.';
  return undefined;
}

export default function EnterBookingReference({ navigation }: LpgScreenProps<'EnterBookingReference'>) {
  const [reference, setReference] = useState('');
  const [touched, setTouched] = useState(false);
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [submitting, setSubmitting] = useState(false);

  const normalized = reference.replace(/\s/g, '').toUpperCase();
  const error = validateReference(normalized);

  const handleSubmit = async () => {
    setTouched(true);
    if (error || submitting) return;
    setSubmitting(true);
    try {
      const request = await submitBookingReference({ bookingReference: normalized, urgency });
      // Completing the form replaces it (flow.md), so back from RequestStatus returns to LpgHome.
      navigation.replace('RequestStatus', { requestId: request.id });
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
      <Text style={styles.secondary}>
        Enter the reference code from the SMS sent by IOCL after your missed call.
      </Text>

      <View style={styles.group}>
        <TextField
          autoCapitalize="characters"
          autoCorrect={false}
          error={touched ? error : undefined}
          icon="document-text-outline"
          label="Booking reference"
          maxLength={REFERENCE_INPUT_MAX_LENGTH}
          onBlur={() => setTouched(true)}
          onChangeText={setReference}
          onSubmitEditing={handleSubmit}
          placeholder="e.g. 6J7K9L2"
          required
          returnKeyType="done"
          value={reference}
        />
        <Text style={styles.hint}>This is usually a 6–10 character code from your SMS.</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Urgency</Text>
        {/* Two FilterChips read as a segmented control; no new component needed. */}
        <View style={styles.segment}>
          {urgencyOptions.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              selected={urgency === option.id}
              onPress={() => setUrgency(option.id)}
              style={styles.segmentOption}
            />
          ))}
        </View>
        <Text style={styles.hint}>Select Urgent only if you need an earlier delivery.</Text>
      </View>

      <View style={styles.spacer} />

      <Button
        label="Submit"
        trailingIcon="arrow-forward"
        disabled={!!error || submitting}
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
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.l,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  group: {
    gap: theme.space.s,
  },
  label: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  hint: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  segment: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  segmentOption: {
    flex: 1,
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
});
