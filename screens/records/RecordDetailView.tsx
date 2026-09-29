// record-detail.png — one record from any service: what it is, where it stands, the details, and
// a way to get help (SDD S-06: a control that places a call). Shared by Records › Record Details
// and Van Dhan › Collection.
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Award, Headphones, Leaf, MessageCircleQuestion, Phone } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import BottomSheet from '../../components/ui/BottomSheet';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ErrorState from '../../components/ui/ErrorState';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonDetail } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import Thumbnail from '../../components/ui/Thumbnail';
import { getRecord, type RecordDetail } from '../../services/recordsService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { speciesIcon } from '../livestock/livestockFormat';
import { pillarMeta } from '../pillarMeta';
import { produceLook } from '../vandhan/vanDhanFormat';
import { detailIcon, recordTone } from './recordFormat';

export type RecordDetailViewProps = {
  recordId: string;
  onBack: () => void;
  onAskUs: () => void;
  onOpenCertificate: (batchId: string) => void;
};

function RecordThumb({ record }: { record: RecordDetail }) {
  const thumb = record.thumb;
  if (thumb.type === 'produce') {
    const look = produceLook[thumb.glyph];
    return <Thumbnail icon={look.icon} bg={look.bg} color={look.fg} size={80} />;
  }
  if (thumb.type === 'species') {
    const tint = theme.speciesTint[thumb.species];
    return <Thumbnail icon={speciesIcon[thumb.species]} bg={tint.bg} color={tint.fg} size={80} />;
  }
  const meta = pillarMeta[record.pillar];
  return (
    <Thumbnail
      icon={meta.icon}
      bg={theme.pillarTint[record.pillar].tint}
      color={theme.pillarTint[record.pillar].icon}
      size={80}
    />
  );
}

export default function RecordDetailView({ recordId, onBack, onAskUs, onOpenCertificate }: RecordDetailViewProps) {
  const record = useQuery(`records:detail:${recordId}`, () => getRecord(recordId));
  const profile = useQuery('profile', getProfile);
  const [helpOpen, setHelpOpen] = useState(false);
  const data = record.data;
  const kendra = profile.data?.kendra;

  return (
    <Screen
      refreshing={record.refreshing}
      onRefresh={record.refresh}
      header={<ScreenHeader layout="inline" title="Record Details" onBack={onBack} />}
      contentStyle={styles.content}
    >
      {!data ? (
        record.error ? (
          <ErrorState error={record.error} onRetry={record.refetch} what="this record" />
        ) : (
          <SkeletonDetail />
        )
      ) : (
        <>
          <Card>
            <View style={styles.summary}>
              <RecordThumb record={data} />
              <View style={styles.summaryText}>
                <Text style={styles.pillar}>{pillarMeta[data.pillar].label}</Text>
                <Text style={styles.heading}>{data.heading}</Text>
                <Text style={styles.kind}>{data.kindLabel}</Text>
              </View>
              <StatusPill tone={recordTone(data)} label={data.statusLabel} size="small" style={styles.pill} />
            </View>
            {data.banner ? (
              <View style={styles.banner}>
                <Leaf size={20} color={theme.pillarTint.vandhan.icon} strokeWidth={2} />
                <Text style={styles.bannerText}>{data.banner}</Text>
              </View>
            ) : null}
          </Card>

          <View style={styles.tracker}>
            <StatusTracker steps={data.steps} />
          </View>

          {data.note ? (
            <Banner
              tone={data.note.tone === 'alert' ? 'alert' : 'info'}
              title={data.note.tone === 'alert' ? 'Reason' : 'Note'}
              body={data.note.text}
            />
          ) : null}

          <SectionHeader title="Details" />
          <Card style={styles.detailsCard}>
            {data.details.map((detail, index) => (
              <DetailRow
                key={detail.label}
                icon={detailIcon[detail.icon]}
                label={detail.label}
                value={detail.value}
                divider={index < data.details.length - 1}
              />
            ))}
          </Card>

          {data.certificateBatchId ? (
            <Card padded={false} style={styles.linkCard}>
              <ListRow
                title="Fitness certificate"
                subtitle="Recorded against this batch by the veterinary officer"
                leading={<IconTile icon={Award} size="medium" />}
                onPress={() => onOpenCertificate(data.certificateBatchId!)}
              />
            </Card>
          ) : null}

          <Card padded={false} style={styles.linkCard}>
            <ListRow
              title="Need help with this record?"
              subtitle="Contact your Kendra or support team"
              leading={<IconTile icon={Headphones} size="medium" bg={theme.color.surfaceMuted} color={theme.color.textPrimary} />}
              onPress={() => setHelpOpen(true)}
            />
          </Card>
          <Text style={styles.reference}>Keep the reference ID ready when you call.</Text>
        </>
      )}

      <BottomSheet visible={helpOpen} onClose={() => setHelpOpen(false)} title="Get help with this record">
        {kendra ? (
          <ListRow
            title={`Call ${kendra.name}`}
            subtitle="Your Kendra can check and correct entries"
            leading={<IconTile icon={Phone} size="medium" />}
            divider
            onPress={() => {
              setHelpOpen(false);
              Linking.openURL(`tel:${kendra.phone}`);
            }}
          />
        ) : null}
        <ListRow
          title="MARCOFED support"
          subtitle="Helpline and common questions"
          leading={<IconTile icon={MessageCircleQuestion} size="medium" />}
          onPress={() => {
            setHelpOpen(false);
            onAskUs();
          }}
        />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m + 2,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.l,
  },
  summaryText: {
    flex: 1,
    paddingTop: 2,
  },
  pillar: {
    ...theme.type.caption,
    fontSize: 13,
    color: theme.color.textSecondary,
  },
  heading: {
    ...theme.type.headline,
    fontSize: 19,
    lineHeight: 26,
    color: theme.color.textPrimary,
    marginTop: 2,
  },
  kind: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  pill: {
    alignSelf: 'flex-start',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    marginTop: theme.space.l,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.surfaceMuted,
  },
  bannerText: {
    flex: 1,
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
  },
  tracker: {
    paddingVertical: theme.space.s,
  },
  detailsCard: {
    paddingVertical: theme.space.xs,
  },
  linkCard: {
    paddingHorizontal: theme.space.l,
  },
  reference: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    textAlign: 'center',
  },
});
