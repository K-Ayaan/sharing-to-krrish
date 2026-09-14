import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { mockKendra } from '../../data/mock/mockVanDhan';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { CALL_UNAVAILABLE, formatPhoneDisplay, openPhone } from './vanDhanFormat';

export default function KendraInfo() {
  const kendra = mockKendra;
  const [toast, setToast] = useState<string | null>(null);

  const call = async () => {
    if (!(await openPhone(kendra.phone))) setToast(CALL_UNAVAILABLE);
  };

  // Hands off to Apple Maps — no in-app map screen.
  const openDirections = () => {
    const query = `${kendra.name}, ${kendra.address.line1}, ${kendra.address.line2} ${kendra.address.pincode}`;
    Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(query)}`).catch(() =>
      setToast("Maps isn't available on this device.")
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Thumbnail
          uri={kendra.photoUrl}
          fallbackIcon="business"
          iconColor={pillarMeta.vandhan.colors.icon}
          tint={pillarMeta.vandhan.colors.tint}
          size="banner"
          accessibilityLabel={`Photo of ${kendra.name}`}
        />

        <Text accessibilityRole="header" style={styles.name}>
          {kendra.name}
        </Text>

        <View>
          <DetailRow
            icon="location"
            value={kendra.address.line1}
            detail={`${kendra.address.line2} – ${kendra.address.pincode}`}
          />
          <DetailRow
            icon="call"
            value={formatPhoneDisplay(kendra.phone)}
            trailing={
              <IconButton
                icon="call"
                color={theme.color.primary}
                accessibilityLabel={`Call ${kendra.name}`}
                onPress={call}
              />
            }
          />
          <DetailRow icon="time" value={kendra.hours} />
        </View>

        <Card tone="info" padded={false}>
          <ListRow
            icon="navigate"
            iconColor={theme.color.primary}
            iconBackground={theme.color.primaryTint}
            title="Get directions"
            onPress={openDirections}
            style={styles.tinted}
          />
        </Card>
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
    gap: theme.space.m,
  },
  name: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  tinted: {
    backgroundColor: theme.color.primaryTint,
  },
});
