import type { Pillar } from './mockUser';

export type PillarStatus =
  | { type: 'rates_updated'; updatedAt: string }
  | { type: 'stock_available'; count: number }
  | { type: 'not_started' };

export type PillarSummary = {
  pillar: Pillar;
  title: string;
  description: string;
  status: PillarStatus;
};

// The user's name and UID come from the live profile (useUserProfile), and the bell badge from
// live unread state (useUnreadNoticeCount) — neither is a snapshot in this response.
export type ServicesResponse = {
  pillars: PillarSummary[];
};

export const mockServicesData: ServicesResponse = {
  pillars: [
    {
      pillar: 'vandhan',
      title: 'Van Dhan',
      description: 'Sell forest produces, check rates and schedule pickups.',
      status: { type: 'rates_updated', updatedAt: new Date().toISOString() },
    },
    {
      pillar: 'livestock',
      title: 'Livestock',
      description: 'Browse MARCOFED livestock stock for purchase.',
      status: { type: 'stock_available', count: 12 },
    },
    {
      pillar: 'lpg',
      title: 'LPG',
      description: 'Track your refill requests and delivery status.',
      status: { type: 'not_started' },
    },
  ],
};
