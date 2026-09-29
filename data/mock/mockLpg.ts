import { addDays, daysAgo } from './dates';

// SDD §4.3.1: a booking is validated against the minimum interval between bookings.
export const MIN_BOOKING_INTERVAL_DAYS = 21;

export type CylinderType = 'domestic_14' | 'domestic_5';

export const CYLINDER_LABEL: Record<CylinderType, string> = {
  domestic_14: '14.2 kg Cylinder',
  domestic_5: '5 kg Cylinder',
};

export type BookingStatus = 'requested' | 'dispatch_arranged' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Booking = {
  id: string;
  reference: string;
  cylinder: CylinderType;
  bookedAt: string;
  dispatchArrangedAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  status: BookingStatus;
  dispatchPoint: string | null;
  payable: number;
};

export type LpgConnection = {
  lpgId: string;
  consumerNumber: string;
  distributor: string;
  brand: string;
  cylinder: CylinderType;
  active: boolean;
  subsidy: 'Applied' | 'Not applied';
};

export type ComplaintTarget = 'booking' | 'connection';

export type ComplaintCategory =
  | 'not_delivered'
  | 'delayed'
  | 'underweight'
  | 'leak_or_damage'
  | 'overcharged'
  | 'other';

export const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string }[] = [
  { value: 'not_delivered', label: 'Cylinder not delivered' },
  { value: 'delayed', label: 'Delivery delayed' },
  { value: 'underweight', label: 'Cylinder underweight' },
  { value: 'leak_or_damage', label: 'Leak or damaged cylinder' },
  { value: 'overcharged', label: 'Charged more than the bill' },
  { value: 'other', label: 'Something else' },
];

export type Complaint = {
  id: string;
  reference: string;
  target: ComplaintTarget;
  bookingReference: string | null;
  category: ComplaintCategory;
  description: string;
  raisedAt: string;
  status: 'open' | 'in_review' | 'closed';
  escalated: boolean;
  note: string;
};

export const mockConnection: LpgConnection = {
  lpgId: 'LPGC-6789',
  consumerNumber: '8123451234',
  distributor: 'IOCL – Dimapur',
  brand: 'Indane',
  cylinder: 'domestic_14',
  active: true,
  subsidy: 'Applied',
};

const REFILL_PRICE = 1010;

function delivered(id: string, reference: string, days: number): Booking {
  const bookedAt = daysAgo(days, 9, 30);
  return {
    id,
    reference,
    cylinder: 'domestic_14',
    bookedAt,
    dispatchArrangedAt: addDays(bookedAt, 2),
    outForDeliveryAt: addDays(bookedAt, 3),
    deliveredAt: addDays(bookedAt, 3),
    status: 'delivered',
    dispatchPoint: 'Village point, Ungma',
    payable: REFILL_PRICE,
  };
}

// Latest refill was delivered 21 days ago, so booking opens today — the lpg-page.png state
// ("Next refill eligible from …" with Book Refill enabled).
export const mockBookings: Booking[] = [
  delivered('lpbk-1240', 'LPBK-1240', 24),
  delivered('lpbk-1198', 'LPBK-1198', 56),
  delivered('lpbk-1157', 'LPBK-1157', 88),
  delivered('lpbk-1103', 'LPBK-1103', 118),
  delivered('lpbk-1061', 'LPBK-1061', 150),
];

export const mockComplaints: Complaint[] = [
  {
    id: 'lpcm-1234', reference: 'LPCM-1234', target: 'booking', bookingReference: 'LPBK-1198',
    category: 'underweight', description: 'Cylinder felt light and ran out in 12 days.', raisedAt: daysAgo(52),
    status: 'in_review', escalated: true, note: 'With the LPG Section of the Federation since 30 August.',
  },
  {
    id: 'lpcm-5678', reference: 'LPCM-5678', target: 'booking', bookingReference: 'LPBK-1103',
    category: 'delayed', description: 'Delivery delayed by nine days.', raisedAt: daysAgo(112),
    status: 'closed', escalated: false, note: 'Resolved by the distributor.',
  },
];

export const REFILL_PAYABLE = REFILL_PRICE;
