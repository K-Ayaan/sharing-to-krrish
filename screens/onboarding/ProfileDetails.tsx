// login-info.png, completed against SDD S-01: adds farm/household name, language (it drives which
// language MARCOFED's calls and WhatsApp messages use), and consent recorded at registration (§8.4).
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ArrowRight, Globe, Home, Mail, MapPin, Tractor, User } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { DISTRICTS, DISTRICT_VILLAGES, LANGUAGES, type Language } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { completeRegistration } from '../../services/onboardingService';
import { validateEmail, validateName } from '../../services/userService';
import theme from '../../theme';

type Errors = Partial<Record<'name' | 'district' | 'village' | 'email' | 'consent', string>>;

export default function ProfileDetails({ navigation, route }: OnboardingScreenProps<'ProfileDetails'>) {
  const { phone } = route.params;
  const toast = useToast();
  const [name, setName] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [consent, setConsent] = useState(false);
  const [district, setDistrict] = useState<string | null>(null);
  const [village, setVillage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const villageOptions = useMemo(
    () => (district ? DISTRICT_VILLAGES[district].map((v) => ({ value: v, label: v })) : []),
    [district]
  );

  const validate = (): Errors => {
    const next: Errors = {};
    const nameError = validateName(name);
    if (nameError) next.name = nameError;
    if (!district) next.district = 'Choose your district';
    if (!village) next.village = 'Choose your village';
    const emailError = validateEmail(email);
    if (emailError) next.email = emailError;
    if (!consent) next.consent = 'Tick the box to continue';
    return next;
  };

  const onContinue = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0 || !district || !village) return;
    setSaving(true);
    try {
      await completeRegistration({
        phone,
        name,
        householdName: householdName.trim() || null,
        consentAt: new Date().toISOString(),
        district,
        village,
        email: email.trim() || null,
        language,
      });
      // Registration is done — nothing before this should be reachable with Back.
      navigation.reset({ index: 0, routes: [{ name: 'AllSet' }] });
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const clear = (field: keyof Errors) => setErrors((current) => ({ ...current, [field]: undefined }));

  return (
    <Screen
      header={
        <ScreenHeader
          layout="stacked"
          onBack={navigation.goBack}
          title="Tell us about yourself"
          subtitle="This helps us provide you with the right services and information."
          landscape="green"
        />
      }
      footer={<Button label="Continue" trailingIcon={ArrowRight} onPress={onContinue} loading={saving} />}
      contentStyle={styles.form}
    >
      <TextField
        icon={User}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          clear('name');
        }}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        error={errors.name}
      />
      <TextField
        icon={Tractor}
        placeholder="Farm or Household Name"
        value={householdName}
        onChangeText={setHouseholdName}
        autoCapitalize="words"
        helper="Optional — as it appears on your society or Kendra records"
      />
      <SelectField
        icon={MapPin}
        placeholder="District"
        sheetTitle="Choose your district"
        value={district}
        options={DISTRICTS.map((d) => ({ value: d, label: d }))}
        onChange={(value) => {
          setDistrict(value);
          if (value !== district) setVillage(null);
          clear('district');
        }}
        error={errors.district}
      />
      <SelectField
        icon={Home}
        placeholder="Village"
        sheetTitle={district ? `Villages in ${district}` : 'Choose your village'}
        value={village}
        options={villageOptions}
        onChange={(value) => {
          setVillage(value);
          clear('village');
        }}
        disabled={!district}
        error={errors.village}
      />
      <TextField
        icon={Mail}
        placeholder="Email Address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clear('email');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        helper={errors.email ? undefined : 'Optional'}
        error={errors.email}
      />
      <SelectField
        icon={Globe}
        label="Language"
        sheetTitle="Preferred language"
        sheetSubtitle="MARCOFED will call and message you in this language."
        value={language}
        options={LANGUAGES}
        onChange={setLanguage}
      />
      <Checkbox
        checked={consent}
        onChange={(value) => {
          setConsent(value);
          clear('consent');
        }}
        error={!!errors.consent}
      >
        I agree that MARCOFED may use these details, and record calls I make to it, to provide its
        services. My data stays in India and I can ask for it to be removed.
      </Checkbox>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    // Tight enough that the whole form fits a phone screen without scrolling; it still scrolls
    // when the keyboard is up, so the field being typed into can come clear of it.
    gap: theme.space.s + 2,
  },
});
