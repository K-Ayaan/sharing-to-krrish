import {
  BottomTabBarHeightCallbackContext,
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { CommonActions, type NavigationState, type PartialState, type Route } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { View } from 'react-native';
import TabBar, { type TabKey } from '../components/ui/TabBar';
import { getUnreadCount } from '../services/homeService';
import { useQuery } from '../services/useQuery';
import AskUsStack from './AskUsStack';
import HomeStack from './HomeStack';
import NoticesStack from './NoticesStack';
import RecordsStack from './RecordsStack';
import ServicesStack from './ServicesStack';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_KEYS: Record<keyof MainTabsParamList, TabKey> = {
  HomeTab: 'home',
  ServicesTab: 'services',
  RecordsTab: 'records',
  NoticesTab: 'notices',
  AskUsTab: 'askus',
};

// The tab bar shows only on hub screens. Forms, details and registration screens take the full
// height with their own bottom button, as in the mockups (vandhan-submit-collection.png,
// record-detail.png, notice-detail.png, settings.png have no tab bar). Add new hubs here.
const SCREENS_WITH_TAB_BAR = new Set([
  'Home',
  'ServicesHub',
  'VanDhanHub',
  'LivestockBrowse',
  'LpgHub',
  'MicroFinanceApplicationStatus',
  'RecordsList',
  'NoticesList',
  'AskUs',
]);

type AnyRoute = Route<string> & {
  state?: NavigationState | PartialState<NavigationState>;
  params?: { screen?: string; params?: object };
};

// A nested navigate ({ screen, params: { screen } }) targets a screen before its navigator has
// mounted — read that target so the tab bar doesn't flash in for a frame.
function pendingScreen(params: AnyRoute['params']): string | undefined {
  if (!params?.screen) return undefined;
  return pendingScreen(params.params as AnyRoute['params']) ?? params.screen;
}

// Follows nested navigators down to the screen actually on show (e.g. ServicesTab → VanDhan →
// SubmitCollection). Undefined means a navigator's initial hub screen.
function deepestRouteName(route: AnyRoute): string | undefined {
  const state = route.state;
  if (!state) return pendingScreen(route.params);
  const index = state.index ?? state.routes.length - 1;
  const child = state.routes[index] as AnyRoute;
  return deepestRouteName(child) ?? child.name;
}

// Mirrors React Navigation's default BottomTabBar: emitting tabPress keeps native-stack's
// pop-to-top on re-tap, and reporting height keeps useBottomTabBarHeight accurate.
function RoutedTabBar({ state, navigation }: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const focused = state.routes[state.index] as AnyRoute;
  const unread = useQuery('notices:unread', getUnreadCount);
  const screen = deepestRouteName(focused);
  const visible = screen === undefined || SCREENS_WITH_TAB_BAR.has(screen);

  useEffect(() => {
    if (!visible) onHeightChange?.(0);
  }, [visible, onHeightChange]);

  if (!visible) return null;

  const onTabPress = (key: TabKey) => {
    const route = state.routes.find((r) => TAB_KEYS[r.name as keyof MainTabsParamList] === key);
    if (!route) return;

    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

    if (route.key !== focused.key && !event.defaultPrevented) {
      navigation.dispatch({
        ...CommonActions.navigate(route.name, route.params),
        target: state.key,
      });
    }
  };

  return (
    <View onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}>
      <TabBar
        activeKey={TAB_KEYS[focused.name as keyof MainTabsParamList]}
        onTabPress={onTabPress}
        badges={{ notices: (unread.data ?? 0) > 0 }}
      />
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <RoutedTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ServicesTab" component={ServicesStack} />
      <Tab.Screen name="RecordsTab" component={RecordsStack} />
      <Tab.Screen name="NoticesTab" component={NoticesStack} />
      <Tab.Screen name="AskUsTab" component={AskUsStack} />
    </Tab.Navigator>
  );
}
