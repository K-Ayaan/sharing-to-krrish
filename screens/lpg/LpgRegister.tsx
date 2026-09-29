// lpg-registration.png — link an LPG connection by consumer number and distributor (SDD §4.3.1:
// the consumer is identified by LPG identity and consumer number). Blue throughout, like the mockup.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, Bell } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import { LeafSprig, WaveBackdrop } from '../../components/ui/Landscape';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import { CylinderIcon } from '../../components/ui/icons';
import type { LpgScreenProps } from '../../navigation/types';
import { describeError, ValidationError } from '../../services/client';
import { getUnreadCount } from '../../services/homeService';
import { getLpgOverview, registerLpg, validateConsumerNumber } from '../../services/lpgService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';

export default function LpgRegister({ navigation }: LpgScreenProps<'LpgRegister'>) {
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  const unread = useQuery('notices:unread', getUnreadCount);
  // Opened from the hub's "Your registration" row, this same screen shows what's on file and saves
  // changes back — there's no un-registering in the SDD.
  const overview = useQuery('lpg:overview', getLpgOverview);
  const existing = overview.data?.connection ?? null;
  const [consumerNumber, setConsumerNumber] = useState('');
  const [distributor, setDistributor] = useState('');
  const [errors, setErrors] = useState<{ consumer?: string; distributor?: string }>({});
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Fill the fields once, when the connection arrives — never over anything being typed.
  useEffect(() => {
    if (existing && !prefilled) {
      setConsumerNumber(existing.consumerNumber);
      setDistributor(existing.distributor);
      setPrefilled(true);
    }
  }, [existing, prefilled]);

  const onContinue = async () => {
    const consumerError = validateConsumerNumber(consumerNumber) ?? undefined;
    const distributorError = distributor.trim().length < 3 ? 'Enter your distributor’s name' : undefined;
    setErrors({ consumer: consumerError, distributor: distributorError });
    if (consumerError || distributorError) return;
    setSaving(true);
    try {
      await registerLpg({ consumerNumber, distributor });
      toast.show({ message: existing ? 'Registration updated' : 'LPG connection linked', tone: 'success' });
      navigation.replace('LpgHub');
    } catch (caught) {
      if (caught instanceof ValidationError) setErrors({ consumer: caught.message });
      else toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      background={theme.pillarTint.lpg.canvas}
      backdrop={
        <>
          <View style={styles.wave}>
            <WaveBackdrop width={width} height={height * 0.28} tone="blue" />
          </View>
          <View style={styles.sprig}>
            <LeafSprig size={width * 0.5} tone="blue" />
          </View>
          <View style={styles.blob} />
        </>
      }
      header={
        <ScreenHeader
          layout="bar"
          title={existing ? 'Your LPG registration' : 'Register for LPG'}
          onBack={navigation.goBack}
          right={
            <IconButton
              icon={Bell}
              label="Notices"
              badge={(unread.data ?? 0) > 0}
              onPress={() => navigation.navigate('NoticesTab', { screen: 'NoticesList' })}
            />
          }
        />
      }
      footer={
        <Button
          label={existing ? 'Save changes' : 'Continue'}
          trailingIcon={existing ? undefined : ArrowRight}
          variant="pillar"
          pillarColor="lpg"
          onPress={onContinue}
          loading={saving}
        />
      }
      contentStyle={styles.content}
    >
      <View style={styles.intro}>
        <IconTile icon={CylinderIcon} pillar="lpg" shape="rounded" size="xlarge" />
        <Text style={styles.introText}>
          {existing
            ? `Connection ${existing.lpgId} is linked to your account. Change these details if they’re wrong.`
            : 'Enter your details to register for LPG services and track your refills.'}
        </Text>
      </View>
      <TextField
        label="Consumer Number"
        labelPosition="above"
        placeholder="Enter consumer number"
        value={consumerNumber}
        onChangeText={(text) => {
          setConsumerNumber(text.replace(/\s/g, ''));
          setErrors((e) => ({ ...e, consumer: undefined }));
        }}
        autoCapitalize="characters"
        maxLength={17}
        error={errors.consumer}
        helper="Printed on your LPG passbook or last bill"
      />
      <TextField
        label="Distributor Name"
        labelPosition="above"
        placeholder="Enter distributor name"
        value={distributor}
        onChangeText={(text) => {
          setDistributor(text);
          setErrors((e) => ({ ...e, distributor: undefined }));
        }}
        autoCapitalize="words"
        error={errors.distributor}
      />
      {pillarMeta.lpg.needed ? (
        <Banner tone="info" title="Also needed" body={`${pillarMeta.lpg.needed}, checked by your distributor.`} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.l,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  introText: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.textSecondary,
    flex: 1,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sprig: {
    position: 'absolute',
    right: -20,
    bottom: 70,
    opacity: 0.8,
  },
  blob: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.pillarTint.lpg.tint,
    opacity: 0.6,
  },
});
