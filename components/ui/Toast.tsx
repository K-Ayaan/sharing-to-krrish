// const toast = useToast(); toast.show({ message: 'Collection submitted', tone: 'success' });
// One transient message at a time, above the tab bar. Mounted once in App.tsx via ToastProvider.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, CloudUpload, Info, XCircle } from 'lucide-react-native';
import theme from '../../theme';

type ToastTone = 'success' | 'info' | 'error' | 'queued';
type ToastMessage = { id: number; message: string; tone: ToastTone };

type ToastApi = { show: (toast: { message: string; tone?: ToastTone }) => void };

const ToastContext = createContext<ToastApi>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const VISIBLE_MS = 3200;
// Clears the 5-item tab bar so toasts never cover navigation.
const TAB_BAR_CLEARANCE = 84;

const ICONS = { success: CheckCircle2, info: Info, error: XCircle, queued: CloudUpload } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(1);

  const hide = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: theme.motion.base,
      easing: Easing.bezier(0.2, 0, 0.2, 1),
      useNativeDriver: true,
    }).start(({ finished }) => finished && setCurrent(null));
  }, [progress]);

  const show = useCallback<ToastApi['show']>(
    ({ message, tone = 'success' }) => {
      if (timer.current) clearTimeout(timer.current);
      setCurrent({ id: nextId.current++, message, tone });
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: theme.motion.settle,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(hide, VISIBLE_MS);
    },
    [hide, progress]
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const api = useMemo(() => ({ show }), [show]);
  const Icon = current ? ICONS[current.tone] : null;
  const iconColor =
    current?.tone === 'error'
      ? '#F4A79D'
      : current?.tone === 'queued'
        ? theme.illustration.sun
        : theme.color.primaryTint;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {current && Icon ? (
        <View pointerEvents="none" style={[styles.host, { bottom: insets.bottom + TAB_BAR_CLEARANCE }]}>
          <Animated.View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={[
              styles.toast,
              {
                opacity: progress,
                transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
              },
            ]}
          >
            <Icon size={20} color={iconColor} strokeWidth={2} />
            <Text style={styles.text}>{current.message}</Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: theme.size.screenPadding,
    right: theme.size.screenPadding,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    maxWidth: '100%',
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m + 2,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.textPrimary,
    ...theme.elevation.raised,
  },
  text: {
    ...theme.type.body,
    color: theme.color.textOnDark,
    flexShrink: 1,
  },
});
