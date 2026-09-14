// <TabBar activeKey="home" onTabPress={(key) => setTab(key)} />
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

export type TabKey = 'home' | 'services' | 'records' | 'notices' | 'askus';

export type TabBarProps = {
  activeKey: TabKey;
  onTabPress: (key: TabKey) => void;
  style?: ViewStyle;
};

type TabDef = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'services', label: 'Services', icon: 'grid-outline', iconActive: 'grid' },
  { key: 'records', label: 'Records', icon: 'document-text-outline', iconActive: 'document-text' },
  { key: 'notices', label: 'Notices', icon: 'notifications-outline', iconActive: 'notifications' },
  { key: 'askus', label: 'Ask Us', icon: 'chatbubble-outline', iconActive: 'chatbubble' },
];

const ICON_SIZE = theme.space.l;

// iOS 26's Liquid Glass tab bar can't be reproduced exactly in RN; expo-blur's
// systemChromeMaterial is the closest available, so the specular edge highlight
// and the bar's scroll-reactive shrink are absent by design.
export default function TabBar({ activeKey, onTabPress, style }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={80}
      tint="systemChromeMaterial"
      style={[styles.bar, { paddingBottom: insets.bottom || theme.space.s }, style]}
    >
      <View style={styles.hairline} />
      {TABS.map((tab) => {
        const active = tab.key === activeKey;
        const tone = active ? theme.color.primary : theme.color.textSecondary;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.icon}
              size={ICON_SIZE}
              color={tone}
            />
            <Text numberOfLines={1} style={[styles.label, { color: tone }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: theme.space.s,
    paddingHorizontal: theme.space.s,
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
    gap: theme.space.xs / 2,
    paddingVertical: theme.space.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...theme.type.caption,
    fontSize: theme.type.caption.fontSize - 2,
    fontWeight: '500',
  },
});
