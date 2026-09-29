// lpg-page.png, completed against SDD S-30/S-31/S-32: the connection, booking a refill (validated
// against an open booking and the minimum interval), and order history. LPG uses its own blue.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bell, CalendarDays, Info, List, MessageSquareWarning, UserCheck } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonCards, SkeletonList } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import { useToast } from '../../components/ui/Toast';
import { CylinderIcon } from '../../components/ui/icons';
import { CYLINDER_LABEL, MIN_BOOKING_INTERVAL_DAYS, type CylinderType } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { getUnreadCount } from '../../services/homeService';
import { bookRefill, getLpgOverview } from '../../services/lpgService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate, maskNumber } from '../../utils/format';
import BookRefillSheet from './BookRefillSheet';
import { bookingStatus } from './lpgFormat';

export default function LpgHub({ navigation, route }: LpgScreenProps<'LpgHub'>) {
  const toast = useToast();
  const overview = useQuery('lpg:overview', getLpgOverview);
  const unread = useQuery('notices:unread', getUnreadCount);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const data = overview.data;
  const eligibility = data?.eligibility;

  // Arriving with { book: true } opens the booking sheet directly.
  useEffect(() => {
    if (route.params?.book && eligibility?.canBook) setSheetOpen(true);
  }, [route.params?.book, eligibility?.canBook]);

  const confirm = async (cylinder: CylinderType) => {
    setBooking(true);
    try {
      const created = await bookRefill(cylinder);
      setSheetOpen(false);
      toast.show({ message: `Refill booked · ${created.reference}`, tone: 'success' });
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setBooking(false);
    }
  };

  const openBooking = (id: string) =>
    navigation.navigate('RecordsTab', { screen: 'RecordDetail', params: { recordId: `booking:${id}` }, initial: false });

  const lockedReason = eligibility?.activeBooking
    ? 'Your refill is on its way. You can book again once it’s delivered.'
    : eligibility && !eligibility.canBook && eligibility.nextEligibleAt
      ? `Refills can be booked ${MIN_BOOKING_INTERVAL_DAYS} days apart. You can book from ${formatDate(eligibility.nextEligibleAt)}.`
      : null;

  return (
    <Screen
      inTabs
      background={theme.pillarTint.lpg.canvas}
      refreshing={overview.refreshing}
      onRefresh={overview.refresh}
      header={
        <ScreenHeader
          layout="bar"
          title="LPG"
          scene="lpg"
          onBack={navigation.goBack}
          right={
            <IconButton
              icon={Bell}
              label="Notices"
              badge={(unread.data ?? 0) > 0}
              onPress={() => navigation.navigate('NoticesTab', { screen: 'NoticesList' })}
            />
          }
        />
      }
      contentStyle={styles.content}
    >
      {!data ? (
        overview.error ? (
          <ErrorState error={overview.error} onRetry={overview.refetch} what="your LPG connection" />
        ) : (
          <>
            <SkeletonCards count={1} height={230} />
            <SkeletonList count={4} thumb={42} lines={2} />
          </>
        )
      ) : !data.connection ? (
        <EmptyState
          icon={CylinderIcon}
          title="No LPG connection linked"
          body="Register your consumer number to book refills and track deliveries."
          actionLabel="Register for LPG"
          onAction={() => navigation.replace('LpgRegister')}
        />
      ) : (
        <>
          <Card padded={false} style={styles.connection}>
            <View style={styles.connectionTop}>
              <IconTile icon={CylinderIcon} pillar="lpg" shape="rounded" size="xlarge" />
              <View style={styles.flex}>
                <View style={styles.connectionHead}>
                  <Text style={styles.caption}>Your Connection</Text>
                  <StatusPill
                    tone="active"
                    label={data.connection.active ? 'Active' : 'Inactive'}
                    size="small"
                    style={styles.pushRight}
                  />
                </View>
                <Text style={styles.connectionTitle}>Cylinder {data.connection.active ? 'Active' : 'Inactive'}</Text>
                {eligibility?.nextEligibleAt ? (
                  <>
                    <Text style={[styles.caption, styles.gapTop]}>Next refill eligible from</Text>
                    <View style={styles.dateRow}>
                      <CalendarDays size={15} color={theme.color.textPrimary} strokeWidth={2} />
                      <Text style={styles.value}>{formatDate(eligibility.nextEligibleAt)}</Text>
                    </View>
                  </>
                ) : null}
              </View>
            </View>
            <View style={styles.rule} />
            <View style={styles.columns}>
              <View style={[styles.flex, styles.columnLeft]}>
                <Text style={styles.caption}>Consumer Number</Text>
                <Text style={styles.value}>{maskNumber(data.connection.consumerNumber)}</Text>
              </View>
              <View style={[styles.flex, styles.columnRight]}>
                <Text style={styles.caption}>Distributor</Text>
                <Text style={styles.value} numberOfLines={1}>
                  {data.connection.distributor}
                </Text>
              </View>
            </View>
            <Button
              label="Book Refill"
              icon={CalendarDays}
              variant="pillar"
              pillarColor="lpg"
              disabled={!eligibility?.canBook}
              onPress={() => setSheetOpen(true)}
              style={styles.book}
            />
            {lockedReason ? (
              <View style={styles.locked}>
                <Info size={14} color={theme.color.textSecondary} strokeWidth={2} />
                <Text style={[styles.caption, styles.flex]}>{lockedReason}</Text>
              </View>
            ) : null}
          </Card>

          {eligibility?.activeBooking ? (
            <Card tone="lpg" onPress={() => openBooking(eligibility.activeBooking!.id)}>
              <View style={styles.current}>
                <View style={styles.flex}>
                  <Text style={styles.caption}>Current refill · {eligibility.activeBooking.reference}</Text>
                  <Text style={styles.value}>Booked {formatDate(eligibility.activeBooking.bookedAt)}</Text>
                </View>
                <StatusPill
                  tone={bookingStatus[eligibility.activeBooking.status].tone}
                  label={bookingStatus[eligibility.activeBooking.status].label}
                  size="small"
                />
              </View>
            </Card>
          ) : null}

          <SectionHeader title="Order History" style={styles.sectionHeader} />
          {data.bookings.length === 0 ? (
            <EmptyState icon={CylinderIcon} title="No refills yet" body="Book your first refill above." />
          ) : (
            <View style={styles.list}>
              {data.bookings.map((item) => {
                const status = bookingStatus[item.status];
                return (
                  <ListRow
                    key={item.id}
                    card
                    title={formatDate(item.bookedAt)}
                    subtitle={CYLINDER_LABEL[item.cylinder]}
                    leading={<IconTile icon={CylinderIcon} pillar="lpg" shape="rounded" size="medium" />}
                    trailing={<StatusPill tone={status.tone} label={status.label} size="small" />}
                    affordance="arrow"
                    onPress={() => openBooking(item.id)}
                  />
                );
              })}
            </View>
          )}

          <Card padded={false} style={styles.helpCard}>
            <ListRow
              title="Your registration"
              subtitle={`${data.connection.distributor} · Tap to change`}
              leading={<IconTile icon={UserCheck} pillar="lpg" size="medium" />}
              divider
              onPress={() => navigation.navigate('LpgRegister')}
            />
            <ListRow
              title="Problem with a delivery?"
              subtitle="Raise a complaint about a booking or your connection"
              leading={<IconTile icon={MessageSquareWarning} pillar="lpg" size="medium" />}
              divider
              onPress={() => navigation.navigate('LpgRaiseComplaint')}
            />
            <ListRow
              title="My complaints"
              subtitle="Status and escalation"
              leading={<IconTile icon={List} pillar="lpg" size="medium" />}
              onPress={() => navigation.navigate('LpgMyComplaints')}
            />
          </Card>

          <BookRefillSheet
            visible={sheetOpen}
            defaultCylinder={data.connection.cylinder}
            booking={booking}
            onClose={() => setSheetOpen(false)}
            onConfirm={confirm}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  connection: {
    padding: theme.space.l,
  },
  connectionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.l,
  },
  connectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pushRight: {
    marginLeft: 'auto',
  },
  caption: {
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
  },
  gapTop: {
    marginTop: theme.space.xs,
  },
  connectionTitle: {
    ...theme.type.largeTitle,
    fontSize: 20,
    lineHeight: 27,
    color: theme.color.textPrimary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  value: {
    ...theme.type.body,
    fontSize: 15,
    fontWeight: '500',
    color: theme.color.textPrimary,
    marginTop: 2,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.borderStrong,
    marginVertical: theme.space.m,
  },
  columns: {
    flexDirection: 'row',
  },
  columnLeft: {
    paddingRight: theme.space.m,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.color.borderStrong,
  },
  columnRight: {
    paddingLeft: theme.space.m,
  },
  book: {
    marginTop: theme.space.l,
  },
  locked: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.s,
    marginTop: theme.space.s,
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  sectionHeader: {
    marginTop: theme.space.s,
  },
  list: {
    gap: theme.space.s,
  },
  helpCard: {
    paddingHorizontal: theme.space.l,
    marginTop: theme.space.s,
  },
});
