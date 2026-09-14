import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
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
        <Avatar icon="information" iconColor={theme.color.background} tint={theme.color.primary} />
        <Text style={[styles.secondary, styles.flex]}>{requestStatusMessage(request)}</Text>
      </Card>

      <Card>
        <DetailRow icon="calendar" label="Booking date" value={formatDate(request.bookedAt)} divider />
        <DetailRow icon="flame" label="Urgency" value={urgencyLabel[request.urgency]} divider />
        {deliveredAt ? (
          <DetailRow icon="car" label="Delivered" value={formatDate(deliveredAt)} />
        ) : (
          <DetailRow
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
        onPress={() => navigation.navigate('ComplaintCategory', { requestId: request.id })}
      />
    </ScrollView>
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
