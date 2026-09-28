import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import { mockLpgHome } from '../../data/mock/mockLpg';
import theme from '../../theme';
import { openPhone } from '../contact';
import { formatTollFree } from './lpgFormat';

const COPIED_MS = 2000;

const STEPS = [
  'This will open your phone to call the IOCL number.',
  'Give a missed call to book your refill (as per IOCL process).',
  'After your missed call, come back here to enter your booking reference from the SMS you receive.',
];

type RequestRefillSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** The device can't place calls (e.g. the simulator). */
  onCallUnavailable: () => void;
};

// <RequestRefillSheet visible={open} onClose={close} onCallUnavailable={showToast} />
export default function RequestRefillSheet({ visible, onClose, onCallUnavailable }: RequestRefillSheetProps) {
  const phone = mockLpgHome.ioclBookingPhone;
  const [copied, setCopied] = useState(false);
  const awaitingReturn = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // flow.md: the sheet dismisses when the user comes back from the dialer.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && awaitingReturn.current) {
        awaitingReturn.current = false;
        onCloseRef.current();
      }
    });
    return () => subscription.remove();
  }, []);

  // The sheet is a modal, so a screen Toast would sit behind it: the copy icon turns into a tick instead.
  const copyNumber = async () => {
    await Clipboard.setStringAsync(formatTollFree(phone));
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  };

  const callNow = async () => {
    // Set before opening: iOS may background and resume the app before openURL resolves.
    awaitingReturn.current = true;
    if (!(await openPhone(phone))) {
      awaitingReturn.current = false;
      onCallUnavailable();
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} showClose>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Avatar icon="call" size="l" />
          <Text accessibilityRole="header" style={styles.title}>
            Call IOCL to book your refill
          </Text>
        </View>

        {/* Plain numbered instructions — not selectable, so no OptionCard (it's a radio). */}
        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View
              key={step}
              accessible
              accessibilityLabel={`Step ${index + 1}: ${step}`}
              style={styles.step}
            >
              <Avatar initials={String(index + 1)} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <Card tone="info" style={styles.numberCard}>
          <Avatar icon="call" tint={theme.lpg.color.surface} />
          <View style={styles.flex}>
            <Text style={styles.caption}>IOCL LPG Booking Number</Text>
            <Text selectable style={styles.number}>
              {formatTollFree(phone)}
            </Text>
          </View>
          <IconButton
            icon={copied ? 'checkmark' : 'copy-outline'}
            color={theme.lpg.color.primary}
            accessibilityLabel={copied ? 'IOCL number copied' : 'Copy IOCL number'}
            onPress={copyNumber}
          />
        </Card>

        <View style={styles.actions}>
          <Button label="Call now" icon="call" onPress={callNow} />
          <Button label="Cancel" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
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
    fontSize: theme.type.largeTitle.fontSize - theme.space.xs,
    color: theme.color.textPrimary,
    textAlign: 'center',
  },
  steps: {
    gap: theme.space.s + theme.space.xs,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  stepText: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    flex: 1,
  },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  number: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  actions: {
    gap: theme.space.s,
  },
});
