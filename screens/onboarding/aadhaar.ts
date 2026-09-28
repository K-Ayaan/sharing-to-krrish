export const AADHAAR_LENGTH = 12;

// Verhoeff checksum tables. UIDAI issues Aadhaar numbers whose last digit is a Verhoeff check
// digit, so a mistyped digit or swapped pair is caught before the number is looked up.
const MULTIPLICATION = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const PERMUTATION = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const PERMUTATION_CYCLE = PERMUTATION.length;

export function hasValidChecksum(digits: string) {
  let check = 0;
  [...digits].reverse().forEach((digit, index) => {
    check = MULTIPLICATION[check][PERMUTATION[index % PERMUTATION_CYCLE][Number(digit)]];
  });
  return check === 0;
}

/** Returns a user-facing error, or undefined when the number is well-formed. */
export function validateAadhaar(digits: string) {
  if (!digits) return 'Aadhaar number is required.';
  if (digits.length < AADHAAR_LENGTH) return `Enter all ${AADHAAR_LENGTH} digits.`;
  if (digits[0] === '0' || digits[0] === '1') return "Aadhaar numbers don't start with 0 or 1.";
  if (!hasValidChecksum(digits)) return "This isn't a valid Aadhaar number. Check the digits and try again.";
  return undefined;
}

const GROUP = 4;

/** "234567890124" → "2345 6789 0124" */
export function formatAadhaar(digits: string) {
  return digits.replace(new RegExp(`(\\d{${GROUP}})(?=\\d)`, 'g'), '$1 ');
}
