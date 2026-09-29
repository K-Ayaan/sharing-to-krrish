import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import theme from '../theme';

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerTintColor: theme.color.primary,
  headerTitleStyle: { color: theme.color.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: theme.color.background },
};
