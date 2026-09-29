import { daysAgo } from './dates';

export type Species = 'cow' | 'goat' | 'buffalo' | 'pig' | 'chicken' | 'duck';
export type Sex = 'male' | 'female' | 'mixed';

export const SPECIES_LABEL: Record<Species, string> = {
  cow: 'Cow',
  goat: 'Goat',
  buffalo: 'Buffalo',
  pig: 'Pig',
  chicken: 'Chicken',
  duck: 'Duck',
};

export type Seller = { name: string; district: string; phone: string };

export type Listing = {
  id: string;
  species: Species;
  breed: string;
  description: string;
  district: string;
  seller: Seller;
  weightKg: { min: number; max: number };
  ageLabel: string;
  price: number;
  available: number;
  sex: Sex;
  purpose: string;
  health: { vaccinated: boolean; vaccines: string; lastCheck: string };
  notes: string | null;
  photos: string[];
};

export type BatchStatus = 'awaiting' | 'assigned' | 'certified' | 'rejected';

export type Certificate = {
  number: string;
  inspectedAt: string;
  result: 'Fit for movement' | 'Unfit';
  validUntil: string;
  issuedBy: string;
};

export type Batch = {
  id: string;
  reference: string;
  species: Species;
  count: number;
  liveWeightKg: number;
  expectedPrice: number;
  location: string;
  reportedAt: string;
  status: BatchStatus;
  inspectedBy: string | null;
  certificate: Certificate | null;
  rejectionReason: string | null;
};

export type BioAlert = {
  id: string;
  kind: 'alert' | 'advisory';
  title: string;
  body: string;
  issuedAt: string;
  // Alerts need acknowledgement; advisories don't (SDD S-24).
  acknowledgedAt: string | null;
};

const kendra = (district: string, n: string): Seller => ({
  name: `${district} Kendra`,
  district,
  // Placeholder numbers — replace with real Kendra contacts.
  phone: `+9190000001${n}`,
});

const healthy = (lastCheckDaysAgo: number) => ({
  vaccinated: true,
  vaccines: 'FMD, HS and BQ vaccinated',
  lastCheck: daysAgo(lastCheckDaysAgo),
});

export const mockListings: Listing[] = [
  { id: 'ls-1024', species: 'cow', breed: 'Gir (Local Breed)', description: 'Gir-cross milch cow, calm and used to hand milking.', district: 'Mokokchung', seller: kendra('Mokokchung', '01'), weightKg: { min: 250, max: 300 }, ageLabel: '4 years', price: 45000, available: 5, sex: 'female', purpose: 'Milk Production', health: healthy(30), notes: 'Currently giving 6–7 litres a day.', photos: [] },
  { id: 'ls-1031', species: 'goat', breed: 'Local Breed', description: 'Hardy local goats raised on open grazing.', district: 'Dimapur', seller: kendra('Dimapur', '02'), weightKg: { min: 20, max: 30 }, ageLabel: '1–2 years', price: 12000, available: 8, sex: 'mixed', purpose: 'Meat & breeding', health: healthy(21), notes: null, photos: [] },
  { id: 'ls-1045', species: 'buffalo', breed: 'Murrah', description: 'Murrah buffalo, suited to draught and milk.', district: 'Kohima', seller: kendra('Kohima', '03'), weightKg: { min: 400, max: 500 }, ageLabel: '5 years', price: 60000, available: 3, sex: 'female', purpose: 'Milk Production', health: healthy(18), notes: null, photos: [] },
  { id: 'ls-1052', species: 'pig', breed: 'Local Breed', description: 'Local breed pigs, dewormed and vaccinated.', district: 'Tuensang', seller: kendra('Tuensang', '04'), weightKg: { min: 70, max: 90 }, ageLabel: '8 months', price: 8000, available: 6, sex: 'mixed', purpose: 'Rearing', health: healthy(12), notes: 'Movement is subject to the current ASF advisory.', photos: [] },
  { id: 'ls-1060', species: 'chicken', breed: 'Local Breed', description: 'Free-range backyard poultry.', district: 'Wokha', seller: kendra('Wokha', '05'), weightKg: { min: 1, max: 2 }, ageLabel: '5 months', price: 300, available: 20, sex: 'mixed', purpose: 'Meat & eggs', health: healthy(9), notes: null, photos: [] },
  { id: 'ls-1067', species: 'duck', breed: 'Local Breed', description: 'Local ducks, good layers.', district: 'Zunheboto', seller: kendra('Zunheboto', '06'), weightKg: { min: 1.5, max: 2.5 }, ageLabel: '6 months', price: 400, available: 15, sex: 'mixed', purpose: 'Eggs', health: healthy(15), notes: null, photos: [] },
  { id: 'ls-1071', species: 'cow', breed: 'Local Breed', description: 'Healthy local breed, suitable for milk production and smallholder farming.', district: 'Mokokchung', seller: kendra('Mokokchung', '01'), weightKg: { min: 280, max: 280 }, ageLabel: '3 years', price: 32000, available: 2, sex: 'female', purpose: 'Milk Production', health: healthy(38), notes: 'Calm temperament. Regularly dewormed. Suitable for smallholder farmers.', photos: [] },
  { id: 'ls-1078', species: 'goat', breed: 'Black Bengal', description: 'Black Bengal goats, fast-growing.', district: 'Phek', seller: kendra('Phek', '07'), weightKg: { min: 15, max: 25 }, ageLabel: '1 year', price: 9500, available: 10, sex: 'mixed', purpose: 'Meat & breeding', health: healthy(20), notes: null, photos: [] },
  { id: 'ls-1083', species: 'pig', breed: 'Hampshire cross', description: 'Hampshire cross weaners.', district: 'Mokokchung', seller: kendra('Mokokchung', '01'), weightKg: { min: 20, max: 30 }, ageLabel: '3 months', price: 5500, available: 9, sex: 'mixed', purpose: 'Rearing', health: healthy(10), notes: 'Movement is subject to the current ASF advisory.', photos: [] },
  { id: 'ls-1090', species: 'chicken', breed: 'Vanaraja', description: 'Vanaraja dual-purpose birds.', district: 'Kohima', seller: kendra('Kohima', '03'), weightKg: { min: 1.5, max: 2.5 }, ageLabel: '4 months', price: 350, available: 40, sex: 'mixed', purpose: 'Meat & eggs', health: healthy(7), notes: null, photos: [] },
];

export const mockBatches: Batch[] = [
  { id: 'lsbt-1234', reference: 'LSBT-1234', species: 'pig', count: 10, liveWeightKg: 500, expectedPrice: 50000, location: 'Ungma', reportedAt: daysAgo(21), status: 'awaiting', inspectedBy: null, certificate: null, rejectionReason: null },
  { id: 'lsbt-5678', reference: 'LSBT-5678', species: 'cow', count: 5, liveWeightKg: 1000, expectedPrice: 100000, location: 'Longkhum', reportedAt: daysAgo(38), status: 'certified', inspectedBy: 'Veterinary Officer, Mokokchung', certificate: { number: 'LSCT-1234', inspectedAt: daysAgo(36), result: 'Fit for movement', validUntil: daysAgo(-6), issuedBy: 'District Veterinary Officer, Mokokchung' }, rejectionReason: null },
  { id: 'lsbt-4321', reference: 'LSBT-4321', species: 'chicken', count: 100, liveWeightKg: 180, expectedPrice: 30000, location: 'Ungma', reportedAt: daysAgo(55), status: 'certified', inspectedBy: 'Veterinary Officer, Mokokchung', certificate: { number: 'LSCT-1190', inspectedAt: daysAgo(53), result: 'Fit for movement', validUntil: daysAgo(23), issuedBy: 'District Veterinary Officer, Mokokchung' }, rejectionReason: null },
  { id: 'lsbt-8765', reference: 'LSBT-8765', species: 'goat', count: 5, liveWeightKg: 110, expectedPrice: 55000, location: 'Chuchuyimlang', reportedAt: daysAgo(70), status: 'rejected', inspectedBy: 'Veterinary Officer, Mokokchung', certificate: null, rejectionReason: 'Two animals showed signs of PPR. Re-inspection after treatment.' },
];

export const mockAlerts: BioAlert[] = [
  { id: 'lsal-1234', kind: 'alert', title: 'African swine fever in a neighbouring district', body: 'Do not move pigs out of your village. Report the death of any pig to the veterinary officer the same day.', issuedAt: daysAgo(0, 8, 40), acknowledgedAt: null },
  { id: 'lsal-1230', kind: 'advisory', title: 'Vaccination round', body: 'Cattle and buffalo vaccination at Ungma on 26 September. Bring your batch reference.', issuedAt: daysAgo(17), acknowledgedAt: null },
  { id: 'lsal-1221', kind: 'advisory', title: 'Poultry sheds before the rain', body: 'Raise the floor level and cover feed. Losses last season were highest in low-lying sheds.', issuedAt: daysAgo(30), acknowledgedAt: null },
];
