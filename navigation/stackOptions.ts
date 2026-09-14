import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import theme from '../theme';

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerTintColor: theme.color.primary,
  headerTitleStyle: { color: theme.color.textPrimary },
  contentStyle: { backgroundColor: theme.color.background },
};
