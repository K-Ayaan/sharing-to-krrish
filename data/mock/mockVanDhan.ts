import { mockDistricts, mockVillagesByDistrict } from './mockOnboarding';
import { mockUser, type UserProfile } from './mockUser';

// Mock numbers only — replace with the real helpline/kendra numbers before release.
const PRICE_LINE_PHONE = '+919876543210';
const KENDRA_PHONE = '+919876543210';

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString();

export type Trend = 'up' | 'down' | 'flat';
export type ProduceUnit = 'kg' | 'bundle' | 'litre';

export type Produce = {
  id: string;
  name: string;
  dialect: { language: string; name: string };
  rate: { amount: number; currency: 'INR'; unit: ProduceUnit };
  trend: Trend;
  updatedAt: string;
  unitConversion: string | null;
  qualityGrade: string;
  applicableArea: string;
  imageUrl: string | null;
};

export type Address = { village: string; district: string; state: string };

export type Kendra = {
  id: string;
  name: string;
  address: { line1: string; line2: string; pincode: string };
  phone: string;
  hours: string;
  photoUrl: string | null;
};

export type PickupStatus = 'requested' | 'confirmed' | 'collected';

export type Pickup = {
  id: string;
  status: PickupStatus;
  requestedAt: string;
  confirmedAt: string | null;
  collectedAt: string | null;
  scheduledFor: string;
  address: Address;
  contactPhone: string;
  notes: string | null;
};

export type GrievanceStage = 'submitted' | 'routed' | 'in_progress' | 'resolved';

export type Grievance = {
  id: string;
  subject: string;
  submittedAt: string;
  stage: GrievanceStage;
  timeline: { stage: GrievanceStage; at: string | null; note: string | null }[];
  helplinePhone: string;
};

export type VanDhanHomeResponse = {
  user: UserProfile;
  tagline: string;
  priceLine: { phone: string; description: string };
  produce: Produce[];
  kendra: Kendra;
  activeGrievance: Grievance | null;
};

export type CollectionType = 'bringing_now' | 'pre_logged';

export type CollectionLogRequest = {
  type: CollectionType;
  produceId: string;
  quantity: number;
  unit: ProduceUnit;
  note: string | null;
};

export type PickupRequest = {
  address: Address;
  date: string;
  notes: string | null;
};

export const produceUnits: { id: ProduceUnit; name: string }[] = [
  { id: 'kg', name: 'kg' },
  { id: 'bundle', name: 'bundle' },
  { id: 'litre', name: 'litre' },
];

const NAGALAND = 'Nagaland';

export const mockProduce: Produce[] = [
  {
    id: 'broom-grass',
    name: 'Broom Grass',
    dialect: { language: 'Yimchunger', name: 'Tsüngri' },
    rate: { amount: 120, currency: 'INR', unit: 'kg' },
    trend: 'up',
    updatedAt: daysAgo(0),
    unitConversion: '1 bundle = 50 leaves (approx. 250 g)',
    qualityGrade: 'Standard (A)',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
  {
    id: 'wild-honey',
    name: 'Wild Honey',
    dialect: { language: 'Sumi', name: 'Süphu' },
    rate: { amount: 280, currency: 'INR', unit: 'kg' },
    trend: 'up',
    updatedAt: daysAgo(1),
    unitConversion: '1 litre ≈ 1.4 kg',
    qualityGrade: 'Raw, unprocessed',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
  {
    id: 'king-chilli',
    name: 'King Chilli',
    dialect: { language: 'Ao', name: 'Tsi' },
    rate: { amount: 450, currency: 'INR', unit: 'kg' },
    trend: 'down',
    updatedAt: daysAgo(2),
    unitConversion: 'Dried weight; fresh ≈ 5× dried',
    qualityGrade: 'Sun-dried (A)',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
  {
    id: 'wild-turmeric',
    name: 'Turmeric (Wild)',
    dialect: { language: 'Konyak', name: 'Alei' },
    rate: { amount: 180, currency: 'INR', unit: 'kg' },
    trend: 'flat',
    updatedAt: daysAgo(0),
    unitConversion: null,
    qualityGrade: 'Standard (A)',
    applicableArea: 'Mon, Tuensang, Longleng',
    imageUrl: null,
  },
  {
    id: 'wild-ginger',
    name: 'Ginger (Wild)',
    dialect: { language: 'Angami', name: 'Zhapfu' },
    rate: { amount: 200, currency: 'INR', unit: 'kg' },
    trend: 'up',
    updatedAt: daysAgo(3),
    unitConversion: null,
    qualityGrade: 'Standard (A)',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
  {
    id: 'bamboo-shoot',
    name: 'Bamboo Shoot',
    dialect: { language: 'Lotha', name: 'Rü' },
    rate: { amount: 90, currency: 'INR', unit: 'kg' },
    trend: 'down',
    updatedAt: daysAgo(4),
    unitConversion: 'Fresh weight',
    qualityGrade: 'Fresh (B)',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
  {
    id: 'forest-mushroom',
    name: 'Forest Mushroom',
    dialect: { language: 'Rengma', name: 'Züphe' },
    rate: { amount: 320, currency: 'INR', unit: 'kg' },
    trend: 'up',
    updatedAt: daysAgo(0),
    unitConversion: 'Dried weight',
    qualityGrade: 'Dried (A)',
    applicableArea: 'Kohima, Phek, Tseminyü',
    imageUrl: null,
  },
  {
    id: 'cane-bamboo-craft',
    name: 'Cane & Bamboo Craft',
    dialect: { language: 'Chakhesang', name: 'Thepfu' },
    rate: { amount: 150, currency: 'INR', unit: 'bundle' },
    trend: 'flat',
    updatedAt: daysAgo(2),
    unitConversion: '1 bundle = 10 finished pieces',
    qualityGrade: 'Handcrafted',
    applicableArea: 'All districts in Nagaland',
    imageUrl: null,
  },
];

export const mockKendra: Kendra = {
  id: 'kendra-dimapur',
  name: 'Dimapur Kendra',
  address: { line1: 'Forest Colony, Dimapur', line2: NAGALAND, pincode: '797112' },
  phone: KENDRA_PHONE,
  hours: 'Mon – Sat, 9:00 AM – 5:00 PM',
  photoUrl: null,
};

export const mockGrievance: Grievance = {
  id: 'GR-2025-0134',
  subject: 'Delayed payment for broom grass collection',
  submittedAt: '2025-08-10T14:15:00+05:30',
  stage: 'in_progress',
  timeline: [
    { stage: 'submitted', at: '2025-08-10T14:15:00+05:30', note: 'Your grievance has been submitted.' },
    { stage: 'routed', at: '2025-08-11T10:20:00+05:30', note: 'Routed to Dimapur Kendra.' },
    { stage: 'in_progress', at: '2025-08-12T16:30:00+05:30', note: 'Our team is working on your grievance.' },
    { stage: 'resolved', at: null, note: null },
  ],
  helplinePhone: PRICE_LINE_PHONE,
};

export const mockVanDhanHome: VanDhanHomeResponse = {
  user: mockUser,
  tagline: 'From our forests to a better future.',
  priceLine: {
    phone: PRICE_LINE_PHONE,
    description: 'Get the latest rates from the Van Dhan helpline.',
  },
  produce: mockProduce,
  kendra: mockKendra,
  activeGrievance: mockGrievance,
};

// ---- Pickups: a tiny in-memory "API" so a newly requested pickup is what
// PickupDetails and VanDhanHome show, as a real backend would.

const PICKUP_SEQUENCE_START = 47;
const PICKUP_WINDOW_DAYS = 7;

const pickups: Pickup[] = [
  {
    id: 'PK-2025-0047',
    status: 'confirmed',
    requestedAt: '2025-08-12T10:30:00+05:30',
    confirmedAt: '2025-08-13T09:15:00+05:30',
    collectedAt: null,
    scheduledFor: '2025-08-14T10:00:00+05:30',
    address: { village: 'Seithekema', district: 'Dimapur', state: NAGALAND },
    contactPhone: KENDRA_PHONE,
    notes: null,
  },
];

export function getPickup(id: string): Pickup | undefined {
  return pickups.find((pickup) => pickup.id === id);
}

export const getPickups = (): readonly Pickup[] => pickups;

export function getCurrentPickup(): Pickup | null {
  return pickups[pickups.length - 1] ?? null;
}

export async function requestPickup(request: PickupRequest): Promise<Pickup> {
  const pickup: Pickup = {
    id: `PK-2025-${String(PICKUP_SEQUENCE_START + pickups.length).padStart(4, '0')}`,
    status: 'requested',
    requestedAt: new Date().toISOString(),
    confirmedAt: null,
    collectedAt: null,
    scheduledFor: request.date,
    address: request.address,
    contactPhone: KENDRA_PHONE,
    notes: request.notes,
  };
  pickups.push(pickup);
  return pickup;
}

/** Next available pickup dates, starting tomorrow. */
export function availablePickupDates(from = new Date()): string[] {
  return Array.from({ length: PICKUP_WINDOW_DAYS }, (_, index) =>
    new Date(from.getTime() + (index + 1) * DAY_MS).toISOString()
  );
}

/** Every village as a pickup address, keyed "district/village". */
export function pickupAddressOptions(): { id: string; address: Address }[] {
  return mockDistricts.flatMap((district) =>
    (mockVillagesByDistrict[district.id] ?? []).map((village) => ({
      id: `${district.id}/${village.id}`,
      address: { village: village.name, district: district.name, state: NAGALAND },
    }))
  );
}

// ---- Collection logs: kept in memory so a collection logged in LogCollection shows up in Records.

export type CollectionLog = CollectionLogRequest & { id: string; loggedAt: string };

const COLLECTION_SEQUENCE_START = 310;

const collectionLogs: CollectionLog[] = [
  {
    id: 'CL-2025-0310',
    type: 'pre_logged',
    produceId: 'wild-honey',
    quantity: 4,
    unit: 'kg',
    note: null,
    loggedAt: daysAgo(12),
  },
  {
    id: 'CL-2025-0311',
    type: 'bringing_now',
    produceId: 'broom-grass',
    quantity: 25,
    unit: 'kg',
    note: 'Dried and bundled.',
    loggedAt: daysAgo(6),
  },
];

export const getCollectionLogs = (): readonly CollectionLog[] => collectionLogs;

export const getProduce = (id: string) => mockProduce.find((item) => item.id === id);

export async function logCollection(request: CollectionLogRequest): Promise<CollectionLog> {
  const log: CollectionLog = {
    ...request,
    id: `CL-2025-${String(COLLECTION_SEQUENCE_START + collectionLogs.length).padStart(4, '0')}`,
    loggedAt: new Date().toISOString(),
  };
  collectionLogs.push(log);
  return log;
}
