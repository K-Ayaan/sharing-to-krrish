// SPEC-ONLY — SDD §4.5. No mockup was supplied; built from the shared components. Micro-Finance is
// a readiness capability ahead of the channelising-agency mandate, not a live lending system, so
// the copy here says exactly that and never promises money.
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, BadgeCheck, FileCheck2, Info, Landmark, Users } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Checkbox from '../../components/ui/Checkbox';
import IconTile from '../../components/ui/IconTile';
import { LeafSprig, WaveBackdrop } from '../../components/ui/Landscape';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useToast } from '../../components/ui/Toast';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { registerMicroFinance } from '../../services/microFinanceService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';

const STEPS = [
  {
    icon: FileCheck2,
    title: 'Tell us what you need',
    body: 'Purpose, amount and how long you’d take to repay.',
  },
  {
    icon: Users,
    title: 'Your society recommends you',
    body: 'Your cooperative society checks your membership and standing.',
  },
  {
    icon: Landmark,
    title: 'The Federation appraises it',
    body: 'If the mandate is in place, your application goes to the lending partner.',
  },
];

export default function MicroFinanceRegister({ navigation }: MicroFinanceScreenProps<'MicroFinanceRegister'>) {
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  const profile = useQuery('profile', getProfile);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const registered = profile.data?.registrations.microfinance != null;

  const onContinue = async () => {
    if (registered) {
      navigation.navigate('MicroFinanceApply');
      return;
    }
    setSaving(true);
    try {
      await registerMicroFinance();
      toast.show({ message: 'Registered for Micro-Finance', tone: 'success' });
      navigation.replace('MicroFinanceApply');
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      backdrop={
        <>
          <View style={styles.wave}>
            <WaveBackdrop width={width} height={height * 0.26} tone="gold" />
          </View>
          <View style={styles.sprig}>
            <LeafSprig size={width * 0.46} tone="gold" />
          </View>
        </>
      }
      header={<ScreenHeader layout="bar" title="Micro-Finance" onBack={navigation.goBack} />}
      footer={
        <Button
          label={registered ? 'Start an application' : 'Continue'}
          trailingIcon={ArrowRight}
          onPress={onContinue}
          loading={saving}
          disabled={!registered && !consent}
        />
      }
      contentStyle={styles.content}
    >
      <View style={styles.intro}>
        <IconTile icon={pillarMeta.microfinance.icon} pillar="microfinance" shape="rounded" size="xlarge" />
        <Text style={styles.introText}>
          Put your papers in order and follow an application from one place. MARCOFED records your
          request and your society’s recommendation.
        </Text>
      </View>

      <Banner
        tone="info"
        icon={Info}
        title="This is not a loan approval"
        body="MARCOFED is preparing to act as a channelising agency. Nothing here sanctions or disburses money, and no amount is promised."
      />

      <Card padded={false} style={styles.steps}>
        {STEPS.map((step, index) => (
          <ListRow
            key={step.title}
            title={step.title}
            subtitle={step.body}
            leading={<IconTile icon={step.icon} pillar="microfinance" size="medium" />}
            divider={index < STEPS.length - 1}
          />
        ))}
      </Card>

      <Card tone="microfinance">
        <View style={styles.neededHead}>
          <BadgeCheck size={18} color={theme.pillarTint.microfinance.icon} strokeWidth={2} />
          <Text style={styles.neededTitle}>Needed before you can apply</Text>
        </View>
        <Text style={styles.neededBody}>{pillarMeta.microfinance.needed}.</Text>
      </Card>

      {!registered ? (
        <Checkbox checked={consent} onChange={setConsent}>
          I agree that MARCOFED may share my application and documents with my cooperative society and
          the lending partner.
        </Checkbox>
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
  steps: {
    paddingHorizontal: theme.space.l,
  },
  neededHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  neededTitle: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  neededBody: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sprig: {
    position: 'absolute',
    right: -18,
    bottom: 64,
    opacity: 0.75,
  },
});
