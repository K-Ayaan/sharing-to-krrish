import type { StatusTone } from '../../components/ui/StatusPill';
import type { BookingStatus } from '../../data/mock/mockLpg';

export const bookingStatus: Record<BookingStatus, { tone: StatusTone; label: string }> = {
  requested: { tone: 'pending', label: 'Requested' },
  dispatch_arranged: { tone: 'progress', label: 'Dispatch Set' },
  out_for_delivery: { tone: 'delivery', label: 'Out for Delivery' },
  delivered: { tone: 'verified', label: 'Delivered' },
  cancelled: { tone: 'rejected', label: 'Cancelled' },
};
