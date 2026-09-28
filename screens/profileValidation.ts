import { PHONE_LENGTH } from '../data/mock/mockOnboarding';

// Same rules onboarding applies (EmailEntry, PhoneEntry, ProfileDetails), for editing in Settings.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFullName(fullName: string) {
  return fullName ? undefined : 'Full name is required.';
}

export function validateEmail(email: string) {
  if (!email) return 'Email address is required.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
  return undefined;
}

export function validateContactPhone(phone: string) {
  if (!phone) return 'Contact number is required.';
  if (phone.length !== PHONE_LENGTH) return `Enter a ${PHONE_LENGTH}-digit mobile number.`;
  return undefined;
}
