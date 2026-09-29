// <IconTile icon={Sprout} pillar="vandhan" size="large" />
// Tinted square/circle holding a glyph — the leading visual on nearly every row and card.
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme, { type PillarToken } from '../../theme';
import type { IconComponent } from './icons';

export type IconTileProps = {
  icon: IconComponent;
  pillar?: PillarToken;
  // Overrides for tiles that aren't pillar-coded (settings preferences, FAQ, why-Aadhaar rows).
  bg?: string;
  color?: string;
  shape?: 'rounded' | 'circle';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
};

const DIMENSIONS = {
  small: { box: 36, glyph: 17 },
  medium: { box: 42, glyph: 20 },
  large: { box: 52, glyph: 25 },
  xlarge: { box: 68, glyph: 32 },
} as const;

export default function IconTile({
  icon: Icon,
  pillar,
  bg,
  color,
  shape = 'circle',
  size = 'medium',
  style,
}: IconTileProps) {
  const { box, glyph } = DIMENSIONS[size];
  const background = bg ?? (pillar ? theme.pillarTint[pillar].tint : theme.color.primaryTint);
  const tone = color ?? (pillar ? theme.pillarTint[pillar].icon : theme.color.primary);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.tile,
        {
          width: box,
          height: box,
          borderRadius: shape === 'circle' ? box / 2 : box * 0.26,
          backgroundColor: background,
        },
        style,
      ]}
    >
      <Icon size={glyph} color={tone} strokeWidth={1.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
