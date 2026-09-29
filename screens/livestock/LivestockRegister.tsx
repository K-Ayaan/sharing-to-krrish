// SPEC-ONLY — no mockup exists (services-page.png shows Livestock already registered). Registering
// makes you a buyer: browse MARCOFED stock and contact the selling Kendra. The producer side was
// removed from registration by the user on 23 Sep 2026.
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, BadgeCheck, Phone, ShoppingCart } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import { LeafSprig, WaveBackdrop } from '../../components/ui/Landscape';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useToast } from '../../components/ui/Toast';
import type { LivestockScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { registerLivestock } from '../../services/livestockService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

const WHAT_YOU_GET = [
  {
    icon: ShoppingCart,
    title: 'Browse available livestock',
    body: 'Species, weight and price, filtered to what you’re after.',
  },
  {
    icon: BadgeCheck,
    title: 'See inspected stock only',
    body: 'Every batch listed has passed a veterinary fitness check.',
  },
  {
    icon: Phone,
    title: 'Contact the Kendra directly',
    body: 'Call or message the Kendra selling the animals.',
  },
];

export default function LivestockRegister({ navigation }: LivestockScreenProps<'LivestockRegister'>) {
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  const profile = useQuery('profile', getProfile);
  const current = profile.data?.registrations.livestock ?? null;
  const [saving, setSaving] = useState(false);

  const onContinue = async () => {
    if (current) {
      navigation.replace('LivestockBrowse');
      return;
    }
    setSaving(true);
    try {
      await registerLivestock();
      toast.show({ message: 'Registered for Livestock', tone: 'success' });
      navigation.replace('LivestockBrowse');
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
            <WaveBackdrop width={width} height={height * 0.28} tone="peach" />
          </View>
          <View style={styles.sprig}>
            <LeafSprig size={width * 0.5} tone="peach" />
          </View>
        </>
      }
      header={
        <ScreenHeader
          layout="bar"
          title={current ? 'Your Livestock registration' : 'Register for Livestock'}
          onBack={navigation.goBack}
        />
      }
      footer={
        <Button
          label={current ? 'Go to Livestock' : 'Register'}
          trailingIcon={ArrowRight}
          onPress={onContinue}
          loading={saving}
        />
      }
      contentStyle={styles.content}
    >
      <Text style={styles.intro}>
        {current
          ? `You’ve been registered since ${formatDate(current.since)}. Nothing else is needed.`
          : 'Register to buy livestock through MARCOFED.'}
      </Text>

      <Card padded={false} style={styles.list}>
        {WHAT_YOU_GET.map((item, index) => (
          <ListRow
            key={item.title}
            title={item.title}
            subtitle={item.body}
            leading={<IconTile icon={item.icon} pillar="livestock" size="medium" />}
            divider={index < WHAT_YOU_GET.length - 1}
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m + 2,
  },
  intro: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.textSecondary,
  },
  list: {
    paddingHorizontal: theme.space.l,
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
    bottom: 60,
    opacity: 0.8,
  },
});
