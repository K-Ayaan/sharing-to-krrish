import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import IconButton from '../../components/ui/IconButton';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import ServiceHeader from '../../components/ui/ServiceHeader';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker, { type Step } from '../../components/ui/StatusTracker';
import SuccessBadge from '../../components/ui/SuccessBadge';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { getCollectionLog, getKendra, getProduce } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDateTime, formatWeekdayDate } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { MAPS_UNAVAILABLE, dialectLabel, kendraMapQuery, openMaps, unitName } from './vanDhanFormat';

const { color } = theme.vandhan;

const NEXT_STEPS: Step[] = [
  { label: 'Visit Kendra', icon: 'walk', state: 'current', description: 'Bring your produce' },
  { label: 'Weighing', icon: 'scale-outline', state: 'upcoming', description: 'Staff verify it' },
  { label: 'Payment', icon: 'document-text-outline', state: 'upcoming', description: 'Recorded & paid' },
];

// Replaces LogCollection once a collection is logged (flow.md), so Back returns to VanDhanHome.
// Everything shown is read back from the stored log and the producer's registered kendra.
export default function CollectionSubmitted({ navigation, route }: VanDhanScreenProps<'CollectionSubmitted'>) {
  const unreadNotificationCount = useUnreadNoticeCount();
  const [toast, setToast] = useState<string | null>(null);
  const log = getCollectionLog(route.params.collectionId);
  const produce = log ? getProduce(log.produceId) : undefined;
  // The kendra picked for this collection, which may differ from the registered one.
  const kendra = log ? getKendra(log.kendraId) : undefined;

  const viewOnMap = async () => {
    if (kendra && !(await openMaps(kendraMapQuery(kendra)))) setToast(MAPS_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ServiceHeader
        title={pillarMeta.vandhan.label}
        icon={pillarMeta.vandhan.icon}
        iconColor={pillarMeta.vandhan.colors.icon}
        tint={pillarMeta.vandhan.colors.tint}
        onBack={() => navigation.goBack()}
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <SuccessBadge />
          <Text accessibilityRole="header" style={styles.title}>
            Collection submitted!
          </Text>
          <Text style={styles.subtitle}>
            {kendra ? `Now bring your produce to ${kendra.name}.` : 'Now bring your produce to the kendra.'}
          </Text>
        </View>

        {log ? (
          <Card>
            <View style={styles.idRow}>
              <View style={styles.flex}>
                <Text style={styles.caption}>Collection ID</Text>
                <Text selectable style={styles.id}>
                  {log.id}
                </Text>
              </View>
              <StatusPill label="Submitted" tone="success" icon="checkmark-circle" />
            </View>
            <DetailRow
              stacked
              divider
              icon={pillarMeta.vandhan.icon}
              label="Produce"
              value={produce?.name ?? log.produceId}
              detail={produce ? dialectLabel(produce) : undefined}
              trailing={
                <View style={styles.quantity}>
                  <Text style={styles.quantityValue}>{`${log.quantity} ${log.unit}`}</Text>
                  <Text style={styles.caption}>Quantity</Text>
                </View>
              }
            />
            <DetailRow stacked divider icon="cube-outline" label="Unit" value={log.unit} detail={unitName(log.unit)} />
            {log.note ? (
              <DetailRow stacked divider icon="document-text-outline" label="Note" value={log.note} />
            ) : null}
            <DetailRow
              stacked
              divider={!!kendra || !!log.deliveryDate}
              icon="calendar-outline"
              label="Submitted on"
              value={formatDateTime(log.loggedAt)}
            />
            {log.deliveryDate ? (
              <DetailRow
                stacked
                divider={!!kendra}
                icon="calendar"
                label="Delivery date"
                value={formatWeekdayDate(log.deliveryDate)}
              />
            ) : null}
            {kendra ? (
              <DetailRow
                stacked
                icon="location"
                label="Van Dhan Kendra"
                value={kendra.name}
                detail={`${kendra.address.line1}, ${kendra.address.line2}`}
                trailing={
                  <Button label="View on map" icon="location" variant="secondary" onPress={viewOnMap} style={styles.mapButton} />
                }
              />
            ) : null}
          </Card>
        ) : (
          <Card>
            <Text style={styles.caption}>We couldn't find this collection.</Text>
          </Card>
        )}

        <Card style={styles.next}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            What happens next?
          </Text>
          <StatusTracker variant="guide" steps={NEXT_STEPS} />
        </Card>

        <View style={styles.actions}>
          <Button
            label="Kendra details"
            icon="location"
            onPress={() => navigation.navigate('KendraInfo', log ? { kendraId: log.kendraId } : undefined)}
            style={styles.action}
          />
          <Button
            label="Log another"
            icon="add-circle"
            variant="secondary"
            onPress={() => navigation.replace('LogCollection')}
            style={styles.action}
          />
        </View>
        <TabBarSpacer />
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.largeTitle,
    fontWeight: '800',
    color: color.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.type.body,
    color: color.textSecondary,
    textAlign: 'center',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
    paddingBottom: theme.space.xs,
  },
  caption: {
    ...theme.type.body,
    color: color.textSecondary,
  },
  id: {
    ...theme.type.title,
    fontWeight: '800',
    color: color.textPrimary,
  },
  quantity: {
    alignItems: 'flex-start',
  },
  quantityValue: {
    ...theme.type.title,
    color: color.textPrimary,
  },
  mapButton: {
    minHeight: theme.space.xl,
    paddingHorizontal: theme.space.s + theme.space.xs,
    paddingVertical: theme.space.xs,
  },
  next: {
    gap: theme.space.m,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: color.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  action: {
    flex: 1,
    paddingHorizontal: theme.space.s,
  },
});
