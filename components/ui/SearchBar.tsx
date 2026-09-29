// <SearchBar placeholder="Search produce" value={query} onChangeText={setQuery} />
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Search, X } from 'lucide-react-native';
import theme from '../../theme';

export type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  style?: ViewStyle;
};

export default function SearchBar({ value, onChangeText, placeholder, autoFocus, style }: SearchBarProps) {
  return (
    <View style={[styles.bar, style]}>
      <Search size={22} color={theme.color.textSecondary} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textTertiary}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          onPress={() => onChangeText('')}
        >
          <X size={18} color={theme.color.textSecondary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: theme.size.touch + 6,
    paddingHorizontal: theme.space.l,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  input: {
    flex: 1,
    ...theme.type.body,
    fontSize: 14,
    color: theme.color.textPrimary,
    paddingVertical: theme.space.s,
  },
});
