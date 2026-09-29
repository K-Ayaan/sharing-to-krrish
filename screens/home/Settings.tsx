// settings.png — profile fields (each editable in a sheet), the MARCOFED ID as read-only, the
// preference toggles (SDD §4.6.1 captures language, notification and analytics preferences), and
// Log Out. Preference icons are plain, not tinted, like the rest of the app's list rows.
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BarChart3,
  Bell,
  Camera,
  Globe,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Phone,
  RotateCcw,
  User,
} from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Avatar from '../../components/ui/Avatar';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import OptionCard from '../../components/ui/OptionCard';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import SwitchRow, { NavRow } from '../../components/ui/SwitchRow';
import TextField from '../../components/ui/TextField';
import { useToast } from '../../components/ui/Toast';
import type { IconComponent } from '../../components/ui/icons';
import { LANGUAGES, languageLabel, type Language } from '../../data/mock/mockOnboarding';
import type { HomeScreenProps } from '../../navigation/types';
import { useResetOnboarding } from '../../navigation/OnboardingContext';
import { describeError } from '../../services/client';
import { useQuery } from '../../services/useQuery';
import { getProfile, resetRegistrations, updateProfile } from '../../services/userService';
import theme from '../../theme';
import { maskNumber } from '../../utils/format';

const APP_VERSION = '1.0.0';

type EditableField = 'name' | 'email' | 'phone';

const FIELD: Record<EditableField, { icon: IconComponent; label: string; sheetTitle: string; placeholder: string }> = {
  name: { icon: User, label: 'Name', sheetTitle: 'Your name', placeholder: 'Full name' },
  email: { icon: Mail, label: 'Email', sheetTitle: 'Your email', placeholder: 'name@example.com' },
  phone: { icon: Phone, label: 'Contact number', sheetTitle: 'Your contact number', placeholder: '10-digit mobile number' },
};

export default function Settings({ navigation }: HomeScreenProps<'Settings'>) {
  const toast = useToast();
  const profile = useQuery('profile', getProfile);
  const resetOnboarding = useResetOnboarding();
  const [editing, setEditing] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  // Toggles answer the tap straight away and hold that value while the save is in flight —
  // waiting for the round trip made the switch snap back and look broken.
  const [pending, setPending] = useState<{ notificationsEnabled?: boolean; analyticsEnabled?: boolean }>({});

  const data = profile.data;

  const openEdit = (field: EditableField) => {
    setDraft(field === 'email' ? (data?.email ?? '') : field === 'phone' ? (data?.phone ?? '') : (data?.name ?? ''));
    setError(null);
    setEditing(field);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateProfile({ [editing]: draft } as { name?: string });
      setEditing(null);
      toast.show({ message: 'Details updated', tone: 'success' });
    } catch (caught) {
      setError(describeError(caught));
    } finally {
      setSaving(false);
    }
  };

  const setPreference = async (patch: { language?: Language; notificationsEnabled?: boolean; analyticsEnabled?: boolean }) => {
    setPending((current) => ({ ...current, ...patch }));
    try {
      await updateProfile(patch);
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      // The query has the saved value now, so the local one steps aside.
      setPending((current) => {
        const next = { ...current };
        for (const key of Object.keys(patch) as (keyof typeof next)[]) delete next[key];
        return next;
      });
    }
  };

  const confirmResetRegistrations = () => {
    Alert.alert(
      'Unregister from all services?',
      'Van Dhan, Livestock, LPG and Micro-Finance will show as not registered, so you can go through each registration screen again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unregister',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetRegistrations();
              toast.show({ message: 'All services unregistered', tone: 'success' });
            } catch (caught) {
              toast.show({ message: describeError(caught), tone: 'error' });
            }
          },
        },
      ]
    );
  };

  const confirmLogOut = () => {
    Alert.alert('Log out?', 'You’ll need your mobile number and an OTP to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: resetOnboarding },
    ]);
  };

  return (
    <Screen
      header={<ScreenHeader layout="bar" title="Settings" onBack={navigation.goBack} />}
      refreshing={profile.refreshing}
      onRefresh={profile.refresh}
      contentStyle={styles.content}
    >
      <AsyncContent query={profile} what="your profile" skeleton={<SkeletonCards count={3} height={110} />}>
        {(user) => (
          <>
            <SectionHeader title="Profile information" />
            <View style={styles.identity}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change your photo"
                onPress={() => toast.show({ message: 'Photo upload comes with the live account service.' })}
                style={styles.photo}
              >
                <Avatar name={user.name} photoUri={user.photoUri} size={82} />
                <View style={styles.cameraBadge}>
                  <Camera size={15} color={theme.color.onPrimary} strokeWidth={2} />
                </View>
              </Pressable>
              <View style={styles.flex}>
                <Text style={styles.identityTitle}>Update your details</Text>
                <Text style={styles.identityBody}>Keep your information up to date for a better experience.</Text>
              </View>
            </View>

            <View style={styles.fields}>
              {(Object.keys(FIELD) as EditableField[]).map((field) => {
                const meta = FIELD[field];
                const value =
                  field === 'name' ? user.name : field === 'email' ? (user.email ?? 'Not added') : user.phone;
                return (
                  <Card key={field} padded={false} style={styles.fieldCard} onPress={() => openEdit(field)}>
                    <View style={styles.fieldRow}>
                      <meta.icon size={22} color={theme.color.textPrimary} strokeWidth={1.75} />
                      <View style={styles.flex}>
                        <Text style={styles.fieldLabel}>{meta.label}</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>
                          {value}
                        </Text>
                      </View>
                      <Pencil size={19} color={theme.color.textSecondary} strokeWidth={1.75} />
                    </View>
                  </Card>
                );
              })}

              <View style={styles.lockedCard}>
                <View style={styles.fieldRow}>
                  <Lock size={22} color={theme.color.textSecondary} strokeWidth={1.75} />
                  <View style={styles.flex}>
                    <Text style={styles.lockedLabel}>MARCOFED ID</Text>
                    <Text style={styles.fieldValue}>{user.uid}</Text>
                    <Text style={styles.lockedNote}>This cannot be changed</Text>
                  </View>
                </View>
              </View>
            </View>

            <SectionHeader title="Preferences" style={styles.sectionGap} />
            <Card padded={false} style={styles.preferences}>
              <SwitchRow
                icon={Bell}
                title="Notifications"
                subtitle="Get updates about your services"
                value={pending.notificationsEnabled ?? user.notificationsEnabled}
                onValueChange={(next) => setPreference({ notificationsEnabled: next })}
                divider
              />
              <NavRow
                icon={Globe}
                title="Language"
                subtitle="Choose your preferred language"
                value={languageLabel(user.language)}
                onPress={() => setLanguageOpen(true)}
                divider
              />
              <SwitchRow
                icon={BarChart3}
                title="Usage analytics"
                subtitle="Help us improve the app"
                value={pending.analyticsEnabled ?? user.analyticsEnabled}
                onValueChange={(next) => setPreference({ analyticsEnabled: next })}
              />
            </Card>

            {/* Review aid, not a shipping feature: the demo account starts registered for every
                service, so this puts it back to a brand-new account's state. */}
            <SectionHeader title="For testing" style={styles.sectionGap} />
            <Card padded={false} style={styles.preferences}>
              <NavRow
                icon={RotateCcw}
                title="Unregister from all services"
                subtitle="So the registration screens can be walked through"
                onPress={confirmResetRegistrations}
              />
            </Card>

            <Button label="Log Out" icon={LogOut} variant="danger" onPress={confirmLogOut} style={styles.logout} />
            <Text style={styles.version}>App version {APP_VERSION}</Text>

            <BottomSheet
              visible={editing !== null}
              onClose={() => setEditing(null)}
              title={editing ? FIELD[editing].sheetTitle : undefined}
              footer={<Button label="Save" onPress={save} loading={saving} />}
            >
              {editing ? (
                <TextField
                  icon={FIELD[editing].icon}
                  placeholder={FIELD[editing].placeholder}
                  value={draft}
                  onChangeText={(text) => {
                    setDraft(text);
                    setError(null);
                  }}
                  error={error ?? undefined}
                  autoFocus
                  keyboardType={editing === 'phone' ? 'number-pad' : editing === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={editing === 'name' ? 'words' : 'none'}
                  maxLength={editing === 'phone' ? 10 : 80}
                />
              ) : null}
            </BottomSheet>

            <BottomSheet visible={languageOpen} onClose={() => setLanguageOpen(false)} title="Language">
              <View style={styles.languages}>
                {LANGUAGES.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.description}
                    description={option.label}
                    indicator="radio"
                    layout="compact"
                    selected={user.language === option.value}
                    onPress={() => {
                      setLanguageOpen(false);
                      if (option.value !== user.language) {
                        setPreference({ language: option.value });
                        if (option.value !== 'en') {
                          toast.show({ message: 'Saved. Translated screens arrive in a later release.' });
                        }
                      }
                    }}
                  />
                ))}
              </View>
            </BottomSheet>
          </>
        )}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  photo: {
    width: 82,
    height: 82,
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.color.background,
  },
  identityTitle: {
    ...theme.type.headline,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
  },
  identityBody: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  fields: {
    gap: theme.space.s,
  },
  fieldCard: {
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  fieldLabel: {
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
  },
  fieldValue: {
    ...theme.type.body,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  lockedCard: {
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.card,
    backgroundColor: theme.color.surfaceMuted,
  },
  lockedLabel: {
    ...theme.type.label,
    color: theme.color.textSecondary,
  },
  lockedNote: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    marginTop: 2,
  },
  sectionGap: {
    marginTop: theme.space.m,
  },
  preferences: {
    paddingHorizontal: theme.space.l,
  },
  logout: {
    marginTop: theme.space.m,
  },
  version: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    marginTop: theme.space.xs,
  },
  languages: {
    gap: theme.space.s + 2,
  },
});
