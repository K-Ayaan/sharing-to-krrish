// <TextField label="Email address" required icon="mail-outline" value={email} onChangeText={setEmail} />
// <TextField label="Tell us more" multiline maxLength={300} value={text} onChangeText={setText} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type FieldShellProps = {
  label?: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Rendered after the icon in the leading segment, e.g. a country code. */
  leading?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  focused?: boolean;
  variant?: 'default' | 'search';
  children: ReactNode;
  style?: ViewStyle;
};

// Shared chrome for TextField and SelectField so both read as the same field.
export function FieldShell({
  label,
  required,
  icon,
  leading,
  trailing,
  error,
  focused,
  variant = 'default',
  children,
  style,
}: FieldShellProps) {
  const hasLeading = !!icon || !!leading;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}>{'  *'}</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.box,
          variant === 'search' ? styles.boxSearch : styles.boxDefault,
          focused && styles.boxFocused,
          !!error && styles.boxError,
        ]}
      >
        {hasLeading ? (
          <View style={[styles.leading, variant === 'default' && styles.leadingDivided]}>
            {icon ? (
              <Ionicons name={icon} size={theme.type.title.fontSize} color={theme.color.textSecondary} />
            ) : null}
            {leading}
          </View>
        ) : null}
        <View style={[styles.control, variant === 'search' && hasLeading && styles.controlTight]}>
          {children}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export type TextFieldProps = Omit<FieldShellProps, 'children' | 'focused'> &
  Omit<TextInputProps, 'style'>;

export default function TextField({
  label,
  required,
  icon,
  leading,
  trailing,
  error,
  variant,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  multiline,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <FieldShell
      label={label}
      required={required}
      icon={icon}
      leading={leading}
      trailing={trailing}
      error={error}
      variant={variant}
      focused={focused}
      style={style}
    >
      <TextInput
        {...inputProps}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel ?? label}
        placeholderTextColor={theme.color.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </FieldShell>
  );
}

export const fieldTextStyles = StyleSheet.create({
  value: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  placeholder: {
    color: theme.color.textSecondary,
  },
});

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.space.s,
  },
  label: {
    ...theme.type.body,
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  required: {
    color: theme.color.danger,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.space.xl + theme.space.m,
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
  },
  boxDefault: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
    borderRadius: theme.radius.field,
  },
  boxSearch: {
    backgroundColor: theme.color.surfaceMuted,
    borderColor: theme.color.surfaceMuted,
    borderRadius: theme.radius.card,
  },
  boxFocused: {
    borderColor: theme.color.primary,
  },
  boxError: {
    borderColor: theme.color.danger,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
  },
  leadingDivided: {
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: theme.color.border,
  },
  control: {
    flex: 1,
    paddingHorizontal: theme.space.m,
  },
  controlTight: {
    paddingLeft: 0,
  },
  input: {
    ...fieldTextStyles.value,
    paddingVertical: theme.space.m,
  },
  // Roughly three lines tall, text starting at the top, growing as the user types.
  inputMultiline: {
    minHeight: theme.space.xl * 2 + theme.space.m,
    paddingTop: theme.space.m,
    textAlignVertical: 'top',
  },
  trailing: {
    paddingRight: theme.space.m,
  },
  error: {
    ...theme.type.caption,
    color: theme.color.danger,
  },
});
