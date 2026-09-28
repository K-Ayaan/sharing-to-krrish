import { mockUser, saveRegisteredProfile } from './mockUser';

export type Option = { id: string; name: string };

export const COUNTRY_CODE = '+91';
export const PHONE_LENGTH = 10;
export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 30;

export const mockDistricts: Option[] = [
  { id: 'dimapur', name: 'Dimapur' },
  { id: 'kohima', name: 'Kohima' },
  { id: 'mokokchung', name: 'Mokokchung' },
  { id: 'mon', name: 'Mon' },
  { id: 'phek', name: 'Phek' },
  { id: 'tuensang', name: 'Tuensang' },
  { id: 'wokha', name: 'Wokha' },
  { id: 'zunheboto', name: 'Zunheboto' },
];

export const mockVillagesByDistrict: Record<string, Option[]> = {
  dimapur: [
    { id: 'sovima', name: 'Sovima' },
    { id: 'diphupar', name: 'Diphupar' },
  ],
  kohima: [
    { id: 'khonoma', name: 'Khonoma' },
    { id: 'jotsoma', name: 'Jotsoma' },
    { id: 'kigwema', name: 'Kigwema' },
  ],
  mokokchung: [{ id: 'ungma', name: 'Ungma' }],
  mon: [{ id: 'longwa', name: 'Longwa' }],
  phek: [{ id: 'pfutsero', name: 'Pfutsero' }],
  tuensang: [{ id: 'noksen', name: 'Noksen' }],
  wokha: [{ id: 'doyang', name: 'Doyang' }],
  zunheboto: [{ id: 'aphuyemi', name: 'Aphuyemi' }],
};

// ---- Aadhaar identity (mock backend).
//
// There is no OTP step: the number is validated locally (Verhoeff) and looked up, which returns an
// opaque reference the account is keyed on. The app keeps only a masked number and that reference —
// never the full Aadhaar past AadhaarEntry. A real integration would verify through a licensed
// AUA/KUA backend.

/** Checksum-valid test number that is already registered, for the sign-in path. Not a real person's Aadhaar. */
export const DEMO_REGISTERED_AADHAAR = '234567890124';

export type VerifiedIdentity = {
  /** Opaque reference the account is mapped to. */
  aadhaarRef: string;
  /** "XXXX XXXX 1234" — the only form of the number the app may show or keep. */
  maskedAadhaar: string;
};

export type AadhaarVerification =
  | { status: 'new'; identity: VerifiedIdentity }
  | { status: 'existing'; identity: VerifiedIdentity; uid: string };

const maskAadhaar = (aadhaar: string) => `XXXX XXXX ${aadhaar.slice(-4)}`;

// Stand-in for a vault-issued reference: a stable, non-cryptographic hash, so the same Aadhaar
// always maps to the same account in this mock.
function aadhaarReference(aadhaar: string) {
  let hash = 0x811c9dc5;
  for (const char of aadhaar) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `AR-${hash.toString(16).padStart(8, '0').toUpperCase()}`;
}

/** aadhaarRef → MARCOFED UID. Every account is keyed on Aadhaar, not phone. */
const accountsByAadhaarRef = new Map<string, string>([
  [aadhaarReference(DEMO_REGISTERED_AADHAAR), mockUser.uid],
]);

/**
 * Identifies the holder of an Aadhaar number: an existing account signs straight in, anything else
 * registers. The caller validates the number first (screens/onboarding/aadhaar.ts).
 */
export async function verifyAadhaar(aadhaar: string): Promise<AadhaarVerification> {
  const identity: VerifiedIdentity = {
    aadhaarRef: aadhaarReference(aadhaar),
    maskedAadhaar: maskAadhaar(aadhaar),
  };
  const uid = accountsByAadhaarRef.get(identity.aadhaarRef);
  return uid ? { status: 'existing', identity, uid } : { status: 'new', identity };
}

// ---- Contact-number verification (mock SMS).
//
// This OTP only proves the contact number is reachable. Identity is Aadhaar (above): this number is
// never used to sign in, and no account is keyed on it.

/** Any six-digit code verifies except this one, which exercises the error state. */
export const INVALID_TEST_OTP = '000000';

export type PhoneOtpSession = { txnId: string };

/** txnId → phone number. Server-side state: never returned to the app. */
const phoneOtpSessions = new Map<string, string>();

let txnSequence = 0;

export async function sendPhoneOtp(phone: string): Promise<PhoneOtpSession> {
  txnSequence += 1;
  const txnId = `TXN-${Date.now()}-${txnSequence}`;
  phoneOtpSessions.set(txnId, phone);
  return { txnId };
}

export async function resendPhoneOtp(txnId: string): Promise<void> {
  if (!phoneOtpSessions.has(txnId)) {
    throw new Error('This OTP session has expired. Go back and enter your number again.');
  }
}

export async function verifyPhoneOtp(txnId: string, code: string): Promise<void> {
  if (!phoneOtpSessions.has(txnId)) {
    throw new Error('This OTP has expired. Go back and enter your number again.');
  }
  if (code === INVALID_TEST_OTP) throw new Error('The OTP is incorrect. Check the code and try again.');
  phoneOtpSessions.delete(txnId);
}

export type RegistrationDraft = {
  identity: VerifiedIdentity;
  /** Contact only — not an identifier. */
  phone: string;
  email: string;
  fullName: string;
  districtId: string;
  villageId: string;
};

export type RegistrationResponse = { uid: string };

export async function submitRegistration(draft: RegistrationDraft): Promise<RegistrationResponse> {
  // Single mock user: every screen shows mockUser, so new accounts reuse its UID.
  const uid = mockUser.uid;
  accountsByAadhaarRef.set(draft.identity.aadhaarRef, uid);
  // Keep the profile the user actually entered (never Aadhaar data), so Settings and every screen
  // show it instead of the seed profile.
  const district = mockDistricts.find((option) => option.id === draft.districtId);
  const village = (mockVillagesByDistrict[draft.districtId] ?? []).find(
    (option) => option.id === draft.villageId
  );
  saveRegisteredProfile({
    fullName: draft.fullName,
    email: draft.email,
    phone: draft.phone,
    district: district?.name ?? mockUser.district,
    village: village?.name ?? mockUser.village,
  });
  return { uid };
}

export type ConsentItem = {
  id: 'aadhaar' | 'services' | 'security';
  /** Ionicons glyph name. */
  icon: 'id-card-outline' | 'stats-chart-outline' | 'shield-checkmark-outline';
  title: string;
  description: string;
};

// Placeholder legal copy from the approved Consent design — to be replaced with the approved
// consent text before release. Every item must be ticked to continue.
export const consentDocument: { version: string; items: ConsentItem[]; note: string } = {
  version: '2026-09',
  items: [
    {
      id: 'aadhaar',
      icon: 'id-card-outline',
      title: 'Use my Aadhaar information',
      description:
        'I consent to using my Aadhaar number to link me to my MARCOFED account for government service eligibility.',
    },
    {
      id: 'services',
      icon: 'stats-chart-outline',
      title: 'Use my information for services',
      description:
        'I allow MARCOFED to use my information to provide and improve government and cooperative services.',
    },
    {
      id: 'security',
      icon: 'shield-checkmark-outline',
      title: 'I understand my data is secure',
      description:
        'I understand that my information is stored securely and used as per applicable government guidelines and the Aadhaar Act.',
    },
  ],
  note: 'You can update your consent and data preferences anytime from your account settings.',
};
