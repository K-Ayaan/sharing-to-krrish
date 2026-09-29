import {
  ChickenIcon,
  CowIcon,
  DuckIcon,
  GoatIcon,
  PigIcon,
  type IconComponent,
} from '../../components/ui/icons';
import type { StatusTone } from '../../components/ui/StatusPill';
import type { BatchStatus, Species } from '../../data/mock/mockLivestock';

// Buffalo has no glyph of its own in the icon set; the cow silhouette stands in.
export const speciesIcon: Record<Species, IconComponent> = {
  cow: CowIcon,
  buffalo: CowIcon,
  goat: GoatIcon,
  pig: PigIcon,
  chicken: ChickenIcon,
  duck: DuckIcon,
};

// Batch inspection states, in the fixed status colours (design-tokens.md) — never the pillar tint.
export const batchStatus: Record<BatchStatus, { tone: StatusTone; label: string }> = {
  awaiting: { tone: 'pending', label: 'Awaiting inspection' },
  assigned: { tone: 'progress', label: 'Vet assigned' },
  certified: { tone: 'verified', label: 'Certified' },
  rejected: { tone: 'rejected', label: 'Rejected' },
};
