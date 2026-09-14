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
  const { phone, email } = route.params;
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
      draft: { phone, email, fullName: name, districtId, villageId },
    });
  };

  return (
    <OnboardingLayout
      step={4}
      title="Tell us about yourself"
      subtitle="This helps us serve you better across all services."
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
          autoCapitalize="words"
          autoComplete="name"
          error={nameTouched ? nameError : undefined}
          icon="person"
          label="Full name"
          onBlur={() => setNameTouched(true)}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          required
          returnKeyType="done"
          textContentType="name"
          value={fullName}
        />
        <SelectField
          icon="location"
          label="District"
          onSelect={(id) => {
            setDistrictId(id);
            setVillageId(undefined);
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
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: theme.space.m,
  },
});
