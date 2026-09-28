import { ReactNode, useLayoutEffect, useReducer, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AppIconName } from '../../components/ui/AppIcon';
import { AppearanceProvider, type AppearanceName } from '../../components/ui/Appearance';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { enquiryMessage, getStockItem } from '../../data/mock/mockLivestock';
import { COUNTRY_CODE } from '../../data/mock/mockOnboarding';
import type { Pillar } from '../../data/mock/mockUser';
import {
  cancelCollection,
  cancelPickup,
  canCancelCollection,
  canCancelPickup,
} from '../../data/mock/mockVanDhan';
import type { RecordsScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate, formatDateTime, formatWeekdayDate } from '../formatDate';
import { enquiryLabels, sexName, speciesIcon, speciesName, weightName } from '../livestock/livestockFormat';
import { formatDateRange, requestSteps, urgencyLabel } from '../lpg/lpgFormat';
import { formatPhone } from '../onboarding/formatPhone';
import { pillarMeta } from '../pillarMeta';
import { grievanceSteps, pickupSteps } from '../vandhan/vanDhanFormat';
import {
  complaintCategoryName,
  enquiryChannelLabel,
  getRecord,
  getRecords,
  produceName,
  recordIdOf,
  summarize,
  type AppRecord,
} from './recordSource';

type Fact = { icon: AppIconName; label: string; value: string; detail?: string };
type Navigation = RecordsScreenProps<'RecordDetail'>['navigation'];

/** Each record's detail page takes its pillar's redesigned look (redesign batch 6). */
const PILLAR_APPEARANCE: Record<Pillar, AppearanceName> = {
  vandhan: 'vandhan',
  livestock: 'livestock',
  lpg: 'lpg',
};

const PILLAR_PALETTE = {
  vandhan: theme.vandhan.color,
  livestock: theme.livestock.color,
  lpg: theme.lpg.color,
} as const;

const COLLECTION_TYPE_LABELS = {
  bringing_now: 'Bringing it now',
  pre_logged: 'Pre-logged for later',
} as const;

function FactList({ facts }: { facts: Fact[] }) {
  return (
    <View>
      {facts.map((fact, index) => (
        <DetailRow
          key={fact.label}
          iconTinted
          icon={fact.icon}
          label={fact.label}
          value={fact.value}
          detail={fact.detail}
          divider={index < facts.length - 1}
        />
      ))}
    </View>
  );
}

type RecordContent = {
  /** Progress shown under the heading in the header card. */
  tracker?: ReactNode;
  facts: Fact[];
};

// One description per record type. There is deliberately no HealthCertificate case (flow.md).
// Every fact the record carries is kept; "Category" leads and "Submitted on" dates it, as in the
// redesigned detail pages.
function recordContent(record: AppRecord, category: string): RecordContent {
  const categoryFact: Fact = { icon: 'alert-circle-outline', label: 'Category', value: category };

  switch (record.kind) {
    case 'vandhan_collection': {
      const log = record.data;
      return {
        facts: [
          categoryFact,
          ...(log.note ? [{ icon: 'document-text-outline' as const, label: 'Description', value: log.note }] : []),
          { icon: 'leaf', label: 'Produce', value: produceName(log.produceId) },
          { icon: 'cube-outline', label: 'Quantity', value: `${log.quantity} ${log.unit}` },
          { icon: 'car', label: 'Collection type', value: COLLECTION_TYPE_LABELS[log.type] },
          ...(log.deliveryDate
            ? [{ icon: 'calendar' as const, label: 'Delivery date', value: formatWeekdayDate(log.deliveryDate) }]
            : []),
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(log.loggedAt) },
          ...(log.cancelledAt
            ? [{ icon: 'close-circle' as const, label: 'Cancelled on', value: formatDateTime(log.cancelledAt) }]
            : []),
        ],
      };
    }
    case 'vandhan_pickup': {
      const pickup = record.data;
      return {
        tracker: pickup.cancelledAt ? undefined : <StatusTracker steps={pickupSteps(pickup, 'dateTime')} />,
        facts: [
          categoryFact,
          ...(pickup.notes
            ? [{ icon: 'document-text-outline' as const, label: 'Description', value: pickup.notes }]
            : []),
          {
            icon: 'leaf',
            label: 'Produce',
            value: produceName(pickup.produceId),
            detail: `${pickup.quantity} ${pickup.unit}`,
          },
          { icon: 'calendar', label: 'Scheduled for', value: formatDate(pickup.scheduledFor) },
          {
            icon: 'home',
            label: 'Address',
            value: pickup.address.village,
            detail: `${pickup.address.district}, ${pickup.address.state}`,
          },
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(pickup.requestedAt) },
          ...(pickup.cancelledAt
            ? [{ icon: 'close-circle' as const, label: 'Cancelled on', value: formatDateTime(pickup.cancelledAt) }]
            : []),
        ],
      };
    }
    case 'vandhan_grievance': {
      const grievance = record.data;
      return {
        tracker: <StatusTracker orientation="vertical" steps={grievanceSteps(grievance)} />,
        facts: [
          categoryFact,
          { icon: 'document-text-outline', label: 'Description', value: grievance.subject },
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(grievance.submittedAt) },
        ],
      };
    }
    case 'livestock_enquiry': {
      const enquiry = record.data;
      const stock = getStockItem(enquiry.stockId);
      return {
        facts: [
          categoryFact,
          // The message the enquiry opened with — the same text StockDetails prefills for WhatsApp.
          ...(stock
            ? [
                {
                  icon: 'document-text-outline' as const,
                  label: 'Description',
                  value: enquiryMessage(stock, enquiryLabels(stock)),
                },
              ]
            : []),
          { icon: 'pricetag-outline', label: 'Stock ID', value: enquiry.stockId },
          ...(stock
            ? [
                {
                  icon: speciesIcon[stock.species],
                  label: 'Stock',
                  value: `${speciesName(stock.species)} · ${sexName(stock.sex)}`,
                  detail: weightName(stock.weightBand),
                },
                { icon: 'location' as const, label: 'Collection centre', value: stock.centre.name },
              ]
            : []),
          {
            icon: enquiry.channel === 'call' ? 'call' : 'logo-whatsapp',
            label: 'Enquired by',
            value: enquiryChannelLabel[enquiry.channel],
          },
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(enquiry.enquiredAt) },
        ],
      };
    }
    case 'lpg_refill': {
      const request = record.data;
      const deliveredAt = request.stageTimes.delivered;
      return {
        tracker: <StatusTracker steps={requestSteps(request, 'dateTime')} />,
        facts: [
          categoryFact,
          { icon: 'document-text-outline', label: 'Refill request', value: `Ref: ${request.bookingReference}` },
          { icon: 'flame', label: 'Urgency', value: urgencyLabel[request.urgency] },
          deliveredAt
            ? { icon: 'car', label: 'Delivered', value: formatDate(deliveredAt) }
            : {
                icon: 'car',
                label: 'Expected delivery',
                value: formatDateRange(request.expectedDelivery.from, request.expectedDelivery.to),
                detail: '(Estimated)',
              },
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(request.bookedAt) },
        ],
      };
    }
    case 'lpg_complaint': {
      const complaint = record.data;
      const linked = getRecords().find(
        (other) => other.kind === 'lpg_refill' && other.data.id === complaint.requestId
      );
      return {
        facts: [
          { icon: 'alert-circle-outline', label: 'Category', value: complaintCategoryName(complaint) },
          { icon: 'document-text-outline', label: 'Description', value: complaint.description },
          ...(linked && linked.kind === 'lpg_refill'
            ? [{ icon: 'document-text' as const, label: 'Refill request', value: `Ref: ${linked.data.bookingReference}` }]
            : complaint.bookingReference
              ? [{ icon: 'document-text' as const, label: 'Booking reference', value: complaint.bookingReference }]
              : []),
          {
            icon: complaint.contactMethod === 'call' ? 'call' : 'chatbubble-ellipses-outline',
            label: 'Contact by',
            value: complaint.contactMethod === 'call' ? 'Phone call' : 'SMS',
            detail: `${COUNTRY_CODE} ${formatPhone(complaint.contactPhone)}`,
          },
          ...(complaint.photoUris.length > 0
            ? [{ icon: 'image-outline' as const, label: 'Photos', value: `${complaint.photoUris.length} attached` }]
            : []),
          { icon: 'calendar-outline', label: 'Submitted on', value: formatDateTime(complaint.submittedAt) },
        ],
      };
    }
  }
}

type Cancellation = {
  label: string;
  confirmTitle: string;
  confirmMessage: string;
  done: string;
  run: () => Promise<unknown>;
};

// Van Dhan pickups (until collected) and collection logs can be withdrawn from Records.
// Livestock enquiries and LPG records have no cancellation yet.
function cancellationFor(record: AppRecord): Cancellation | null {
  switch (record.kind) {
    case 'vandhan_pickup':
      if (!canCancelPickup(record.data)) return null;
      return {
        label: 'Cancel pickup request',
        confirmTitle: 'Cancel this pickup?',
        confirmMessage: "The kendra won't visit for this request. You can schedule a new pickup any time.",
        done: 'Pickup request cancelled',
        run: () => cancelPickup(record.data.id),
      };
    case 'vandhan_collection':
      if (!canCancelCollection(record.data)) return null;
      return {
        label: 'Cancel collection',
        confirmTitle: 'Cancel this collection?',
        confirmMessage: 'It will be withdrawn from your kendra. You can log a new collection any time.',
        done: 'Collection cancelled',
        run: () => cancelCollection(record.data.id),
      };
    default:
      return null;
  }
}

function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Button label={label} icon="open-outline" trailingIcon="arrow-forward" variant="secondary" onPress={onPress} />;
}

// Reuses the pillar's own detail screen where one exists (flow.md). Every level passes
// `pop: true` so jumping across tabs never stacks a duplicate.
function PillarLink({ record, navigation }: { record: AppRecord; navigation: Navigation }) {
  switch (record.kind) {
    case 'vandhan_pickup':
      return (
        <LinkButton
          label="Open in Van Dhan"
          onPress={() =>
            navigation.navigate('ServicesTab', {
              screen: 'VanDhanStack',
              initial: false,
              pop: true,
              params: { screen: 'PickupDetails', initial: false, pop: true, params: { pickupId: record.data.id } },
            })
          }
        />
      );
    case 'vandhan_grievance':
      return (
        <LinkButton
          label="Open in Van Dhan"
          onPress={() =>
            navigation.navigate('ServicesTab', {
              screen: 'VanDhanStack',
              initial: false,
              pop: true,
              params: { screen: 'GrievanceStatus', initial: false, pop: true },
            })
          }
        />
      );
    case 'livestock_enquiry': {
      const { stockId } = record.data;
      if (!getStockItem(stockId)) return null;
      return (
        <LinkButton
          label="View stock"
          onPress={() =>
            navigation.navigate('ServicesTab', {
              screen: 'LivestockStack',
              initial: false,
              pop: true,
              params: { screen: 'StockDetails', initial: false, pop: true, params: { stockId } },
            })
          }
        />
      );
    }
    case 'lpg_refill':
    case 'lpg_complaint': {
      const requestId = record.kind === 'lpg_refill' ? record.data.id : record.data.requestId;
      if (!requestId) return null;
      return (
        <LinkButton
          label={record.kind === 'lpg_refill' ? 'Open in LPG' : 'View related refill request'}
          onPress={() =>
            navigation.navigate('ServicesTab', {
              screen: 'LpgStack',
              initial: false,
              pop: true,
              params: { screen: 'RequestStatus', initial: false, pop: true, params: { requestId } },
            })
          }
        />
      );
    }
    case 'vandhan_collection':
      // No pillar screen shows a single collection log; this detail view is the record.
      return null;
  }
}

export default function RecordDetail({ navigation, route }: RecordsScreenProps<'RecordDetail'>) {
  const record = getRecord(route.params.recordId);
  const summary = record ? summarize(record) : null;
  const [toast, setToast] = useState<string | null>(null);
  // The mock mutates in place, so re-read the record after cancelling.
  const [, refresh] = useReducer((count: number) => count + 1, 0);
  const palette = summary ? PILLAR_PALETTE[summary.pillar] : theme.color;

  // Title per record type; the header takes the pillar's page colour and a dark back button.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...(summary ? { title: summary.title } : {}),
      headerStyle: { backgroundColor: palette.background },
      headerTintColor: palette.textPrimary,
    });
  }, [navigation, summary?.title, palette]);

  if (!record || !summary) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>This record is no longer available.</Text>
        </Card>
      </ScrollView>
    );
  }

  const meta = pillarMeta[summary.pillar];
  const cancellation = cancellationFor(record);
  const content = recordContent(record, summary.title);

  // Destructive, so it always goes through a confirmation first (as Settings' "Log out" does).
  const confirmCancel = (action: Cancellation) =>
    Alert.alert(action.confirmTitle, action.confirmMessage, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: action.label,
        style: 'destructive',
        onPress: async () => {
          try {
            await action.run();
            setToast(action.done);
          } catch (failure) {
            setToast(failure instanceof Error ? failure.message : "Couldn't cancel. Please try again.");
          } finally {
            refresh();
          }
        },
      },
    ]);

  return (
    <AppearanceProvider appearance={PILLAR_APPEARANCE[summary.pillar]}>
      <View style={[styles.screen, { backgroundColor: palette.background }]}>
        {/* Behind the whole page, not inside the scroll content, so it always spans the full screen
            (this header has no large title, so the ScrollView needn't be the first view). */}
        <ScenicBackdrop />
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
          <Card elevated style={styles.section}>
            <View style={styles.headerRow}>
              <Thumbnail uri={null} fallbackIcon={meta.icon} iconColor={meta.colors.icon} tint={meta.colors.tint} size="l" />
              <View style={styles.flex}>
                <Text style={styles.caption}>{meta.label}</Text>
                <Text accessibilityRole="header" style={styles.title}>
                  {summary.title}
                </Text>
                <Text selectable style={styles.secondary}>
                  {summary.subtitle}
                </Text>
              </View>
              <StatusPill label={summary.status.label} tone={summary.status.tone} />
            </View>
            {content.tracker}
          </Card>

          <Card elevated>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Details
            </Text>
            <FactList key={recordIdOf(record)} facts={content.facts} />
          </Card>

          <PillarLink record={record} navigation={navigation} />
          {cancellation ? (
            <Button
              label={cancellation.label}
              icon="close-circle-outline"
              variant="danger"
              onPress={() => confirmCancel(cancellation)}
            />
          ) : null}
          <TabBarSpacer />
        </ScrollView>
        <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
      </View>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
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
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  title: {
    ...theme.type.title,
    fontSize: theme.type.title.fontSize + theme.space.xs,
    fontWeight: '800',
    color: theme.color.textPrimary,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
    paddingBottom: theme.space.s,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
