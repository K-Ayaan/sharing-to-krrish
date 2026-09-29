// SPEC-ONLY — SDD S-34. No mockup was supplied. Every complaint with its reference, what it was
// about, where it sits now, and the escalation path (§4.3.4): the distributor first, then the
// Federation's LPG Section.
import { StyleSheet, Text, View } from 'react-native';
import { ArrowUpRight, MessageSquarePlus, MessageSquareWarning } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StatusPill, { type StatusTone } from '../../components/ui/StatusPill';
import Tag from '../../components/ui/Tag';
import { COMPLAINT_CATEGORIES, type Complaint } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import { getComplaints } from '../../services/lpgService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

const STATUS: Record<Complaint['status'], { tone: StatusTone; label: string }> = {
  open: { tone: 'pending', label: 'Open' },
  in_review: { tone: 'progress', label: 'In Review' },
  closed: { tone: 'verified', label: 'Closed' },
};

export default function LpgMyComplaints({ navigation }: LpgScreenProps<'LpgMyComplaints'>) {
  const complaints = useQuery('lpg:complaints', getComplaints);

  return (
    <Screen
      background={theme.pillarTint.lpg.canvas}
      refreshing={complaints.refreshing}
      onRefresh={complaints.refresh}
      header={<ScreenHeader layout="bar" title="My Complaints" onBack={navigation.goBack} />}
      footer={
        <Button
          label="Raise a complaint"
          icon={MessageSquarePlus}
          variant="pillar"
          pillarColor="lpg"
          onPress={() => navigation.navigate('LpgRaiseComplaint')}
        />
      }
      contentStyle={styles.content}
    >
      <AsyncContent
        query={complaints}
        what="your complaints"
        skeleton={<SkeletonCards count={2} height={140} />}
        isEmpty={(items) => items.length === 0}
        empty={
          <EmptyState
            icon={MessageSquareWarning}
            title="No complaints"
            body="If a refill doesn’t arrive, arrives late, is underweight or costs more than the bill, raise it here."
          />
        }
      >
        {(items) => (
          <View style={styles.list}>
            {items.map((item) => {
              const status = STATUS[item.status];
              return (
                <Card
                  key={item.id}
                  accessibilityLabel={`${item.reference}, ${status.label}`}
                  onPress={() =>
                    navigation.navigate('RecordsTab', {
                      screen: 'RecordDetail',
                      params: { recordId: `complaint:${item.id}` },
                      initial: false,
                    })
                  }
                >
                  <View style={styles.top}>
                    <Text style={styles.reference}>{item.reference}</Text>
                    <StatusPill tone={status.tone} label={status.label} size="small" />
                  </View>
                  <Text style={styles.title}>
                    {COMPLAINT_CATEGORIES.find((c) => c.value === item.category)?.label}
                  </Text>
                  <Text style={styles.body}>{item.description}</Text>
                  <View style={styles.tags}>
                    <Tag label={item.bookingReference ?? 'My connection'} pillar="lpg" />
                    {item.escalated ? (
                      <View style={styles.escalated}>
                        <ArrowUpRight size={14} color={theme.color.alert.fg} strokeWidth={2.25} />
                        <Text style={styles.escalatedText}>Escalated</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.footer}>
                    <Text style={styles.footerLabel}>Raised {formatDate(item.raisedAt)}</Text>
                  </View>
                  <Text style={styles.note}>{item.note}</Text>
                </Card>
              );
            })}
          </View>
        )}
      </AsyncContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  list: {
    gap: theme.space.m,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reference: {
    ...theme.type.captionStrong,
    color: theme.pillarTint.lpg.icon,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  title: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.color.textPrimary,
    marginTop: theme.space.s,
  },
  body: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.s,
    marginTop: theme.space.m,
  },
  escalated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.space.s + 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.alert.bg,
  },
  escalatedText: {
    ...theme.type.captionStrong,
    color: theme.color.alert.fg,
  },
  footer: {
    marginTop: theme.space.m,
    paddingTop: theme.space.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.color.border,
  },
  footerLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  note: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    marginTop: 2,
  },
});
