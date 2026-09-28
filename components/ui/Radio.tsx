// <Radio selected={id === current} />
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';
import { useAppearance } from './Appearance';

export type RadioProps = {
  selected: boolean;
};

const SIZE = theme.space.l + theme.space.xs;
const CORE = theme.space.s + theme.space.xs;

// Display-only round mark: an empty ring, or a ring with a filled centre when selected. The pressable
// row around it owns the accessibility role and state — a radio for one choice (the kendra sheet), a
// checkbox for multi-select lists drawn with round marks (the Livestock filter sheets).
export default function Radio({ selected }: RadioProps) {
  const { color } = useAppearance();
  return (
    <View style={[styles.ring, { borderColor: selected ? color.primary : color.border }]}>
      {selected ? <View style={[styles.core, { backgroundColor: color.primary }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: SIZE,
    height: SIZE,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: CORE,
    height: CORE,
    borderRadius: theme.radius.pill,
  },
});
