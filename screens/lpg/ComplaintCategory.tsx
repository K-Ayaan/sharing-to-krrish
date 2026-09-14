import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import { complaintCategories, type ComplaintCategoryId } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { complaintCategoryIcon } from './lpgFormat';

export default function ComplaintCategory({ navigation, route }: LpgScreenProps<'ComplaintCategory'>) {
  const [categoryId, setCategoryId] = useState<ComplaintCategoryId>();

  const handleContinue = () => {
    if (!categoryId) return;
    // A step within the complaint form, so a normal push (flow.md) — Change comes back here.
    navigation.navigate('ComplaintDetails', { categoryId, requestId: route.params?.requestId });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
    >
      <Text style={styles.secondary}>Select a category for your issue.</Text>

      <Card padded={false}>
        {complaintCategories.map((category, index) => {
          const selected = category.id === categoryId;
          return (
            <ListRow
              key={category.id}
              title={category.name}
              icon={complaintCategoryIcon[category.id]}
              iconColor={selected ? theme.color.primary : theme.color.textSecondary}
              iconBackground={selected ? theme.color.primaryTint : theme.color.surfaceMuted}
              selected={selected}
              divider={index < complaintCategories.length - 1}
              onPress={() => setCategoryId(category.id)}
              trailing={
                selected ? (
                  <Ionicons name="checkmark" size={theme.type.title.fontSize} color={theme.color.primary} />
                ) : (
                  <></>
                )
              }
            />
          );
        })}
      </Card>

      <View style={styles.spacer} />

      <Button
        label="Continue"
        trailingIcon="arrow-forward"
        disabled={!categoryId}
        onPress={handleContinue}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.color.background,
  },
  content: {
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  spacer: {
    flex: 1,
  },
});
