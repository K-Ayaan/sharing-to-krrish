import {
  MAX_LOAN_AMOUNT,
  type LoanApplication,
  type LoanPurpose,
  type MfGrievance,
} from '../data/mock/mockMicroFinance';
import { invalidate } from './cache';
import { request, ValidationError } from './client';
import { db, nextReference } from './db';

export function getMfOverview() {
  return request(() => ({
    application: db.application,
    documents: db.documents,
    repayments: db.repayments,
    grievances: [...db.mfGrievances].sort((a, b) => b.raisedAt.localeCompare(a.raisedAt)),
  }));
}

export async function registerMicroFinance() {
  await request(() => {
    db.profile.registrations.microfinance = { since: new Date().toISOString() };
  });
  invalidate('profile', 'home', 'services', 'microfinance');
}

export type ApplicationInput = { purpose: LoanPurpose; amount: number; tenureMonths: number };

export function validateAmount(amount: number) {
  if (!amount || Number.isNaN(amount)) return 'Enter the amount you need';
  if (amount < 5000) return 'The smallest amount is ₹5,000';
  if (amount > MAX_LOAN_AMOUNT) return `The largest amount is ₹${MAX_LOAN_AMOUNT.toLocaleString('en-IN')}`;
  return null;
}

export async function applyForLoan(input: ApplicationInput) {
  const error = validateAmount(input.amount);
  if (error) throw new ValidationError(error);
  const application = await request(() => {
    if (db.application && !db.application.sanctioned) {
      throw new ValidationError('You already have an application in progress.');
    }
    const now = new Date().toISOString();
    const created: LoanApplication = {
      id: `mfap-${Date.now()}`,
      reference: nextReference('MFAP'),
      purpose: input.purpose,
      amount: input.amount,
      tenureMonths: input.tenureMonths,
      submittedAt: now,
      stage: 'documents',
      stageDates: { received: now },
      sanctioned: false,
    };
    db.application = created;
    return created;
  });
  invalidate('microfinance', 'records', 'home');
  return application;
}

export async function uploadDocument(id: string) {
  await request(() => {
    db.documents = db.documents.map((doc) =>
      doc.id === id ? { ...doc, receivedAt: new Date().toISOString(), note: 'Received, awaiting check' } : doc
    );
  });
  invalidate('microfinance', 'home');
}

export async function raiseMfGrievance(input: { title: string; description: string }) {
  if (input.description.trim().length < 10) throw new ValidationError('Tell us what happened — ten words or so is enough');
  const grievance = await request(() => {
    const created: MfGrievance = {
      id: `mfgr-${Date.now()}`,
      reference: nextReference('MFGR'),
      title: input.title,
      detail: input.description.trim(),
      raisedAt: new Date().toISOString(),
      status: 'in_review',
    };
    db.mfGrievances = [created, ...db.mfGrievances];
    return created;
  });
  invalidate('microfinance');
  return grievance;
}
