// <TabBar activeKey="home" onTabPress={(key) => setTab(key)} />
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, LayoutGrid, FileText, Bell, Headphones } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../../theme';

export type TabKey = 'home' | 'services' | 'records' | 'notices' | 'askus';

export type TabBarProps = {
  activeKey: TabKey;
  onTabPress: (key: TabKey) => void;
  // A dot on the icon, e.g. unread notices (notices-page.png).
  badges?: Partial<Record<TabKey, boolean>>;
  style?: ViewStyle;
};

type TabDef = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
};

// Fixed order per design/flow.md: Home, Services, Records, Notices, Ask Us. The mockups show a
// 5th-tab inconsistency (records.png shows "Profile" instead of "Ask Us") — resolved in flow.md
// in favor of Ask Us; Settings is reached from Home's account chip instead.
const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'services', label: 'Services', icon: LayoutGrid },
  { key: 'records', label: 'Records', icon: FileText },
  { key: 'notices', label: 'Notices', icon: Bell },
  { key: 'askus', label: 'Ask Us', icon: Headphones },
];

// The sliding pill's size: as wide as a tab less this inset each side, and tall enough to hold the
// icon (24) and its label (15) with the icon wrap's own padding.
const BLOB_INSET = 10;
const BLOB_HEIGHT = 49;

// design-tokens.md: the active tab gets a pill-shaped primaryTint background behind icon+label —
// this app's own mockups (home.png, services-page.png) show that treatment, unlike the iOS app's
// plain color-change-only tab bar. Keep this difference; it isn't a mistake.
export default function TabBar({ activeKey, onTabPress, badges, style }: TabBarProps) {
  const insets = useSafeAreaInsets();
  // The tinted pill slides between tabs instead of jumping — the only motion in the tab bar.
  const [barWidth, setBarWidth] = useState(0);
  const activeIndex = Math.max(
    TABS.findIndex((tab) => tab.key === activeKey),
    0
  );
  const slide = useRef(new Animated.Value(activeIndex)).current;
  const tabWidth = barWidth / TABS.length;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: activeIndex,
      duration: theme.motion.base,
      easing: Easing.bezier(0.2, 0.9, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slide]);

  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, theme.space.s) }, style]}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.hairline} />
      {barWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.blob,
            {
              top: theme.space.s,
              width: tabWidth - BLOB_INSET * 2,
              left: BLOB_INSET,
              transform: [
                {
                  translateX: slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, tabWidth],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      {TABS.map((tab) => {
        const active = tab.key === activeKey;
        const tone = active ? theme.color.primary : theme.color.textSecondary;
        const Icon = tab.icon;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={badges?.[tab.key] ? `${tab.label}, new items` : tab.label}
            onPress={() => onTabPress(tab.key)}
            style={styles.tab}
          >
            <View style={styles.iconWrap}>
              <View>
                <Icon size={24} color={tone} strokeWidth={1.75} />
                {badges?.[tab.key] ? <View style={styles.badge} /> : null}
              </View>
              <Text numberOfLines={1} style={[styles.label, { color: tone }]}>
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.color.surface,
    paddingTop: theme.space.s,
    ...theme.elevation.tabBar,
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.xs,
    borderRadius: theme.radius.pill,
  },
  blob: {
    position: 'absolute',
    height: BLOB_HEIGHT,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.primaryTint,
  },
  label: {
    ...theme.type.label,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.color.alert.fg,
    borderWidth: 1.5,
    borderColor: theme.color.surface,
  },
});
