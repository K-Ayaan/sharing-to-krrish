import type { Ionicons } from '@expo/vector-icons';
import type { Pillar } from '../data/mock/mockUser';
import theme from '../theme';

type PillarMeta = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: { icon: string; tint: string };
};

// Ionicons has no cow, pig or gas-cylinder glyph; paw and flame are the closest.
export const pillarMeta: Record<Pillar, PillarMeta> = {
  vandhan: { label: 'Van Dhan', icon: 'leaf', colors: theme.pillarTint.vandhan },
  livestock: { label: 'Livestock', icon: 'paw', colors: theme.pillarTint.livestock },
  lpg: { label: 'LPG', icon: 'flame', colors: theme.pillarTint.lpg },
};
