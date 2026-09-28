import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ListRow from '../../components/ui/ListRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { getPickup, getProduce, type Pickup, type Produce } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate, formatDateTime } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import ProduceDetailSheet from './ProduceDetailSheet';
import {
  CALL_UNAVAILABLE,
  MAPS_UNAVAILABLE,
  dialectLabel,
  formatPhoneDisplay,
  openMaps,
  openPhone,
  pickupDisplayStatus,
  pickupSteps,
} from './vanDhanFormat';

const { color } = theme.vandhan;

function statusMessage(pickup: Pickup) {
  if (pickup.cancelledAt) return `You cancelled this pickup on ${formatDate(pickup.cancelledAt)}.`;
  const visitDate = formatDate(pickup.scheduledFor);
  switch (pickup.status) {
    case 'requested':
      return `We've received your request. The kendra will confirm a visit for ${visitDate}.`;
    case 'confirmed':
      return `Your pickup has been confirmed. Our team will visit your location on ${visitDate}.`;
    case 'collected':
      return pickup.collectedAt
        ? `Your produce was collected on ${formatDate(pickup.collectedAt)}.`
        : 'Your produce has been collected.';
  }
}

export default function PickupDetails({ route }: VanDhanScreenProps<'PickupDetails'>) {
  const pickup = getPickup(route.params.pickupId);
  const [toast, setToast] = useState<string | null>(null);
  const [sheetProduce, setSheetProduce] = useState<Produce | null>(null);

  if (!pickup) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>We couldn't find this pickup.</Text>
        </Card>
      </ScrollView>
    );
  }

  const status = pickupDisplayStatus(pickup);
  const produce = getProduce(pickup.produceId);
  const { village, district, state } = pickup.address;

  const call = async () => {
    if (!(await openPhone(pickup.contactPhone))) setToast(CALL_UNAVAILABLE);
  };

  const showAddress = async () => {
    if (!(await openMaps(`${village}, ${district}, ${state}`))) setToast(MAPS_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      {/* The ScrollView stays the screen's first view so the large title collapses on scroll; the
          backdrop lives inside its content. */}
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <ScenicBackdrop />
        <Card style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={styles.caption}>Pickup ID</Text>
              <Text selectable style={styles.id}>
                {pickup.id}
              </Text>
            </View>
            <StatusPill label={status.label} tone={status.tone} icon={status.icon} />
          </View>
          <View>
            <Text style={styles.caption}>Requested on</Text>
            <Text style={styles.body}>{formatDateTime(pickup.requestedAt)}</Text>
          </View>
          {/* A cancelled pickup has no progress left to track. */}
          {pickup.cancelledAt ? null : <StatusTracker steps={pickupSteps(pickup, 'dateTime')} />}
          <Card tone="info" style={styles.row}>
            <Avatar icon="information" iconColor={theme.color.background} tint={color.primary} />
            <Text style={[styles.secondary, styles.flex]}>{statusMessage(pickup)}</Text>
          </Card>
        </Card>

        <Card padded={false}>
          <Text style={styles.sectionTitle}>Produce details</Text>
          <ListRow
            icon={pillarMeta.vandhan.icon}
            iconColor={pillarMeta.vandhan.colors.icon}
            iconBackground={color.primaryTint}
            title={produce?.name ?? pickup.produceId}
            subtitle={produce ? dialectLabel(produce) : undefined}
            meta={`${pickup.quantity} ${pickup.unit}`}
            onPress={() => produce && setSheetProduce(produce)}
          />
        </Card>

        <Card padded={false}>
          <Text style={styles.sectionTitle}>Collection address</Text>
          <ListRow icon="location" title={village} subtitle={`${district}, ${state}`} onPress={showAddress} />
        </Card>

        <Card padded={false}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <ListRow
            icon="call"
            title={formatPhoneDisplay(pickup.contactPhone)}
            subtitle="Call for changes or queries"
            onPress={call}
          />
        </Card>

        {pickup.notes ? (
          <Card>
            <Text style={styles.cardTitle}>Additional information</Text>
            <DetailRow stacked icon="document-text-outline" value={pickup.notes} />
          </Card>
        ) : null}
        <TabBarSpacer />
      </ScrollView>
      <ProduceDetailSheet produce={sheetProduce} onClose={() => setSheetProduce(null)} />
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
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  section: {
    gap: theme.space.m,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    borderWidth: 0,
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
  body: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: color.textSecondary,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: color.textPrimary,
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.m,
  },
  cardTitle: {
    ...theme.type.headline,
    color: color.textPrimary,
  },
});
