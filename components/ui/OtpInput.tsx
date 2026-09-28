// <OtpInput length={6} value={code} onChange={setCode} onComplete={verify} autoFocus />
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

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
// iOS doesn't hit-test views at opacity 0, so tapping the input itself never
// focuses it — the row is a Pressable that focuses the input instead.
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
  const inputRef = useRef<TextInput>(null);
  const activeIndex = Math.min(value.length, length - 1);
  const { appearance, color } = useAppearance();
  const onboarding = appearance === 'onboarding';

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length);
    onChange(digits);
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <Pressable
      accessibilityHint="Opens the keyboard"
      accessibilityLabel={`One-time code, ${length} digits${value ? `, ${value.length} entered` : ''}`}
      onPress={() => inputRef.current?.focus()}
      style={[styles.row, style]}
    >
      {Array.from({ length }, (_, index) => {
        const active = focused && index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.box,
              onboarding && [
                styles.boxOnboarding,
                { backgroundColor: color.surface, borderColor: color.border },
              ],
              active && [styles.boxActive, { borderColor: color.primary }],
              error && styles.boxError,
            ]}
          >
            {onboarding && active && !value[index] ? (
              // Onboarding shows a caret in the empty box being typed into.
              <View style={[styles.caret, { backgroundColor: color.textPrimary }]} />
            ) : (
              <Text style={[styles.digit, { color: color.textPrimary }]}>{value[index] ?? ''}</Text>
            )}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
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
    </Pressable>
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
  boxOnboarding: {
    borderRadius: theme.radius.card,
  },
  boxActive: {
    borderColor: theme.color.primary,
    borderWidth: theme.space.xs / 2,
  },
  caret: {
    width: theme.space.xs / 2,
    height: theme.type.largeTitle.fontSize,
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
