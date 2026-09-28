// <ProfileChip fullName={profile.fullName} uid={profile.uid} onPress={openSettings} />
// <ProfileChip fullName={profile.fullName} uid={profile.uid} layout="stacked" onPress={openSettings} />
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { initialsOf } from '../../data/mock/mockUser';
import theme from '../../theme';
import Avatar from './Avatar';

export type ProfileChipProps = {
  fullName: string;
  uid: string;
  onPress: () => void;
  /** `inline`: "UID  12345" beside a small avatar. `stacked`: the "UID" caption over the number, larger avatar. */
  layout?: 'inline' | 'stacked';
  style?: ViewStyle;
};

// The avatar and UID at the top of every tab screen. Tapping it opens Settings. Fills the space
// beside the trailing bell, so the whole left side of the header is the touch target.
export default function ProfileChip({ fullName, uid, onPress, layout = 'inline', style }: ProfileChipProps) {
  const stacked = layout === 'stacked';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Settings. ${fullName}, UID ${uid}`}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed, style]}
    >
      <Avatar initials={initialsOf(fullName)} size={stacked ? 'l' : 'm'} />
      {stacked ? (
        <View style={styles.flex}>
          <Text style={styles.uidLabel}>UID</Text>
          <Text numberOfLines={1} style={styles.uidStacked}>
            {uid}
          </Text>
        </View>
      ) : (
        <Text numberOfLines={1} style={styles.uid}>
          <Text style={styles.uidLabel}>{'UID  '}</Text>
          {uid}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  pressed: {
    opacity: 0.7,
  },
  flex: {
    flex: 1,
  },
  uid: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    flex: 1,
  },
  uidStacked: {
    ...theme.type.headline,
    fontWeight: '400',
    color: theme.color.textPrimary,
  },
  uidLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
