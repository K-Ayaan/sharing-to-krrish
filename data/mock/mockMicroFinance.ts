import { daysAgo } from './dates';

// SDD §4.5: a readiness capability ahead of the channelising-agency mandate — not a live
// lending or core banking system. Copy must never promise a loan.

export type LoanPurpose = 'livestock' | 'farm_inputs' | 'equipment' | 'working_capital' | 'other';

export const LOAN_PURPOSES: { value: LoanPurpose; label: string }[] = [
  { value: 'livestock', label: 'Livestock purchase' },
  { value: 'farm_inputs', label: 'Farm inputs' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'working_capital', label: 'Working capital' },
  { value: 'other', label: 'Something else' },
];

export const TENURES = [6, 12, 18, 24] as const;

export const MAX_LOAN_AMOUNT = 100000;

export type ApplicationStage = 'received' | 'documents' | 'society_recommendation' | 'appraisal' | 'sanction';

export const STAGE_LABEL: Record<ApplicationStage, string> = {
  received: 'Received',
  documents: 'Documents',
  society_recommendation: 'Society recommendation',
  appraisal: 'Appraisal',
  sanction: 'Sanction',
};

export const STAGES: ApplicationStage[] = ['received', 'documents', 'society_recommendation', 'appraisal', 'sanction'];

export type LoanApplication = {
  id: string;
  reference: string;
  purpose: LoanPurpose;
  amount: number;
  tenureMonths: number;
  submittedAt: string;
  stage: ApplicationStage;
  stageDates: Partial<Record<ApplicationStage, string>>;
  sanctioned: boolean;
};

export type LoanDocument = {
  id: string;
  name: string;
  hint: string;
  receivedAt: string | null;
  note: string | null;
};

export type Repayment = { id: string; dueAt: string; amount: number; status: 'due' | 'scheduled' | 'paid' };

export type MfGrievance = {
  id: string;
  reference: string;
  title: string;
  detail: string;
  raisedAt: string;
  status: 'in_review' | 'closed';
};

export const MF_GRIEVANCE_CATEGORIES = [
  { value: 'document_rejected', label: 'Document rejected' },
  { value: 'delay', label: 'Application delayed' },
  { value: 'disbursal', label: 'Disbursal not received' },
  { value: 'repayment', label: 'Repayment issue' },
  { value: 'other', label: 'Something else' },
] as const;

export const mockApplication: LoanApplication | null = {
  id: 'mfap-1234',
  reference: 'MFAP-1234',
  purpose: 'livestock',
  amount: 50000,
  tenureMonths: 12,
  submittedAt: daysAgo(17, 11, 0),
  stage: 'documents',
  stageDates: { received: daysAgo(17, 11, 0) },
  sanctioned: false,
};

export const mockDocuments: LoanDocument[] = [
  { id: 'photo-uid', name: 'Photograph and UID', hint: 'A clear photo of you holding your MARCOFED ID', receivedAt: daysAgo(26), note: null },
  { id: 'society-cert', name: 'Society certificate', hint: 'Issued by your cooperative society', receivedAt: null, note: null },
  { id: 'land-record', name: 'Land record', hint: 'Patta, jamabandi or council certificate', receivedAt: null, note: null },
  { id: 'passbook', name: 'Bank passbook', hint: 'First page, showing your name and account number', receivedAt: daysAgo(24), note: 'Name matched' },
];

// Repayments are scheduled only after sanction (SDD §4.5.4).
export const mockRepayments: Repayment[] = [];

export const mockMfGrievances: MfGrievance[] = [];
