import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DocumentIllustration from '../../components/ui/DocumentIllustration';
import ListRow from '../../components/ui/ListRow';
import PageIntro from '../../components/ui/PageIntro';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import { useTabBarInset } from '../../components/ui/TabBarSpacer';
import { complaintCategories, type ComplaintCategoryId } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { complaintCategoryIcon } from './lpgFormat';

const { color } = theme.lpg;

export default function ComplaintCategory({ navigation, route }: LpgScreenProps<'ComplaintCategory'>) {
  const [categoryId, setCategoryId] = useState<ComplaintCategoryId>();
  const tabBarInset = useTabBarInset();

  const handleContinue = () => {
    if (!categoryId) return;
    // A step within the complaint form, so a normal push (flow.md) — Change comes back here.
    navigation.navigate('ComplaintDetails', { categoryId, requestId: route.params?.requestId });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <ScenicBackdrop />
        <PageIntro text="Select a category for your issue." art={<DocumentIllustration badge="alert" />} />

        <Card padded={false}>
          {complaintCategories.map((category, index) => {
            const selected = category.id === categoryId;
            return (
              <ListRow
                key={category.id}
                title={category.name}
                icon={complaintCategoryIcon[category.id]}
                iconColor={color.primary}
                iconBackground={color.primaryTint}
                selected={selected}
                divider={index < complaintCategories.length - 1}
                onPress={() => setCategoryId(category.id)}
                trailing={
                  <Ionicons
                    name={selected ? 'checkmark' : 'chevron-forward'}
                    size={selected ? theme.type.title.fontSize : theme.type.headline.fontSize}
                    color={color.primary}
                  />
                }
              />
            );
          })}
        </Card>
      </ScrollView>

      {/* Pinned above the floating tab bar so Continue is reachable without scrolling. */}
      <View style={[styles.footer, { paddingBottom: theme.space.s + tabBarInset }]}>
        <Button
          label="Continue"
          trailingIcon="arrow-forward"
          disabled={!categoryId}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  footer: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.s,
    backgroundColor: color.background,
  },
});
