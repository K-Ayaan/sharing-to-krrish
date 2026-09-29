import type { Batch, Species } from '../data/mock/mockLivestock';
import { invalidate } from './cache';
import { NotFoundError, request, ValidationError } from './client';
import { db, nextReference } from './db';
import { getIsOnline } from './network';
import { enqueue } from './syncQueue';
import type { WriteResult } from './vanDhanService';

export function getListings() {
  return request(() => db.listings);
}

export function getListing(id: string) {
  return request(() => {
    const listing = db.listings.find((item) => item.id === id);
    if (!listing) throw new NotFoundError('Listing');
    return listing;
  });
}

export async function registerLivestock() {
  await request(() => {
    db.profile.registrations.livestock = { since: new Date().toISOString() };
  });
  invalidate('profile', 'home', 'services');
}

export function getBatches() {
  return request(() => [...db.batches].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)));
}

export function getBatch(id: string) {
  return request(() => {
    const batch = db.batches.find((item) => item.id === id);
    if (!batch) throw new NotFoundError('Batch');
    return batch;
  });
}

export type StockInput = {
  species: Species;
  count: number;
  liveWeightKg: number;
  expectedPrice: number;
  location: string;
};

// SDD §4.2.1: validated against plausible ranges before it is accepted.
const PER_ANIMAL_KG: Record<Species, { min: number; max: number }> = {
  cow: { min: 50, max: 900 },
  buffalo: { min: 80, max: 1200 },
  goat: { min: 5, max: 90 },
  pig: { min: 5, max: 350 },
  chicken: { min: 0.3, max: 6 },
  duck: { min: 0.5, max: 6 },
};

export function validateStock(input: Partial<StockInput>): string | null {
  if (!input.species) return 'Choose the animal';
  if (!input.count || input.count < 1) return 'Enter how many animals';
  if (input.count > 5000) return 'Enter a count up to 5,000';
  if (!input.liveWeightKg || input.liveWeightKg <= 0) return 'Enter the total live weight';
  const perAnimal = input.liveWeightKg / input.count;
  const range = PER_ANIMAL_KG[input.species];
  if (perAnimal < range.min || perAnimal > range.max) {
    return `That’s about ${Math.round(perAnimal * 10) / 10} kg per animal, which is outside the usual range. Check the weight.`;
  }
  if (!input.expectedPrice || input.expectedPrice <= 0) return 'Enter the price you expect';
  if (!input.location?.trim()) return 'Enter where the animals are kept';
  return null;
}

function commitBatch(input: StockInput) {
  const batch: Batch = {
    id: `lsbt-${Date.now()}`,
    reference: nextReference('LSBT'),
    species: input.species,
    count: input.count,
    liveWeightKg: input.liveWeightKg,
    expectedPrice: input.expectedPrice,
    location: input.location.trim(),
    reportedAt: new Date().toISOString(),
    status: 'awaiting',
    inspectedBy: null,
    certificate: null,
    rejectionReason: null,
  };
  db.batches = [batch, ...db.batches];
  return batch;
}

export async function reportStock(input: StockInput): Promise<WriteResult<Batch>> {
  const error = validateStock(input);
  if (error) throw new ValidationError(error);
  if (!getIsOnline()) {
    enqueue({
      pillar: 'livestock',
      label: `Stock report · ${input.count} ${input.species}`,
      send: () => {
        commitBatch(input);
        invalidate('livestock', 'records');
      },
    });
    return { queued: true };
  }
  const batch = await request(() => commitBatch(input));
  invalidate('livestock', 'records');
  return { queued: false, value: batch };
}

export function getAlerts() {
  return request(() => [...db.alerts].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)));
}

export async function acknowledgeAlert(id: string) {
  await request(() => {
    db.alerts = db.alerts.map((alert) =>
      alert.id === id ? { ...alert, acknowledgedAt: new Date().toISOString() } : alert
    );
  });
  invalidate('livestock:alerts');
}
