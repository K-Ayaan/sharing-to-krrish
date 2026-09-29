import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ToastProvider } from './components/ui/Toast';
import RootNavigator from './navigation/RootNavigator';
import { fontsToLoad, theme } from './theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    Font.loadAsync(fontsToLoad)
      .catch((error) => console.warn('Failed to load fonts', error))
      .finally(() => setFontsReady(true));
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady]);

  if (!fontsReady) {
    return <View style={{ flex: 1, backgroundColor: theme.color.background }} />;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <ToastProvider>
        <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: theme.color.primary,
              background: theme.color.background,
              card: theme.color.background,
              text: theme.color.textPrimary,
              border: theme.color.border,
              notification: theme.color.alert.fg,
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '600' },
              heavy: { fontFamily: 'System', fontWeight: '700' },
            },
          }}
        >
          <RootNavigator />
        </NavigationContainer>
      </ToastProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
