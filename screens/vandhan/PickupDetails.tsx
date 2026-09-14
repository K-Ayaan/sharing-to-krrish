import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ListRow from '../../components/ui/ListRow';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import Toast from '../../components/ui/Toast';
import { getPickup, type Pickup } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate, formatDateTime } from '../formatDate';
import {
  CALL_UNAVAILABLE,
  formatPhoneDisplay,
  openPhone,
  pickupStatusMeta,
  pickupSteps,
} from './vanDhanFormat';

function statusMessage(pickup: Pickup) {
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

  if (!pickup) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>We couldn't find this pickup.</Text>
        </Card>
      </ScrollView>
    );
  }

  const status = pickupStatusMeta[pickup.status];
  const call = async () => {
    if (!(await openPhone(pickup.contactPhone))) setToast(CALL_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={styles.caption}>Pickup ID</Text>
              <Text style={styles.id}>{pickup.id}</Text>
            </View>
            <StatusPill label={status.label} tone={status.tone} icon={status.icon} />
          </View>
          <View>
            <Text style={styles.caption}>Requested on</Text>
            <Text style={styles.body}>{formatDateTime(pickup.requestedAt)}</Text>
          </View>
          <StatusTracker steps={pickupSteps(pickup, 'dateTime')} />
        </Card>

        <Card tone="info" style={styles.row}>
          <Avatar icon="information" iconColor={theme.color.background} tint={theme.color.primary} />
          <Text style={[styles.secondary, styles.flex]}>{statusMessage(pickup)}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Collection address</Text>
          <DetailRow
            icon="home"
            value={pickup.address.village}
            detail={`${pickup.address.district}, ${pickup.address.state}`}
          />
        </Card>

        <Card padded={false}>
          <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>Contact</Text>
          <ListRow
            icon="call"
            iconColor={theme.color.primary}
            iconBackground={theme.color.primaryTint}
            title={formatPhoneDisplay(pickup.contactPhone)}
            subtitle="Call for changes or queries"
            onPress={call}
          />
        </Card>
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
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
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  id: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  body: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  sectionTitlePadded: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.m,
  },
});
