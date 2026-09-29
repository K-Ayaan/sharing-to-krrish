// SDD S-04 "My records": the user's own entries across every service, with status. Each source
// entity (collection, booking, batch…) is normalised into one shape so Records and Record
// Details render any of them the same way. Record ids are "<kind>:<source id>".
import { SPECIES_LABEL, type Species } from '../data/mock/mockLivestock';
import { COMPLAINT_CATEGORIES, CYLINDER_LABEL } from '../data/mock/mockLpg';
import { LOAN_PURPOSES, STAGE_LABEL, STAGES } from '../data/mock/mockMicroFinance';
import type { PillarKey } from '../data/mock/mockUser';
import { GRIEVANCE_CATEGORIES, type ProduceGlyph } from '../data/mock/mockVanDhan';
import {
  formatDate,
  formatDateTime,
  formatINR,
  formatQuantity,
  formatTime,
  groupIndian,
} from '../utils/format';
import { NotFoundError, request } from './client';
import { db } from './db';

export type RecordKind = 'collection' | 'grievance' | 'booking' | 'complaint' | 'batch' | 'event' | 'application';
export type RecordStatus = 'completed' | 'pending' | 'in_progress' | 'rejected';
export type StepState = 'done' | 'current' | 'upcoming' | 'failed';

export type RecordSummary = {
  id: string;
  kind: RecordKind;
  sourceId: string;
  pillar: PillarKey;
  title: string;
  subtitle: string;
  at: string;
  status: RecordStatus;
  statusLabel: string;
  delivery?: boolean;
};

export type RecordThumb =
  | { type: 'produce'; glyph: ProduceGlyph }
  | { type: 'species'; species: Species }
  | { type: 'pillar' };

export type DetailIcon =
  | 'quantity' | 'product' | 'calendar' | 'reference' | 'location' | 'grade' | 'delivery'
  | 'cylinder' | 'distributor' | 'amount' | 'purpose' | 'tenure' | 'species' | 'weight'
  | 'person' | 'category' | 'note';

export type RecordDetail = RecordSummary & {
  kindLabel: string;
  heading: string;
  thumb: RecordThumb;
  banner: string | null;
  steps: { label: string; date: string | null; time: string | null; state: StepState }[];
  details: { icon: DetailIcon; label: string; value: string }[];
  note: { tone: 'alert' | 'info'; text: string } | null;
  certificateBatchId: string | null;
};

const step = (label: string, iso: string | null | undefined, state: StepState) => ({
  label,
  date: iso ? formatDate(iso) : null,
  time: iso ? formatTime(iso) : null,
  state,
});

function produceOf(id: string) {
  const produce = db.produce.find((item) => item.id === id);
  if (!produce) throw new NotFoundError('Produce');
  return produce;
}

// ---- summaries --------------------------------------------------------------------------------

function collectionSummaries(): RecordSummary[] {
  return db.collections.map((c) => ({
    id: `collection:${c.id}`,
    kind: 'collection',
    sourceId: c.id,
    pillar: 'vandhan',
    title: `${produceOf(c.produceId).name} Collection`,
    subtitle: 'Van Dhan',
    at: c.submittedAt,
    status: c.status === 'verified' ? 'completed' : c.status === 'rejected' ? 'rejected' : 'pending',
    statusLabel: c.status === 'verified' ? 'Verified' : c.status === 'rejected' ? 'Rejected' : 'Pending',
  }));
}

function grievanceSummaries(): RecordSummary[] {
  return db.vdGrievances.map((g) => ({
    id: `grievance:${g.id}`,
    kind: 'grievance',
    sourceId: g.id,
    pillar: 'vandhan',
    title: 'Grievance',
    subtitle: GRIEVANCE_CATEGORIES.find((c) => c.value === g.category)?.label ?? 'Van Dhan',
    at: g.raisedAt,
    status: g.status === 'closed' ? 'completed' : g.status === 'in_review' ? 'in_progress' : 'pending',
    statusLabel: g.status === 'closed' ? 'Closed' : g.status === 'in_review' ? 'In Review' : 'Open',
  }));
}

const BOOKING_STATUS: Record<string, { status: RecordStatus; label: string; delivery?: boolean }> = {
  requested: { status: 'pending', label: 'Requested' },
  dispatch_arranged: { status: 'in_progress', label: 'Dispatch Arranged' },
  out_for_delivery: { status: 'in_progress', label: 'Out for Delivery', delivery: true },
  delivered: { status: 'completed', label: 'Delivered' },
  cancelled: { status: 'rejected', label: 'Cancelled' },
};

function bookingSummaries(): RecordSummary[] {
  return db.bookings.map((b) => ({
    id: `booking:${b.id}`,
    kind: 'booking',
    sourceId: b.id,
    pillar: 'lpg',
    title: 'LPG Refill Booking',
    subtitle: db.connection?.brand ?? 'LPG',
    at: b.bookedAt,
    status: BOOKING_STATUS[b.status].status,
    statusLabel: BOOKING_STATUS[b.status].label,
    delivery: BOOKING_STATUS[b.status].delivery,
  }));
}

function complaintSummaries(): RecordSummary[] {
  return db.complaints.map((c) => ({
    id: `complaint:${c.id}`,
    kind: 'complaint',
    sourceId: c.id,
    pillar: 'lpg',
    title: 'LPG Complaint',
    subtitle: COMPLAINT_CATEGORIES.find((item) => item.value === c.category)?.label ?? 'LPG',
    at: c.raisedAt,
    status: c.status === 'closed' ? 'completed' : c.status === 'in_review' ? 'in_progress' : 'pending',
    statusLabel: c.status === 'closed' ? 'Closed' : c.status === 'in_review' ? 'In Review' : 'Open',
  }));
}

const BATCH_STATUS: Record<string, { status: RecordStatus; label: string }> = {
  awaiting: { status: 'pending', label: 'Awaiting Inspection' },
  assigned: { status: 'in_progress', label: 'Vet Assigned' },
  certified: { status: 'completed', label: 'Certified' },
  rejected: { status: 'rejected', label: 'Rejected' },
};

function batchSummaries(): RecordSummary[] {
  return db.batches.map((b) => ({
    id: `batch:${b.id}`,
    kind: 'batch',
    sourceId: b.id,
    pillar: 'livestock',
    title: `Stock Report · ${SPECIES_LABEL[b.species]}`,
    subtitle: `${groupIndian(b.count)} animals`,
    at: b.reportedAt,
    status: BATCH_STATUS[b.status].status,
    statusLabel: BATCH_STATUS[b.status].label,
  }));
}

function eventSummaries(): RecordSummary[] {
  return db.events.map((e) => ({
    id: `event:${e.id}`,
    kind: 'event',
    sourceId: e.id,
    pillar: e.pillar,
    title: e.title,
    subtitle: e.provider,
    at: e.at,
    status: e.status === 'completed' ? 'completed' : 'pending',
    statusLabel: e.status === 'completed' ? 'Completed' : 'Scheduled',
  }));
}

function applicationSummaries(): RecordSummary[] {
  const a = db.application;
  if (!a) return [];
  return [
    {
      id: `application:${a.id}`,
      kind: 'application',
      sourceId: a.id,
      pillar: 'microfinance',
      title: 'Micro-Finance Application',
      subtitle: `${LOAN_PURPOSES.find((p) => p.value === a.purpose)?.label ?? 'Loan'} · ${formatINR(a.amount)}`,
      at: a.submittedAt,
      status: a.sanctioned ? 'completed' : 'in_progress',
      statusLabel: a.sanctioned ? 'Sanctioned' : 'In Progress',
    },
  ];
}

function allSummaries() {
  return [
    ...collectionSummaries(),
    ...grievanceSummaries(),
    ...bookingSummaries(),
    ...complaintSummaries(),
    ...batchSummaries(),
    ...eventSummaries(),
    ...applicationSummaries(),
  ].sort((a, b) => b.at.localeCompare(a.at));
}

export function getRecords() {
  return request(allSummaries);
}

export function getRecentActivity(limit = 2) {
  return request(() => allSummaries().slice(0, limit));
}

// ---- details ----------------------------------------------------------------------------------

function collectionDetail(id: string, summary: RecordSummary): RecordDetail {
  const c = db.collections.find((item) => item.id === id);
  if (!c) throw new NotFoundError('Collection');
  const produce = produceOf(c.produceId);
  const decided = c.status !== 'pending';
  return {
    ...summary,
    kindLabel: 'Collection Record',
    heading: produce.name,
    thumb: { type: 'produce', glyph: produce.glyph },
    banner: 'Supporting local livelihoods\nand sustainable forests',
    steps: [
      step('Submitted', c.submittedAt, 'done'),
      step('Under Review', c.reviewStartedAt, c.reviewStartedAt ? (decided ? 'done' : 'current') : 'current'),
      c.status === 'rejected'
        ? step('Rejected', c.decidedAt, 'failed')
        : step('Verified', c.decidedAt, c.status === 'verified' ? 'done' : 'upcoming'),
    ],
    details: [
      { icon: 'quantity', label: 'Quantity', value: formatQuantity(c.quantity, produce.unit) },
      { icon: 'product', label: 'Product', value: produce.name },
      { icon: 'grade', label: 'Grade', value: c.grade },
      { icon: 'calendar', label: 'Submitted On', value: formatDateTime(c.submittedAt) },
      ...(c.scheduledFor
        ? [{ icon: 'delivery' as const, label: 'Delivery', value: formatDateTime(c.scheduledFor) }]
        : []),
      { icon: 'reference', label: 'Reference ID', value: c.reference },
      { icon: 'location', label: 'Collection Centre', value: c.kendraName },
    ],
    note: c.rejectionReason ? { tone: 'alert', text: c.rejectionReason } : null,
    certificateBatchId: null,
  };
}

function grievanceDetail(id: string, summary: RecordSummary): RecordDetail {
  const g = db.vdGrievances.find((item) => item.id === id);
  if (!g) throw new NotFoundError('Grievance');
  return {
    ...summary,
    kindLabel: 'Grievance',
    heading: summary.subtitle,
    thumb: { type: 'pillar' },
    banner: null,
    steps: [
      step('Raised', g.raisedAt, 'done'),
      step('In Review', null, g.status === 'open' ? 'upcoming' : g.status === 'in_review' ? 'current' : 'done'),
      step('Resolved', null, g.status === 'closed' ? 'done' : 'upcoming'),
    ],
    details: [
      { icon: 'reference', label: 'Reference ID', value: g.reference },
      { icon: 'calendar', label: 'Raised On', value: formatDateTime(g.raisedAt) },
      { icon: 'location', label: 'Kendra', value: g.kendraName },
      { icon: 'person', label: 'With', value: g.withWhom },
    ],
    note: { tone: 'info', text: g.description },
    certificateBatchId: null,
  };
}

function bookingDetail(id: string, summary: RecordSummary): RecordDetail {
  const b = db.bookings.find((item) => item.id === id);
  if (!b) throw new NotFoundError('Booking');
  const order = ['requested', 'dispatch_arranged', 'out_for_delivery', 'delivered'];
  const reached = order.indexOf(b.status);
  const state = (index: number): StepState =>
    index < reached || b.status === 'delivered' ? 'done' : index === reached ? 'current' : 'upcoming';
  return {
    ...summary,
    kindLabel: 'Refill Booking',
    heading: CYLINDER_LABEL[b.cylinder],
    thumb: { type: 'pillar' },
    banner: null,
    steps: [
      step('Requested', b.bookedAt, 'done'),
      step('Dispatch', b.dispatchArrangedAt, state(1)),
      step('Out for Delivery', b.outForDeliveryAt, state(2)),
      step('Delivered', b.deliveredAt, b.status === 'delivered' ? 'done' : 'upcoming'),
    ],
    details: [
      { icon: 'reference', label: 'Booking Reference', value: b.reference },
      { icon: 'cylinder', label: 'Cylinder', value: CYLINDER_LABEL[b.cylinder] },
      { icon: 'calendar', label: 'Booked On', value: formatDateTime(b.bookedAt) },
      { icon: 'location', label: 'Dispatch Point', value: b.dispatchPoint ?? 'Shared once arranged' },
      { icon: 'distributor', label: 'Distributor', value: db.connection?.distributor ?? '—' },
      { icon: 'amount', label: 'Payable on Delivery', value: formatINR(b.payable) },
    ],
    note:
      b.status === 'requested'
        ? { tone: 'info', text: 'You’ll get a message with the dispatch location, date and time once it’s arranged. Bring your consumer number.' }
        : null,
    certificateBatchId: null,
  };
}

function complaintDetail(id: string, summary: RecordSummary): RecordDetail {
  const c = db.complaints.find((item) => item.id === id);
  if (!c) throw new NotFoundError('Complaint');
  return {
    ...summary,
    kindLabel: 'Complaint',
    heading: summary.subtitle,
    thumb: { type: 'pillar' },
    banner: null,
    steps: [
      step('Raised', c.raisedAt, 'done'),
      step(c.escalated ? 'Escalated' : 'In Review', null, c.status === 'open' ? 'upcoming' : c.status === 'in_review' ? 'current' : 'done'),
      step('Closed', null, c.status === 'closed' ? 'done' : 'upcoming'),
    ],
    details: [
      { icon: 'reference', label: 'Reference ID', value: c.reference },
      { icon: 'category', label: 'About', value: c.bookingReference ? `Booking ${c.bookingReference}` : 'My connection' },
      { icon: 'calendar', label: 'Raised On', value: formatDateTime(c.raisedAt) },
    ],
    note: { tone: 'info', text: `${c.description}\n\n${c.note}` },
    certificateBatchId: null,
  };
}

function batchDetail(id: string, summary: RecordSummary): RecordDetail {
  const b = db.batches.find((item) => item.id === id);
  if (!b) throw new NotFoundError('Batch');
  return {
    ...summary,
    kindLabel: 'Stock Report',
    heading: `${SPECIES_LABEL[b.species]} · ${groupIndian(b.count)} animals`,
    thumb: { type: 'species', species: b.species },
    banner: null,
    steps: [
      step('Reported', b.reportedAt, 'done'),
      step('Inspection', b.certificate?.inspectedAt ?? null, b.status === 'awaiting' ? 'current' : 'done'),
      b.status === 'rejected'
        ? step('Rejected', null, 'failed')
        : step('Certified', b.certificate?.inspectedAt ?? null, b.status === 'certified' ? 'done' : 'upcoming'),
    ],
    details: [
      { icon: 'reference', label: 'Batch', value: b.reference },
      { icon: 'weight', label: 'Live Weight', value: `${groupIndian(b.liveWeightKg)} kg` },
      { icon: 'amount', label: 'Price Expected', value: formatINR(b.expectedPrice) },
      { icon: 'location', label: 'Held At', value: b.location },
      { icon: 'person', label: 'Inspected By', value: b.inspectedBy ?? 'Not yet assigned' },
    ],
    note: b.rejectionReason
      ? { tone: 'alert', text: b.rejectionReason }
      : b.status === 'awaiting'
        ? { tone: 'info', text: 'Don’t move the animals until the inspection is recorded.' }
        : null,
    certificateBatchId: b.certificate ? b.id : null,
  };
}

function eventDetail(id: string, summary: RecordSummary): RecordDetail {
  const e = db.events.find((item) => item.id === id);
  if (!e) throw new NotFoundError('Record');
  return {
    ...summary,
    kindLabel: 'Service Record',
    heading: e.title,
    thumb: e.pillar === 'livestock' ? { type: 'species', species: 'cow' } : { type: 'pillar' },
    banner: null,
    steps: [step('Scheduled', null, 'done'), step('Completed', e.at, e.status === 'completed' ? 'done' : 'upcoming')],
    details: [
      { icon: 'calendar', label: 'Date', value: formatDateTime(e.at) },
      { icon: 'person', label: 'Provided By', value: e.provider },
      { icon: 'location', label: 'Location', value: e.location },
    ],
    note: e.notes ? { tone: 'info', text: e.notes } : null,
    certificateBatchId: null,
  };
}

function applicationDetail(id: string, summary: RecordSummary): RecordDetail {
  const a = db.application;
  if (!a || a.id !== id) throw new NotFoundError('Application');
  const reached = STAGES.indexOf(a.stage);
  const received = db.documents.filter((doc) => doc.receivedAt).length;
  return {
    ...summary,
    kindLabel: 'Loan Application',
    heading: formatINR(a.amount),
    thumb: { type: 'pillar' },
    banner: null,
    steps: [
      step(STAGE_LABEL.received, a.stageDates.received, 'done'),
      step(STAGE_LABEL[a.stage === 'received' ? 'documents' : a.stage], a.stageDates[a.stage] ?? null, a.sanctioned ? 'done' : 'current'),
      step(STAGE_LABEL.sanction, a.stageDates.sanction ?? null, a.sanctioned ? 'done' : reached >= 4 ? 'current' : 'upcoming'),
    ],
    details: [
      { icon: 'reference', label: 'Reference ID', value: a.reference },
      { icon: 'purpose', label: 'Purpose', value: LOAN_PURPOSES.find((p) => p.value === a.purpose)?.label ?? '—' },
      { icon: 'tenure', label: 'Tenure', value: `${a.tenureMonths} months` },
      { icon: 'note', label: 'Documents', value: `${received} of ${db.documents.length} received` },
    ],
    note: null,
    certificateBatchId: null,
  };
}

export function getRecord(recordId: string) {
  return request(() => {
    const [kind, sourceId] = recordId.split(':') as [RecordKind, string];
    const summary = allSummaries().find((item) => item.id === recordId);
    if (!summary) throw new NotFoundError('Record');
    switch (kind) {
      case 'collection':
        return collectionDetail(sourceId, summary);
      case 'grievance':
        return grievanceDetail(sourceId, summary);
      case 'booking':
        return bookingDetail(sourceId, summary);
      case 'complaint':
        return complaintDetail(sourceId, summary);
      case 'batch':
        return batchDetail(sourceId, summary);
      case 'event':
        return eventDetail(sourceId, summary);
      case 'application':
        return applicationDetail(sourceId, summary);
    }
  });
}
