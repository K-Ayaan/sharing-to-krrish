// SPEC-ONLY — SDD S-53. No mockup was supplied. The repayment schedule and what's been paid.
// Per SDD §4.5.4 a schedule only exists after sanction, so before that this screen says so plainly
// rather than showing invented instalments.
import { StyleSheet, Text, View } from 'react-native';
import { CalendarClock, Info, Wallet } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Banner from '../../components/ui/Banner';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StatusPill, { type StatusTone } from '../../components/ui/StatusPill';
import type { Repayment } from '../../data/mock/mockMicroFinance';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { getMfOverview } from '../../services/microFinanceService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate, formatINR } from '../../utils/format';

const STATUS: Record<Repayment['status'], { tone: StatusTone; label: string }> = {
  due: { tone: 'pending', label: 'Due' },
  scheduled: { tone: 'progress', label: 'Scheduled' },
  paid: { tone: 'verified', label: 'Paid' },
};

export default function MicroFinanceRepayments({ navigation }: MicroFinanceScreenProps<'MicroFinanceRepayments'>) {
  const overview = useQuery('microfinance:overview', getMfOverview);

  return (
    <Screen
      refreshing={overview.refreshing}
      onRefresh={overview.refresh}
      header={<ScreenHeader layout="bar" title="Repayments" onBack={navigation.goBack} />}
      contentStyle={styles.content}
    >
      <AsyncContent
        query={overview}
        what="your repayments"
        skeleton={<SkeletonCards count={2} height={110} />}
        isEmpty={(data) => data.repayments.length === 0}
        empty={
          <EmptyState
            icon={Wallet}
            title="No repayment schedule yet"
            body="Instalments are set once an application is sanctioned and the money is disbursed. Nothing is owed before then."
            actionLabel="See application status"
            onAction={() => navigation.navigate('MicroFinanceApplicationStatus')}
          />
        }
      >
        {(data) => {
          const paid = data.repayments.filter((r) => r.status === 'paid');
          const outstanding = data.repayments.filter((r) => r.status !== 'paid');
          const remaining = outstanding.reduce((sum, r) => sum + r.amount, 0);

          return (
            <>
              <Card tone="microfinance">
                <View style={styles.summaryRow}>
                  <IconTile icon={Wallet} pillar="microfinance" shape="rounded" size="xlarge" />
                  <View style={styles.flex}>
                    <Text style={styles.summaryLabel}>Still to repay</Text>
                    <Text style={styles.summaryValue}>{formatINR(remaining)}</Text>
                    <Text style={styles.summaryNote}>
                      {paid.length} of {data.repayments.length} instalments paid
                    </Text>
                  </View>
                </View>
              </Card>

              {outstanding.length > 0 ? (
                <>
                  <SectionHeader title="Coming up" style={styles.sectionHeader} />
                  <Card padded={false} style={styles.listCard}>
                    {outstanding.map((item, index) => (
                      <ListRow
                        key={item.id}
                        title={formatINR(item.amount)}
                        subtitle={`Due ${formatDate(item.dueAt)}`}
                        leading={<IconTile icon={CalendarClock} pillar="microfinance" size="medium" />}
                        trailing={<StatusPill tone={STATUS[item.status].tone} label={STATUS[item.status].label} size="small" />}
                        divider={index < outstanding.length - 1}
                      />
                    ))}
                  </Card>
                </>
              ) : null}

              {paid.length > 0 ? (
                <>
                  <SectionHeader title="Already paid" style={styles.sectionHeader} />
                  <Card padded={false} style={styles.listCard}>
                    {paid.map((item, index) => (
                      <ListRow
                        key={item.id}
                        title={formatINR(item.amount)}
                        subtitle={formatDate(item.dueAt)}
                        leading={<IconTile icon={CalendarClock} pillar="microfinance" size="medium" />}
                        trailing={<StatusPill tone="verified" label="Paid" size="small" />}
                        divider={index < paid.length - 1}
                      />
                    ))}
                  </Card>
                </>
              ) : null}

              <Banner
                tone="info"
                icon={Info}
                title="Paying an instalment"
                body="Repayments are collected by the lending partner, not in this app. This screen is your record of what's due and what's been paid."
              />
            </>
          );
        }}
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  summaryLabel: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  summaryValue: {
    ...theme.type.largeTitle,
    fontSize: 24,
    lineHeight: 31,
    color: theme.color.textPrimary,
  },
  summaryNote: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  sectionHeader: {
    marginTop: theme.space.s,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
});
