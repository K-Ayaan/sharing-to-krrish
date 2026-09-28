import { StyleSheet, View } from 'react-native';
import BottomSheet from '../../components/ui/BottomSheet';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import Radio from '../../components/ui/Radio';
import theme from '../../theme';
import { sortOptions, type StockSort } from './livestockFormat';

type SortSheetProps = {
  visible: boolean;
  selected: StockSort;
  onSelect: (sort: StockSort) => void;
  onClose: () => void;
};

// LivestockHome's "Sort by" picker: one choice, applied as soon as it's tapped.
export default function SortSheet({ visible, selected, onSelect, onClose }: SortSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort by" showClose>
      <View style={styles.content}>
        <Card padded={false}>
          {sortOptions.map((option, index) => (
            <ListRow
              key={option.id}
              title={option.name}
              selected={option.id === selected}
              divider={index < sortOptions.length - 1}
              trailing={<Radio selected={option.id === selected} />}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
            />
          ))}
        </Card>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.space.s,
  },
});
