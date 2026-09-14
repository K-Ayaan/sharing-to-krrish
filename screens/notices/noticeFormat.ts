import type { Ionicons } from '@expo/vector-icons';
import type { Notice, NoticePillar } from '../../data/mock/mockNotices';
import theme from '../../theme';
import { groupByDay } from '../dayGroups';
import { formatDate, formatTime, isToday } from '../formatDate';
import { pillarMeta } from '../pillarMeta';

type IconName = keyof typeof Ionicons.glyphMap;

export const noticePillarMeta: Record<
  NoticePillar,
  { label: string; icon: IconName; colors: { icon: string; tint: string } }
> = {
  vandhan: pillarMeta.vandhan,
  livestock: pillarMeta.livestock,
  lpg: pillarMeta.lpg,
  general: { label: 'General', icon: 'document-text', colors: theme.pillarTint.notices },
};

export type NoticeGroup = { key: string; label: string; notices: Notice[] };

/** Newest first, one group per local calendar day. */
export const groupNoticesByDay = (notices: Notice[]): NoticeGroup[] =>
  groupByDay(notices, (notice) => notice.publishedAt).map((group) => ({
    key: group.key,
    label: group.label,
    notices: group.items,
  }));

export const lastUpdatedLabel = (iso: string) =>
  `Last updated ${isToday(iso) ? 'today' : formatDate(iso)}, ${formatTime(iso)}`;

const KB = 1024;

/** 250880 → "245 KB" */
export function formatFileSize(bytes: number) {
  if (bytes < KB * KB) return `${Math.max(1, Math.round(bytes / KB))} KB`;
  return `${(bytes / (KB * KB)).toFixed(1)} MB`;
}
