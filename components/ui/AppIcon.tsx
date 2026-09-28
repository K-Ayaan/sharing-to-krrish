// <AppIcon name="leaf" size={20} color={c} />  or  <AppIcon name="mci:cow" size={20} color={c} />
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;
type MciName = keyof typeof MaterialCommunityIcons.glyphMap;

/**
 * An Ionicons name, or a MaterialCommunityIcons name prefixed "mci:". Ionicons stays the app's icon
 * set; MaterialCommunityIcons fills gaps it can't, such as animal glyphs for Livestock species.
 */
export type AppIconName = IoniconName | `mci:${MciName}`;

export type AppIconProps = {
  name: AppIconName;
  size: number;
  color: string;
};

const MCI_PREFIX = 'mci:';

export default function AppIcon({ name, size, color }: AppIconProps) {
  if (name.startsWith(MCI_PREFIX)) {
    return <MaterialCommunityIcons name={name.slice(MCI_PREFIX.length) as MciName} size={size} color={color} />;
  }
  return <Ionicons name={name as IoniconName} size={size} color={color} />;
}
