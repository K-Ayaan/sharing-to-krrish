import type { StatusTone } from '../../components/ui/StatusPill';
import {
  getEnquiries,
  getStockItem,
  type EnquiryChannel,
  type LivestockEnquiry,
} from '../../data/mock/mockLivestock';
import {
  complaintCategories,
  getComplaints,
  getRequests,
  type Complaint,
  type RefillRequest,
} from '../../data/mock/mockLpg';
import type { Pillar } from '../../data/mock/mockUser';
import {
  getCollectionLogs,
  getPickups,
  getProduce,
  mockVanDhanHome,
  type CollectionLog,
  type Grievance,
  type Pickup,
} from '../../data/mock/mockVanDhan';
import { speciesName } from '../livestock/livestockFormat';
import { requestStageMeta } from '../lpg/lpgFormat';
import { grievanceStageMeta, pickupStatusMeta } from '../vandhan/vanDhanFormat';

// Records owns no data. Every record is derived, on each read, from the pillar mocks the rest
// of the app writes to — so a collection logged in LogCollection, a booking made in
// EnterBookingReference or an enquiry started from StockDetails appears here immediately, and
// the two can never drift apart.
//
// Livestock's only records are enquiries: the app is buyer-only and enquiry-only, so there is
// no in-app purchase, ownership or intake to record. See flow.md's HealthCertificate resolution.

export type AppRecord =
  | { kind: 'vandhan_collection'; data: CollectionLog }
  | { kind: 'vandhan_pickup'; data: Pickup }
  | { kind: 'vandhan_grievance'; data: Grievance }
  | { kind: 'livestock_enquiry'; data: LivestockEnquiry }
  | { kind: 'lpg_refill'; data: RefillRequest }
  | { kind: 'lpg_complaint'; data: Complaint };

export type RecordSummary = {
  recordId: string;
  pillar: Pillar;
  title: string;
  subtitle: string;
  occurredAt: string;
  status: { label: string; tone: StatusTone };
};

export const recordIdOf = (record: AppRecord) => `${record.kind}:${record.data.id}`;

export function getRecords(): AppRecord[] {
  const grievance = mockVanDhanHome.activeGrievance;
  return [
    ...getCollectionLogs().map((data): AppRecord => ({ kind: 'vandhan_collection', data })),
    ...getPickups().map((data): AppRecord => ({ kind: 'vandhan_pickup', data })),
    ...(grievance ? [{ kind: 'vandhan_grievance', data: grievance } satisfies AppRecord] : []),
    ...getEnquiries().map((data): AppRecord => ({ kind: 'livestock_enquiry', data })),
    ...getRequests().map((data): AppRecord => ({ kind: 'lpg_refill', data })),
    ...getComplaints().map((data): AppRecord => ({ kind: 'lpg_complaint', data })),
  ];
}

export const getRecord = (recordId: string) =>
  getRecords().find((record) => recordIdOf(record) === recordId);

export const produceName = (produceId: string) => getProduce(produceId)?.name ?? produceId;

export const complaintCategoryName = (complaint: Complaint) =>
  complaintCategories.find((category) => category.id === complaint.categoryId)?.name ?? complaint.categoryId;

export const enquiryChannelLabel: Record<EnquiryChannel, string> = {
  call: 'Phone call',
  whatsapp: 'WhatsApp',
};

export function summarize(record: AppRecord): RecordSummary {
  const recordId = recordIdOf(record);

  switch (record.kind) {
    case 'vandhan_collection': {
      const log = record.data;
      return {
        recordId,
        pillar: 'vandhan',
        title: 'Collection record',
        subtitle: `${produceName(log.produceId)} – ${log.quantity} ${log.unit}`,
        occurredAt: log.loggedAt,
        status: { label: 'Recorded', tone: 'success' },
      };
    }
    case 'vandhan_pickup': {
      const pickup = record.data;
      const meta = pickupStatusMeta[pickup.status];
      return {
        recordId,
        pillar: 'vandhan',
        title: 'Pickup request',
        subtitle: pickup.id,
        occurredAt: pickup.requestedAt,
        status: { label: meta.label, tone: meta.tone },
      };
    }
    case 'vandhan_grievance': {
      const grievance = record.data;
      const meta = grievanceStageMeta[grievance.stage];
      return {
        recordId,
        pillar: 'vandhan',
        title: 'Grievance',
        subtitle: grievance.id,
        occurredAt: grievance.submittedAt,
        status: { label: meta.label, tone: meta.tone },
      };
    }
    case 'livestock_enquiry': {
      const enquiry = record.data;
      const stock = getStockItem(enquiry.stockId);
      return {
        recordId,
        pillar: 'livestock',
        title: 'Stock enquiry',
        subtitle: `${stock ? speciesName(stock.species) : 'Stock'} · ${enquiry.stockId}`,
        occurredAt: enquiry.enquiredAt,
        status: { label: enquiryChannelLabel[enquiry.channel], tone: 'info' },
      };
    }
    case 'lpg_refill': {
      const request = record.data;
      const meta = requestStageMeta[request.stage];
      const deliveredAt = request.stageTimes.delivered;
      return {
        recordId,
        pillar: 'lpg',
        title: deliveredAt ? 'Cylinder delivered' : 'Refill request',
        subtitle: `Ref: ${request.bookingReference}`,
        occurredAt: deliveredAt ?? request.bookedAt,
        status: { label: meta.label, tone: meta.tone },
      };
    }
    case 'lpg_complaint': {
      const complaint = record.data;
      return {
        recordId,
        pillar: 'lpg',
        title: 'Complaint',
        subtitle: `${complaintCategoryName(complaint)} · ${complaint.id}`,
        occurredAt: complaint.submittedAt,
        status: { label: 'Submitted', tone: 'info' },
      };
    }
  }
}
