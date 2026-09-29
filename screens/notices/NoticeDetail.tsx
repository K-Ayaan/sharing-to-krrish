// notice-detail.png — one notice in full. Beyond the mockup, only what helps someone act on it:
// the key facts at a glance, a way into the related service, sharing (notices get forwarded on
// WhatsApp), and who issued it.
import { useEffect } from 'react';
import { Linking, Share, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Download,
  FileText,
  Leaf,
  MapPin,
  Share2,
  Users,
} from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ErrorState from '../../components/ui/ErrorState';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import Landscape from '../../components/ui/Landscape';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonDetail } from '../../components/ui/Skeleton';
import Tag from '../../components/ui/Tag';
import { useToast } from '../../components/ui/Toast';
import type { IconComponent } from '../../components/ui/icons';
import type { NoticeCategory, NoticeFact } from '../../data/mock/mockNotices';
import type { PillarKey } from '../../data/mock/mockUser';
import type { NoticesScreenProps } from '../../navigation/types';
import { getNotice, markNoticeRead } from '../../services/noticesService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { formatDate } from '../../utils/format';
import { pillarMeta } from '../pillarMeta';
import { openPillar } from '../services/openPillar';
import { noticeLook } from './noticeFormat';

const FACT_ICON: Record<NoticeFact['kind'], IconComponent> = {
  when: CalendarDays,
  where: MapPin,
  who: Users,
  bring: Briefcase,
};

const FACT_LABEL: Record<NoticeFact['kind'], string> = {
  when: 'When',
  where: 'Where',
  who: 'For',
  bring: 'Bring',
};

// Notices about a service link straight into it.
const RELATED_PILLAR: Partial<Record<NoticeCategory, PillarKey>> = {
  vandhan: 'vandhan',
  lpg: 'lpg',
  livestock: 'livestock',
  microfinance: 'microfinance',
};

export default function NoticeDetail({ navigation, route }: NoticesScreenProps<'NoticeDetail'>) {
  const { noticeId } = route.params;
  const { width } = useWindowDimensions();
  const toast = useToast();
  const notice = useQuery(`notice:${noticeId}`, () => getNotice(noticeId));
  const profile = useQuery('profile', getProfile);
  const data = notice.data;

  useEffect(() => {
    markNoticeRead(noticeId);
  }, [noticeId]);

  const share = () => {
    if (!data) return;
    Share.share({ message: `${data.title}\n\n${data.summary}\n\n— ${data.issuer}, via MARCOFED` }).catch(() => {});
  };

  const openAttachment = () => {
    if (data?.attachment?.url) Linking.openURL(data.attachment.url);
    else toast.show({ message: 'This attachment isn’t available to download yet.', tone: 'info' });
  };

  const related = data ? RELATED_PILLAR[data.category] : undefined;
  const relatedRegistered = related ? Boolean(profile.data?.registrations[related]) : false;
  const look = data ? noticeLook[data.category] : null;

  return (
    <Screen
      refreshing={notice.refreshing}
      onRefresh={notice.refresh}
      header={
        <ScreenHeader
          layout="inline"
          title="Notice"
          onBack={navigation.goBack}
          right={data ? <IconButton icon={Share2} label="Share notice" onPress={share} /> : null}
        />
      }
      contentStyle={styles.content}
    >
      {!data || !look ? (
        notice.error ? (
          <ErrorState error={notice.error} onRetry={notice.refetch} what="this notice" />
        ) : (
          <SkeletonDetail />
        )
      ) : (
        <>
          <Card padded={false} style={styles.hero}>
            <View style={styles.heroArt} pointerEvents="none">
              <Landscape
                width={width - theme.size.screenPadding * 2}
                height={70}
                tone={data.category === 'weather' ? 'peach' : 'green'}
                spread="right"
                birds={false}
              />
            </View>
            <View style={styles.heroBody}>
              <View style={styles.heroTop}>
                <IconTile icon={look.icon} bg={look.bg} color={look.fg} shape="rounded" size="large" />
                <View style={styles.heroTopText}>
                  <Text style={styles.kicker}>OFFICIAL NOTICE</Text>
                  {related ? <Tag label={pillarMeta[related].label} pillar={related} style={styles.heroTag} /> : null}
                </View>
              </View>
              <Text accessibilityRole="header" style={styles.title}>
                {data.title}
              </Text>
              <Text style={styles.meta}>
                {formatDate(data.publishedAt)} • {data.issuer}
              </Text>
            </View>
          </Card>

          {data.facts.length > 0 ? (
            <View style={styles.facts}>
              {data.facts.map((fact) => {
                const Icon = FACT_ICON[fact.kind];
                return (
                  <View
                    key={fact.kind}
                    accessible
                    accessibilityLabel={`${FACT_LABEL[fact.kind]}: ${fact.value}`}
                    style={styles.fact}
                  >
                    <View style={styles.factIcon}>
                      <Icon size={15} color={theme.color.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.factText}>
                      <Text style={styles.factLabel}>{FACT_LABEL[fact.kind]}</Text>
                      <Text style={styles.factValue}>{fact.value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {data.tagline ? (
            <View style={styles.tagline}>
              <View style={styles.taglineIcon}>
                <Leaf size={17} color={theme.pillarTint.vandhan.icon} strokeWidth={2} />
              </View>
              <Text style={styles.taglineText}>{data.tagline}</Text>
            </View>
          ) : null}

          <View style={styles.body}>
            {data.body.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph.map((run, runIndex) => (
                  <Text key={runIndex} style={run.bold ? styles.bold : undefined}>
                    {run.text}
                  </Text>
                ))}
              </Text>
            ))}
          </View>

          {data.attachment ? (
            <Card padded={false} style={styles.attachment}>
              <ListRow
                title={data.attachment.name}
                subtitle={`${data.attachment.sizeLabel} • PDF`}
                leading={<IconTile icon={FileText} size="medium" />}
                trailing={<Download size={20} color={theme.color.primary} strokeWidth={2} />}
                affordance="none"
                onPress={openAttachment}
                accessibilityLabel={`Download ${data.attachment.name}, ${data.attachment.sizeLabel}`}
              />
            </Card>
          ) : null}

          {related ? (
            <Button
              label={relatedRegistered ? `Open ${pillarMeta[related].label}` : `Register for ${pillarMeta[related].label}`}
              trailingIcon={ArrowRight}
              variant={related === 'lpg' ? 'pillar' : 'secondary'}
              pillarColor={related === 'lpg' ? 'lpg' : undefined}
              onPress={() => openPillar(navigation, related, relatedRegistered)}
            />
          ) : null}

          <View style={styles.issuer}>
            <BadgeCheck size={20} color={theme.pillarTint.vandhan.icon} strokeWidth={2} />
            <View style={styles.issuerText}>
              <Text style={styles.issuerTitle}>Issued by {data.issuer}</Text>
              <Text style={styles.issuerBody}>
                Verified notice, sent through MARCOFED. MARCOFED never asks for OTPs or payments in a notice.
              </Text>
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.l,
  },
  hero: {
    overflow: 'hidden',
  },
  heroArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroBody: {
    paddingHorizontal: theme.space.l,
    paddingTop: theme.space.l,
    paddingBottom: 58,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  heroTopText: {
    flex: 1,
  },
  kicker: {
    ...theme.type.label,
    letterSpacing: 2,
    color: theme.pillarTint.vandhan.icon,
  },
  heroTag: {
    marginTop: theme.space.xs,
  },
  title: {
    ...theme.type.title,
    fontSize: 21,
    lineHeight: 28,
    color: theme.color.textPrimary,
    marginTop: theme.space.m,
  },
  meta: {
    ...theme.type.caption,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.s,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    flexGrow: 1,
    flexBasis: '46%',
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s + 2,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  factIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    flex: 1,
  },
  factLabel: {
    ...theme.type.label,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    color: theme.color.textTertiary,
  },
  factValue: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.primarySoft,
  },
  taglineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.color.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    flex: 1,
    ...theme.type.body,
    color: theme.color.primary,
  },
  body: {
    gap: theme.space.l,
  },
  paragraph: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 24,
    color: theme.color.textPrimary,
  },
  bold: {
    fontWeight: '700',
  },
  attachment: {
    paddingHorizontal: theme.space.l,
  },
  issuer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surfaceMuted,
  },
  issuerText: {
    flex: 1,
  },
  issuerTitle: {
    ...theme.type.captionStrong,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textPrimary,
  },
  issuerBody: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
});
