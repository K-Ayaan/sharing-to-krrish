import { mockUser } from './mockUser';

export type Option = { id: string; name: string };

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 30;
export const COUNTRY_CODE = '+91';
export const PHONE_LENGTH = 10;

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

export type RegistrationDraft = {
  phone: string;
  email: string;
  fullName: string;
  districtId: string;
  villageId: string;
};

export type RegistrationResponse = { uid: string };

// Stubs: resolve immediately until the real auth/registration API exists.
export async function sendOtp(_phone: string): Promise<{ sent: true }> {
  return { sent: true };
}

export async function verifyOtp(_phone: string, _code: string): Promise<{ verified: true }> {
  return { verified: true };
}

export async function submitRegistration(_draft: RegistrationDraft): Promise<RegistrationResponse> {
  return { uid: mockUser.uid };
}

export const consentDocument = {
  version: '2025-08',
  paragraphs: [
    'I consent to MARCOFED and the Government of Nagaland collecting, using and securely storing my personal information (including name, phone number, email address, location and service-related data) for the purpose of delivering and improving government and cooperative services such as Van Dhan, Livestock, LPG and related programmes.',
    'I understand that my information may be shared with authorised government departments and cooperative partners only for service delivery, verification, monitoring and evaluating these schemes. My information will be protected in accordance with applicable laws and will not be used for any purpose beyond these services.',
    'I understand that I may request access to, correction of, or deletion of my personal information at any time by contacting MARCOFED support or visiting my nearest kendra, subject to records the law requires to be retained.',
    'I understand that providing my information is voluntary, but that some services may not be available to me without it. I may withdraw this consent at any time, which will not affect services already delivered.',
    'Placeholder legal copy — to be replaced with the approved consent text before release.',
  ],
};
