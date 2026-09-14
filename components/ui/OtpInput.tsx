// <OtpInput length={6} value={code} onChange={setCode} onComplete={verify} autoFocus />
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type OtpInputProps = {
  length: number;
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
  error?: boolean;
  style?: ViewStyle;
};

const BOX_ASPECT_RATIO = 0.85;

// One transparent TextInput sits over the boxes, so typing, paste and iOS
// one-time-code autofill all behave natively; the boxes are display only.
export default function OtpInput({
  length,
  value,
  onChange,
  onComplete,
  autoFocus = false,
  error = false,
  style,
}: OtpInputProps) {
  const [focused, setFocused] = useState(autoFocus);
  const activeIndex = Math.min(value.length, length - 1);

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length }, (_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            focused && index === activeIndex && styles.boxActive,
            error && styles.boxError,
          ]}
        >
          <Text style={styles.digit}>{value[index] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        accessibilityLabel={`One-time code, ${length} digits`}
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        caretHidden
        keyboardType="number-pad"
        maxLength={length}
        onBlur={() => setFocused(false)}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        textContentType="oneTimeCode"
        value={value}
        style={styles.hiddenInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  box: {
    flex: 1,
    aspectRatio: BOX_ASPECT_RATIO,
    borderRadius: theme.radius.field,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: theme.color.border,
    backgroundColor: theme.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: theme.color.primary,
    borderWidth: theme.space.xs / 2,
  },
  boxError: {
    borderColor: theme.color.danger,
  },
  digit: {
    ...theme.type.title,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
    color: theme.color.background,
  },
});
