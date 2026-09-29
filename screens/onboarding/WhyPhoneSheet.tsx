// aadhaar login-why do we need this.png, reworked for the phone number (Aadhaar was dropped from
// onboarding on 23 Sep 2026).
import { StyleSheet, Text, View } from 'react-native';
import { Landmark, Lock, Phone, ShieldCheck } from 'lucide-react-native';
import BottomSheet from '../../components/ui/BottomSheet';
import IconTile from '../../components/ui/IconTile';
import type { IconComponent } from '../../components/ui/icons';
import type { SheetProps } from '../../navigation/types';
import theme from '../../theme';

type Reason = { icon: IconComponent; title: string; body: string; warm?: boolean };

const REASONS: Reason[] = [
  { icon: ShieldCheck, title: 'Verify your identity', body: 'The OTP we send confirms this number is yours.' },
  { icon: Landmark, title: 'Enable government services', body: 'Allows you to access schemes and benefits meant for you.' },
  {
    icon: Phone,
    title: 'How MARCOFED reaches you',
    body: 'Rate changes, delivery updates and alerts come to this number.',
    warm: true,
  },
  {
    icon: Lock,
    title: 'Stored securely',
    body: 'Your information is stored safely and used only for authorized government purposes.',
  },
];

export default function WhyPhoneSheet({ visible, onClose }: SheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Why do we need this?">
      <View style={styles.list}>
        {REASONS.map((reason) => (
          <View key={reason.title} style={styles.row} accessible accessibilityLabel={`${reason.title}. ${reason.body}`}>
            <IconTile
              icon={reason.icon}
              size="large"
              bg={reason.warm ? theme.color.status.pendingBg : theme.color.primaryTint}
              color={theme.color.primary}
            />
            <View style={styles.text}>
              <Text style={styles.title}>{reason.title}</Text>
              <Text style={styles.body}>{reason.body}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.privacy}>
        <ShieldCheck size={22} color={theme.color.primary} strokeWidth={2} fill={theme.color.primary} />
        <Text style={styles.privacyText}>Your privacy is our priority.</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.space.l + 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l + 4,
  },
  text: {
    flex: 1,
  },
  title: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 21,
    color: theme.color.textPrimary,
  },
  body: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m + 2,
    marginTop: theme.space.xl,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.l,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.primarySoft,
  },
  privacyText: {
    ...theme.type.body,
    color: theme.color.textPrimary,
  },
});
