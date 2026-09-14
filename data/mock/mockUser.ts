export type Pillar = 'vandhan' | 'livestock' | 'lpg';

export type RegisteredRole = {
  pillar: Pillar;
  label: string;
};

export type UserProfile = {
  uid: string;
  fullName: string;
  district: string;
  village: string;
  registeredRoles: RegisteredRole[];
};

export const mockUser: UserProfile = {
  uid: 'NL-2024-4587-2291',
  fullName: 'Neikhrielie Angami',
  district: 'Kohima',
  village: 'Khonoma',
  registeredRoles: [
    { pillar: 'vandhan', label: 'Van Dhan Producer' },
    // Home.png says "Livestock Owner"; this app is buyer-only for Livestock.
    { pillar: 'livestock', label: 'Livestock Buyer' },
    { pillar: 'lpg', label: 'LPG Consumer' },
  ],
};

// The unread badge count is not a user field: it's live notice state, read through
// useUnreadNoticeCount() (screens/useUnreadNoticeCount.ts).

export function initialsOf(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}
