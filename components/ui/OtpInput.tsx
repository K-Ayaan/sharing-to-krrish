// <OtpInput value={code} onChange={setCode} error={!!otpError} />
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../theme';

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
  autoFocus?: boolean;
};

// One hidden input drives the boxes, so paste, SMS autofill and backspace behave natively. It
// covers the whole row, so a tap anywhere on the boxes lands on the input itself.
export default function OtpInput({ value, onChange, length = 6, error = false, autoFocus = false }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  // Android keeps the input focused after the keyboard is dismissed, so focus() alone does
  // nothing on the next tap — blur first, then focus, and the keyboard comes back.
  const openKeyboard = () => {
    const input = inputRef.current;
    if (!input) return;
    if (input.isFocused()) input.blur();
    requestAnimationFrame(() => input.focus());
  };

  return (
    <Pressable accessibilityRole="none" onPress={openKeyboard} style={styles.row}>
      {Array.from({ length }, (_, index) => {
        const char = value[index] ?? '';
        const isActive = focused && index === activeIndex && value.length < length;
        return (
          <View
            key={index}
            style={[
              styles.box,
              isActive && styles.boxActive,
              error && styles.boxError,
            ]}
          >
            {char ? (
              <Text style={styles.char}>{char}</Text>
            ) : isActive ? (
              <View style={styles.caret} />
            ) : null}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        onPressIn={openKeyboard}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        accessibilityLabel={`${length}-digit OTP`}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.space.s,
  },
  box: {
    flex: 1,
    aspectRatio: 0.9,
    maxHeight: 54,
    borderRadius: theme.radius.small + 2,
    borderWidth: 1,
    borderColor: theme.color.borderStrong,
    backgroundColor: theme.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: theme.color.primary,
    borderWidth: 1.75,
  },
  boxError: {
    borderColor: theme.color.alert.fg,
  },
  char: {
    ...theme.type.title,
    fontFamily: undefined,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  caret: {
    width: 2,
    height: 26,
    backgroundColor: theme.color.primary,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    // Keeps the caret and any selection handles off-screen while the input still takes the taps.
    color: 'transparent',
  },
});
