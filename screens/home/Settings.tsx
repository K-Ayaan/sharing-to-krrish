import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GlassCard from '../../components/ui/GlassCard';
import ListRow from '../../components/ui/ListRow';
import SoftBackdrop from '../../components/ui/SoftBackdrop';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Toast from '../../components/ui/Toast';
import { COUNTRY_CODE } from '../../data/mock/mockOnboarding';
import { initialsOf } from '../../data/mock/mockUser';
import { useSignOut } from '../../navigation/OnboardingContext';
import type { HomeScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatPhone } from '../onboarding/formatPhone';
import { useUserProfile } from '../useUserProfile';
import ProfileEditSheet, { type ProfileEditTopic } from './ProfileEditSheet';

// Section: a glass card with a heading over a white group of rows. Layout only.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <GlassCard padded={false}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      <Card padded={false} style={styles.group}>
        {children}
      </Card>
    </GlassCard>
  );
}

// Opened by tapping the UID chip on any tab (from outside Home it switches to the Home tab first). A menu of rows (redesign): name, email and contact number
// open ProfileEditSheet; Aadhaar and the UID are read-only and never part of what Settings can save.
// Rows the reference image shows but nothing backs yet — Notifications, Language, App theme,
// Privacy & Terms — are left out until those features exist.
export default function Settings({ navigation }: HomeScreenProps<'Settings'>) {
  const profile = useUserProfile();
  const signOut = useSignOut();
  const [editing, setEditing] = useState<ProfileEditTopic | null>(null);
  const [aadhaarOpen, setAadhaarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const copyUid = async () => {
    await Clipboard.setStringAsync(profile.uid);
    setToast('MARCOFED ID copied');
  };

  // Logout always goes through this confirmation — there is no direct path. Confirming clears the
  // stored UID and swaps back to Onboarding.
  const confirmLogout = () =>
    Alert.alert('Log out?', "You'll need to verify your Aadhaar again to sign back in.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => void signOut() },
    ]);

  return (
    <View style={styles.screen}>
      {/* The ScrollView must be the screen's first view: iOS only collapses the large title into a
          solid bar on scroll when it is. */}
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        {/* Decorative backdrop behind the glass; inside the scroll content so the rule above holds. */}
        <SoftBackdrop leaves />

        <GlassCard padded={false}>
          <ListRow
            size="large"
            leading={<Avatar initials={initialsOf(profile.fullName)} size="l" />}
            title={profile.fullName}
            subtitle={`UID ${profile.uid}`}
            onPress={() => setEditing('personal')}
            style={styles.clear}
          />
        </GlassCard>

        <Section title="Profile">
          <ListRow
            icon="person"
            iconShape="circle"
            title="Personal details"
            subtitle="Name, village, district"
            onPress={() => setEditing('personal')}
            divider
          />
          <ListRow
            icon="mail-outline"
            iconShape="circle"
            iconColor={theme.pillarTint.notices.icon}
            iconBackground={theme.pillarTint.notices.tint}
            title="Email address"
            subtitle={profile.email}
            onPress={() => setEditing('email')}
            divider
          />
          <ListRow
            icon="call-outline"
            iconShape="circle"
            iconColor={theme.pillarTint.vandhan.icon}
            iconBackground={theme.pillarTint.vandhan.tint}
            title="Contact number"
            subtitle={`${COUNTRY_CODE} ${formatPhone(profile.phone)}`}
            onPress={() => setEditing('phone')}
          />
        </Section>

        <Section title="Identity">
          <ListRow
            icon="finger-print"
            iconShape="circle"
            iconColor={theme.color.textSecondary}
            iconBackground={theme.color.surfaceMuted}
            title="Aadhaar"
            subtitle="Verified · Linked at registration"
            onPress={() => setAadhaarOpen(true)}
            divider
          />
          <ListRow
            icon="document-text-outline"
            iconShape="circle"
            title="MARCOFED ID"
            subtitle={profile.uid}
            trailing={
              <Ionicons name="copy-outline" size={theme.type.headline.fontSize} color={theme.color.textSecondary} />
            }
            onPress={copyUid}
          />
        </Section>

        <Section title="Support">
          <ListRow
            icon="help-circle-outline"
            iconShape="circle"
            iconColor={theme.color.textSecondary}
            iconBackground={theme.color.surfaceMuted}
            title="Help & Support"
            subtitle="FAQs, contact support"
            onPress={() => navigation.navigate('AskUsTab', { screen: 'AskUs', pop: true })}
            divider
          />
          <ListRow
            icon="log-out-outline"
            iconShape="circle"
            iconColor={theme.color.danger}
            iconBackground={theme.color.dangerTint}
            title="Log out"
            tone="danger"
            onPress={confirmLogout}
          />
        </Section>
        <TabBarSpacer />
      </ScrollView>

      <ProfileEditSheet
        topic={editing}
        profile={profile}
        onClose={() => setEditing(null)}
        onSaved={setToast}
      />

      <BottomSheet visible={aadhaarOpen} onClose={() => setAadhaarOpen(false)} title="Aadhaar" showClose>
        <View style={styles.sheetContent}>
          <Text style={styles.body}>
            Your Aadhaar was verified and linked when you registered. It is your MARCOFED identity and
            can't be changed here. To sign in on another phone, verify the same Aadhaar again.
          </Text>
          <Button label="Close" variant="secondary" onPress={() => setAadhaarOpen(false)} />
        </View>
      </BottomSheet>

      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.backgroundWarm,
  },
  content: {
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  clear: {
    backgroundColor: 'transparent',
    paddingVertical: theme.space.m,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.s + theme.space.xs,
    paddingBottom: theme.space.s,
  },
  group: {
    marginHorizontal: theme.space.s,
    marginBottom: theme.space.s,
  },
  sheetContent: {
    gap: theme.space.l,
    paddingBottom: theme.space.s,
  },
  body: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
});
