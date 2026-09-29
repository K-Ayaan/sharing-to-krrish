// <BrandMark size={112} />
// The leaves-and-sun mark shown on aadhaar login.png: two leaves under a warm sun, on a white
// rounded tile. Recreated as vector from the mockup — swap for the Federation's supplied logo
// file once one exists.
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import theme from '../../theme';

export default function BrandMark({ size = 96 }: { size?: number }) {
  const glyph = size * 0.66;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="MARCOFED"
      style={[styles.tile, { width: size, height: size, borderRadius: size * 0.22 }]}
    >
      <Svg width={glyph} height={glyph} viewBox="0 0 100 100">
        {/* An emblem, not an illustration: one ring, a sun, and a symmetric pair of leaves. */}
        <Circle cx={50} cy={50} r={45} stroke={theme.color.primary} strokeWidth={3} fill="none" />
        <Circle cx={50} cy={30} r={8.5} fill={theme.illustration.sun} />
        <Path d="M50 82 C32 76 26 60 30 48 C44 52 52 68 50 82 Z" fill={theme.pillarTint.vandhan.icon} />
        <Path d="M50 82 C68 76 74 60 70 48 C56 52 48 68 50 82 Z" fill={theme.illustration.green.treeDark} />
        <Path d="M50 84 L50 60" stroke={theme.color.primary} strokeWidth={2.5} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: theme.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.elevation.card,
  },
});
