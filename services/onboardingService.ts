import { MOCK_WRONG_OTP, type RegistrationDraft } from '../data/mock/mockOnboarding';
import { MOCK_SCENARIO, emptyRegistrations, mockUser } from '../data/mock/mockUser';
import { clearCache } from './cache';
import { request, ValidationError } from './client';
import { db, resetToNewUser } from './db';

export async function sendPhoneOtp(phone: string) {
  if (!/^[6-9]\d{9}$/.test(phone)) throw new ValidationError('Enter a 10-digit mobile number');
  return request(() => ({ phone }));
}

export async function verifyOtp(code: string) {
  if (code.length !== 6) throw new ValidationError('Enter all 6 digits');
  return request(() => {
    if (code === MOCK_WRONG_OTP) {
      throw new ValidationError('That code is incorrect. Check the SMS and try again.');
    }
    return { verified: true };
  });
}

function newUid() {
  const block = () => String(Math.floor(1000 + Math.random() * 9000));
  return `MF-${block()}-${block()}`;
}

export async function completeRegistration(draft: RegistrationDraft) {
  const profile = await request(() => {
    const returning = MOCK_SCENARIO === 'returning';
    if (!returning) resetToNewUser();
    db.profile = {
      ...db.profile,
      uid: returning ? mockUser.uid : newUid(),
      name: draft.name.trim(),
      householdName: draft.householdName?.trim() || null,
      consentAt: draft.consentAt,
      phone: draft.phone,
      email: draft.email?.trim() || null,
      district: draft.district,
      village: draft.village,
      language: draft.language,
      registrations: returning ? db.profile.registrations : { ...emptyRegistrations },
    };
    return db.profile;
  });
  clearCache();
  return profile;
}
