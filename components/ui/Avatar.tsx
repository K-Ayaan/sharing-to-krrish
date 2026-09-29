// <Avatar name="Ayaan Ahmed" size={48} />
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export type AvatarProps = {
  name: string;
  size?: number;
  photoUri?: string | null;
  style?: ViewStyle;
};

export default function Avatar({ name, size = 48, photoUri, style }: AvatarProps) {
  return (
    <View
      accessibilityLabel={name}
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>{initialsOf(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: theme.color.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontFamily: 'Poppins_600SemiBold',
    color: theme.color.primary,
  },
});
