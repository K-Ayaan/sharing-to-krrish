import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CylinderIllustration from '../../components/ui/CylinderIllustration';
import DetailRow from '../../components/ui/DetailRow';
import IconButton from '../../components/ui/IconButton';
import RunningBanner from '../../components/ui/RunningBanner';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import ServiceHeader from '../../components/ui/ServiceHeader';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { BOOKING_INTERVAL_DAYS, getColony, getLpgSummary, mockLpgHome } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { CALL_UNAVAILABLE, openWhatsAppGroup, WHATSAPP_UNAVAILABLE } from '../contact';
import { formatDate } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import { bookingLockLabel, requestSteps } from './lpgFormat';
import RequestRefillSheet from './RequestRefillSheet';

// Longer than iOS's push animation; only used when no transitionEnd arrives
// (LpgHome was already on top, so nothing animated).
const TRANSITION_FALLBACK_MS = 500;

const { color } = theme.lpg;

export default function LpgHome({ navigation, route }: LpgScreenProps<'LpgHome'>) {
  const { banner } = mockLpgHome;
  const unreadNotificationCount = useUnreadNoticeCount();
  const [refillOpen, setRefillOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Re-render on focus so a booking made in EnterBookingReference shows on return.
  // getLpgSummary() is the same source Home's LPG card reads, so they always agree.
  useIsFocused();
  const summary = getLpgSummary();
  const registered = summary.isRegistered;
  const canBook = summary.isRegistered && summary.canBook;
  const daysLeft = summary.isRegistered ? summary.daysUntilEligible : 0;
  const colony = getColony();

  const joinColonyGroup = async () => {
    if (colony && !(await openWhatsAppGroup(colony.whatsappGroupUrl))) setToast(WHATSAPP_UNAVAILABLE);
  };

  // Registration gate (flow.md): the Services card and Home route unregistered users straight to
  // LpgRegistration; any other way in is redirected here instead.
  useEffect(() => {
    if (!registered) navigation.replace('LpgRegistration');
  }, [registered, navigation]);

  // Home's "Book Refill" lands here with openRefillSheet. iOS can drop a Modal presented
  // mid-push, so open once the transition ends (or after the fallback when nothing animated).
  // The param is cleared only after opening; clearing it re-runs this effect, whose cleanup
  // cancels whichever trigger didn't fire.
  const openRefillSheet = route.params?.openRefillSheet;
  useEffect(() => {
    if (!openRefillSheet || !registered) return;

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
  }, [openRefillSheet, registered, canBook, daysLeft, navigation]);

  if (!summary.isRegistered) {
    // Blank for the instant before the redirect lands.
    return <View style={styles.screen} />;
  }

  const { connection, nextEligibleAt, activeRequest } = summary;

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ServiceHeader
        title={pillarMeta.lpg.label}
        icon={pillarMeta.lpg.icon}
        iconColor={pillarMeta.lpg.colors.icon}
        tint={pillarMeta.lpg.colors.tint}
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
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <CylinderIllustration style={styles.hero} />
        <RunningBanner tone="info" icon="megaphone" text={banner.text} style={styles.fullBleed} />

        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Your LPG connection</Text>
            <StatusPill label="Linked" tone="success" icon="checkmark" />
          </View>
          <DetailRow iconTinted icon="card-outline" label="LPG ID" value={connection.lpgId} divider />
          <DetailRow
            iconTinted
            icon="person-outline"
            label="Consumer number"
            value={connection.consumerNumber}
            divider
          />
          <DetailRow
            iconTinted
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
            chevron
            disabled={!canBook}
            onPress={() => setRefillOpen(true)}
          />
          {canBook ? (
            <Button
              label="Enter booking reference"
              icon="document-text-outline"
              variant="secondary"
              chevron
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
                trailingIcon="chevron-forward"
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
          chevron
          onPress={() =>
            navigation.navigate('ComplaintCategory', activeRequest ? { requestId: activeRequest.id } : undefined)
          }
        />

        {/* The colony's WhatsApp group: everyone on this reference code, plus the colony in-charge. */}
        {colony ? (
          <Button
            label="Join colony WhatsApp group"
            icon="logo-whatsapp"
            variant="secondary"
            chevron
            onPress={joinColonyGroup}
          />
        ) : null}
        <TabBarSpacer />
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
    backgroundColor: color.background,
  },
  hero: {
    alignSelf: 'flex-end',
    marginTop: -theme.space.l,
    marginBottom: -theme.space.s,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
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
