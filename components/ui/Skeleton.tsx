// <SkeletonList count={5} /> while a list loads; <Skeleton width={120} height={16} /> for custom shapes.
// A gentle opacity pulse, shared by every block on screen so they breathe in sync. Static under
// the OS "remove animations" setting.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';

const PulseContext = createContext<Animated.Value | null>(null);

function usePulse() {
  const shared = useContext(PulseContext);
  const own = useRef(new Animated.Value(1)).current;
  const value = shared ?? own;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (shared || reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(own, { toValue: 0.45, duration: 700, useNativeDriver: true }),
        Animated.timing(own, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shared, own, reduceMotion]);

  return value;
}

function PulseGroup({ children }: { children: React.ReactNode }) {
  const pulse = usePulse();
  return <PulseContext.Provider value={pulse}>{children}</PulseContext.Provider>;
}

export function Skeleton({
  width = '100%',
  height = 14,
  radius = 7,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const pulse = usePulse();
  return (
    <Animated.View
      style={[styles.block, { width, height, borderRadius: radius, opacity: pulse }, style]}
    />
  );
}

function RowSkeleton({ thumb = 56, lines = 3 }: { thumb?: number; lines?: number }) {
  return (
    <View style={styles.rowCard}>
      <Skeleton width={thumb} height={thumb} radius={thumb >= 72 ? theme.radius.tile : thumb / 2} />
      <View style={styles.rowText}>
        <Skeleton width="62%" height={16} />
        {lines > 1 ? <Skeleton width="40%" height={12} /> : null}
        {lines > 2 ? <Skeleton width="50%" height={12} /> : null}
      </View>
      <Skeleton width={72} height={28} radius={14} />
    </View>
  );
}

export function SkeletonList({
  count = 5,
  thumb,
  lines,
  accessibilityLabel = 'Loading',
}: {
  count?: number;
  thumb?: number;
  lines?: number;
  accessibilityLabel?: string;
}) {
  return (
    <PulseGroup>
      <View accessible accessibilityLabel={accessibilityLabel} accessibilityRole="progressbar" style={styles.stack}>
        {Array.from({ length: count }, (_, index) => (
          <RowSkeleton key={index} thumb={thumb} lines={lines} />
        ))}
      </View>
    </PulseGroup>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <PulseGroup>
      <View accessible accessibilityLabel="Loading listings" accessibilityRole="progressbar" style={styles.grid}>
        {Array.from({ length: count }, (_, index) => (
          <View key={index} style={styles.gridCard}>
            <Skeleton height={110} radius={theme.radius.tile} />
            <Skeleton width="50%" height={16} />
            <Skeleton width="70%" height={12} />
            <Skeleton width="60%" height={12} />
            <Skeleton width="45%" height={18} />
            <Skeleton height={40} radius={20} />
          </View>
        ))}
      </View>
    </PulseGroup>
  );
}

export function SkeletonCards({ count = 3, height = 140 }: { count?: number; height?: number }) {
  return (
    <PulseGroup>
      <View accessible accessibilityLabel="Loading" accessibilityRole="progressbar" style={styles.stack}>
        {Array.from({ length: count }, (_, index) => (
          <View key={index} style={[styles.card, { height }]}>
            <View style={styles.cardRow}>
              <Skeleton width={72} height={72} radius={theme.radius.tile} />
              <View style={styles.rowText}>
                <Skeleton width="45%" height={18} />
                <Skeleton width="85%" height={12} />
                <Skeleton width="70%" height={12} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </PulseGroup>
  );
}

export function SkeletonDetail() {
  return (
    <PulseGroup>
      <View accessible accessibilityLabel="Loading details" accessibilityRole="progressbar" style={styles.stack}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Skeleton width={96} height={96} radius={theme.radius.tile} />
            <View style={styles.rowText}>
              <Skeleton width="30%" height={12} />
              <Skeleton width="65%" height={20} />
              <Skeleton width="45%" height={14} />
            </View>
          </View>
          <Skeleton height={52} radius={theme.radius.field} style={styles.gapTop} />
        </View>
        <View style={styles.trackerRow}>
          {[0, 1, 2].map((key) => (
            <View key={key} style={styles.trackerItem}>
              <Skeleton width={44} height={44} radius={22} />
              <Skeleton width={70} height={12} />
            </View>
          ))}
        </View>
        <View style={styles.card}>
          {[0, 1, 2, 3].map((key) => (
            <View key={key} style={styles.detailLine}>
              <Skeleton width={40} height={40} radius={20} />
              <Skeleton width="30%" height={14} />
              <View style={styles.flex} />
              <Skeleton width="28%" height={14} />
            </View>
          ))}
        </View>
      </View>
    </PulseGroup>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: theme.color.surfaceMuted,
  },
  stack: {
    gap: theme.space.m,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    padding: theme.space.l,
    borderRadius: theme.radius.card,
    backgroundColor: theme.color.surface,
  },
  rowText: {
    flex: 1,
    gap: theme.space.s,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.m,
  },
  gridCard: {
    width: '48%',
    flexGrow: 1,
    gap: theme.space.s,
    padding: theme.space.m,
    borderRadius: theme.radius.card,
    backgroundColor: theme.color.surface,
  },
  card: {
    padding: theme.space.l,
    borderRadius: theme.radius.card,
    backgroundColor: theme.color.surface,
    gap: theme.space.s,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  gapTop: {
    marginTop: theme.space.m,
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.space.m,
  },
  trackerItem: {
    alignItems: 'center',
    gap: theme.space.s,
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    paddingVertical: theme.space.m,
  },
  flex: {
    flex: 1,
  },
});
