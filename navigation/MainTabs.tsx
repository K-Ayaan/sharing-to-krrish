import {
  BottomTabBarHeightCallbackContext,
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { CommonActions, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import TabBar, { type TabKey } from '../components/ui/TabBar';
import { pillarOfRecordId } from '../screens/records/recordSource';
import theme from '../theme';
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
// useBottomTabBarHeight accurate. The bar floats over the screens (content scrolls behind its
// glass), so screens clear it with TabBarSpacer / useTabBarInset.
function RoutedTabBar({ state, navigation }: BottomTabBarProps) {
  const onHeightChange = useContext(BottomTabBarHeightCallbackContext);
  const focused = state.routes[state.index];
  // Inside a redesigned pillar the active tab takes its colour: Van Dhan green, Livestock rose. A
  // record's detail page in My Records takes its record's pillar colour the same way.
  const pillar = focused.name === 'ServicesTab' ? getFocusedRouteNameFromRoute(focused) : undefined;
  const nested = focused.state;
  const nestedTop = nested?.index !== undefined ? nested.routes[nested.index] : undefined;
  const recordId =
    focused.name === 'RecordsTab' && nestedTop?.name === 'RecordDetail'
      ? (nestedTop.params as { recordId?: string } | undefined)?.recordId
      : undefined;
  const recordPillar = recordId ? pillarOfRecordId(recordId) : null;
  const pillarPalette =
    pillar === 'VanDhanStack' || recordPillar === 'vandhan'
      ? theme.vandhan.color
      : pillar === 'LivestockStack' || recordPillar === 'livestock'
        ? theme.livestock.color
        : null;

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
    <View
      pointerEvents="box-none"
      style={styles.floating}
      onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}
    >
      <TabBar
        activeKey={TAB_KEYS[focused.name as keyof MainTabsParamList]}
        onTabPress={onTabPress}
        accent={pillarPalette ? { color: pillarPalette.primary, tint: pillarPalette.primaryTint } : undefined}
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

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
