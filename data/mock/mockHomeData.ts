import { requireNotice } from './mockNotices';
import { mockUser, type UserProfile } from './mockUser';

export type Announcement = {
  id: string;
  category: string;
  publishedAt: string;
  title: string;
  body: string;
};

// Not in this response, on purpose:
// - the LPG status card reads getLpgSummary() from mockLpg.ts, the same source LpgHome uses;
// - the bell badge reads live unread state via useUnreadNoticeCount().
export type HomeResponse = {
  user: UserProfile;
  tagline: string;
  announcement: Announcement;
};

const featured = requireNotice('ann-2025-0812-vandhan-msp');

export const mockHomeData: HomeResponse = {
  user: mockUser,
  tagline: 'Nagaland, together for a stronger tomorrow',
  announcement: {
    id: featured.id,
    category: 'Important Update',
    publishedAt: featured.publishedAt,
    title: featured.title,
    body: featured.summary,
  },
};
