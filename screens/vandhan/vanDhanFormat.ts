import { Apple, Bean, Carrot, Cherry, Droplet, Leaf, Nut, TreeDeciduous, Wheat } from 'lucide-react-native';
import type { StatusTone } from '../../components/ui/StatusPill';
import { HoneyIcon, type IconComponent } from '../../components/ui/icons';
import type { CollectionStatus, ProduceGlyph } from '../../data/mock/mockVanDhan';
import theme from '../../theme';

type Look = { icon: IconComponent; bg: string; fg: string };

const warm = theme.produceTint.warm;
const green = theme.produceTint.green;
const gold = theme.produceTint.gold;

export const produceLook: Record<ProduceGlyph, Look> = {
  wood: { icon: TreeDeciduous, ...warm },
  root: { icon: Carrot, ...gold },
  fruit: { icon: Apple, ...green },
  pod: { icon: Bean, ...warm },
  honey: { icon: HoneyIcon, ...gold },
  seed: { icon: Nut, ...warm },
  leaf: { icon: Leaf, ...green },
  nut: { icon: Cherry, ...warm },
  grass: { icon: Wheat, ...gold },
  resin: { icon: Droplet, ...gold },
};

export const collectionStatus: Record<CollectionStatus, { tone: StatusTone; label: string }> = {
  pending: { tone: 'pending', label: 'Pending' },
  verified: { tone: 'verified', label: 'Verified' },
  rejected: { tone: 'rejected', label: 'Rejected' },
};

export type RateWindow = 'today' | 'week' | 'all';

export const RATE_WINDOWS: { value: RateWindow; label: string }[] = [
  { value: 'today', label: 'Updated today' },
  { value: 'week', label: 'This week' },
  { value: 'all', label: 'All rates' },
];
