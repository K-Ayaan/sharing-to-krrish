// <Avatar initials="NA" />  or  <Avatar icon="people" size="l" />
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type AvatarProps = {
  initials?: string;
  /** Decorative icon in place of initials. */
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  tint?: string;
  size?: 'm' | 'l' | 'xl';
  style?: ViewStyle;
};

const SIZES = {
  m: theme.space.xl,
  l: theme.space.xl + theme.space.m,
  xl: theme.space.xl * 2,
} as const;

const INITIALS_TYPE = {
  m: theme.type.headline,
  l: theme.type.title,
  xl: theme.type.largeTitle,
} as const;

export default function Avatar({
  initials,
  icon,
  iconColor = theme.color.primary,
  tint = theme.color.primaryTint,
  size = 'm',
  style,
}: AvatarProps) {
  const dimension = SIZES[size];

  return (
    <View
      accessibilityLabel={initials ? `Profile ${initials}` : undefined}
      accessibilityElementsHidden={!initials}
      importantForAccessibility={initials ? 'auto' : 'no-hide-descendants'}
      style={[styles.circle, { width: dimension, height: dimension, backgroundColor: tint }, style]}
    >
      {icon ? (
        <Ionicons name={icon} size={dimension / 2} color={iconColor} />
      ) : (
        <Text style={[INITIALS_TYPE[size], { color: iconColor }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
