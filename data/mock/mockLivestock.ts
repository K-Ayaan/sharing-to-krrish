// Mock number only — replace with each kendra's real sales line before release.
const SALES_PHONE = '+919876543210';

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString();

export type Species = 'pig' | 'cattle' | 'goat' | 'sheep' | 'poultry' | 'mithun';
export type Sex = 'male' | 'female' | 'unspecified';
export type WeightBand = 'below_20' | '20_30' | '30_50' | '50_70' | '70_90' | 'above_90';

export type Option<T extends string> = { id: T; name: string };

export const speciesOptions: Option<Species>[] = [
  { id: 'pig', name: 'Pig' },
  { id: 'cattle', name: 'Cattle' },
  { id: 'goat', name: 'Goat' },
  { id: 'sheep', name: 'Sheep' },
  { id: 'poultry', name: 'Poultry' },
  { id: 'mithun', name: 'Mithun' },
];

export const sexOptions: Option<Sex>[] = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
  { id: 'unspecified', name: 'Not specified' },
];

export const weightBandOptions: Option<WeightBand>[] = [
  { id: 'below_20', name: 'Below 20 kg' },
  { id: '20_30', name: '20 – 30 kg' },
  { id: '30_50', name: '30 – 50 kg' },
  { id: '50_70', name: '50 – 70 kg' },
  { id: '70_90', name: '70 – 90 kg' },
  { id: 'above_90', name: 'Above 90 kg' },
];

export type CollectionCentre = {
  id: string;
  name: string;
  address: { line1: string; line2: string };
  salesPhone: string;
};

export type StockPhoto = { id: string; url: string | null };

export type StockItem = {
  id: string;
  species: Species;
  sex: Sex;
  weightBand: WeightBand;
  quantityAvailable: number;
  centre: CollectionCentre;
  updatedAt: string;
  availableTo: string;
  photos: StockPhoto[];
};

export type MovementAlert = {
  id: string;
  title: string;
  body: string;
  species: Species;
  issuedAt: string;
};

export type LivestockHomeResponse = {
  tagline: string;
  banner: { id: string; text: string };
  stock: StockItem[];
};

const centres: Record<string, CollectionCentre> = {
  dimapur: {
    id: 'dimapur',
    name: 'Dimapur Kendra',
    address: { line1: 'Forest Colony, Dimapur', line2: 'Nagaland' },
    salesPhone: SALES_PHONE,
  },
  kohima: {
    id: 'kohima',
    name: 'Kohima Kendra',
    address: { line1: 'High School Junction, Kohima', line2: 'Nagaland' },
    salesPhone: SALES_PHONE,
  },
  mokokchung: {
    id: 'mokokchung',
    name: 'Mokokchung Kendra',
    address: { line1: 'Main Town, Mokokchung', line2: 'Nagaland' },
    salesPhone: SALES_PHONE,
  },
  tuensang: {
    id: 'tuensang',
    name: 'Tuensang Kendra',
    address: { line1: 'Sub-Divisional Road, Tuensang', line2: 'Nagaland' },
    salesPhone: SALES_PHONE,
  },
};

const AUTHORISED_BUYERS = 'Government departments and authorised institutions only.';

const photos = (id: string, count: number): StockPhoto[] =>
  Array.from({ length: count }, (_, index) => ({ id: `${id}-photo-${index + 1}`, url: null }));

export const mockStock: StockItem[] = [
  { id: 'LV-2025-0134', species: 'pig', sex: 'female', weightBand: '20_30', quantityAvailable: 12, centre: centres.dimapur, updatedAt: daysAgo(0), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0134', 3) },
  { id: 'LV-2025-0133', species: 'pig', sex: 'male', weightBand: '30_50', quantityAvailable: 8, centre: centres.kohima, updatedAt: daysAgo(1), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0133', 2) },
  { id: 'LV-2025-0131', species: 'pig', sex: 'female', weightBand: '50_70', quantityAvailable: 5, centre: centres.mokokchung, updatedAt: daysAgo(1), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0131', 3) },
  { id: 'LV-2025-0129', species: 'pig', sex: 'male', weightBand: '70_90', quantityAvailable: 3, centre: centres.tuensang, updatedAt: daysAgo(2), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0129', 1) },
  { id: 'LV-2025-0127', species: 'goat', sex: 'female', weightBand: 'below_20', quantityAvailable: 15, centre: centres.kohima, updatedAt: daysAgo(2), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0127', 2) },
  { id: 'LV-2025-0125', species: 'cattle', sex: 'male', weightBand: 'above_90', quantityAvailable: 4, centre: centres.dimapur, updatedAt: daysAgo(3), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0125', 3) },
  { id: 'LV-2025-0122', species: 'poultry', sex: 'unspecified', weightBand: 'below_20', quantityAvailable: 60, centre: centres.mokokchung, updatedAt: daysAgo(4), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0122', 1) },
  { id: 'LV-2025-0120', species: 'mithun', sex: 'female', weightBand: 'above_90', quantityAvailable: 2, centre: centres.tuensang, updatedAt: daysAgo(5), availableTo: AUTHORISED_BUYERS, photos: photos('LV-2025-0120', 2) },
];

export const mockLivestockHome: LivestockHomeResponse = {
  tagline: 'Current MARCOFED stock you can enquire about.',
  banner: {
    id: 'ann-livestock-guidelines',
    text: 'MARCOFED livestock is subject to stock availability and movement guidelines.',
  },
  stock: mockStock,
};

export function getStockItem(id: string): StockItem | undefined {
  return mockStock.find((item) => item.id === id);
}

// ---- Movement-ban alerts: in-memory acknowledgement, so a dismissed alert stays
// dismissed for the session, as a real "acknowledged" flag on the server would.

const alerts: MovementAlert[] = [
  {
    id: 'alert-asf-2025-08',
    title: 'Movement ban notice',
    body: 'Movement of pigs is restricted in certain areas due to an outbreak. Check the latest guidelines before planning transport.',
    species: 'pig',
    issuedAt: daysAgo(1),
  },
];

const acknowledged = new Set<string>();

export function getActiveAlerts(): MovementAlert[] {
  return alerts.filter((alert) => !acknowledged.has(alert.id));
}

export async function acknowledgeAlert(id: string): Promise<void> {
  acknowledged.add(id);
}

export function enquiryMessage(item: StockItem, labels: { species: string; sex: string; weight: string }) {
  return `Hello, I'd like to enquire about MARCOFED livestock stock ${item.id} (${labels.species}, ${labels.sex}, ${labels.weight}) at ${item.centre.name}.`;
}

// ---- Enquiries: kept in memory so a Call or WhatsApp hand-off from StockDetails shows up in
// Records — the same pattern as Van Dhan collection logs and LPG refill requests.

export type EnquiryChannel = 'call' | 'whatsapp';

export type LivestockEnquiry = {
  id: string;
  stockId: string;
  channel: EnquiryChannel;
  enquiredAt: string;
};

const ENQUIRY_SEQUENCE_START = 1;

const enquiries: LivestockEnquiry[] = [];

export const getEnquiries = (): readonly LivestockEnquiry[] => enquiries;

export async function recordEnquiry(input: {
  stockId: string;
  channel: EnquiryChannel;
}): Promise<LivestockEnquiry> {
  const enquiry: LivestockEnquiry = {
    ...input,
    id: `ENQ-2025-${String(ENQUIRY_SEQUENCE_START + enquiries.length).padStart(4, '0')}`,
    enquiredAt: new Date().toISOString(),
  };
  enquiries.push(enquiry);
  return enquiry;
}
