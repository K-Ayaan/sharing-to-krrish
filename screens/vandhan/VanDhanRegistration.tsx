import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { CheckboxBox } from '../../components/ui/Checkbox';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import SelectField from '../../components/ui/SelectField';
import ServiceHeader from '../../components/ui/ServiceHeader';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import { mockProduce, registerForVanDhan } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { dialectLabel, kendraOptions } from './vanDhanFormat';

const { color } = theme.vandhan;

// Van Dhan isn't linked to a new account automatically (flow.md). VanDhanHome and the Services
// card send unregistered users here. Everyone registers as a producer — there is no view-only
// option — choosing their kendra and what they sell.
export default function VanDhanRegistration({ navigation }: VanDhanScreenProps<'VanDhanRegistration'>) {
  const unreadNotificationCount = useUnreadNoticeCount();
  const [kendraId, setKendraId] = useState<string>();
  const [produceIds, setProduceIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const complete = !!kendraId && produceIds.length > 0;

  const toggleProduce = (id: string) =>
    setProduceIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );

  const handleRegister = async () => {
    if (!kendraId || !complete || submitting) return;
    setSubmitting(true);
    try {
      await registerForVanDhan({ kendraId, produceIds });
      // Single-screen form: replace, so the finished form never stays in history (flow.md).
      navigation.replace('VanDhanHome', { confirmation: 'registered' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ServiceHeader
        title={pillarMeta.vandhan.label}
        icon={pillarMeta.vandhan.icon}
        iconColor={pillarMeta.vandhan.colors.icon}
        tint={pillarMeta.vandhan.colors.tint}
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        trailing={
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            tint={color.surface}
            onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <SelectField
          icon="location"
          label="Your Van Dhan Kendra"
          onSelect={setKendraId}
          options={kendraOptions}
          placeholder="Select kendra"
          required
          selectedId={kendraId}
          sheetTitle="Select kendra"
          sheetSubtitle="Choose the Van Dhan Kendra where you will sell or deliver your produce."
          optionIcon="location"
          confirmLabel="Select kendra"
        />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              What do you sell?<Text style={styles.required}>{'  *'}</Text>
            </Text>
            <Text style={styles.caption}>Select all that apply.</Text>
          </View>
          {mockProduce.map((item) => {
            const selected = produceIds.includes(item.id);
            return (
              <Card key={item.id} padded={false} elevated>
                <ListRow
                  icon={pillarMeta.vandhan.icon}
                  iconColor={pillarMeta.vandhan.colors.icon}
                  iconBackground={pillarMeta.vandhan.colors.tint}
                  title={item.name}
                  subtitle={dialectLabel(item)}
                  selected={selected}
                  onPress={() => toggleProduce(item.id)}
                  trailing={<CheckboxBox checked={selected} />}
                />
              </Card>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <Button
          label="Register"
          trailingIcon="arrow-forward"
          disabled={!complete || submitting}
          onPress={handleRegister}
        />
        <TabBarSpacer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.l,
  },
  section: {
    gap: theme.space.s,
  },
  sectionHeading: {
    gap: theme.space.xs,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  required: {
    color: theme.color.danger,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  spacer: {
    flex: 1,
  },
});
