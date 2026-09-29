// SPEC-ONLY — SDD S-14. No mockup was supplied. Reference, category, current status and who it
// sits with, newest first.
import { StyleSheet, Text, View } from 'react-native';
import { MessageSquarePlus, MessagesSquare } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StatusPill, { type StatusTone } from '../../components/ui/StatusPill';
import { GRIEVANCE_CATEGORIES, type Grievance } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import { useQuery } from '../../services/useQuery';
import { getGrievances } from '../../services/vanDhanService';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

const STATUS: Record<Grievance['status'], { tone: StatusTone; label: string }> = {
  open: { tone: 'pending', label: 'Open' },
  in_review: { tone: 'progress', label: 'In Review' },
  closed: { tone: 'verified', label: 'Closed' },
};

export default function GrievanceStatus({ navigation }: VanDhanScreenProps<'VanDhanGrievanceStatus'>) {
  const grievances = useQuery('vandhan:grievances', getGrievances);

  return (
    <Screen
      refreshing={grievances.refreshing}
      onRefresh={grievances.refresh}
      header={<ScreenHeader layout="inline" title="My Grievances" subtitle="Van Dhan" onBack={navigation.goBack} />}
      footer={
        <Button
          label="Raise a grievance"
          icon={MessageSquarePlus}
          onPress={() => navigation.navigate('VanDhanRaiseGrievance')}
        />
      }
      contentStyle={styles.content}
    >
      <AsyncContent
        query={grievances}
        what="your grievances"
        skeleton={<SkeletonCards count={2} height={130} />}
        isEmpty={(items) => items.length === 0}
        empty={
          <EmptyState
            icon={MessagesSquare}
            title="No grievances"
            body="If you’re paid less than the notified rate, not paid, or have a weighing dispute, raise it here."
          />
        }
      >
        {(items) => (
          <View style={styles.list}>
            {items.map((item) => (
              <Card key={item.id} accessibilityLabel={`${item.reference}, ${STATUS[item.status].label}`}>
                <View style={styles.top}>
                  <Text style={styles.reference}>{item.reference}</Text>
                  <StatusPill tone={STATUS[item.status].tone} label={STATUS[item.status].label} size="small" />
                </View>
                <Text style={styles.title}>
                  {GRIEVANCE_CATEGORIES.find((c) => c.value === item.category)?.label}
                </Text>
                <Text style={styles.body}>{item.description}</Text>
                <View style={styles.footer}>
                  <Text style={styles.footerLabel}>With</Text>
                  <Text style={styles.footerValue}>{item.withWhom}</Text>
                </View>
                <Text style={styles.raised}>Raised {formatDate(item.raisedAt)}</Text>
              </Card>
            ))}
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space.m,
    paddingTop: theme.space.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.color.border,
  },
  footerLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  footerValue: {
    ...theme.type.captionStrong,
    color: theme.color.textPrimary,
  },
  raised: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
    marginTop: theme.space.xs,
  },
});
