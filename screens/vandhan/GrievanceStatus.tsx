import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import IconButton from '../../components/ui/IconButton';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { getActiveGrievance } from '../../data/mock/mockVanDhan';
import theme from '../../theme';
import { formatDateTime } from '../formatDate';
import {
  CALL_UNAVAILABLE,
  formatPhoneDisplay,
  grievanceStageMeta,
  grievanceSteps,
  openPhone,
} from './vanDhanFormat';

export default function GrievanceStatus() {
  // Registered producers only — unregistered users have no grievances.
  const grievance = getActiveGrievance();
  const [toast, setToast] = useState<string | null>(null);

  if (!grievance) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>You have no open grievances.</Text>
        </Card>
      </ScrollView>
    );
  }

  const stage = grievanceStageMeta[grievance.stage];
  const callHelpline = async () => {
    if (!(await openPhone(grievance.helplinePhone))) setToast(CALL_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <ScenicBackdrop />
        <Card style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <Text style={styles.caption}>Grievance ID</Text>
              <Text style={styles.id}>{grievance.id}</Text>
            </View>
            <StatusPill label={stage.label} tone={stage.tone} icon={stage.icon} />
          </View>
          <View>
            <Text style={styles.caption}>Submitted on</Text>
            <Text style={styles.body}>{formatDateTime(grievance.submittedAt)}</Text>
          </View>

          <StatusTracker orientation="vertical" steps={grievanceSteps(grievance)} />

          <Card tone="info" style={styles.help}>
            <Avatar icon="chatbubble-ellipses" tint={theme.color.surface} />
            <View style={styles.flex}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.secondary}>Call {formatPhoneDisplay(grievance.helplinePhone)}</Text>
            </View>
            <IconButton
              icon="call"
              color={theme.vandhan.color.primary}
              accessibilityLabel="Call the Van Dhan helpline"
              onPress={callHelpline}
            />
          </Card>
        </Card>
        <TabBarSpacer />
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.vandhan.color.background,
  },
  content: {
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  section: {
    gap: theme.space.l,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  body: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  helpTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
});
