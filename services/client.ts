// The one seam between the app and its backend. Every service function goes through `request`,
// which today resolves against in-memory mock data with realistic latency. Swapping in the real
// SassyJinni API means replacing the bodies of the service functions — screens don't change.
import { getIsOnline } from './network';

export class OfflineError extends Error {
  constructor() {
    super('No internet connection');
    this.name = 'OfflineError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} was not found`);
    this.name = 'NotFoundError';
  }
}

const LATENCY_MS = { min: 450, max: 950 };

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function latency() {
  return LATENCY_MS.min + Math.random() * (LATENCY_MS.max - LATENCY_MS.min);
}

// Responses are deep-copied so screens can never mutate the mock "server" state by accident.
// A call that returns nothing (registering, saving a preference) has nothing to copy — going
// through JSON there would throw on `undefined` and fail an operation that actually succeeded.
export function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function request<T>(resolve: () => T): Promise<T> {
  if (!getIsOnline()) throw new OfflineError();
  await wait(latency());
  if (!getIsOnline()) throw new OfflineError();
  return clone(resolve());
}

export function describeError(error: unknown) {
  if (error instanceof OfflineError) return 'You’re offline. Connect to the internet and try again.';
  if (error instanceof ValidationError) return error.message;
  return 'That didn’t go through. Try again in a moment.';
}
