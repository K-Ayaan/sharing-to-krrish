import { invalidate } from './cache';
import { NotFoundError, request } from './client';
import { db } from './db';

export function getNotices() {
  return request(() => [...db.notices].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)));
}

export function getNotice(id: string) {
  return request(() => {
    const notice = db.notices.find((item) => item.id === id);
    if (!notice) throw new NotFoundError('Notice');
    return notice;
  });
}

export function markAllNoticesRead() {
  if (db.notices.every((item) => item.read)) return;
  db.notices = db.notices.map((item) => ({ ...item, read: true }));
  invalidate('notices', 'home');
}

// Read state is local-first: mark immediately so the unread dot clears on return.
export function markNoticeRead(id: string) {
  const notice = db.notices.find((item) => item.id === id);
  if (!notice || notice.read) return;
  db.notices = db.notices.map((item) => (item.id === id ? { ...item, read: true } : item));
  invalidate('notices', 'home');
}
