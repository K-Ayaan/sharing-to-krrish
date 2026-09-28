import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../components/ui/Button';
import SelectField from '../../components/ui/SelectField';
import TextField from '../../components/ui/TextField';
import { mockDistricts, mockVillagesByDistrict } from '../../data/mock/mockOnboarding';
import type { OnboardingScreenProps } from '../../navigation/types';
import theme from '../../theme';
import OnboardingLayout from './OnboardingLayout';

export default function ProfileDetails({ navigation, route }: OnboardingScreenProps<'ProfileDetails'>) {
  const { identity, phone, email } = route.params;
  const [fullName, setFullName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [districtId, setDistrictId] = useState<string>();
  const [villageId, setVillageId] = useState<string>();

  const name = fullName.trim();
  const nameError = name ? undefined : 'Full name is required.';
  const villages = districtId ? (mockVillagesByDistrict[districtId] ?? []) : [];
  const complete = !!name && !!districtId && !!villageId;

  const handleContinue = () => {
    setNameTouched(true);
    if (!name || !districtId || !villageId) return;
    navigation.navigate('Consent', {
      draft: { identity, phone, email, fullName: name, districtId, villageId },
    });
  };

  return (
    <OnboardingLayout
      step={5}
      title="Tell us about yourself"
      subtitle="This helps us personalize your experience and connect you to the right services."
      onBack={() => navigation.goBack()}
      footer={
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!complete}
          onPress={handleContinue}
        />
      }
    >
      <View style={styles.fields}>
        <TextField
          accessibilityLabel="Full name"
          autoCapitalize="words"
          autoComplete="name"
          error={nameTouched ? nameError : undefined}
          icon="person-outline"
          onBlur={() => setNameTouched(true)}
          onChangeText={setFullName}
          placeholder="Full name"
          returnKeyType="done"
          textContentType="name"
          value={fullName}
        />
        <SelectField
          icon="location-outline"
          label="District"
          labelHidden
          onSelect={(id) => {
            setDistrictId(id);
            setVillageId(undefined);
          }}
          options={mockDistricts}
          placeholder="Select your district"
          selectedId={districtId}
          sheetTitle="Select district"
        />
        <SelectField
          disabled={!districtId}
          icon="home-outline"
          label="Village"
          labelHidden
          onSelect={setVillageId}
          options={villages}
          placeholder="Select your village"
          selectedId={villageId}
          sheetTitle="Select village"
        />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: theme.space.m,
  },
});
