import { addDays } from '../data/mock/dates';
import {
  MIN_BOOKING_INTERVAL_DAYS,
  REFILL_PAYABLE,
  type Booking,
  type Complaint,
  type ComplaintCategory,
  type ComplaintTarget,
  type CylinderType,
} from '../data/mock/mockLpg';
import { invalidate } from './cache';
import { NotFoundError, request, ValidationError } from './client';
import { db, nextReference } from './db';

export type Eligibility = {
  canBook: boolean;
  nextEligibleAt: string | null;
  activeBooking: Booking | null;
};

function sortedBookings() {
  return [...db.bookings].sort((a, b) => b.bookedAt.localeCompare(a.bookedAt));
}

// SDD §4.3.1: one open booking at a time, and a minimum interval between bookings.
function eligibility(): Eligibility {
  const bookings = sortedBookings();
  const activeBooking =
    bookings.find((booking) => booking.status !== 'delivered' && booking.status !== 'cancelled') ?? null;
  const last = bookings[0];
  const nextEligibleAt = last ? addDays(last.bookedAt, MIN_BOOKING_INTERVAL_DAYS) : null;
  const intervalPassed = !nextEligibleAt || new Date(nextEligibleAt).getTime() <= Date.now();
  return { canBook: !activeBooking && intervalPassed, nextEligibleAt, activeBooking };
}

export function getLpgOverview() {
  return request(() => ({
    connection: db.connection,
    bookings: sortedBookings(),
    eligibility: eligibility(),
  }));
}

export function getBooking(id: string) {
  return request(() => {
    const booking = db.bookings.find((item) => item.id === id);
    if (!booking) throw new NotFoundError('Booking');
    return booking;
  });
}

export async function bookRefill(cylinder: CylinderType) {
  const booking = await request(() => {
    const state = eligibility();
    if (state.activeBooking) throw new ValidationError('You already have a refill in progress.');
    if (!state.canBook) throw new ValidationError('Your next refill can’t be booked yet.');
    const created: Booking = {
      id: `lpbk-${Date.now()}`,
      reference: nextReference('LPBK'),
      cylinder,
      bookedAt: new Date().toISOString(),
      dispatchArrangedAt: null,
      outForDeliveryAt: null,
      deliveredAt: null,
      status: 'requested',
      dispatchPoint: null,
      payable: REFILL_PAYABLE,
    };
    db.bookings = [created, ...db.bookings];
    return created;
  });
  invalidate('lpg', 'records', 'home');
  return booking;
}

// Consumer numbers are printed on the LPG passbook; lengths vary by oil company.
export function validateConsumerNumber(value: string) {
  const digits = value.replace(/\s/g, '');
  if (!digits) return 'Enter your consumer number';
  if (!/^[A-Za-z0-9]{5,17}$/.test(digits)) return 'Use the 5–17 character number from your LPG passbook';
  return null;
}

export async function registerLpg(input: { consumerNumber: string; distributor: string }) {
  const numberError = validateConsumerNumber(input.consumerNumber);
  if (numberError) throw new ValidationError(numberError);
  if (input.distributor.trim().length < 3) throw new ValidationError('Enter your distributor’s name');
  await request(() => {
    const consumerNumber = input.consumerNumber.replace(/\s/g, '');
    const distributor = input.distributor.trim();
    // Editing an existing registration keeps the LPG id, cylinder and subsidy status as they are —
    // only the two fields on this form change.
    db.connection = db.connection
      ? { ...db.connection, consumerNumber, distributor }
      : {
          lpgId: nextReference('LPGC'),
          consumerNumber,
          distributor,
          brand: 'Indane',
          cylinder: 'domestic_14',
          active: true,
          subsidy: 'Not applied',
        };
    db.profile.registrations.lpg = {
      consumerNumber,
      distributor,
      since: db.profile.registrations.lpg?.since ?? new Date().toISOString(),
    };
  });
  invalidate('lpg', 'profile', 'home', 'services');
}

export function getComplaints() {
  return request(() => [...db.complaints].sort((a, b) => b.raisedAt.localeCompare(a.raisedAt)));
}

export type ComplaintInput = {
  target: ComplaintTarget;
  bookingReference: string | null;
  category: ComplaintCategory;
  description: string;
};

export async function raiseComplaint(input: ComplaintInput) {
  if (input.description.trim().length < 10) throw new ValidationError('Tell us what happened — ten words or so is enough');
  const complaint = await request(() => {
    const created: Complaint = {
      id: `lpcm-${Date.now()}`,
      reference: nextReference('LPCM'),
      target: input.target,
      bookingReference: input.bookingReference,
      category: input.category,
      description: input.description.trim(),
      raisedAt: new Date().toISOString(),
      status: 'open',
      escalated: false,
      note: `Sent to ${db.connection?.distributor ?? 'your distributor'}. It moves to the Federation if not resolved in 7 days.`,
    };
    db.complaints = [created, ...db.complaints];
    return created;
  });
  invalidate('lpg', 'records');
  return complaint;
}
