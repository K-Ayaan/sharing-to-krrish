// allset page.png — registration complete, MARCOFED ID issued. Fixed layout; the hills fill the
// leftover space and end above "Go to Home".
import * as Clipboard from 'expo-clipboard';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Check, Copy, Phone } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ErrorState from '../../components/ui/ErrorState';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import Landscape from '../../components/ui/Landscape';
import Screen from '../../components/ui/Screen';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { useCompleteOnboarding } from '../../navigation/OnboardingContext';
import { getProfile } from '../../services/userService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatPhone } from '../../utils/format';

export default function AllSet() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const toast = useToast();
  const completeOnboarding = useCompleteOnboarding();
  const profile = useQuery('profile', getProfile);
  const compact = height < 720;

  const copy = async (uid: string) => {
    await Clipboard.setStringAsync(uid);
    toast.show({ message: 'MARCOFED ID copied', tone: 'success' });
  };

  return (
    <Screen
      scroll={false}
      footer={
        <Button
          label="Go to Home"
          trailingIcon={ArrowRight}
          disabled={!profile.data}
          onPress={() => profile.data && completeOnboarding(profile.data.uid)}
        />
      }
      contentStyle={[styles.content, { paddingTop: insets.top + (compact ? theme.space.l : theme.space.xxl) }]}
    >
      <View style={[styles.badgeOuter, compact && styles.badgeOuterCompact]} accessibilityElementsHidden>
        <View style={styles.badgeMiddle}>
          <View style={styles.badgeInner}>
            <Check size={36} color={theme.color.onPrimary} strokeWidth={3} />
          </View>
        </View>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        You’re all set!
      </Text>
      <Text style={styles.subtitle}>Your account has been created successfully.</Text>

      {profile.data ? (
        <>
          <Card tone="success" style={styles.idCard}>
            <Text style={styles.idLabel}>YOUR MARCOFED ID</Text>
            <View style={styles.idRow}>
              <Text
                style={styles.id}
                adjustsFontSizeToFit
                numberOfLines={1}
                accessibilityLabel={`MARCOFED ID ${profile.data.uid.split('').join(' ')}`}
              >
                {profile.data.uid}
              </Text>
              <IconButton
                icon={Copy}
                label="Copy MARCOFED ID"
                variant="tinted"
                size={18}
                onPress={() => copy(profile.data!.uid)}
              />
            </View>
            <Text style={styles.idHint}>This is your unique ID for all MARCOFED services.</Text>
          </Card>

          <Card style={styles.aadhaarCard}>
            <IconTile
              icon={Phone}
              size="medium"
              bg={theme.pillarTint.livestock.tint}
              color={theme.color.alert.fg}
            />
            <View>
              <Text style={styles.aadhaarLabel}>Verified mobile number</Text>
              <Text style={styles.aadhaarValue}>{formatPhone(profile.data.phone)}</Text>
            </View>
          </Card>
        </>
      ) : profile.error ? (
        <ErrorState error={profile.error} onRetry={profile.refetch} what="your ID" />
      ) : (
        <View style={styles.idSkeleton}>
          <Skeleton height={118} radius={theme.radius.card} />
          <Skeleton height={70} radius={theme.radius.card} />
        </View>
      )}

      <Text style={styles.note}>
        Keep this ID safe — you’ll need it at the Kendra and for support.{'\n'}To sign in on another phone,
        just verify your phone number.
      </Text>

      <View style={styles.landscape} pointerEvents="none">
        <Landscape width={width} height={width * 0.36} spread="full" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0,
  },
  badgeOuter: {
    alignSelf: 'center',
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: theme.color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOuterCompact: {
    transform: [{ scale: 0.85 }],
  },
  badgeMiddle: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: theme.color.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.pillarTint.vandhan.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.type.display,
    fontSize: 28,
    lineHeight: 36,
    color: theme.color.textPrimary,
    textAlign: 'center',
    marginTop: theme.space.l,
  },
  subtitle: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: theme.space.xs,
  },
  idCard: {
    marginTop: theme.space.xl,
    paddingVertical: theme.space.l + 2,
    paddingHorizontal: theme.space.l + 4,
  },
  idLabel: {
    ...theme.type.label,
    fontSize: 11,
    color: theme.color.textSecondary,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    marginTop: theme.space.xs,
  },
  id: {
    flex: 1,
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 1,
    color: theme.color.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  idHint: {
    ...theme.type.caption,
    fontSize: 13,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  aadhaarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    marginTop: theme.space.m,
    paddingVertical: theme.space.m + 2,
  },
  aadhaarLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  aadhaarValue: {
    ...theme.type.body,
    fontSize: 15,
    color: theme.color.textPrimary,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  idSkeleton: {
    marginTop: theme.space.xl,
    gap: theme.space.m,
  },
  note: {
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 20,
    color: theme.color.textSecondary,
    textAlign: 'center',
    marginTop: theme.space.l,
  },
  landscape: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginHorizontal: -theme.size.screenPadding,
    marginTop: theme.space.m,
  },
});
