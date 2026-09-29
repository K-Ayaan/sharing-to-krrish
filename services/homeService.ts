// Everything Home (home.png) and the Services hub (services-page.png) show, computed from the
// same records the pillar screens read, so the two never disagree.
import { STAGE_LABEL } from '../data/mock/mockMicroFinance';
import type { PillarKey } from '../data/mock/mockUser';
import { isSameDay } from '../data/mock/dates';
import { formatDayMonth, formatINR } from '../utils/format';
import { request } from './client';
import { db } from './db';

export type PillarStatus = { pillar: PillarKey; registered: boolean; tag: string | null };

export const PILLAR_ORDER: PillarKey[] = ['vandhan', 'livestock', 'lpg', 'microfinance'];

function lpgTag() {
  const bookings = [...db.bookings].sort((a, b) => b.bookedAt.localeCompare(a.bookedAt));
  const active = bookings.find((b) => b.status !== 'delivered' && b.status !== 'cancelled');
  if (active) return active.status === 'out_for_delivery' ? 'Out for delivery' : 'Refill in progress';
  const last = bookings[0];
  if (!last) return 'Book your first refill';
  const eligible = new Date(last.bookedAt).getTime() + 21 * 24 * 60 * 60 * 1000;
  return eligible <= Date.now() ? 'Refill due' : `Next refill ${formatDayMonth(new Date(eligible).toISOString())}`;
}

function tagFor(pillar: PillarKey): string | null {
  switch (pillar) {
    case 'vandhan':
      return db.produce.some((p) => isSameDay(p.updatedAt)) ? 'Rate updated today' : null;
    case 'livestock':
      return `${db.listings.reduce((sum, l) => sum + (l.available > 0 ? 1 : 0), 0)} available`;
    case 'lpg':
      return lpgTag();
    case 'microfinance':
      if (!db.application) return 'No application yet';
      return db.application.sanctioned ? 'Sanctioned' : `${STAGE_LABEL[db.application.stage]} pending`;
  }
}

export function pillarStatuses(): PillarStatus[] {
  return PILLAR_ORDER.map((pillar) => {
    const registered = Boolean(db.profile.registrations[pillar]);
    return { pillar, registered, tag: registered ? tagFor(pillar) : null };
  });
}

// SDD S-02: Home carries today's rate and the things that need the person's attention today.
export type TodayItem = {
  id: string;
  pillar: PillarKey;
  kind: 'rate' | 'alert' | 'documents' | 'refill';
  title: string;
  detail: string;
  urgent: boolean;
};

function todayItems(): TodayItem[] {
  const items: TodayItem[] = [];
  const regs = db.profile.registrations;

  if (regs.vandhan) {
    const latest = [...db.collections].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
    const produce =
      db.produce.find((p) => p.id === latest?.produceId) ?? db.produce.find((p) => isSameDay(p.updatedAt));
    if (produce) {
      items.push({
        id: 'rate',
        pillar: 'vandhan',
        kind: 'rate',
        title: `Today’s rate · ${produce.name}`,
        detail: `${formatINR(produce.rate)} per ${produce.unit} at ${db.profile.kendra.name}`,
        urgent: false,
      });
    }
  }
  if (regs.livestock) {
    db.alerts
      .filter((a) => a.kind === 'alert' && !a.acknowledgedAt)
      .forEach((a) =>
        items.push({
          id: `alert-${a.id}`,
          pillar: 'livestock',
          kind: 'alert',
          title: 'Acknowledge the biosecurity alert',
          detail: a.title,
          urgent: true,
        })
      );
  }
  if (regs.microfinance && db.application && !db.application.sanctioned) {
    const missing = db.documents.filter((d) => !d.receivedAt).length;
    if (missing > 0) {
      items.push({
        id: 'documents',
        pillar: 'microfinance',
        kind: 'documents',
        title: `${missing} loan ${missing === 1 ? 'document' : 'documents'} missing`,
        detail: `Application ${db.application.reference}`,
        urgent: false,
      });
    }
  }
  if (regs.lpg && lpgTag() === 'Refill due') {
    items.push({
      id: 'refill',
      pillar: 'lpg',
      kind: 'refill',
      title: 'Your LPG refill is due',
      detail: 'Booking is open for your connection',
      urgent: false,
    });
  }
  return items;
}

export function getHome() {
  return request(() => ({
    profile: db.profile,
    pillars: pillarStatuses(),
    today: todayItems(),
    unreadNotices: db.notices.filter((n) => !n.read).length,
  }));
}

export function getServices() {
  return request(() => pillarStatuses());
}

export function getUnreadCount() {
  return request(() => db.notices.filter((n) => !n.read).length);
}
