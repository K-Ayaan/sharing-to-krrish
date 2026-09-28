import type { Ionicons } from '@expo/vector-icons';
import type { StatusTone } from '../../components/ui/StatusPill';
import type { Step } from '../../components/ui/StatusTracker';
import type {
  Grievance,
  GrievanceStage,
  Kendra,
  Pickup,
  PickupStatus,
  Produce,
  ProduceUnit,
  Trend,
} from '../../data/mock/mockVanDhan';
import { mockKendras } from '../../data/mock/mockVanDhan';
import { formatDateTime, formatShortDate, formatTime } from '../formatDate';

export { CALL_UNAVAILABLE, MAPS_UNAVAILABLE, formatPhoneDisplay, openMaps, openPhone } from '../contact';

type IconName = keyof typeof Ionicons.glyphMap;

// ---- Kendras

/** Kendra picker options (registration and LogCollection): name over its address. */
export const kendraOptions = mockKendras.map((kendra) => ({
  id: kendra.id,
  name: kendra.name,
  description: `${kendra.address.line1}, ${kendra.address.line2}`,
}));

// ---- Produce

export const formatRate = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

export const unitLabel = (unit: ProduceUnit) => `per ${unit}`;

const UNIT_NAMES: Record<ProduceUnit, string> = {
  kg: 'Kilogram (kg)',
  bundle: 'Bundle',
  litre: 'Litre (L)',
};

export const unitName = (unit: ProduceUnit) => UNIT_NAMES[unit];

export const dialectLabel = (produce: Produce) => `${produce.dialect.language}: ${produce.dialect.name}`;

export const trendTone: Record<Trend, StatusTone> = {
  up: 'success',
  down: 'danger',
  flat: 'neutral',
};

// ---- Kendra

/** What Apple Maps searches for to find a kendra. */
export const kendraMapQuery = (kendra: Kendra) =>
  `${kendra.name}, ${kendra.address.line1}, ${kendra.address.line2} ${kendra.address.pincode}`;

// ---- Pickups

const PICKUP_ORDER: PickupStatus[] = ['requested', 'confirmed', 'collected'];

export const pickupStatusMeta: Record<PickupStatus, { label: string; tone: StatusTone; icon: IconName }> = {
  requested: { label: 'Requested', tone: 'info', icon: 'time' },
  confirmed: { label: 'Confirmed', tone: 'success', icon: 'checkmark-circle' },
  collected: { label: 'Collected', tone: 'complete', icon: 'checkmark-done-circle' },
};

const PICKUP_CANCELLED = { label: 'Cancelled', tone: 'neutral' as const, icon: 'close-circle' as const };

/** The status to show for a pickup — "Cancelled" overrides the stage it had reached. */
export const pickupDisplayStatus = (pickup: Pickup) =>
  pickup.cancelledAt ? PICKUP_CANCELLED : pickupStatusMeta[pickup.status];

export function pickupSteps(pickup: Pickup, detail: 'none' | 'date' | 'dateTime'): Step[] {
  const reached = PICKUP_ORDER.indexOf(pickup.status);
  const timestamps: Record<PickupStatus, string | null> = {
    requested: pickup.requestedAt,
    confirmed: pickup.confirmedAt,
    collected: pickup.collectedAt,
  };

  return PICKUP_ORDER.map((status, index): Step => {
    const at = timestamps[status];
    const finished = index < reached || (status === 'collected' && index === reached);
    return {
      label: pickupStatusMeta[status].label,
      state: finished ? 'done' : index === reached ? 'current' : 'upcoming',
      detail:
        detail === 'none'
          ? undefined
          : !at
            ? '—'
            : detail === 'date'
              ? formatShortDate(at)
              : `${formatShortDate(at)}\n${formatTime(at)}`,
    };
  });
}

// ---- Grievances

const GRIEVANCE_ORDER: GrievanceStage[] = ['submitted', 'routed', 'in_progress', 'resolved'];

export const grievanceStageMeta: Record<GrievanceStage, { label: string; tone: StatusTone; icon: IconName }> = {
  submitted: { label: 'Submitted', tone: 'info', icon: 'paper-plane' },
  routed: { label: 'Routed', tone: 'info', icon: 'git-branch' },
  in_progress: { label: 'In progress', tone: 'warning', icon: 'hourglass' },
  resolved: { label: 'Resolved', tone: 'complete', icon: 'checkmark-circle' },
};

export function grievanceSteps(grievance: Grievance): Step[] {
  const reached = GRIEVANCE_ORDER.indexOf(grievance.stage);

  return grievance.timeline.map((event): Step => {
    const index = GRIEVANCE_ORDER.indexOf(event.stage);
    const finished = index < reached || (event.stage === 'resolved' && index === reached);
    return {
      label: grievanceStageMeta[event.stage].label,
      state: finished ? 'done' : index === reached ? 'current' : 'upcoming',
      detail: event.at ? formatDateTime(event.at) : 'Pending',
      description: event.note ?? undefined,
    };
  });
}
