import {
  BottomTabBarHeightCallbackContext,
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { useContext } from 'react';
import { View } from 'react-native';
import TabBar, { type TabKey } from '../components/ui/TabBar';
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

// Mirrors React Navigation's default BottomTabBar: emitting tabPress keeps
// native-stack's pop-to-top on re-tap, and reporting height keeps
// useBottomTabBarHeight accurate.
function RoutedTabBar({ state, navigation }: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const focused = state.routes[state.index];

  const onTabPress = (key: TabKey) => {
    const route = state.routes.find(
      (r) => TAB_KEYS[r.name as keyof MainTabsParamList] === key
    );
    if (!route) return;

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

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
      />
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <RoutedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ServicesTab" component={ServicesStack} />
      <Tab.Screen name="RecordsTab" component={RecordsStack} />
      <Tab.Screen name="NoticesTab" component={NoticesStack} />
      <Tab.Screen name="AskUsTab" component={AskUsStack} />
    </Tab.Navigator>
  );
}
