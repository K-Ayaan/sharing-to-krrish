import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DocumentIllustration from '../../components/ui/DocumentIllustration';
import FilterChip from '../../components/ui/FilterChip';
import PageIntro from '../../components/ui/PageIntro';
import PhotoPicker from '../../components/ui/PhotoPicker';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import SelectField from '../../components/ui/SelectField';
import { useTabBarInset } from '../../components/ui/TabBarSpacer';
import TextField from '../../components/ui/TextField';
import {
  complaintCategories,
  getRequest,
  submitComplaint,
  type ComplaintCategoryId,
  type ContactMethod,
} from '../../data/mock/mockLpg';
import { COUNTRY_CODE, PHONE_LENGTH } from '../../data/mock/mockOnboarding';
import { getProfile } from '../../data/mock/mockUser';
import { completeForm } from '../../navigation/completeForm';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhone } from '../onboarding/formatPhone';
import { validateContactPhone } from '../profileValidation';
import { useKeyboardOverlap } from '../useKeyboardOverlap';
import { normalizeBookingReference, validateBookingReference } from './lpgFormat';

const DESCRIPTION_MAX_LENGTH = 500;
const REFERENCE_INPUT_MAX_LENGTH = 12;
const MAX_PHOTOS = 3;

const { color } = theme.lpg;

const CONTACT_METHODS: { id: ContactMethod; label: string; icon: 'call' | 'chatbubble-ellipses-outline' }[] = [
  { id: 'call', label: 'Phone call', icon: 'call' },
  { id: 'sms', label: 'SMS', icon: 'chatbubble-ellipses-outline' },
];

const categoryOptions = complaintCategories.map((category) => ({ id: category.id, name: category.name }));

// Second step of the complaint form. The category chosen on ComplaintCategory can be changed here;
// the booking reference is prefilled when the complaint starts from a request, and the contact
// number from the profile.
export default function ComplaintDetails({ navigation, route }: LpgScreenProps<'ComplaintDetails'>) {
  const { requestId } = route.params;
  const [categoryId, setCategoryId] = useState<ComplaintCategoryId>(route.params.categoryId);
  const [reference, setReference] = useState(() => (requestId ? getRequest(requestId)?.bookingReference : '') ?? '');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('call');
  const [phone, setPhone] = useState(() => getProfile().phone);
  const [touched, setTouched] = useState({ reference: false, description: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const screenRef = useRef<View>(null);
  const keyboardOverlap = useKeyboardOverlap(screenRef);
  const tabBarInset = useTabBarInset();

  const normalizedReference = normalizeBookingReference(reference);
  const trimmedDescription = description.trim();
  const errors = {
    reference: validateBookingReference(normalizedReference, { optional: true }),
    description: trimmedDescription ? undefined : 'Describe the issue.',
    phone: validateContactPhone(phone),
  };
  const valid = !errors.reference && !errors.description && !errors.phone;

  const handleSubmit = async () => {
    setTouched({ reference: true, description: true, phone: true });
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const complaint = await submitComplaint({
        categoryId,
        description: trimmedDescription,
        requestId: requestId ?? null,
        bookingReference: normalizedReference || null,
        contactMethod,
        contactPhone: phone,
        photoUris: photos,
      });
      // Multi-step form: completeForm() drops ComplaintCategory + ComplaintDetails, so back
      // from the confirmation never re-enters the finished form (flow.md).
      completeForm(navigation, 'ComplaintCategory', 'ComplaintSubmitted', {
        complaintId: complaint.id,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View ref={screenRef} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <ScenicBackdrop />
        <PageIntro text="Tell us about the issue you're facing." art={<DocumentIllustration badge="typing" />} />

        <Card style={styles.form}>
          <View style={styles.group}>
            <TextField
              autoCapitalize="characters"
              autoCorrect={false}
              error={touched.reference ? errors.reference : undefined}
              icon="document-text-outline"
              iconTinted
              label="Booking reference (optional)"
              maxLength={REFERENCE_INPUT_MAX_LENGTH}
              onBlur={() => setTouched((current) => ({ ...current, reference: true }))}
              onChangeText={setReference}
              placeholder="e.g. 6J7K9L2"
              value={reference}
            />
            <Text style={styles.hint}>Enter if your complaint is related to a specific booking.</Text>
          </View>

          <SelectField
            icon="information-circle-outline"
            label="Complaint category"
            onSelect={(id) => setCategoryId(id as ComplaintCategoryId)}
            options={categoryOptions}
            placeholder="Select a category"
            required
            selectedId={categoryId}
            sheetTitle="Complaint category"
          />

          <View style={styles.group}>
            <TextField
              error={touched.description ? errors.description : undefined}
              icon="create-outline"
              iconTinted
              label="Description"
              maxLength={DESCRIPTION_MAX_LENGTH}
              multiline
              onBlur={() => setTouched((current) => ({ ...current, description: true }))}
              onChangeText={setDescription}
              placeholder="Describe the issue in detail…"
              required
              value={description}
            />
            <Text style={styles.counter}>
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </Text>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>
              Add photos <Text style={styles.optional}>(optional)</Text>
            </Text>
            <PhotoPicker photos={photos} onChange={setPhotos} max={MAX_PHOTOS} />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>
              Preferred contact method<Text style={styles.required}>{'  *'}</Text>
            </Text>
            {/* Two FilterChips read as a segmented control, as on EnterBookingReference. */}
            <View style={styles.segment}>
              {CONTACT_METHODS.map((method) => (
                <FilterChip
                  key={method.id}
                  label={method.label}
                  icon={method.icon}
                  selected={contactMethod === method.id}
                  onPress={() => setContactMethod(method.id)}
                  style={styles.segmentOption}
                />
              ))}
            </View>
          </View>

          <TextField
            accessibilityLabel="Contact phone number"
            autoComplete="tel"
            error={touched.phone ? errors.phone : undefined}
            icon="call-outline"
            iconTinted
            keyboardType="number-pad"
            label="Contact number"
            leading={<Text style={styles.countryCode}>{COUNTRY_CODE}</Text>}
            maxLength={PHONE_LENGTH + 1}
            onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
            onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(-PHONE_LENGTH))}
            placeholder="98765 43210"
            required
            textContentType="telephoneNumber"
            value={formatPhone(phone)}
          />
        </Card>
      </ScrollView>

      {/* Pinned above the floating tab bar, or above the keyboard (which covers the bar) while typing. */}
      <View style={[styles.footer, { paddingBottom: theme.space.s + Math.max(tabBarInset, keyboardOverlap) }]}>
        <Button label="Submit complaint" trailingIcon="arrow-forward" disabled={submitting} onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  form: {
    gap: theme.space.l,
  },
  group: {
    gap: theme.space.s,
  },
  label: {
    ...theme.type.body,
    fontWeight: '600',
    color: color.textPrimary,
  },
  optional: {
    fontWeight: '400',
    color: color.textSecondary,
  },
  required: {
    color: color.danger,
  },
  hint: {
    ...theme.type.caption,
    color: color.textSecondary,
  },
  counter: {
    ...theme.type.caption,
    color: color.textSecondary,
    textAlign: 'right',
  },
  segment: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  segmentOption: {
    flex: 1,
    justifyContent: 'center',
  },
  countryCode: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: color.textPrimary,
  },
  footer: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.s,
    backgroundColor: color.background,
  },
});
