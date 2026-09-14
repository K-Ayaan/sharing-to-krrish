/** IOCL line from flow.md. Confirm it is the booking number (not a helpline) before release. */
const IOCL_BOOKING_PHONE = '18002333555';

export const BOOKING_INTERVAL_DAYS = 21;

/**
 * 'eligible' — booking is open and the last request was delivered, so Home's "Book Refill"
 *              opens RequestRefillSheet.
 * 'waiting'  — LpgHome.png's state: a request in progress and "Request refill" locked.
 * Submitting a booking reference in the app also moves 'eligible' into the waiting state.
 */
const MOCK_SCENARIO: 'eligible' | 'waiting' = 'eligible';

const DAY_MS = 24 * 60 * 60 * 1000;
const REQUEST_SEQUENCE_START = 438;
/** Days after booking at which each stage completes, in REQUEST_STAGES order. */
const STAGE_OFFSET_DAYS = [0, 1, 3, 5];
const DELIVERY_WINDOW_DAYS = { from: 4, to: 6 };

const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString();
const pad = (value: number, length = 2) => String(value).padStart(length, '0');

export type Urgency = 'normal' | 'urgent';

export type RequestStage = 'reference_submitted' | 'consolidated' | 'batch_published' | 'delivered';

export const REQUEST_STAGES: RequestStage[] = [
  'reference_submitted',
  'consolidated',
  'batch_published',
  'delivered',
];

export type LpgConnection = {
  lpgId: string;
  consumerNumber: string;
  lastBookingAt: string;
};

export type RefillRequest = {
  id: string;
  bookingReference: string;
  urgency: Urgency;
  bookedAt: string;
  stage: RequestStage;
  stageTimes: Record<RequestStage, string | null>;
  expectedDelivery: { from: string; to: string };
};

export type ComplaintCategoryId =
  | 'unable_to_book'
  | 'lpg_id_suspended'
  | 'login_issue'
  | 'unable_to_call'
  | 'delivery_timing';

export type Complaint = {
  id: string;
  categoryId: ComplaintCategoryId;
  description: string | null;
  requestId: string | null;
  submittedAt: string;
};

export const complaintCategories: { id: ComplaintCategoryId; name: string }[] = [
  { id: 'unable_to_book', name: 'Unable to book' },
  { id: 'lpg_id_suspended', name: 'LPG ID suspended' },
  { id: 'login_issue', name: 'Login issue' },
  { id: 'unable_to_call', name: 'Unable to make the call' },
  { id: 'delivery_timing', name: 'Delivery timing' },
];

export const mockLpgHome = {
  tagline: 'Clean energy for a greener Nagaland.',
  banner: { id: 'ann-lpg-connection-camp', text: 'New connection camp at Dimapur on 22nd Aug.' },
  ioclBookingPhone: IOCL_BOOKING_PHONE,
};

function makeRequest(
  id: string,
  bookingReference: string,
  bookedDaysAgo: number,
  stage: RequestStage,
  urgency: Urgency
): RefillRequest {
  const reached = REQUEST_STAGES.indexOf(stage);
  const stageTimes = Object.fromEntries(
    REQUEST_STAGES.map((name, index) => [
      name,
      index <= reached ? daysFromNow(STAGE_OFFSET_DAYS[index] - bookedDaysAgo) : null,
    ])
  ) as Record<RequestStage, string | null>;

  return {
    id,
    bookingReference,
    urgency,
    bookedAt: daysFromNow(-bookedDaysAgo),
    stage,
    stageTimes,
    expectedDelivery: {
      from: daysFromNow(DELIVERY_WINDOW_DAYS.from - bookedDaysAgo),
      to: daysFromNow(DELIVERY_WINDOW_DAYS.to - bookedDaysAgo),
    },
  };
}

// ---- In-memory "API": a booking made in the app is what LpgHome and RequestStatus then show.

const requests: RefillRequest[] =
  MOCK_SCENARIO === 'eligible'
    ? [makeRequest('REQ-2025-0412', '5H2M8Q1', 23, 'delivered', 'normal')]
    : [makeRequest('REQ-2025-0437', '6J7K9L2', 2, 'consolidated', 'normal')];

const connection: LpgConnection = {
  lpgId: '1234567890',
  consumerNumber: '76543210',
  lastBookingAt: requests[requests.length - 1].bookedAt,
};

const complaints: Complaint[] = [];

export const getConnection = (): LpgConnection => connection;

export const nextEligibleDate = (lpg: LpgConnection) =>
  new Date(new Date(lpg.lastBookingAt).getTime() + BOOKING_INTERVAL_DAYS * DAY_MS);

export const getLatestRequest = (): RefillRequest | null => requests[requests.length - 1] ?? null;

export const getRequest = (id: string) => requests.find((request) => request.id === id);

export async function submitBookingReference(input: {
  bookingReference: string;
  urgency: Urgency;
}): Promise<RefillRequest> {
  const request = makeRequest(
    `REQ-2025-${pad(REQUEST_SEQUENCE_START + requests.length, 4)}`,
    input.bookingReference,
    0,
    'reference_submitted',
    input.urgency
  );
  requests.push(request);
  connection.lastBookingAt = request.bookedAt;
  return request;
}

export async function submitComplaint(input: {
  categoryId: ComplaintCategoryId;
  description: string | null;
  requestId: string | null;
}): Promise<Complaint> {
  const now = new Date();
  const complaint: Complaint = {
    id: `CMP-${now.getFullYear()}-${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(complaints.length + 1, 3)}`,
    ...input,
    submittedAt: now.toISOString(),
  };
  complaints.push(complaint);
  return complaint;
}

export const getComplaint = (id: string) => complaints.find((complaint) => complaint.id === id);

export const getRequests = (): readonly RefillRequest[] => requests;

export const getComplaints = (): readonly Complaint[] => complaints;

// ---- One derived view of LPG state, shared by Home's status card and LpgHome.

export type LpgSummary = {
  connection: LpgConnection;
  nextEligibleAt: string;
  /** Whole calendar days until booking opens; 0 or less means it's open. */
  daysUntilEligible: number;
  canBook: boolean;
  latestRequest: RefillRequest | null;
  /** The latest request while it's still undelivered. */
  activeRequest: RefillRequest | null;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export function getLpgSummary(today = new Date()): LpgSummary {
  const nextEligible = nextEligibleDate(connection);
  const daysUntilEligible = Math.round((startOfDay(nextEligible) - startOfDay(today)) / DAY_MS);
  const latestRequest = getLatestRequest();

  return {
    connection,
    nextEligibleAt: nextEligible.toISOString(),
    daysUntilEligible,
    canBook: daysUntilEligible <= 0,
    latestRequest,
    activeRequest: latestRequest && latestRequest.stage !== 'delivered' ? latestRequest : null,
  };
}
