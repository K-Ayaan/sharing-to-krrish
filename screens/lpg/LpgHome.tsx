import { useIsFocused } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import IconButton from '../../components/ui/IconButton';
import RunningBanner from '../../components/ui/RunningBanner';
import StatusTracker from '../../components/ui/StatusTracker';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { BOOKING_INTERVAL_DAYS, getLpgSummary, mockLpgHome } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { CALL_UNAVAILABLE } from '../contact';
import { formatDate } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { bookingLockLabel, requestSteps } from './lpgFormat';
import RequestRefillSheet from './RequestRefillSheet';

// Longer than iOS's push animation; only used when no transitionEnd arrives
// (LpgHome was already on top, so nothing animated).
const TRANSITION_FALLBACK_MS = 500;

export default function LpgHome({ navigation, route }: LpgScreenProps<'LpgHome'>) {
  const { tagline, banner } = mockLpgHome;
  const unreadNotificationCount = useUnreadNoticeCount();
  const [refillOpen, setRefillOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Re-render on focus so a booking made in EnterBookingReference shows on return.
  // getLpgSummary() is the same source Home's LPG card reads, so they always agree.
  useIsFocused();
  const {
    connection,
    nextEligibleAt,
    daysUntilEligible: daysLeft,
    canBook,
    activeRequest,
  } = getLpgSummary();

  // Pillar-home rule (flow.md): native large title, visible back chevron, bell in the header.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="notifications-outline"
          badgeCount={unreadNotificationCount}
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
        />
      ),
    });
  }, [navigation, unreadNotificationCount]);

  // Home's "Book Refill" lands here with openRefillSheet. iOS can drop a Modal presented
  // mid-push, so open once the transition ends (or after the fallback when nothing animated).
  // The param is cleared only after opening; clearing it re-runs this effect, whose cleanup
  // cancels whichever trigger didn't fire.
  const openRefillSheet = route.params?.openRefillSheet;
  useEffect(() => {
    if (!openRefillSheet) return;

    if (!canBook) {
      setToast(bookingLockLabel(daysLeft));
      navigation.setParams({ openRefillSheet: undefined });
      return;
    }

    const open = () => {
      setRefillOpen(true);
      navigation.setParams({ openRefillSheet: undefined });
    };
    const unsubscribe = navigation.addListener('transitionEnd', open);
    const fallback = setTimeout(open, TRANSITION_FALLBACK_MS);
    return () => {
      unsubscribe();
      clearTimeout(fallback);
    };
  }, [openRefillSheet, canBook, daysLeft, navigation]);

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.taglineRow}>
          <Text style={[styles.secondary, styles.flex]}>{tagline}</Text>
          <Thumbnail
            uri={null}
            fallbackIcon={pillarMeta.lpg.icon}
            iconColor={pillarMeta.lpg.colors.icon}
            tint={pillarMeta.lpg.colors.tint}
          />
        </View>

        <RunningBanner tone="info" icon="megaphone" text={banner.text} style={styles.fullBleed} />

        <Card>
          <Text style={styles.sectionTitle}>Your LPG connection</Text>
          <DetailRow icon="person" label="LPG ID" value={connection.lpgId} divider />
          <DetailRow icon="id-card-outline" label="Consumer number" value={connection.consumerNumber} divider />
          <DetailRow
            icon="calendar"
            label="Next eligible booking date"
            value={formatDate(nextEligibleAt)}
            detail={`${BOOKING_INTERVAL_DAYS} days after last booking`}
          />
        </Card>

        <View style={styles.actions}>
          <Button
            label={canBook ? 'Request refill' : bookingLockLabel(daysLeft)}
            icon="call"
            disabled={!canBook}
            onPress={() => setRefillOpen(true)}
          />
          {canBook ? (
            <Button
              label="Enter booking reference"
              icon="document-text-outline"
              variant="secondary"
              onPress={() => navigation.navigate('EnterBookingReference')}
            />
          ) : null}
        </View>

        {activeRequest ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Your current request</Text>
              <Button
                label="View details"
                variant="text"
                onPress={() => navigation.navigate('RequestStatus', { requestId: activeRequest.id })}
              />
            </View>
            <StatusTracker steps={requestSteps(activeRequest, 'none')} style={styles.tracker} />
          </Card>
        ) : null}

        <Button
          label="Raise a complaint"
          icon="chatbubble-ellipses-outline"
          variant="secondary"
          onPress={() =>
            navigation.navigate('ComplaintCategory', activeRequest ? { requestId: activeRequest.id } : undefined)
          }
        />
      </ScrollView>

      <RequestRefillSheet
        visible={refillOpen}
        onClose={() => setRefillOpen(false)}
        onCallUnavailable={() => {
          setRefillOpen(false);
          setToast(CALL_UNAVAILABLE);
        }}
      />
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
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  actions: {
    gap: theme.space.s,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.s,
  },
  tracker: {
    marginTop: theme.space.m,
  },
});
