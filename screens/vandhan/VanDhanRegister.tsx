// vandhan-registration.png — register as a collector. The mockup offered a Price Checker role
// alongside it; the user removed that on 23 Sep 2026, so there's one kind of member and the screen
// says what registering gives you rather than asking a question with one answer.
import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, BarChart3, MessageSquareWarning, ShoppingBasket } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import { LeafSprig, WaveBackdrop } from '../../components/ui/Landscape';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useToast } from '../../components/ui/Toast';
import type { VanDhanScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import { registerVanDhan } from '../../services/vanDhanService';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

const WHAT_YOU_GET = [
  {
    icon: ShoppingBasket,
    title: 'Submit your collections',
    body: 'Hand produce to your Kendra and follow weighing and payment.',
  },
  {
    icon: BarChart3,
    title: 'See the notified rates',
    body: 'Today’s rate for every produce your Kendra buys.',
  },
  {
    icon: MessageSquareWarning,
    title: 'Raise a grievance',
    body: 'If a weight or a payment is wrong, it goes on record.',
  },
];

export default function VanDhanRegister({ navigation }: VanDhanScreenProps<'VanDhanRegister'>) {
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  const profile = useQuery('profile', getProfile);
  const current = profile.data?.registrations.vandhan ?? null;
  const [saving, setSaving] = useState(false);

  const onContinue = async () => {
    if (current) {
      navigation.replace('VanDhanHub', { tab: 'collections' });
      return;
    }
    setSaving(true);
    try {
      await registerVanDhan();
      toast.show({ message: 'Registered for Van Dhan', tone: 'success' });
      navigation.replace('VanDhanHub', { tab: 'collections' });
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
            <WaveBackdrop width={width} height={height * 0.3} />
          </View>
          <View style={styles.sprig}>
            <LeafSprig size={width * 0.55} />
          </View>
        </>
      }
      header={
        <ScreenHeader
          layout="bar"
          title={current ? 'Your Van Dhan registration' : 'Register for Van Dhan'}
          onBack={navigation.goBack}
        />
      }
      footer={
        <Button
          label={current ? 'Go to Van Dhan' : 'Register'}
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
          : 'Register to hand your forest produce to your Kendra and be paid at the notified rate.'}
      </Text>

      <Card padded={false} style={styles.list}>
        {WHAT_YOU_GET.map((item, index) => (
          <ListRow
            key={item.title}
            title={item.title}
            subtitle={item.body}
            leading={<IconTile icon={item.icon} size="medium" />}
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
