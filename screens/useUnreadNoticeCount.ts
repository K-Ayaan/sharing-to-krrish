import { useSyncExternalStore } from 'react';
import { getUnreadNoticeCount, subscribeToNotices } from '../data/mock/mockNotices';

/** Live unread count. Every bell badge reads this, so marking a notice read updates them all at once. */
export const useUnreadNoticeCount = () => useSyncExternalStore(subscribeToNotices, getUnreadNoticeCount);
