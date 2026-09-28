// <ScrollView>…content…<TabBarSpacer /></ScrollView>
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { View } from 'react-native';

/** Height of the floating tab bar, safe area included, inside MainTabs; 0 anywhere else. */
export function useTabBarInset() {
  return useContext(BottomTabBarHeightContext) ?? 0;
}

// The tab bar floats over the screens so content scrolls behind its glass. End a screen's scroll
// content with this so the last item can scroll clear of the bar.
export default function TabBarSpacer() {
  const height = useTabBarInset();
  return <View pointerEvents="none" style={{ height }} />;
}
