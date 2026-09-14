import { requireNotice } from './mockNotices';
import { mockUser, type Pillar, type UserProfile } from './mockUser';

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

// The bell badge isn't here: it reads live unread state via useUnreadNoticeCount().
export type ServicesResponse = {
  user: UserProfile;
  /** `id` is a real notice id — the banner opens it in NoticeDetail. */
  announcement: { id: string; text: string };
  pillars: PillarSummary[];
};

const banner = requireNotice('ann-2025-0811-dimapur-drive');

export const mockServicesData: ServicesResponse = {
  user: mockUser,
  announcement: { id: banner.id, text: banner.title },
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
