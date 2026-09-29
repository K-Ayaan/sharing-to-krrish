import { CalendarDays, FileText, Landmark, Sprout, TriangleAlert, Users } from 'lucide-react-native';
import { CowIcon, CylinderIcon, type IconComponent } from '../../components/ui/icons';
import type { NoticeCategory } from '../../data/mock/mockNotices';
import theme from '../../theme';

type Look = { icon: IconComponent; bg: string; fg: string };

// Icon + tint per notice type (notices-page.png). Weather alerts use the alert tone.
export const noticeLook: Record<NoticeCategory, Look> = {
  vandhan: { icon: Sprout, bg: theme.pillarTint.vandhan.tint, fg: theme.pillarTint.vandhan.icon },
  lpg: { icon: CylinderIcon, bg: theme.pillarTint.lpg.tint, fg: theme.pillarTint.lpg.icon },
  microfinance: { icon: Users, bg: theme.pillarTint.livestock.tint, fg: theme.pillarTint.livestock.icon },
  livestock: { icon: CowIcon, bg: theme.pillarTint.livestock.tint, fg: theme.pillarTint.livestock.icon },
  government: { icon: Landmark, bg: theme.color.primarySoft, fg: theme.color.primary },
  weather: { icon: TriangleAlert, bg: theme.color.alert.bg, fg: theme.color.alert.fg },
  meeting: { icon: CalendarDays, bg: theme.color.primarySoft, fg: theme.pillarTint.vandhan.icon },
  scheme: { icon: FileText, bg: theme.pillarTint.microfinance.tint, fg: theme.pillarTint.microfinance.icon },
};

// The categories offered as filters on the notices list, in the order they appear.
export const NOTICE_FILTERS: { value: NoticeCategory; label: string }[] = [
  { value: 'vandhan', label: 'Van Dhan' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'lpg', label: 'LPG' },
  { value: 'microfinance', label: 'Micro-Finance' },
  { value: 'scheme', label: 'Schemes' },
  { value: 'government', label: 'Government' },
  { value: 'weather', label: 'Weather' },
  { value: 'meeting', label: 'Meetings' },
];
