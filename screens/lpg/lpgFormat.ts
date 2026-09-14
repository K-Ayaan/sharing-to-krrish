import type { Ionicons } from '@expo/vector-icons';
import type { StatusTone } from '../../components/ui/StatusPill';
import type { Step } from '../../components/ui/StatusTracker';
import {
  REQUEST_STAGES,
  type ComplaintCategoryId,
  type RefillRequest,
  type RequestStage,
  type Urgency,
} from '../../data/mock/mockLpg';
import { formatDate, formatShortDate, formatTime } from '../formatDate';

type IconName = keyof typeof Ionicons.glyphMap;

export const bookingLockLabel = (days: number) =>
  `You can book again in ${days} ${days === 1 ? 'day' : 'days'}`;

const TOLL_FREE = /^(1800)(\d{4})(\d{3})$/;

/** "18002333555" → "1800 2333 555" */
export function formatTollFree(phone: string) {
  const match = TOLL_FREE.exec(phone);
  return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
}

/** "16–18 Aug 2025", or "30 Aug – 1 Sept 2025" across months. */
export function formatDateRange(fromIso: string, toIso: string) {
  const from = new Date(fromIso);
  const to = new Date(toIso);
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  return sameMonth
    ? `${from.getDate()}–${formatDate(toIso)}`
    : `${formatShortDate(fromIso)} – ${formatDate(toIso)}`;
}

export const urgencyOptions: { id: Urgency; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'urgent', label: 'Urgent' },
];

export const urgencyLabel: Record<Urgency, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
};

export const requestStageMeta: Record<
  RequestStage,
  { label: string; stepLabel: string; tone: StatusTone; icon: IconName }
> = {
  reference_submitted: { label: 'Submitted', stepLabel: 'Reference Submitted', tone: 'info', icon: 'document-text' },
  consolidated: { label: 'In progress', stepLabel: 'Consolidated by In-Charge', tone: 'info', icon: 'hourglass' },
  batch_published: { label: 'Batch published', stepLabel: 'Batch Published', tone: 'warning', icon: 'megaphone' },
  delivered: { label: 'Delivered', stepLabel: 'Delivered', tone: 'success', icon: 'checkmark-circle' },
};

export function requestSteps(request: RefillRequest, detail: 'none' | 'dateTime'): Step[] {
  const reached = REQUEST_STAGES.indexOf(request.stage);

  return REQUEST_STAGES.map((stage, index): Step => {
    const at = request.stageTimes[stage];
    const finished = index < reached || (stage === 'delivered' && index === reached);
    return {
      label: requestStageMeta[stage].stepLabel,
      state: finished ? 'done' : index === reached ? 'current' : 'upcoming',
      detail: detail === 'dateTime' && at ? `${formatShortDate(at)}\n${formatTime(at)}` : undefined,
    };
  });
}

export function requestStatusMessage(request: RefillRequest) {
  switch (request.stage) {
    case 'reference_submitted':
      return "We've received your booking reference. The In-Charge will add it to the next delivery batch.";
    case 'consolidated':
      return "Your request has been included in the current batch. We'll notify you once it is published for delivery.";
    case 'batch_published':
      return `Your delivery batch has been published. Expect your cylinder between ${formatDateRange(
        request.expectedDelivery.from,
        request.expectedDelivery.to
      )}.`;
    case 'delivered':
      return request.stageTimes.delivered
        ? `Your refill was delivered on ${formatDate(request.stageTimes.delivered)}.`
        : 'Your refill has been delivered.';
  }
}

export const complaintCategoryIcon: Record<ComplaintCategoryId, IconName> = {
  unable_to_book: 'close-circle-outline',
  lpg_id_suspended: 'information-circle-outline',
  login_issue: 'person-circle-outline',
  unable_to_call: 'call-outline',
  delivery_timing: 'car-outline',
};
