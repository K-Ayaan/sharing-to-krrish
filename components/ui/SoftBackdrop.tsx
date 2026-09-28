// <SoftBackdrop />  or  <SoftBackdrop leaves />  — first child of a full-screen container
import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import theme from '../../theme';
import Leaf from './art/Leaf';

export type SoftBackdropProps = {
  /** A sprig of leaves at the top-right edge (Settings). */
  leaves?: boolean;
};

const BLOB = theme.space.xl * 8;
const BLOB_OPACITY = 0.7;
const SPRIG_W = theme.space.xl * 2;
const SPRIG_H = theme.space.xl * 4;

const art = theme.onboarding.art;

// Pale colour fields behind a screen's cards — a large blue circle at the top-right and soft green
// and blue ones along the bottom, from existing tint tokens. Glass and elevated cards need
// something behind them to read as layered. Decorative; hidden from VoiceOver.
export default function SoftBackdrop({ leaves = false }: SoftBackdropProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <View style={[styles.blob, styles.topRight]} />
      <View style={[styles.blob, styles.bottomLeft]} />
      <View style={[styles.blob, styles.bottomRight]} />
      {leaves ? (
        <Svg width={SPRIG_W} height={SPRIG_H} viewBox={`0 0 ${SPRIG_W} ${SPRIG_H}`} style={styles.sprig}>
          <Leaf x={SPRIG_W} y={SPRIG_H * 0.55} length={70} angle={-40} fill={art.leafLight} opacity={0.7} />
          <Leaf x={SPRIG_W} y={SPRIG_H * 0.9} length={60} angle={-70} fill={art.leafLight} opacity={0.55} />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: BLOB,
    height: BLOB,
    borderRadius: theme.radius.pill,
    opacity: BLOB_OPACITY,
  },
  topRight: {
    top: -BLOB * 0.35,
    right: -BLOB * 0.4,
    backgroundColor: theme.color.primaryTint,
  },
  bottomLeft: {
    bottom: theme.space.xl * 2,
    left: -BLOB * 0.6,
    backgroundColor: theme.pillarTint.vandhan.tint,
  },
  bottomRight: {
    bottom: -BLOB * 0.45,
    right: -BLOB * 0.45,
    backgroundColor: theme.color.primaryTint,
  },
  sprig: {
    position: 'absolute',
    top: theme.space.xl * 2,
    right: 0,
  },
});
