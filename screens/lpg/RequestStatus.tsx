import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import PageIntro from '../../components/ui/PageIntro';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import { getLatestRequest, getRequest } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate } from '../formatDate';
import {
  formatDateRange,
  requestStageMeta,
  requestStatusMessage,
  requestSteps,
  urgencyLabel,
} from './lpgFormat';

const { color } = theme.lpg;

export default function RequestStatus({ navigation, route }: LpgScreenProps<'RequestStatus'>) {
  const requestId = route.params?.requestId;
  const request = requestId ? getRequest(requestId) : getLatestRequest();

  if (!request) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>You don't have any refill requests yet.</Text>
        </Card>
      </ScrollView>
    );
  }

  const stage = requestStageMeta[request.stage];
  const deliveredAt = request.stageTimes.delivered;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <ScenicBackdrop />
      <PageIntro text="Track the status of your LPG refill request using the booking reference." />
      <Card style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.caption}>Booking reference</Text>
            <Text selectable style={styles.reference}>
              {request.bookingReference}
            </Text>
          </View>
          <StatusPill label={stage.label} tone={stage.tone} icon={stage.icon} />
        </View>
        <StatusTracker steps={requestSteps(request, 'dateTime')} />
      </Card>

      <Card tone="info" style={styles.infoRow}>
        <Avatar icon="information" iconColor={theme.color.background} tint={color.primary} />
        <Text style={[styles.secondary, styles.flex]}>{requestStatusMessage(request)}</Text>
      </Card>

      <Card>
        <DetailRow iconTinted icon="calendar" label="Booking date" value={formatDate(request.bookedAt)} divider />
        <DetailRow iconTinted icon="flame" label="Urgency" value={urgencyLabel[request.urgency]} divider />
        {deliveredAt ? (
          <DetailRow iconTinted icon="car" label="Delivered" value={formatDate(deliveredAt)} />
        ) : (
          <DetailRow
            iconTinted
            icon="car"
            label="Expected delivery"
            value={formatDateRange(request.expectedDelivery.from, request.expectedDelivery.to)}
            detail="(Estimated)"
          />
        )}
      </Card>

      <Button
        label="Raise a complaint"
        icon="chatbubble-ellipses-outline"
        variant="secondary"
        chevron
        onPress={() => navigation.navigate('ComplaintCategory', { requestId: request.id })}
      />
      <TabBarSpacer />
    </ScrollView>
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
    gap: theme.space.l,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  reference: {
    ...theme.type.title,
    fontWeight: '800',
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
});
