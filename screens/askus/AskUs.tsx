// askus-page.png, completed against SDD S-06 (how to reach the Federation, with a control that
// places a call) and the one-pager's "three front doors": the same services by WhatsApp or a
// plain phone call, for anyone who'd rather not use the app.
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import {
  Clock,
  CreditCard,
  FileText,
  Headphones,
  IndianRupee,
  MapPin,
  Phone,
  PhoneCall,
  Store,
  Users,
} from 'lucide-react-native';
import Accordion from '../../components/ui/Accordion';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonCards, SkeletonList } from '../../components/ui/Skeleton';
import { WhatsAppIcon, type IconComponent } from '../../components/ui/icons';
import type { FaqTopic } from '../../data/mock/mockSupport';
import { getSupport } from '../../services/supportService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';

const FAQ_ICON: Record<FaqTopic, IconComponent> = {
  register: FileText,
  aadhaar: CreditCard,
  multiple: Users,
  approval: Clock,
  fee: IndianRupee,
  village: MapPin,
};

export default function AskUs() {
  const support = useQuery('support', getSupport);
  const [open, setOpen] = useState<string | null>('faq-register');

  return (
    <Screen
      inTabs
      refreshing={support.refreshing}
      onRefresh={support.refresh}
      header={<ScreenHeader layout="hero" title="Ask Us" landscape="green" />}
      contentStyle={styles.content}
    >
      <AsyncContent
        query={support}
        what="help"
        skeleton={
          <>
            <SkeletonCards count={1} height={190} />
            <SkeletonList count={4} thumb={42} lines={1} />
          </>
        }
      >
        {(data) => (
          <>
            <Card tone="success" padded={false} style={styles.helpCard}>
              <View style={styles.helpTop}>
                <View style={styles.helpIcon}>
                  <Headphones size={30} color={theme.color.primary} strokeWidth={2} />
                </View>
                <View style={styles.flex}>
                  <Text accessibilityRole="header" style={styles.helpTitle}>
                    Need help? Talk to us
                  </Text>
                  <Text style={styles.helpBody}>Our support team is ready to assist you with any questions or issues.</Text>
                </View>
              </View>
              <Button
                label="Call Support"
                icon={Phone}
                onPress={() => Linking.openURL(`tel:${data.phone}`)}
                style={styles.callButton}
              />
              <View style={styles.hours}>
                <Clock size={14} color={theme.color.textSecondary} strokeWidth={2} />
                <Text style={styles.hoursText}>{data.hours}</Text>
              </View>
            </Card>

            <Card padded={false} style={styles.listCard}>
              <ListRow
                title={`Call ${data.kendra.name}`}
                subtitle="Your Kendra can check entries, weights and payments"
                leading={<IconTile icon={Store} size="medium" />}
                divider
                onPress={() => Linking.openURL(`tel:${data.kendra.phone}`)}
              />
              <ListRow
                title="Chat on WhatsApp"
                subtitle="Book, check status and get alerts by message"
                leading={<IconTile icon={WhatsAppIcon} size="medium" />}
                divider
                onPress={() => Linking.openURL(`https://wa.me/${data.whatsapp}`)}
              />
              <ListRow
                title="MARCOFED voice line"
                subtitle="Works on any phone — no app or internet needed"
                leading={<IconTile icon={PhoneCall} size="medium" />}
                onPress={() => Linking.openURL(`tel:${data.voiceLine}`)}
              />
            </Card>

            <SectionHeader title="Frequently Asked Questions" style={styles.sectionHeader} />
            <View style={styles.faqs}>
              {data.faqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  icon={FAQ_ICON[faq.topic]}
                  title={faq.question}
                  expanded={open === faq.id}
                  onToggle={() => setOpen(open === faq.id ? null : faq.id)}
                >
                  <Text style={styles.answer}>{faq.answer}</Text>
                </Accordion>
              ))}
            </View>
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
  helpCard: {
    padding: theme.space.l,
  },
  helpTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  helpIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    ...theme.type.headline,
    fontSize: 18,
    lineHeight: 25,
    color: theme.color.textPrimary,
  },
  helpBody: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  callButton: {
    marginTop: theme.space.l,
  },
  hours: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.space.m,
  },
  hoursText: {
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
  sectionHeader: {
    marginTop: theme.space.s,
  },
  faqs: {
    gap: theme.space.s,
  },
  answer: {
    ...theme.type.body,
    lineHeight: 21,
    color: theme.color.textSecondary,
  },
});
