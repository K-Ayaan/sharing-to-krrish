// <Thumbnail uri={produce.imageUrl} icon={Leaf} bg={tint} color={fg} size={96} />
// Product/produce image. The mockups use photographs; none were supplied, so until the backend
// serves image URLs this falls back to a tinted tile with the item's glyph.
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type ThumbnailProps = {
  uri?: string | null;
  icon: IconComponent;
  bg?: string;
  color?: string;
  size?: number;
  radius?: number;
  style?: ViewStyle;
};

export default function Thumbnail({
  uri,
  icon: Icon,
  bg = theme.color.primarySoft,
  color = theme.pillarTint.vandhan.icon,
  size = 88,
  radius = theme.radius.tile,
  style,
}: ThumbnailProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { width: size, height: size, borderRadius: radius, backgroundColor: bg }, style]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} resizeMode="cover" />
      ) : (
        <Icon size={size * 0.46} color={color} strokeWidth={1.6} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
