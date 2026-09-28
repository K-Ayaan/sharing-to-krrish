import type { Ionicons } from '@expo/vector-icons';
import { getNotices } from '../../data/mock/mockNotices';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { getRecords, summarize } from '../records/recordSource';

// Home's "Recent activities" owns no data: like Records, it is derived on each read from what the
// rest of the app writes — the user's records (recordSource) plus the notices they've received — so
// it never drifts from My Records or Notices. Livestock appears only as enquiries: the app is
// buyer-only, so there are no listings to show.

export type ActivityTarget = { kind: 'record'; recordId: string } | { kind: 'notice'; noticeId: string };

export type Activity = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  tint: string;
  title: string;
  subtitle: string;
  occurredAt: string;
  target: ActivityTarget;
};

export const RECENT_ACTIVITY_LIMIT = 3;

export function getRecentActivity(limit = RECENT_ACTIVITY_LIMIT): Activity[] {
  const records = getRecords()
    .map(summarize)
    .map(
      (summary): Activity => ({
        id: summary.recordId,
        icon: pillarMeta[summary.pillar].icon,
        iconColor: pillarMeta[summary.pillar].colors.icon,
        tint: pillarMeta[summary.pillar].colors.tint,
        title: summary.title,
        subtitle: summary.subtitle,
        occurredAt: summary.occurredAt,
        target: { kind: 'record', recordId: summary.recordId },
      })
    );

  const notices = getNotices().map(
    (notice): Activity => ({
      id: `notice:${notice.id}`,
      icon: 'document-text',
      iconColor: theme.pillarTint.notices.icon,
      tint: theme.pillarTint.notices.tint,
      title: 'Notice received',
      subtitle: notice.title,
      occurredAt: notice.publishedAt,
      target: { kind: 'notice', noticeId: notice.id },
    })
  );

  return [...records, ...notices]
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
    .slice(0, limit);
}
