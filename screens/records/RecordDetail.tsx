import type { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import { getStockItem } from '../../data/mock/mockLivestock';
import type { RecordsScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate, formatDateTime } from '../formatDate';
import { sexName, speciesIcon, speciesName, weightName } from '../livestock/livestockFormat';
import { formatDateRange, requestSteps, urgencyLabel } from '../lpg/lpgFormat';
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

type IconName = keyof typeof Ionicons.glyphMap;
type Fact = { icon: IconName; label: string; value: string; detail?: string };
type Navigation = RecordsScreenProps<'RecordDetail'>['navigation'];

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

// One renderer per record type. There is deliberately no HealthCertificate case (flow.md).
function RecordBody({ record }: { record: AppRecord }) {
  switch (record.kind) {
    case 'vandhan_collection': {
      const log = record.data;
      return (
        <FactList
          facts={[
            { icon: 'leaf', label: 'Produce', value: produceName(log.produceId) },
            { icon: 'scale-outline', label: 'Quantity', value: `${log.quantity} ${log.unit}` },
            { icon: 'car', label: 'Collection type', value: COLLECTION_TYPE_LABELS[log.type] },
            ...(log.note ? [{ icon: 'create-outline' as const, label: 'Note', value: log.note }] : []),
            { icon: 'time', label: 'Logged on', value: formatDateTime(log.loggedAt) },
          ]}
        />
      );
    }
    case 'vandhan_pickup': {
      const pickup = record.data;
      return (
        <>
          <StatusTracker steps={pickupSteps(pickup, 'dateTime')} />
          <FactList
            facts={[
              { icon: 'calendar', label: 'Scheduled for', value: formatDate(pickup.scheduledFor) },
              {
                icon: 'home',
                label: 'Address',
                value: pickup.address.village,
                detail: `${pickup.address.district}, ${pickup.address.state}`,
              },
              ...(pickup.notes ? [{ icon: 'create-outline' as const, label: 'Notes', value: pickup.notes }] : []),
            ]}
          />
        </>
      );
    }
    case 'vandhan_grievance': {
      const grievance = record.data;
      return (
        <>
          <FactList
            facts={[
              { icon: 'chatbubble-ellipses', label: 'Subject', value: grievance.subject },
              { icon: 'time', label: 'Submitted on', value: formatDateTime(grievance.submittedAt) },
            ]}
          />
          <StatusTracker orientation="vertical" steps={grievanceSteps(grievance)} />
        </>
      );
    }
    case 'livestock_enquiry': {
      const enquiry = record.data;
      const stock = getStockItem(enquiry.stockId);
      const stockFacts: Fact[] = stock
        ? [
            {
              icon: speciesIcon[stock.species],
              label: 'Stock',
              value: `${speciesName(stock.species)} · ${sexName(stock.sex)}`,
              detail: weightName(stock.weightBand),
            },
            { icon: 'location', label: 'Collection centre', value: stock.centre.name },
          ]
        : [];
      return (
        <FactList
          facts={[
            { icon: 'pricetag-outline', label: 'Stock ID', value: enquiry.stockId },
            ...stockFacts,
            {
              icon: enquiry.channel === 'call' ? 'call' : 'logo-whatsapp',
              label: 'Enquired by',
              value: enquiryChannelLabel[enquiry.channel],
            },
            { icon: 'time', label: 'Enquired on', value: formatDateTime(enquiry.enquiredAt) },
          ]}
        />
      );
    }
    case 'lpg_refill': {
      const request = record.data;
      const deliveredAt = request.stageTimes.delivered;
      return (
        <>
          <StatusTracker steps={requestSteps(request, 'dateTime')} />
          <FactList
            facts={[
              { icon: 'document-text', label: 'Booking reference', value: request.bookingReference },
              { icon: 'calendar', label: 'Booked on', value: formatDate(request.bookedAt) },
              { icon: 'flame', label: 'Urgency', value: urgencyLabel[request.urgency] },
              deliveredAt
                ? { icon: 'car', label: 'Delivered', value: formatDate(deliveredAt) }
                : {
                    icon: 'car',
                    label: 'Expected delivery',
                    value: formatDateRange(request.expectedDelivery.from, request.expectedDelivery.to),
                    detail: '(Estimated)',
                  },
            ]}
          />
        </>
      );
    }
    case 'lpg_complaint': {
      const complaint = record.data;
      const linked = getRecords().find(
        (other) => other.kind === 'lpg_refill' && other.data.id === complaint.requestId
      );
      return (
        <FactList
          facts={[
            { icon: 'alert-circle-outline', label: 'Category', value: complaintCategoryName(complaint) },
            { icon: 'create-outline', label: 'Description', value: complaint.description ?? 'No description given' },
            ...(linked && linked.kind === 'lpg_refill'
              ? [{ icon: 'document-text' as const, label: 'Refill request', value: linked.data.bookingReference }]
              : []),
            { icon: 'time', label: 'Submitted on', value: formatDateTime(complaint.submittedAt) },
          ]}
        />
      );
    }
  }
}

// Reuses the pillar's own detail screen where one exists (flow.md). Every level passes
// `pop: true` so jumping across tabs never stacks a duplicate.
function PillarLink({ record, navigation }: { record: AppRecord; navigation: Navigation }) {
  switch (record.kind) {
    case 'vandhan_pickup':
      return (
        <Button
          label="Open in Van Dhan"
          variant="secondary"
          trailingIcon="arrow-forward"
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
        <Button
          label="Open in Van Dhan"
          variant="secondary"
          trailingIcon="arrow-forward"
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
        <Button
          label="View stock"
          variant="secondary"
          trailingIcon="arrow-forward"
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
        <Button
          label={record.kind === 'lpg_refill' ? 'Open in LPG' : 'View related refill request'}
          variant="secondary"
          trailingIcon="arrow-forward"
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

  useLayoutEffect(() => {
    if (summary) navigation.setOptions({ title: summary.title });
  }, [navigation, summary?.title]);

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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <Card style={styles.section}>
        <View style={styles.headerRow}>
          <Avatar icon={meta.icon} iconColor={meta.colors.icon} tint={meta.colors.tint} size="l" />
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
        <RecordBody key={recordIdOf(record)} record={record} />
      </Card>

      <PillarLink record={record} navigation={navigation} />
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
  title: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
