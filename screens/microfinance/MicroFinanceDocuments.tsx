// SPEC-ONLY — SDD S-51. No mockup was supplied. A checklist: what's received, what's outstanding,
// and a take-photo action per item. Photo capture itself waits for the live document service —
// tapping records the document as received against the mock data layer.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, CheckCircle2, Circle, FileCheck2 } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { SkeletonList } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import { useToast } from '../../components/ui/Toast';
import type { MicroFinanceScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { getMfOverview, uploadDocument } from '../../services/microFinanceService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate } from '../../utils/format';

export default function MicroFinanceDocuments({ navigation }: MicroFinanceScreenProps<'MicroFinanceDocuments'>) {
  const toast = useToast();
  const overview = useQuery('microfinance:overview', getMfOverview);
  const [busy, setBusy] = useState<string | null>(null);

  const documents = overview.data?.documents ?? [];
  const received = documents.filter((doc) => doc.receivedAt !== null).length;
  const complete = documents.length > 0 && received === documents.length;

  const add = async (id: string, name: string) => {
    setBusy(id);
    try {
      await uploadDocument(id);
      toast.show({ message: `${name} received`, tone: 'success' });
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen
      refreshing={overview.refreshing}
      onRefresh={overview.refresh}
      header={<ScreenHeader layout="bar" title="Documents" onBack={navigation.goBack} />}
      footer={
        <Button
          label={complete ? 'See application status' : 'Done for now'}
          variant={complete ? 'primary' : 'secondary'}
          onPress={() => navigation.replace('MicroFinanceApplicationStatus')}
        />
      }
      contentStyle={styles.content}
    >
      <AsyncContent query={overview} what="your documents" skeleton={<SkeletonList count={4} thumb={42} lines={2} />}>
        {(data) => (
          <>
            <Card tone="microfinance">
              <View style={styles.summaryRow}>
                <IconTile icon={FileCheck2} pillar="microfinance" shape="rounded" size="xlarge" />
                <View style={styles.flex}>
                  <Text style={styles.summaryTitle}>
                    {received} of {data.documents.length} received
                  </Text>
                  <Text style={styles.summaryBody}>
                    {complete
                      ? 'Everything is in. Your society is asked next.'
                      : 'Add the rest whenever you can — your application waits for them.'}
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.list}>
              {data.documents.map((doc) => {
                const done = doc.receivedAt !== null;
                return (
                  <Card key={doc.id} style={styles.docCard}>
                    <View style={styles.docTop}>
                      {done ? (
                        <CheckCircle2 size={22} color={theme.color.status.verifiedFg} strokeWidth={2} />
                      ) : (
                        <Circle size={22} color={theme.color.textTertiary} strokeWidth={2} />
                      )}
                      <View style={styles.flex}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        <Text style={styles.docHint}>{doc.hint}</Text>
                      </View>
                      {done ? <StatusPill tone="verified" label="Received" size="small" /> : null}
                    </View>
                    {done ? (
                      <Text style={styles.docMeta}>
                        Added {formatDate(doc.receivedAt!)}
                        {doc.note ? ` · ${doc.note}` : ''}
                      </Text>
                    ) : (
                      <Button
                        label="Take a photo"
                        icon={Camera}
                        variant="tonal"
                        loading={busy === doc.id}
                        onPress={() => add(doc.id, doc.name)}
                        style={styles.docAction}
                      />
                    )}
                  </Card>
                );
              })}
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  summaryTitle: {
    ...theme.type.headline,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
  },
  summaryBody: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  list: {
    gap: theme.space.s,
  },
  docCard: {
    gap: theme.space.s,
  },
  docTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  docName: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  docHint: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  docMeta: {
    ...theme.type.caption,
    color: theme.color.textTertiary,
  },
  docAction: {
    alignSelf: 'flex-start',
  },
});
