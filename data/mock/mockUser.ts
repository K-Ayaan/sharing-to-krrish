import type { Language } from './mockOnboarding';

export type PillarKey = 'vandhan' | 'livestock' | 'lpg' | 'microfinance';

// SDD §3.1 User + User Service: one UID, and which services the person is registered for.
export type Registrations = {
  // Van Dhan has one kind of member — a collector — and Livestock one kind — a buyer. Both were
  // offered as a choice of roles until the user removed the other options (23 Sep 2026).
  vandhan: { since: string } | null;
  livestock: { since: string } | null;
  lpg: { consumerNumber: string; distributor: string; since: string } | null;
  microfinance: { since: string } | null;
};

export type Kendra = { id: string; name: string; district: string; phone: string };

export type UserProfile = {
  uid: string;
  name: string;
  householdName: string | null;
  consentAt: string;
  phone: string;
  email: string | null;
  district: string;
  village: string;
  language: Language;
  kendra: Kendra;
  photoUri: string | null;
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  registrations: Registrations;
};

// Placeholder contact numbers throughout the mock data — replace with the Federation's real
// Kendra and helpline numbers before release.
export const MOKOKCHUNG_KENDRA: Kendra = {
  id: 'KD-MKG',
  name: 'Mokokchung Kendra',
  district: 'Mokokchung',
  phone: '+919000000101',
};

// The Kendras a person can collect through — mock master data (SDD §3.1). The live list comes from
// the Federation's registry, filtered to the districts a person can reach.
export const KENDRAS: Kendra[] = [
  MOKOKCHUNG_KENDRA,
  { id: 'KD-DMP', name: 'Dimapur Kendra', district: 'Dimapur', phone: '+919000000102' },
  { id: 'KD-KHM', name: 'Kohima Kendra', district: 'Kohima', phone: '+919000000103' },
  { id: 'KD-WKH', name: 'Wokha Kendra', district: 'Wokha', phone: '+919000000104' },
  { id: 'KD-ZBT', name: 'Zunheboto Kendra', district: 'Zunheboto', phone: '+919000000105' },
];

// 'returning' mirrors the mockups: this person already has history from the voice and WhatsApp
// channels (the "one record" principle), so registering in the app links Van Dhan, Livestock,
// LPG and Micro-Finance straight away. 'new' starts with no services to exercise empty states.
// Every service starts unregistered, per the user's instruction (23 Sep 2026): registration is
// something to go through, not something already done.
export const MOCK_SCENARIO: 'returning' | 'new' = 'new';

export const mockUser: UserProfile = {
  uid: 'MF-2847-3106',
  name: 'Ayaan Ahmed',
  householdName: 'Ahmed Household',
  consentAt: '2026-03-12T10:00:00.000Z',
  phone: '9876543210',
  email: 'ayaan@example.com',
  district: 'Mokokchung',
  village: 'Ungma',
  language: 'en',
  kendra: MOKOKCHUNG_KENDRA,
  photoUri: null,
  notificationsEnabled: true,
  analyticsEnabled: true,
  registrations: {
    vandhan: null,
    livestock: null,
    lpg: null,
    microfinance: null,
  },
};

export const emptyRegistrations: Registrations = {
  vandhan: null,
  livestock: null,
  lpg: null,
  microfinance: null,
};

export function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}
