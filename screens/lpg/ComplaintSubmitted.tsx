import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import Toast from '../../components/ui/Toast';
import { getComplaint } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';

export default function ComplaintSubmitted({ navigation, route }: LpgScreenProps<'ComplaintSubmitted'>) {
  const { complaintId } = route.params;
  const complaint = getComplaint(complaintId);
  const [toast, setToast] = useState<string | null>(null);

  const copyId = async () => {
    await Clipboard.setStringAsync(complaintId);
    setToast('Complaint ID copied');
  };

  // There is no complaint-tracking screen, so "View status" shows the related refill request.
  // popTo returns to RequestStatus if it's still underneath, otherwise replaces this screen with
  // it — never a duplicate (plain navigate would push a second RequestStatus in React Navigation 7).
  const viewStatus = () =>
    navigation.popTo(
      'RequestStatus',
      complaint?.requestId ? { requestId: complaint.requestId } : undefined
    );

  const done = () => navigation.popTo('LpgHome');

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar
            icon="checkmark"
            iconColor={theme.color.success}
            tint={theme.color.successTint}
            size="xl"
          />
          <Text accessibilityRole="header" style={styles.title}>
            Complaint submitted
          </Text>
          <Text style={[styles.secondary, styles.centered]}>
            Your complaint has been submitted successfully.
          </Text>
        </View>

        <Card style={styles.idCard}>
          <Avatar icon="document-text" size="l" />
          <View style={styles.flex}>
            <Text style={styles.caption}>Complaint ID</Text>
            <Text selectable style={styles.id}>
              {complaintId}
            </Text>
          </View>
          <IconButton
            icon="copy-outline"
            color={theme.color.primary}
            accessibilityLabel="Copy complaint ID"
            onPress={copyId}
          />
        </Card>

        <Text style={[styles.caption, styles.centered]}>We'll notify you about the updates.</Text>

        <View style={styles.actions}>
          <Button label="View status" variant="secondary" onPress={viewStatus} />
          <Button label="Done" onPress={done} />
        </View>
      </ScrollView>

      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.l,
  },
  flex: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
    textAlign: 'center',
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  centered: {
    textAlign: 'center',
  },
  idCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  id: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  actions: {
    gap: theme.space.s,
  },
});
