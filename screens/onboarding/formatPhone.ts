import { COUNTRY_CODE } from '../../data/mock/mockOnboarding';

const FIRST_GROUP = 5;

// "9876543210" → "98765 43210"
export function formatPhone(digits: string) {
  return digits.length > FIRST_GROUP
    ? `${digits.slice(0, FIRST_GROUP)} ${digits.slice(FIRST_GROUP)}`
    : digits;
}

export function formatPhoneWithCode(digits: string) {
  return `${COUNTRY_CODE} ${formatPhone(digits)}`;
}
