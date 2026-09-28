export type NoticePillar = 'vandhan' | 'livestock' | 'lpg' | 'general';

export type NoticeAttachment = {
  id: string;
  fileName: string;
  sizeBytes: number;
  url: string | null;
};

export type Notice = {
  id: string;
  pillar: NoticePillar;
  title: string;
  summary: string;
  body: string[];
  publishedAt: string;
  read: boolean;
  attachment: NoticeAttachment | null;
};

const KB = 1024;
const REFRESH_LATENCY_MS = 800;

/** Local time `daysAgo` days back at hh:mm, so "Today"/"Yesterday" grouping stays live. */
function atDaysAgo(daysAgo: number, hours: number, minutes: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

// ---- In-memory store: opening a notice marks it read, as a real API call would.

const notices: Notice[] = [
  {
    id: 'ntc-vandhan-agarwood-msp',
    pillar: 'vandhan',
    title: 'MSP price update: Agarwood',
    summary: 'New MSP rate of ₹12,500/kg is now in effect.',
    body: [
      'The Minimum Support Price (MSP) for Agarwood has been revised to ₹12,500 per kg, effective immediately.',
      'This new rate applies at all registered Van Dhan Kendras across Nagaland.',
    ],
    publishedAt: atDaysAgo(0, 10, 30),
    read: false,
    attachment: { id: 'att-msp-order', fileName: 'MSP_Order_Agarwood.pdf', sizeBytes: 245 * KB, url: null },
  },
  {
    id: 'ann-2025-0812-vandhan-msp',
    pillar: 'vandhan',
    title: 'Van Dhan MSP price updated',
    summary: 'New minimum support prices for NTFP products are now in effect for 2025–26.',
    body: [
      'Revised minimum support prices for non-timber forest produce (NTFP) are now in effect for the 2025–26 season.',
      'Check the Van Dhan rate list or call the price line for the rate that applies to your produce.',
    ],
    publishedAt: atDaysAgo(0, 9, 40),
    read: false,
    attachment: null,
  },
  {
    id: 'ntc-lpg-subsidy',
    pillar: 'lpg',
    title: 'LPG subsidy update',
    summary: 'Revised subsidy rates apply from next month.',
    body: [
      'Revised LPG subsidy rates will apply to refills booked from next month.',
      'No action is needed — the updated subsidy is credited automatically to linked accounts.',
    ],
    publishedAt: atDaysAgo(0, 9, 15),
    read: false,
    attachment: null,
  },
  {
    id: 'ntc-livestock-fmd-vaccination',
    pillar: 'livestock',
    title: 'FMD vaccination drive',
    summary: 'Free vaccination camp at all block veterinary offices this week.',
    body: [
      'A free foot-and-mouth disease (FMD) vaccination camp is running at all block veterinary offices this week.',
      'The full schedule by block is attached.',
    ],
    publishedAt: atDaysAgo(1, 16, 20),
    read: true,
    attachment: {
      id: 'att-fmd-schedule',
      fileName: 'FMD_Vaccination_Schedule.pdf',
      sizeBytes: 180 * KB,
      url: null,
    },
  },
  {
    id: 'ann-2025-0811-dimapur-drive',
    pillar: 'vandhan',
    title: 'Collection drive in Dimapur district this week.',
    summary: 'Kendra staff will collect registered produce village by village.',
    body: [
      'Dimapur Kendra staff are running a collection drive across the district this week, visiting villages in turn.',
      'Schedule a pickup in Van Dhan to make sure your produce is on the route.',
    ],
    publishedAt: atDaysAgo(1, 11, 5),
    read: true,
    attachment: null,
  },
  {
    id: 'ntc-general-village-scheme',
    pillar: 'general',
    title: 'New village development scheme',
    summary: 'Applications are now open for the Tribal Livelihood Support Scheme.',
    body: [
      'Applications are now open for the Tribal Livelihood Support Scheme.',
      'Visit your nearest kendra for eligibility details.',
    ],
    publishedAt: atDaysAgo(2, 14, 15),
    read: true,
    attachment: null,
  },
  {
    id: 'ntc-vandhan-kendra-timing',
    pillar: 'vandhan',
    title: 'Collection centre timing change',
    summary: 'Chizami Van Dhan Kendra will now operate from 8:00 AM – 4:00 PM.',
    body: ['Chizami Van Dhan Kendra will now operate from 8:00 AM to 4:00 PM, Monday to Saturday.'],
    publishedAt: atDaysAgo(4, 10, 0),
    read: true,
    attachment: null,
  },
];

let lastFetchedAt = new Date().toISOString();

export const mockNotices: readonly Notice[] = notices;

export const getNotices = (): Notice[] => notices;

export const getNotice = (id: string) => notices.find((notice) => notice.id === id);

const listeners = new Set<() => void>();

/** Subscribe to read-state changes (useSyncExternalStore-compatible). */
export function subscribeToNotices(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getUnreadNoticeCount = () => notices.filter((notice) => !notice.read).length;

export function markNoticeRead(id: string) {
  const notice = getNotice(id);
  if (!notice || notice.read) return;
  notice.read = true;
  listeners.forEach((listener) => listener());
}

export const getLastFetchedAt = () => lastFetchedAt;

/** Simulated network refresh. */
export async function refreshNotices(): Promise<{ notices: Notice[]; fetchedAt: string }> {
  await new Promise((resolve) => setTimeout(resolve, REFRESH_LATENCY_MS));
  lastFetchedAt = new Date().toISOString();
  return { notices, fetchedAt: lastFetchedAt };
}
