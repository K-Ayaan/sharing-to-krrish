import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import PhotoCarousel from '../../components/ui/PhotoCarousel';
import StatusPill from '../../components/ui/StatusPill';
import Toast from '../../components/ui/Toast';
import { enquiryMessage, getStockItem, recordEnquiry } from '../../data/mock/mockLivestock';
import type { LivestockScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { CALL_UNAVAILABLE, openPhone, openWhatsApp, WHATSAPP_UNAVAILABLE } from '../contact';
import { formatDateTime } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { enquiryLabels, sexIcon, speciesIcon, WEIGHT_ICON } from './livestockFormat';

// Enquiry-only by design (flow.md): the only actions hand off to Phone and WhatsApp.
export default function StockDetails({ route }: LivestockScreenProps<'StockDetails'>) {
  const item = getStockItem(route.params.stockId);
  const [toast, setToast] = useState<string | null>(null);

  if (!item) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>This stock is no longer shown.</Text>
        </Card>
      </ScrollView>
    );
  }

  const labels = enquiryLabels(item);

  // An enquiry is recorded only once the hand-off actually opens: a failed hand-off
  // (no phone, WhatsApp missing) means no enquiry happened, so Records shows nothing.
  const call = async () => {
    if (!(await openPhone(item.centre.salesPhone))) {
      setToast(CALL_UNAVAILABLE);
      return;
    }
    void recordEnquiry({ stockId: item.id, channel: 'call' });
  };

  const messageOnWhatsApp = async () => {
    if (!(await openWhatsApp(item.centre.salesPhone, enquiryMessage(item, labels)))) {
      setToast(WHATSAPP_UNAVAILABLE);
      return;
    }
    void recordEnquiry({ stockId: item.id, channel: 'whatsapp' });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <PhotoCarousel
          photos={item.photos}
          fallbackIcon={pillarMeta.livestock.icon}
          iconColor={pillarMeta.livestock.colors.icon}
          tint={pillarMeta.livestock.colors.tint}
          accessibilityLabel={`Photos of stock ${item.id}`}
        />

        <View style={styles.headerRow}>
          <Text accessibilityRole="header" style={[styles.id, styles.flex]}>
            Stock {item.id}
          </Text>
          <StatusPill label="Available" tone="success" />
        </View>

        <Card>
          <DetailRow icon={speciesIcon[item.species]} label="Species" value={labels.species} divider />
          <DetailRow icon={sexIcon[item.sex]} label="Sex" value={labels.sex} divider />
          <DetailRow icon={WEIGHT_ICON} label="Weight range" value={labels.weight} divider />
          <DetailRow
            icon="layers-outline"
            label="Quantity available"
            value={String(item.quantityAvailable)}
            divider
          />
          <DetailRow
            icon="location"
            label="Collection centre"
            value={item.centre.name}
            detail={`${item.centre.address.line1}, ${item.centre.address.line2}`}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Additional information</Text>
          <DetailRow icon="time" label="Last updated" value={formatDateTime(item.updatedAt)} divider />
          <DetailRow icon="people" label="Available to" value={item.availableTo} />
        </Card>

        <Card tone="info" style={styles.infoRow}>
          <Avatar icon="information" iconColor={theme.color.background} tint={theme.color.primary} />
          <Text style={[styles.secondary, styles.flex]}>
            This stock is shown for enquiries only. To ask about it, contact the MARCOFED livestock
            team at {item.centre.name} by phone or WhatsApp.
          </Text>
        </Card>
      </ScrollView>

      {/* Equal weight on purpose: same variant, same flex, neither is the "main" action. */}
      <View style={styles.footer}>
        <Button label="Call" icon="call" onPress={call} style={styles.flex} />
        <Button label="WhatsApp" icon="logo-whatsapp" onPress={messageOnWhatsApp} style={styles.flex} />
      </View>

      <Toast
        visible={toast !== null}
        message={toast ?? ''}
        onHide={() => setToast(null)}
        bottomOffset={theme.space.xl + theme.space.l}
      />
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
  flex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  id: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.color.border,
    backgroundColor: theme.color.background,
  },
});
