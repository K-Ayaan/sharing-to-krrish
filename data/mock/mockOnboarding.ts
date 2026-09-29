export type Language = 'en' | 'hi' | 'nag';

// SDD language strategy: English and Hindi at launch; Nagamese follows with the voice layer.
export const LANGUAGES: { value: Language; label: string; description: string }[] = [
  { value: 'en', label: 'English', description: 'English' },
  { value: 'hi', label: 'हिन्दी', description: 'Hindi' },
  { value: 'nag', label: 'Nagamese', description: 'Calls and WhatsApp only, for now' },
];

export function languageLabel(language: Language) {
  return LANGUAGES.find((option) => option.value === language)?.description ?? 'English';
}

// Nagaland's districts with a handful of villages each — mock master data (SDD §3.1 District
// and Village). The live list comes from the Federation's registry.
export const DISTRICT_VILLAGES: Record<string, string[]> = {
  Chümoukedima: ['Medziphema', 'Seithekema', 'Chümoukedima Town'],
  Dimapur: ['Dhansiripar', 'Nihokhu', 'Singrijan', 'Dimapur Town'],
  Kiphire: ['Pungro', 'Seyochung', 'Kiphire Town'],
  Kohima: ['Khonoma', 'Jotsoma', 'Kigwema', 'Viswema'],
  Longleng: ['Tamlu', 'Yongnyah', 'Longleng Town'],
  Mokokchung: ['Ungma', 'Longkhum', 'Chuchuyimlang', 'Mopungchuket'],
  Mon: ['Longwa', 'Chui', 'Shangnyu', 'Mon Town'],
  Niuland: ['Niuland Town', 'Kuhoboto'],
  Noklak: ['Thonoknyu', 'Panso', 'Noklak Town'],
  Peren: ['Jalukie', 'Tening', 'Peren Town'],
  Phek: ['Pfutsero', 'Chizami', 'Meluri'],
  Shamator: ['Shamator Town', 'Chessore'],
  Tseminyü: ['Tseminyü Town', 'Sendenyu'],
  Tuensang: ['Noksen', 'Chare', 'Tuensang Town'],
  Wokha: ['Longsa', 'Sanis', 'Bhandari'],
  Zunheboto: ['Akuluto', 'Satakha', 'Aghunato'],
};

export const DISTRICTS = Object.keys(DISTRICT_VILLAGES).sort();

// SDD S-01: name, farm or household name, village, district and language — plus consent,
// recorded against the person (§8.4).
export type RegistrationDraft = {
  phone: string;
  name: string;
  householdName: string | null;
  consentAt: string;
  district: string;
  village: string;
  email: string | null;
  language: Language;
};

// Any 6 digits verify, except this one, which simulates a wrong code for testing.
export const MOCK_WRONG_OTP = '000000';

export const OTP_RESEND_SECONDS = 30;
