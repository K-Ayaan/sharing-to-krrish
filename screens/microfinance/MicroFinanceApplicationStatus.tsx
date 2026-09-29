// SPEC-ONLY — SDD S-52. No mockup was supplied. Where the application sits: Received → Documents →
// Society recommendation → Appraisal → Sanction, with what's outstanding and where to raise a
// problem. This is the Micro-Finance hub screen, so it keeps the tab bar.
import { StyleSheet, Text, View } from 'react-native';
import {
  CalendarClock,
  FileCheck2,
  HandCoins,
  Info,
  MessageSquareWarning,
  Target,
  Wallet,
} from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import EmptyState from '../../components/ui/EmptyState';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import { StepList, type StepState } from '../../components/ui/StatusTracker';
import { LOAN_PURPOSES, STAGES, STAGE_LABEL, type ApplicationStage } from '../../data/mock/mockMicroFinance';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { getMfOverview } from '../../services/microFinanceService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate, formatINR } from '../../utils/format';

// What the citizen can do about each stage while it's the current one.
const STAGE_DETAIL: Record<ApplicationStage, string> = {
  received: 'Your application reached MARCOFED.',
  documents: 'Add the documents on the checklist.',
  society_recommendation: 'Your cooperative society is asked to recommend you.',
  appraisal: 'The Federation and lending partner review the application.',
  sanction: 'The outcome is recorded here. Nothing is promised.',
};

export default function MicroFinanceApplicationStatus({
  navigation,
}: MicroFinanceScreenProps<'MicroFinanceApplicationStatus'>) {
  const overview = useQuery('microfinance:overview', getMfOverview);

  return (
    <Screen
      inTabs
      refreshing={overview.refreshing}
      onRefresh={overview.refresh}
      header={<ScreenHeader layout="bar" title="Micro-Finance" scene="microfinance" onBack={navigation.goBack} />}
      contentStyle={styles.content}
    >
      <AsyncContent
        query={overview}
        what="your application"
        skeleton={<SkeletonCards count={2} height={200} />}
        isEmpty={(data) => data.application === null}
        empty={
          <EmptyState
            icon={HandCoins}
            title="No application yet"
            body="Tell us what you need and MARCOFED records your request and your society’s recommendation."
            actionLabel="Start an application"
            onAction={() => navigation.navigate('MicroFinanceApply')}
          />
        }
      >
        {(data) => {
          const application = data.application!;
          const currentIndex = STAGES.indexOf(application.stage);
          const outstanding = data.documents.filter((doc) => doc.receivedAt === null).length;
          const purposeLabel = LOAN_PURPOSES.find((p) => p.value === application.purpose)?.label ?? '';

          return (
            <>
              <Card padded={false} style={styles.headCard}>
                <View style={styles.headTop}>
                  <IconTile icon={HandCoins} pillar="microfinance" shape="rounded" size="xlarge" />
                  <View style={styles.flex}>
                    <Text style={styles.reference}>{application.reference}</Text>
                    <Text style={styles.amount}>{formatINR(application.amount)}</Text>
                    <Text style={styles.submitted}>Sent {formatDate(application.submittedAt)}</Text>
                  </View>
                  <StatusPill
                    tone={application.sanctioned ? 'verified' : 'progress'}
                    label={application.sanctioned ? 'Sanctioned' : STAGE_LABEL[application.stage]}
                    size="small"
                  />
                </View>
                <View style={styles.rule} />
                <DetailRow icon={Target} label="Purpose" value={purposeLabel} />
                <DetailRow
                  icon={CalendarClock}
                  label="Repayment period"
                  value={`${application.tenureMonths} months`}
                  divider={false}
                />
              </Card>

              <SectionHeader title="Progress" style={styles.sectionHeader} />
              <Card>
                <StepList
                  steps={STAGES.map((stage, index) => {
                    const state: StepState =
                      index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';
                    return {
                      label: STAGE_LABEL[stage],
                      date: application.stageDates[stage] ? formatDate(application.stageDates[stage]!) : null,
                      state,
                      detail: index === currentIndex ? STAGE_DETAIL[stage] : null,
                    };
                  })}
                />
              </Card>

              {outstanding > 0 ? (
                <Banner
                  tone="warning"
                  icon={FileCheck2}
                  title={`${outstanding} ${outstanding === 1 ? 'document' : 'documents'} still needed`}
                  body="Your application waits here until they're in."
                />
              ) : null}

              <Card padded={false} style={styles.listCard}>
                <ListRow
                  title="Documents"
                  subtitle={`${data.documents.length - outstanding} of ${data.documents.length} received`}
                  leading={<IconTile icon={FileCheck2} pillar="microfinance" size="medium" />}
                  divider
                  onPress={() => navigation.navigate('MicroFinanceDocuments')}
                />
                <ListRow
                  title="Repayments"
                  subtitle={
                    data.repayments.length > 0 ? `${data.repayments.length} instalments` : 'Scheduled after sanction'
                  }
                  leading={<IconTile icon={Wallet} pillar="microfinance" size="medium" />}
                  divider
                  onPress={() => navigation.navigate('MicroFinanceRepayments')}
                />
                <ListRow
                  title="Raise a grievance"
                  subtitle="A rejected document, a delay or a repayment problem"
                  leading={<IconTile icon={MessageSquareWarning} pillar="microfinance" size="medium" />}
                  onPress={() => navigation.navigate('MicroFinanceRaiseGrievance')}
                />
              </Card>

              <Banner
                tone="info"
                icon={Info}
                title="A readiness capability"
                body="MARCOFED is preparing to act as a channelising agency. This application is recorded and tracked; it does not sanction or disburse money."
              />

              {!application.sanctioned ? (
                <Button
                  label="Add documents"
                  icon={FileCheck2}
                  onPress={() => navigation.navigate('MicroFinanceDocuments')}
                  style={styles.cta}
                />
              ) : null}
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
  headCard: {
    padding: theme.space.l,
  },
  headTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  reference: {
    ...theme.type.captionStrong,
    color: theme.pillarTint.microfinance.icon,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  amount: {
    ...theme.type.largeTitle,
    fontSize: 22,
    lineHeight: 29,
    color: theme.color.textPrimary,
  },
  submitted: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.borderStrong,
    marginVertical: theme.space.m,
  },
  sectionHeader: {
    marginTop: theme.space.s,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
  cta: {
    marginTop: theme.space.s,
  },
});
