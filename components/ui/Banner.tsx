// <Banner tone="sync" title="2 entries waiting for network" body="They send automatically…" />
// Inline notice strip: offline, waiting-to-sync (SDD S-07 / S-62), info and alerts.
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ChevronRight, CloudUpload, Info, ShieldCheck, TriangleAlert, WifiOff } from 'lucide-react-native';
import theme from '../../theme';
import type { IconComponent } from './icons';

export type BannerTone = 'offline' | 'sync' | 'warning' | 'info' | 'success' | 'alert';

const TONES: Record<BannerTone, { bg: string; fg: string; icon: IconComponent }> = {
  offline: { bg: theme.color.status.pendingBg, fg: theme.color.status.pendingFg, icon: WifiOff },
  sync: { bg: theme.color.status.pendingBg, fg: theme.color.status.pendingFg, icon: CloudUpload },
  // Something is outstanding but nothing has gone wrong — amber, not red.
  warning: { bg: theme.color.status.pendingBg, fg: theme.color.status.pendingFg, icon: TriangleAlert },
  info: { bg: theme.color.primarySoft, fg: theme.color.primary, icon: Info },
  success: { bg: theme.color.primarySoft, fg: theme.color.primary, icon: ShieldCheck },
  alert: { bg: theme.color.alert.bg, fg: theme.color.alert.fg, icon: TriangleAlert },
};

export type BannerProps = {
  tone: BannerTone;
  title: string;
  body?: string;
  icon?: IconComponent;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Banner({ tone, title, body, icon, onPress, style }: BannerProps) {
  const { bg, fg, icon: DefaultIcon } = TONES[tone];
  const Icon = icon ?? DefaultIcon;
  const content = (
    <>
      <Icon size={22} color={fg} strokeWidth={2} />
      <View style={styles.text}>
        <Text style={[styles.title, { color: tone === 'info' || tone === 'success' ? theme.color.primary : fg }]}>
          {title}
        </Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>
      {onPress ? <ChevronRight size={20} color={fg} strokeWidth={2} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.banner, { backgroundColor: bg }, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <View accessibilityLiveRegion="polite" style={[styles.banner, { backgroundColor: bg }, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m + 2,
    borderRadius: theme.radius.field,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    flex: 1,
  },
  title: {
    ...theme.type.bodyStrong,
    fontWeight: '500',
  },
  body: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
});
