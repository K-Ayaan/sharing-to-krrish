import { daysAgo } from './dates';
import { MOKOKCHUNG_KENDRA } from './mockUser';

// Glyph keys are resolved to icons in screens/vandhan/vanDhanFormat.ts (data stays UI-free).
export type ProduceGlyph = 'wood' | 'root' | 'fruit' | 'pod' | 'honey' | 'seed' | 'leaf' | 'nut' | 'grass' | 'resin';

export type Produce = {
  id: string;
  name: string;
  unit: 'kg' | 'bundle' | 'litre';
  // Current notified MSP rate in rupees per unit (SDD §4.1.1 / S-10).
  rate: number;
  effectiveFrom: string;
  updatedAt: string;
  glyph: ProduceGlyph;
  imageUrl: string | null;
  grades: string[];
};

export type CollectionStatus = 'pending' | 'verified' | 'rejected';
export type DeliveryType = 'today' | 'scheduled';

export type Collection = {
  id: string;
  reference: string;
  produceId: string;
  quantity: number;
  grade: string;
  deliveryType: DeliveryType;
  scheduledFor: string | null;
  notes: string | null;
  kendraName: string;
  submittedAt: string;
  reviewStartedAt: string | null;
  decidedAt: string | null;
  status: CollectionStatus;
  rejectionReason: string | null;
};

export type GrievanceCategory =
  | 'rate_below_notified'
  | 'payment_not_received'
  | 'weighing_dispute'
  | 'kendra_closed'
  | 'something_else';

export type Grievance = {
  id: string;
  reference: string;
  category: GrievanceCategory;
  description: string;
  kendraName: string;
  raisedAt: string;
  status: 'open' | 'in_review' | 'closed';
  withWhom: string;
};

export const GRIEVANCE_CATEGORIES: { value: GrievanceCategory; label: string }[] = [
  { value: 'rate_below_notified', label: 'Rate below notified' },
  { value: 'payment_not_received', label: 'Payment not received' },
  { value: 'weighing_dispute', label: 'Weighing dispute' },
  { value: 'kendra_closed', label: 'Kendra closed' },
  { value: 'something_else', label: 'Something else' },
];

const GRADES = ['A Grade', 'B Grade', 'C Grade'];
const today = daysAgo(0, 6, 0);

export const mockProduce: Produce[] = [
  { id: 'agarwood', name: 'Agarwood', unit: 'kg', rate: 6500, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'wood', imageUrl: null, grades: GRADES },
  { id: 'wild-turmeric', name: 'Wild Turmeric', unit: 'kg', rate: 120, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'root', imageUrl: null, grades: GRADES },
  { id: 'amla', name: 'Amla', unit: 'kg', rate: 35, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'fruit', imageUrl: null, grades: GRADES },
  { id: 'tamarind', name: 'Tamarind', unit: 'kg', rate: 22, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'pod', imageUrl: null, grades: GRADES },
  { id: 'wild-honey', name: 'Wild Honey', unit: 'kg', rate: 280, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'honey', imageUrl: null, grades: GRADES },
  { id: 'mahua', name: 'Mahua', unit: 'kg', rate: 40, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'seed', imageUrl: null, grades: GRADES },
  { id: 'sal-leaf', name: 'Sal Leaf', unit: 'bundle', rate: 15, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'leaf', imageUrl: null, grades: GRADES },
  { id: 'soapnut', name: 'Soapnut (Ritha)', unit: 'kg', rate: 45, effectiveFrom: daysAgo(18), updatedAt: today, glyph: 'nut', imageUrl: null, grades: GRADES },
  { id: 'broom-grass', name: 'Broom Grass', unit: 'kg', rate: 30, effectiveFrom: daysAgo(49), updatedAt: daysAgo(3), glyph: 'grass', imageUrl: null, grades: GRADES },
  { id: 'sal-resin', name: 'Sal Resin', unit: 'kg', rate: 95, effectiveFrom: daysAgo(49), updatedAt: daysAgo(3), glyph: 'resin', imageUrl: null, grades: GRADES },
];

const kendraName = MOKOKCHUNG_KENDRA.name;

export const mockCollections: Collection[] = [
  {
    id: 'vdcl-4587', reference: 'VD-2026-0912-4587', produceId: 'wild-honey', quantity: 25, grade: 'A Grade',
    deliveryType: 'today', scheduledFor: null, notes: null, kendraName,
    submittedAt: daysAgo(7, 10, 24), reviewStartedAt: daysAgo(6, 14, 15), decidedAt: null, status: 'pending', rejectionReason: null,
  },
  {
    id: 'vdcl-4411', reference: 'VD-2026-0910-4411', produceId: 'broom-grass', quantity: 50, grade: 'A Grade',
    deliveryType: 'today', scheduledFor: null, notes: null, kendraName,
    submittedAt: daysAgo(9, 9, 5), reviewStartedAt: daysAgo(8, 11, 30), decidedAt: daysAgo(7, 11, 40), status: 'verified', rejectionReason: null,
  },
  {
    id: 'vdcl-4290', reference: 'VD-2026-0905-4290', produceId: 'wild-turmeric', quantity: 30, grade: 'B Grade',
    deliveryType: 'scheduled', scheduledFor: daysAgo(14, 11, 0), notes: 'Collected near Longkhum ridge.', kendraName,
    submittedAt: daysAgo(14, 8, 50), reviewStartedAt: daysAgo(13, 10, 0), decidedAt: daysAgo(12, 16, 20), status: 'rejected',
    rejectionReason: 'Moisture above the accepted level. Dry the produce and bring it again.',
  },
  {
    id: 'vdcl-4102', reference: 'VD-2026-0828-4102', produceId: 'amla', quantity: 40, grade: 'A Grade',
    deliveryType: 'today', scheduledFor: null, notes: null, kendraName,
    submittedAt: daysAgo(22, 10, 10), reviewStartedAt: daysAgo(21, 12, 0), decidedAt: daysAgo(20, 15, 30), status: 'verified', rejectionReason: null,
  },
  {
    id: 'vdcl-3988', reference: 'VD-2026-0818-3988', produceId: 'sal-resin', quantity: 20, grade: 'B Grade',
    deliveryType: 'today', scheduledFor: null, notes: null, kendraName,
    submittedAt: daysAgo(32, 9, 40), reviewStartedAt: null, decidedAt: null, status: 'pending', rejectionReason: null,
  },
];

export const mockGrievances: Grievance[] = [
  {
    id: 'vdgr-1234', reference: 'VDGR-1234', category: 'payment_not_received',
    description: 'Payment not received for the 19 August collection.', kendraName,
    raisedAt: daysAgo(11), status: 'in_review', withWhom: 'District Marketing Officer',
  },
  {
    id: 'vdgr-5678', reference: 'VDGR-5678', category: 'weighing_dispute',
    description: 'Weighing dispute at the Kendra scale.', kendraName,
    raisedAt: daysAgo(40), status: 'closed', withWhom: 'Kendra Manager, Mokokchung',
  },
];
