import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import {
  COUNTRY_CODE,
  mockDistricts,
  mockVillagesByDistrict,
  PHONE_LENGTH,
} from '../../data/mock/mockOnboarding';
import { updateProfile, type UserProfile } from '../../data/mock/mockUser';
import theme from '../../theme';
import { formatPhone } from '../onboarding/formatPhone';
import { validateContactPhone, validateEmail, validateFullName } from '../profileValidation';

export type ProfileEditTopic = 'personal' | 'email' | 'phone';

const TITLES: Record<ProfileEditTopic, string> = {
  personal: 'Personal details',
  email: 'Email address',
  phone: 'Contact number',
};

const SAVED: Record<ProfileEditTopic, string> = {
  personal: 'Personal details saved',
  email: 'Email address saved',
  phone: 'Contact number saved',
};

type ProfileEditSheetProps = {
  /** Which part of the profile to edit; null when closed. */
  topic: ProfileEditTopic | null;
  profile: UserProfile;
  onClose: () => void;
  onSaved: (message: string) => void;
};

// The profile stores district and village by name (as registration saved them); the pickers work
// with the onboarding option ids, so map between the two.
const districtIdByName = (name: string) => mockDistricts.find((option) => option.name === name)?.id;
const villageIdByName = (districtId: string | undefined, name: string) =>
  districtId ? mockVillagesByDistrict[districtId]?.find((option) => option.name === name)?.id : undefined;

// Settings' editor for the editable profile fields, one topic at a time: personal details (name,
// district, village), email, or contact number. Aadhaar and the UID are never part of this sheet.
export default function ProfileEditSheet({ topic, profile, onClose, onSaved }: ProfileEditSheetProps) {
  const [value, setValue] = useState('');
  const [districtId, setDistrictId] = useState<string>();
  const [villageId, setVillageId] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Start from the saved values each time the sheet opens.
  useEffect(() => {
    if (!topic) return;
    setValue(topic === 'personal' ? profile.fullName : topic === 'email' ? profile.email : profile.phone);
    const district = districtIdByName(profile.district);
    setDistrictId(district);
    setVillageId(villageIdByName(district, profile.village));
    setTouched(false);
    // Only on open: a save updates `profile`, and the fields must not reset under the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const villages = districtId ? (mockVillagesByDistrict[districtId] ?? []) : [];
  const districtName = mockDistricts.find((option) => option.id === districtId)?.name;
  const villageName = villages.find((option) => option.id === villageId)?.name;

  const trimmed = value.trim();
  const error =
    topic === 'personal'
      ? validateFullName(trimmed) ?? (!districtName || !villageName ? 'Choose your district and village.' : undefined)
      : topic === 'email'
        ? validateEmail(trimmed)
        : validateContactPhone(trimmed);
  const changed =
    topic === 'personal'
      ? trimmed !== profile.fullName || districtName !== profile.district || villageName !== profile.village
      : trimmed !== (topic === 'email' ? profile.email : profile.phone);
  const canSave = !!topic && !error && changed && !saving;

  const handleSave = async () => {
    setTouched(true);
    if (!topic || !canSave) return;
    setSaving(true);
    try {
      await updateProfile({
        fullName: topic === 'personal' ? trimmed : profile.fullName,
        email: topic === 'email' ? trimmed : profile.email,
        phone: topic === 'phone' ? trimmed : profile.phone,
        district: topic === 'personal' && districtName ? districtName : profile.district,
        village: topic === 'personal' && villageName ? villageName : profile.village,
      });
      onSaved(SAVED[topic]);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const nameError = touched ? validateFullName(trimmed) : undefined;
  const shownError = touched ? error : undefined;

  return (
    <BottomSheet
      visible={topic !== null}
      onClose={onClose}
      title={topic ? TITLES[topic] : undefined}
      showClose
      // Focus only once the sheet has settled, so the keyboard doesn't race the slide-in.
      onOpened={() => inputRef.current?.focus()}
    >
      <View style={styles.content}>
        {topic === 'personal' ? (
          <>
            <TextField
              autoCapitalize="words"
              autoComplete="name"
              error={nameError}
              icon="person"
              inputRef={inputRef}
              label="Full name"
              onBlur={() => setTouched(true)}
              onChangeText={setValue}
              placeholder="Enter your full name"
              required
              textContentType="name"
              value={value}
            />
            <SelectField
              icon="location"
              label="District"
              onSelect={(id) => {
                setDistrictId(id);
                // A new district invalidates the village until one from that district is chosen.
                if (id !== districtId) setVillageId(undefined);
              }}
              options={mockDistricts}
              placeholder="Select district"
              required
              selectedId={districtId}
              sheetTitle="Select district"
            />
            <SelectField
              disabled={!districtId}
              icon="home"
              label="Village"
              onSelect={setVillageId}
              options={villages}
              placeholder={districtId ? 'Select village' : 'Select a district first'}
              required
              selectedId={villageId}
              sheetTitle="Select village"
            />
          </>
        ) : null}

        {topic === 'email' ? (
          <TextField
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            error={shownError}
            icon="mail-outline"
            inputRef={inputRef}
            keyboardType="email-address"
            label="Email address"
            onBlur={() => setTouched(true)}
            onChangeText={setValue}
            placeholder="you@example.com"
            required
            textContentType="emailAddress"
            value={value}
          />
        ) : null}

        {topic === 'phone' ? (
          <>
            <TextField
              accessibilityLabel="Contact phone number"
              autoComplete="tel"
              error={shownError}
              inputRef={inputRef}
              keyboardType="number-pad"
              label="Contact number"
              leading={<Text style={styles.countryCode}>{COUNTRY_CODE}</Text>}
              maxLength={PHONE_LENGTH + 1}
              onBlur={() => setTouched(true)}
              onChangeText={(text) => setValue(text.replace(/\D/g, '').slice(-PHONE_LENGTH))}
              placeholder="98765 43210"
              required
              textContentType="telephoneNumber"
              value={formatPhone(value)}
            />
            <Text style={styles.caption}>
              Your contact number is only used to reach you. You sign in with Aadhaar.
            </Text>
          </>
        ) : null}

        <Button label="Save changes" icon="checkmark" disabled={!canSave} onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
    paddingBottom: theme.space.s,
  },
  countryCode: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
