import { emptyRegistrations, KENDRAS, type UserProfile } from '../data/mock/mockUser';
import { invalidate } from './cache';
import { request, ValidationError } from './client';
import { db } from './db';

export function getProfile() {
  return request(() => db.profile);
}

export type ProfilePatch = Partial<
  Pick<UserProfile, 'name' | 'email' | 'phone' | 'language' | 'photoUri' | 'notificationsEnabled' | 'analyticsEnabled'>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(name: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Enter your full name';
  if (!/^[\p{L} .'-]+$/u.test(trimmed)) return 'Use letters only';
  return null;
}

export function validateEmail(email: string) {
  if (!email.trim()) return null;
  return EMAIL_PATTERN.test(email.trim()) ? null : 'Enter an email like name@example.com';
}

export function validatePhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone) ? null : 'Enter a 10-digit mobile number';
}

// For review only: the seeded mock user is already registered for every service, which leaves no
// way to walk through the registration screens. This unregisters them all so those flows can be
// tried. A real backend has no such call — registrations end by a MARCOFED officer's action.
export async function resetRegistrations() {
  await request(() => {
    db.profile = { ...db.profile, registrations: { ...emptyRegistrations } };
    db.connection = null;
  });
  invalidate('profile', 'home', 'services', 'lpg', 'vandhan', 'livestock', 'microfinance');
}

// Which Kendra the person collects through. It sets the rates they see and who their collections
// and grievances go to.
export async function setKendra(id: string) {
  const kendra = KENDRAS.find((item) => item.id === id);
  if (!kendra) throw new ValidationError('Choose a Kendra');
  await request(() => {
    db.profile = { ...db.profile, kendra };
  });
  invalidate('profile', 'home', 'vandhan');
}

export async function updateProfile(patch: ProfilePatch) {
  if (patch.name !== undefined) {
    const error = validateName(patch.name);
    if (error) throw new ValidationError(error);
  }
  if (patch.email !== undefined && patch.email) {
    const error = validateEmail(patch.email);
    if (error) throw new ValidationError(error);
  }
  if (patch.phone !== undefined) {
    const error = validatePhone(patch.phone);
    if (error) throw new ValidationError(error);
  }
  const updated = await request(() => {
    db.profile = {
      ...db.profile,
      ...patch,
      name: patch.name?.trim() ?? db.profile.name,
      email: patch.email === undefined ? db.profile.email : patch.email?.trim() || null,
    };
    return db.profile;
  });
  invalidate('profile', 'home');
  return updated;
}
