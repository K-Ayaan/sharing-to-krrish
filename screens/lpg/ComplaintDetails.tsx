import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import TextField from '../../components/ui/TextField';
import { complaintCategories, submitComplaint } from '../../data/mock/mockLpg';
import { completeForm } from '../../navigation/completeForm';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { complaintCategoryIcon } from './lpgFormat';

const DESCRIPTION_MAX_LENGTH = 300;

export default function ComplaintDetails({ navigation, route }: LpgScreenProps<'ComplaintDetails'>) {
  const { categoryId, requestId } = route.params;
  const category = complaintCategories.find((option) => option.id === categoryId);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ComplaintCategory is always the previous screen, still mounted with its selection.
  const changeCategory = () => navigation.goBack();

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const complaint = await submitComplaint({
        categoryId,
        description: description.trim() || null,
        requestId: requestId ?? null,
      });
      // Multi-step form: completeForm() drops ComplaintCategory + ComplaintDetails, so back
      // from the confirmation never re-enters the finished form (flow.md).
      completeForm(navigation, 'ComplaintCategory', 'ComplaintSubmitted', {
        complaintId: complaint.id,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.group}>
        <Text style={styles.caption}>Selected category</Text>
        <Card padded={false}>
          <ListRow
            title={category?.name ?? categoryId}
            icon={complaintCategoryIcon[categoryId]}
            iconColor={theme.color.textSecondary}
            iconBackground={theme.color.surfaceMuted}
            onPress={changeCategory}
            trailing={<Button label="Change" variant="text" onPress={changeCategory} />}
          />
        </Card>
      </View>

      <View style={styles.group}>
        <TextField
          label="Tell us more"
          maxLength={DESCRIPTION_MAX_LENGTH}
          multiline
          onChangeText={setDescription}
          placeholder="Describe the issue (optional)"
          value={description}
        />
        <Text style={styles.counter}>
          {description.length}/{DESCRIPTION_MAX_LENGTH}
        </Text>
      </View>

      <View style={styles.spacer} />

      <Button label="Submit" trailingIcon="arrow-forward" disabled={submitting} onPress={handleSubmit} />
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
    gap: theme.space.l,
  },
  group: {
    gap: theme.space.s,
  },
  caption: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  counter: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    textAlign: 'right',
  },
  spacer: {
    flex: 1,
  },
});
