// <CowIcon size={24} color={theme.pillarTint.livestock.icon} />
// Lucide is the app's icon set (see design-tokens.md). It has no livestock, gas-cylinder or
// WhatsApp glyphs, so those few domain icons come from Material Community Icons, wrapped here to
// share Lucide's { size, color } signature so every screen treats them the same way.
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentType } from 'react';

export type IconProps = { size?: number; color?: string; strokeWidth?: number };
export type IconComponent = ComponentType<IconProps>;

type McName = keyof typeof MaterialCommunityIcons.glyphMap;

function mc(name: McName): IconComponent {
  function McIcon({ size = 20, color }: IconProps) {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  }
  McIcon.displayName = `McIcon(${name})`;
  return McIcon;
}

export const CowIcon = mc('cow');
export const PigIcon = mc('pig-variant');
// No goat glyph exists in the set; sheep is the closest silhouette.
export const GoatIcon = mc('sheep');
export const DuckIcon = mc('duck');
export const ChickenIcon = mc('bird');
export const CylinderIcon = mc('gas-cylinder');
export const WhatsAppIcon = mc('whatsapp');
export const HoneyIcon = mc('beehive-outline');
export const FingerprintIcon = mc('fingerprint');
