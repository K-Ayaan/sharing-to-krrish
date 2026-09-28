import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/ui/Card';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import DetailRow from '../../components/ui/DetailRow';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { getKendra, getRegisteredKendra } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import {
  CALL_UNAVAILABLE,
  MAPS_UNAVAILABLE,
  formatPhoneDisplay,
  kendraMapQuery,
  openMaps,
  openPhone,
} from './vanDhanFormat';

// Shows a kendra: the one a collection is going to when opened from CollectionSubmitted, otherwise the
// one the producer chose when registering for Van Dhan.
export default function KendraInfo({ route }: VanDhanScreenProps<'KendraInfo'>) {
  const kendraId = route.params?.kendraId;
  const kendra = kendraId ? getKendra(kendraId) : getRegisteredKendra();
  const [toast, setToast] = useState<string | null>(null);

  if (!kendra) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>No kendra is linked to your Van Dhan registration.</Text>
        </Card>
      </ScrollView>
    );
  }

  const call = async () => {
    if (!(await openPhone(kendra.phone))) setToast(CALL_UNAVAILABLE);
  };

  const openDirections = async () => {
    if (!(await openMaps(kendraMapQuery(kendra)))) setToast(MAPS_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <ScenicBackdrop />
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
                color={theme.vandhan.color.primary}
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
            iconColor={theme.vandhan.color.primary}
            iconBackground={theme.vandhan.color.primaryTint}
            title="Get directions"
            onPress={openDirections}
            style={styles.tinted}
          />
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
  name: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  tinted: {
    backgroundColor: theme.vandhan.color.primaryTint,
  },
});
