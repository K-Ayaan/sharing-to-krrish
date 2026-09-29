import type {
  Collection,
  DeliveryType,
  Grievance,
  GrievanceCategory,
  Produce,
} from '../data/mock/mockVanDhan';
import { invalidate } from './cache';
import { NotFoundError, request, ValidationError } from './client';
import { db, nextReference } from './db';
import { getIsOnline } from './network';
import { enqueue } from './syncQueue';

export type CollectionWithProduce = Collection & { produce: Produce };

export type WriteResult<T> = { queued: true } | { queued: false; value: T };

function withProduce(collection: Collection): CollectionWithProduce {
  const produce = db.produce.find((item) => item.id === collection.produceId);
  if (!produce) throw new NotFoundError('Produce');
  return { ...collection, produce };
}

export function getRates() {
  return request(() => [...db.produce].sort((a, b) => a.name.localeCompare(b.name)));
}

export function getCollections() {
  return request(() =>
    db.collections
      .map(withProduce)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  );
}

export function getCollection(id: string) {
  return request(() => {
    const collection = db.collections.find((item) => item.id === id);
    if (!collection) throw new NotFoundError('Collection');
    return withProduce(collection);
  });
}

export async function registerVanDhan() {
  await request(() => {
    db.profile.registrations.vandhan = { since: new Date().toISOString() };
  });
  invalidate('profile', 'home', 'services');
}

export type CollectionInput = {
  produceId: string;
  grade: string;
  quantity: number;
  deliveryType: DeliveryType;
  scheduledFor: string | null;
  notes: string;
};

export const MAX_COLLECTION_QUANTITY = 5000;

export function validateCollection(input: Partial<CollectionInput>) {
  const errors: Partial<Record<keyof CollectionInput, string>> = {};
  if (!input.produceId) errors.produceId = 'Choose the produce you are delivering';
  if (!input.grade) errors.grade = 'Choose a grade';
  if (!input.quantity || Number.isNaN(input.quantity) || input.quantity <= 0) {
    errors.quantity = 'Enter the quantity';
  } else if (input.quantity > MAX_COLLECTION_QUANTITY) {
    errors.quantity = `Enter a quantity up to ${MAX_COLLECTION_QUANTITY.toLocaleString('en-IN')}`;
  }
  if (input.deliveryType === 'scheduled') {
    if (!input.scheduledFor) errors.scheduledFor = 'Choose a delivery date and time';
    else if (new Date(input.scheduledFor).getTime() < Date.now()) {
      errors.scheduledFor = 'Choose a time later than now';
    }
  }
  return errors;
}

function commitCollection(input: CollectionInput) {
  const reference = `VD-${new Date().getFullYear()}-${nextReference('').slice(1)}`;
  const collection: Collection = {
    id: `vdcl-${Date.now()}`,
    reference,
    produceId: input.produceId,
    quantity: input.quantity,
    grade: input.grade,
    deliveryType: input.deliveryType,
    scheduledFor: input.scheduledFor,
    notes: input.notes.trim() || null,
    kendraName: db.profile.kendra.name,
    submittedAt: new Date().toISOString(),
    reviewStartedAt: null,
    decidedAt: null,
    status: 'pending',
    rejectionReason: null,
  };
  db.collections = [collection, ...db.collections];
  return collection;
}

// Works offline: the entry is held on the phone and sent when the network returns (SDD §8.8).
export async function submitCollection(input: CollectionInput): Promise<WriteResult<Collection>> {
  const errors = validateCollection(input);
  const first = Object.values(errors)[0];
  if (first) throw new ValidationError(first);

  if (!getIsOnline()) {
    const produce = db.produce.find((item) => item.id === input.produceId);
    enqueue({
      pillar: 'vandhan',
      label: `${produce?.name ?? 'Collection'} · ${input.quantity} ${produce?.unit ?? ''}`.trim(),
      send: () => {
        commitCollection(input);
        invalidate('vandhan', 'records', 'home');
      },
    });
    return { queued: true };
  }
  const collection = await request(() => commitCollection(input));
  invalidate('vandhan', 'records', 'home');
  return { queued: false, value: collection };
}

export function getGrievances() {
  return request(() => [...db.vdGrievances].sort((a, b) => b.raisedAt.localeCompare(a.raisedAt)));
}

export type GrievanceInput = { category: GrievanceCategory; description: string };

function commitGrievance(input: GrievanceInput) {
  const grievance: Grievance = {
    id: `vdgr-${Date.now()}`,
    reference: nextReference('VDGR'),
    category: input.category,
    description: input.description.trim(),
    kendraName: db.profile.kendra.name,
    raisedAt: new Date().toISOString(),
    status: 'open',
    withWhom: `Kendra Coordinator, ${db.profile.kendra.district}`,
  };
  db.vdGrievances = [grievance, ...db.vdGrievances];
  return grievance;
}

export async function raiseGrievance(input: GrievanceInput): Promise<WriteResult<Grievance>> {
  if (input.description.trim().length < 10) {
    throw new ValidationError('Tell us what happened — ten words or so is enough');
  }
  if (!getIsOnline()) {
    enqueue({
      pillar: 'vandhan',
      label: 'Van Dhan grievance',
      send: () => {
        commitGrievance(input);
        invalidate('vandhan', 'records');
      },
    });
    return { queued: true };
  }
  const grievance = await request(() => commitGrievance(input));
  invalidate('vandhan', 'records');
  return { queued: false, value: grievance };
}
