// <KeyboardDoneBar nativeID="phone-done" />  +  <TextField inputAccessoryViewID="phone-done" … />
import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { onboardingShadow, useAppearance } from './Appearance';

export type KeyboardDoneBarProps = {
  /** Matches the `inputAccessoryViewID` of the field(s) it attaches to. */
  nativeID: string;
};

// A "Done" pill above the iOS number pad, which has no return key of its own. iOS only —
// Android's number keyboard already has one, so this renders nothing there.
export default function KeyboardDoneBar({ nativeID }: KeyboardDoneBarProps) {
  const { color } = useAppearance();
  if (Platform.OS !== 'ios') return null;

  return (
    <InputAccessoryView nativeID={nativeID} backgroundColor={color.background}>
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Done, hide keyboard"
          onPress={Keyboard.dismiss}
          style={({ pressed }) => [
            styles.pill,
            { backgroundColor: color.surface },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.label, { color: color.primary }]}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s,
  },
  pill: {
    ...onboardingShadow,
    paddingHorizontal: theme.space.l - theme.space.xs,
    paddingVertical: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.pill,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...theme.type.headline,
    fontWeight: '500',
  },
});
