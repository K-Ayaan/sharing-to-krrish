// <TextField label="Email address" required icon="mail-outline" value={email} onChangeText={setEmail} />
// <TextField label="Tell us more" multiline maxLength={300} value={text} onChangeText={setText} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode, Ref, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { onboardingShadow, useAppearance } from './Appearance';

export type FieldShellProps = {
  label?: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Rendered after the icon in the leading segment, e.g. a country code. */
  leading?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  focused?: boolean;
  /** `inset` draws the label inside the box, above the input, beside a tinted icon tile. */
  variant?: 'default' | 'search' | 'inset';
  /**
   * Onboarding appearance only: `pill` (default) is the raised, fully rounded field with a round icon
   * badge; `rounded` is a bordered box (the Aadhaar field). Ignored in the default appearance.
   */
  shape?: 'pill' | 'rounded';
  /** Default appearance: draw the leading icon in a small tinted tile (Van Dhan forms). */
  iconTinted?: boolean;
  children: ReactNode;
  style?: ViewStyle;
};

const BADGE_SIZE = theme.space.xl;
const BADGE_ICON_SIZE = theme.type.title.fontSize + theme.space.xs;

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
  shape = 'pill',
  iconTinted = false,
  children,
  style,
}: FieldShellProps) {
  const { appearance, color } = useAppearance();
  const hasLeading = !!icon || !!leading;

  if (appearance === 'onboarding' && variant === 'default') {
    const pill = shape === 'pill';
    return (
      <View style={[styles.wrapper, style]}>
        {label ? (
          <Text style={[styles.onboardingLabel, { color: color.textPrimary }]}>
            {label}
            {required ? <Text style={styles.required}>{' *'}</Text> : null}
          </Text>
        ) : null}
        <View
          style={[
            styles.onboardingBox,
            { backgroundColor: color.surface },
            pill
              ? styles.pill
              : [styles.rounded, { borderColor: focused ? color.primary : color.border }],
            !!error && styles.boxError,
          ]}
        >
          <View style={[styles.onboardingInner, pill ? styles.pillInner : styles.roundedInner]}>
            {icon ? (
              <View style={[styles.badge, { backgroundColor: color.primaryTint }]}>
                <Ionicons name={icon} size={BADGE_ICON_SIZE} color={color.primary} />
              </View>
            ) : null}
            {leading ? (
              <View
                style={[
                  styles.leadingSegment,
                  { backgroundColor: color.primaryTint, borderRightColor: color.border },
                ]}
              >
                {leading}
              </View>
            ) : null}
            <View style={[styles.control, !!icon && styles.controlAfterBadge]}>{children}</View>
            {trailing ? <View style={styles.onboardingTrailing}>{trailing}</View> : null}
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  if (variant === 'inset') {
    return (
      <View style={[styles.wrapper, style]}>
        <View
          style={[
            styles.insetBox,
            { backgroundColor: color.surface, borderColor: focused ? color.primary : color.border },
            !!error && styles.boxError,
          ]}
        >
          {icon ? (
            <View style={[styles.iconTile, { backgroundColor: color.primaryTint }]}>
              <Ionicons name={icon} size={theme.type.title.fontSize} color={color.primary} />
            </View>
          ) : null}
          <View style={styles.insetControl}>
            {label ? (
              <Text style={styles.insetLabel}>
                {label}
                {required ? <Text style={styles.required}>{'  *'}</Text> : null}
              </Text>
            ) : null}
            {children}
          </View>
          {trailing}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

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
          focused && { borderColor: color.primary },
          !!error && styles.boxError,
        ]}
      >
        {hasLeading ? (
          <View
            style={[
              styles.leading,
              variant === 'default' && styles.leadingDivided,
              iconTinted && styles.leadingTinted,
            ]}
          >
            {icon && iconTinted ? (
              <View style={[styles.iconTile, { backgroundColor: color.primaryTint }]}>
                <Ionicons name={icon} size={theme.type.title.fontSize} color={color.primary} />
              </View>
            ) : icon ? (
              <Ionicons name={icon} size={theme.type.title.fontSize} color={color.textSecondary} />
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
  Omit<TextInputProps, 'style'> & {
    /** Ref to the underlying TextInput, e.g. to focus it once a sheet has finished opening. */
    inputRef?: Ref<TextInput>;
  };

export default function TextField({
  label,
  required,
  icon,
  leading,
  trailing,
  error,
  variant,
  shape,
  iconTinted,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  multiline,
  inputRef,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const { color } = useAppearance();

  return (
    <FieldShell
      label={label}
      required={required}
      icon={icon}
      leading={leading}
      trailing={trailing}
      error={error}
      variant={variant}
      shape={shape}
      iconTinted={iconTinted}
      focused={focused}
      style={style}
    >
      <TextInput
        {...inputProps}
        ref={inputRef}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel ?? label}
        placeholderTextColor={color.textSecondary}
        selectionColor={color.primary}
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
          { color: color.textPrimary },
          multiline && styles.inputMultiline,
          variant === 'inset' && styles.inputInset,
        ]}
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
  boxError: {
    borderColor: theme.color.danger,
    borderWidth: StyleSheet.hairlineWidth * 2,
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
  insetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  insetControl: {
    flex: 1,
  },
  insetLabel: {
    ...theme.type.body,
    color: theme.color.textPrimary,
  },
  inputInset: {
    paddingVertical: theme.space.xs,
  },
  leadingTinted: {
    paddingHorizontal: theme.space.s + theme.space.xs,
  },
  iconTile: {
    width: theme.space.xl,
    height: theme.space.xl,
    borderRadius: theme.radius.field,
    alignItems: 'center',
    justifyContent: 'center',
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

  // ---- Onboarding appearance.
  onboardingLabel: {
    ...theme.type.headline,
    fontWeight: '500',
  },
  // The outer box carries the shadow; the inner one clips the tinted leading segment to the
  // corners (a view that clips its own content loses its shadow on iOS).
  onboardingBox: {
    minHeight: theme.space.xl * 1.5,
  },
  pill: {
    ...onboardingShadow,
    borderRadius: theme.radius.pill,
  },
  rounded: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth * 3,
  },
  onboardingInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pillInner: {
    borderRadius: theme.radius.pill,
  },
  roundedInner: {
    borderRadius: theme.radius.card,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    marginLeft: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingSegment: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: theme.space.m + theme.space.xs,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
  },
  controlAfterBadge: {
    paddingLeft: theme.space.m + theme.space.xs,
  },
  onboardingTrailing: {
    paddingRight: theme.space.l,
  },
});
