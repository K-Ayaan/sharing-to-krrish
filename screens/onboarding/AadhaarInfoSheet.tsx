import type { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppearance } from '../../components/ui/Appearance';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import Thumbnail from '../../components/ui/Thumbnail';
import theme from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

const REASONS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'person-outline',
    title: 'One account per person',
    body: 'Your Aadhaar number links you to your MARCOFED account, so you have a single account across all services.',
  },
  {
    icon: 'phone-portrait-outline',
    title: 'Get back into your account',
    body: 'Enter the same Aadhaar number on a new phone and you will be signed back into your existing account.',
  },
  {
    icon: 'information-circle-outline',
    title: 'Not used for verification',
    body: 'We do not verify your Aadhaar with an OTP or biometrics. We only check that the number is valid and use it to find your account.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Stored securely',
    body: 'Only a masked Aadhaar number and an account reference are kept, handled as per the Aadhaar Act, 2016 and applicable data protection guidelines.',
  },
];

const CONTENT_MAX_HEIGHT_RATIO = 0.7;
const CONTENT_MAX_HEIGHT = Dimensions.get('window').height * CONTENT_MAX_HEIGHT_RATIO;

type AadhaarInfoSheetProps = {
  visible: boolean;
  onClose: () => void;
};

// <AadhaarInfoSheet visible={open} onClose={() => setOpen(false)} />
export default function AadhaarInfoSheet({ visible, onClose }: AadhaarInfoSheetProps) {
  const { color } = useAppearance();
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Why do we need this?" showClose>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {REASONS.map((reason) => (
          <View
            key={reason.title}
            accessible
            accessibilityLabel={`${reason.title}. ${reason.body}`}
            style={styles.reason}
          >
            <Thumbnail
              uri={null}
              fallbackIcon={reason.icon}
              iconColor={color.primary}
              tint={color.primaryTint}
            />
            <View style={styles.text}>
              <Text style={[styles.title, { color: color.textPrimary }]}>{reason.title}</Text>
              <Text style={[styles.body, { color: color.textSecondary }]}>{reason.body}</Text>
            </View>
          </View>
        ))}
        <Button label="Close" variant="secondary" onPress={onClose} />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: CONTENT_MAX_HEIGHT,
  },
  content: {
    gap: theme.space.l,
    paddingBottom: theme.space.s,
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  text: {
    flex: 1,
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.headline,
  },
  body: {
    ...theme.type.body,
  },
});
