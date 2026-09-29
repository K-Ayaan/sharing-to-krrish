// <TextField icon={User} placeholder="Full Name" value={name} onChangeText={setName} />
// <TextField label="Quantity" labelPosition="inside" required trailing={<Text>kg</Text>} … />
// <TextField label="Aadhaar Number" labelPosition="notched" notchBackground={bg} … />
import { ReactNode, forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label?: string;
  // 'inside' — small label above the value, within the box (vandhan-submit-collection.png).
  // 'above' — label outside, over the box (lpg-registration.png).
  // 'notched' — label cut into the top border (aadhaar login.png).
  labelPosition?: 'inside' | 'above' | 'notched';
  notchBackground?: string;
  icon?: IconComponent;
  // Draws the thin vertical rule after the icon, as on the Aadhaar field.
  iconDivider?: boolean;
  // Sits before the value, inside the box — the country code on a phone field.
  leading?: ReactNode;
  trailing?: ReactNode;
  required?: boolean;
  helper?: string;
  error?: string | null;
  showCount?: boolean;
  // Read-only values that should still look like normal fields (the verified phone number).
  plainWhenReadOnly?: boolean;
  containerStyle?: ViewStyle;
};

const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    labelPosition = 'inside',
    notchBackground = theme.color.background,
    icon: Icon,
    iconDivider = false,
    leading,
    trailing,
    required = false,
    helper,
    error,
    showCount = false,
    multiline,
    maxLength,
    value,
    editable = true,
    plainWhenReadOnly = false,
    containerStyle,
    onFocus,
    onBlur,
    ...inputProps
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? theme.color.alert.fg
    : focused
      ? theme.color.primary
      : theme.color.borderStrong;

  const labelText = label ? (
    <Text style={styles.labelText}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  ) : null;

  return (
    <View style={containerStyle}>
      {labelPosition === 'above' && labelText ? <View style={styles.aboveLabel}>{labelText}</View> : null}
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          { borderColor, borderWidth: focused || error ? 1.5 : 1 },
          !editable && !plainWhenReadOnly && styles.boxDisabled,
        ]}
      >
        {labelPosition === 'notched' && label ? (
          <View style={[styles.notch, { backgroundColor: notchBackground }]}>
            <Text style={styles.notchText}>{label}</Text>
          </View>
        ) : null}
        {Icon ? (
          <View style={[styles.iconSlot, multiline && styles.iconSlotTop]}>
            <Icon
              size={theme.size.iconLarge}
              color={editable ? theme.color.textPrimary : theme.color.textTertiary}
              strokeWidth={1.75}
            />
          </View>
        ) : null}
        {Icon && iconDivider ? <View style={styles.divider} /> : null}
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={[styles.inputColumn, multiline && styles.inputColumnMultiline]}>
          {labelPosition === 'inside' && labelText ? labelText : null}
          <TextInput
            ref={ref}
            accessibilityLabel={label ?? inputProps.placeholder}
            accessibilityHint={error ?? helper}
            placeholderTextColor={theme.color.textTertiary}
            value={value}
            editable={editable}
            multiline={multiline}
            maxLength={maxLength}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[
              styles.input,
              labelPosition === 'inside' && label ? styles.inputUnderLabel : null,
              multiline && styles.inputMultiline,
              !editable && !plainWhenReadOnly && styles.inputDisabled,
            ]}
            {...inputProps}
          />
          {showCount && maxLength ? (
            <Text style={styles.count}>
              {value?.length ?? 0}/{maxLength}
            </Text>
          ) : null}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <AlertCircle size={14} color={theme.color.alert.fg} strokeWidth={2} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
});

export default TextField;

// Trailing unit or action text, e.g. "kg" or "Edit", separated by a hairline.
export function FieldTrailingText({ children, onPress }: { children: string; onPress?: () => void }) {
  return (
    <View style={styles.trailingTextWrap}>
      <View style={styles.divider} />
      <Text
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : 'text'}
        suppressHighlighting
        style={[styles.trailingText, onPress && styles.trailingAction]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aboveLabel: {
    marginBottom: theme.space.s,
    paddingLeft: theme.space.xs,
  },
  labelText: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    fontWeight: '500',
  },
  required: {
    color: theme.color.required,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.size.field + 8,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.l,
  },
  boxMultiline: {
    alignItems: 'flex-start',
    // Room for roughly six lines, so a full account of what happened is visible while it's typed.
    minHeight: 172,
    paddingTop: theme.space.m + 2,
    paddingBottom: theme.space.m,
  },
  boxDisabled: {
    backgroundColor: theme.color.surfaceMuted,
  },
  notch: {
    position: 'absolute',
    top: -10,
    left: theme.space.l + 8,
    paddingHorizontal: 6,
  },
  notchText: {
    ...theme.type.body,
    color: theme.color.textPrimary,
    fontWeight: '500',
  },
  iconSlot: {
    marginRight: theme.space.m + 2,
  },
  iconSlotTop: {
    marginTop: -1,
  },
  inputColumnMultiline: {
    justifyContent: 'flex-start',
    paddingVertical: 0,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: theme.space.m,
    backgroundColor: theme.color.border,
    marginRight: theme.space.l,
  },
  inputColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.space.s,
  },
  input: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textPrimary,
    paddingVertical: theme.space.xs,
    paddingHorizontal: 0,
  },
  inputUnderLabel: {
    paddingTop: 2,
  },
  // First line of text sits level with the icon: no top padding, no Android font padding.
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },
  inputDisabled: {
    color: theme.color.textSecondary,
  },
  count: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    alignSelf: 'flex-end',
    marginTop: theme.space.s,
  },
  leading: {
    justifyContent: 'center',
    paddingRight: theme.space.s,
  },
  trailing: {
    marginLeft: theme.space.s,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  trailingTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  trailingText: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textSecondary,
  },
  trailingAction: {
    color: theme.color.primary,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.space.s,
    paddingLeft: theme.space.xs,
  },
  error: {
    ...theme.type.caption,
    color: theme.color.alert.fg,
    flex: 1,
  },
  helper: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: theme.space.s,
    paddingLeft: theme.space.xs,
  },
});
