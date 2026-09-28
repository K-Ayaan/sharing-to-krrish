export type Pillar = 'vandhan' | 'livestock' | 'lpg';

export type RegisteredRole = {
  pillar: Pillar;
  label: string;
};

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  /** Contact only — 10-digit national number, never used to sign in. */
  phone: string;
  district: string;
  village: string;
  registeredRoles: RegisteredRole[];
};

/** Seed profile: the pre-registered demo account (Aadhaar 2345 6789 0124). */
export const mockUser: UserProfile = {
  uid: 'NL-2024-4587-2291',
  fullName: 'Neikhrielie Angami',
  email: 'neikhrielie.angami@example.com',
  phone: '9876543210',
  district: 'Kohima',
  village: 'Khonoma',
  registeredRoles: [
    { pillar: 'vandhan', label: 'Van Dhan Producer' },
    // Home.png says "Livestock Owner"; this app is buyer-only for Livestock.
    { pillar: 'livestock', label: 'Livestock Buyer' },
    { pillar: 'lpg', label: 'LPG Consumer' },
  ],
};

// ---- Live profile: the one place name, email and contact number are kept after registration.
// Screens read it through useUserProfile() so a save in Settings shows everywhere at once.
// Aadhaar and identity data are deliberately not part of this profile.

let profile: UserProfile = mockUser;

const listeners = new Set<() => void>();

/** Snapshot keeps the same identity until something changes (useSyncExternalStore-compatible). */
export const getProfile = (): UserProfile => profile;

export function subscribeToProfile(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setProfile(next: UserProfile) {
  profile = next;
  listeners.forEach((listener) => listener());
}

/** The only fields Settings may change — never Aadhaar or the UID. */
export type EditableProfile = Pick<UserProfile, 'fullName' | 'email' | 'phone' | 'district' | 'village'>;

export async function updateProfile(changes: EditableProfile): Promise<UserProfile> {
  setProfile({
    ...profile,
    fullName: changes.fullName,
    email: changes.email,
    phone: changes.phone,
    district: changes.district,
    village: changes.village,
  });
  return profile;
}

/** Registration: keeps what the user entered during onboarding. */
export function saveRegisteredProfile(fields: EditableProfile) {
  setProfile({ ...profile, ...fields });
}

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
