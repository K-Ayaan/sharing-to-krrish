// <SwitchRow icon={Bell} title="Notifications" subtitle="Get updates about your services" value={on} onValueChange={setOn} />
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import theme from '../../theme';
import IconTile from './IconTile';
import type { IconComponent } from './icons';

type BaseProps = {
  icon: IconComponent;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  divider?: boolean;
};

export type SwitchRowProps = BaseProps & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

// Settings preference row with a toggle (settings.png § Preferences).
export default function SwitchRow({ value, onValueChange, disabled = false, ...base }: SwitchRowProps) {
  return (
    <RowShell {...base} disabled={disabled}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={base.title}
        trackColor={{ false: theme.color.borderStrong, true: theme.color.primary }}
        thumbColor={theme.color.surface}
      />
    </RowShell>
  );
}

// Same row shape, but navigates or opens a picker (Language › English).
export function NavRow({ value, onPress, ...base }: BaseProps & { value?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${base.title}${value ? `, ${value}` : ''}`} onPress={onPress}>
      {({ pressed }) => (
        <RowShell {...base} pressed={pressed}>
          <View style={styles.navTrailing}>
            {value ? <Text style={styles.value}>{value}</Text> : null}
            <ChevronRight size={22} color={theme.color.textPrimary} strokeWidth={2} />
          </View>
        </RowShell>
      )}
    </Pressable>
  );
}

function RowShell({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  divider = false,
  disabled = false,
  pressed = false,
  children,
}: BaseProps & { disabled?: boolean; pressed?: boolean; children: ReactNode }) {
  return (
    <View style={[styles.row, divider && styles.divider, pressed && styles.pressed]}>
      <IconTile icon={icon} bg={iconBg} color={iconColor} size="medium" />
      <View style={styles.text}>
        <Text style={[styles.title, disabled && styles.disabledText]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    paddingVertical: theme.space.l,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
  },
  title: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  disabledText: {
    color: theme.color.textSecondary,
  },
  subtitle: {
    ...theme.type.caption,
    fontSize: 12,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  navTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  value: {
    ...theme.type.body,
    fontSize: 14,
    color: theme.color.textPrimary,
  },
});
