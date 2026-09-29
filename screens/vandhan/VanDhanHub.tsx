// vandhan-page.png (Price Check) + my collection vandhan.png (My Collections), completed against
// SDD S-10 rates, S-12 my collections and S-13/S-14 grievances.
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BarChart3,
  Bell,
  CalendarDays,
  Clock,
  Inbox,
  List,
  MessageSquareWarning,
  Plus,
  SearchX,
  ShieldQuestion,
  Store,
  UserCheck,
} from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Banner from '../../components/ui/Banner';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import FloatingButton from '../../components/ui/FloatingButton';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import SegmentedControl from '../../components/ui/SegmentedControl';
import SelectField from '../../components/ui/SelectField';
import { SkeletonList } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import { useToast } from '../../components/ui/Toast';
import Thumbnail from '../../components/ui/Thumbnail';
import { KENDRAS } from '../../data/mock/mockUser';
import type { Produce } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import { describeError } from '../../services/client';
import { getUnreadCount } from '../../services/homeService';
import { usePendingEntries } from '../../services/syncQueue';
import { useQuery } from '../../services/useQuery';
import { getProfile, setKendra } from '../../services/userService';
import { getCollections, getRates } from '../../services/vanDhanService';
import theme from '../../theme';
import { daysBetween, formatDate, formatINR, formatQuantity, updatedLabel } from '../../utils/format';
import { collectionStatus, produceLook, RATE_WINDOWS, type RateWindow } from './vanDhanFormat';
import ProduceDetailSheet from './ProduceDetailSheet';

type Tab = 'rates' | 'collections';

export default function VanDhanHub({ navigation, route }: VanDhanScreenProps<'VanDhanHub'>) {
  const [tab, setTab] = useState<Tab>(route.params?.tab ?? 'rates');
  const [query, setQuery] = useState('');
  const [rateWindow, setRateWindow] = useState<RateWindow>('today');
  const [selected, setSelected] = useState<Produce | null>(null);

  const rates = useQuery('vandhan:rates', getRates);
  const collections = useQuery('vandhan:collections', getCollections);
  const profile = useQuery('profile', getProfile);
  const unread = useQuery('notices:unread', getUnreadCount);
  const pending = usePendingEntries().filter((entry) => entry.pillar === 'vandhan');
  const toast = useToast();

  // Everyone registered for Van Dhan is a collector — submitting collections needs that registration.
  const vandhan = profile.data?.registrations.vandhan ?? null;
  const isCollector = vandhan !== null;

  const changeKendra = async (id: string) => {
    try {
      await setKendra(id);
    } catch (caught) {
      toast.show({ message: describeError(caught), tone: 'error' });
    }
  };

  const visibleRates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rates.data ?? []).filter((produce) => {
      if (q && !produce.name.toLowerCase().includes(q)) return false;
      const age = daysBetween(produce.updatedAt);
      if (rateWindow === 'today') return age <= 0;
      if (rateWindow === 'week') return age <= 7;
      return true;
    });
  }, [rates.data, query, rateWindow]);

  const active = tab === 'rates' ? rates : collections;

  return (
    <View style={styles.root}>
      <Screen
        refreshing={active.refreshing}
        onRefresh={active.refresh}
        inTabs
        header={
          <ScreenHeader
            layout="inline"
            title="Van Dhan"
            scene="vandhan"
            onBack={navigation.goBack}
            right={
              <IconButton
                icon={Bell}
                label="Notices"
                badge={(unread.data ?? 0) > 0}
                onPress={() => navigation.navigate('NoticesTab', { screen: 'NoticesList' })}
              />
            }
          />
        }
        contentStyle={[styles.content, isCollector && styles.contentWithFab]}
      >
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          segments={[
            { value: 'rates', label: 'Price Check', icon: BarChart3 },
            { value: 'collections', label: 'My Collections', icon: List },
          ]}
        />

        {tab === 'rates' ? (
          <>
            <View style={styles.filters}>
              <SearchBar value={query} onChangeText={setQuery} placeholder="Search produce" style={styles.search} />
              <SelectField<RateWindow>
                appearance="chip"
                icon={CalendarDays}
                label="Rates"
                sheetTitle="Show rates"
                value={rateWindow}
                options={RATE_WINDOWS}
                onChange={setRateWindow}
              />
            </View>

            {/* Rates are notified per Kendra, so which Kendra you collect through decides what you
                see here and where your collections go. */}
            <View style={styles.kendraRow}>
              <Text style={styles.kendraLabel}>Kendra</Text>
              <SelectField<string>
                appearance="chip"
                icon={Store}
                label="Kendra"
                sheetTitle="Choose your Kendra"
                sheetSubtitle="Your collections, rates and grievances go through this Kendra."
                value={profile.data?.kendra.id ?? null}
                options={KENDRAS.map((item) => ({ value: item.id, label: item.name, description: item.district }))}
                onChange={changeKendra}
              />
            </View>
            <AsyncContent
              query={rates}
              what="today’s rates"
              skeleton={<SkeletonList count={6} thumb={56} />}
              isEmpty={() => visibleRates.length === 0}
              empty={
                <EmptyState
                  icon={SearchX}
                  title={query ? `No produce matches “${query.trim()}”` : 'No rates updated in this period'}
                  body={query ? 'Check the spelling, or try the local name.' : 'Choose “All rates” to see every notified rate.'}
                  actionLabel={rateWindow !== 'all' ? 'Show all rates' : undefined}
                  onAction={rateWindow !== 'all' ? () => setRateWindow('all') : undefined}
                />
              }
            >
              {() => (
                <View style={styles.list}>
                  {visibleRates.map((produce) => {
                    const look = produceLook[produce.glyph];
                    return (
                      <ListRow
                        key={produce.id}
                        card
                        title={produce.name}
                        subtitle={`per ${produce.unit}`}
                        leading={<Thumbnail uri={produce.imageUrl} icon={look.icon} bg={look.bg} color={look.fg} size={56} />}
                        meta={
                          <View style={styles.metaRow}>
                            <Clock size={13} color={theme.color.textSecondary} strokeWidth={2} />
                            <Text style={styles.meta}>{updatedLabel(produce.updatedAt)}</Text>
                          </View>
                        }
                        trailing={<Text style={styles.price}>{formatINR(produce.rate)}</Text>}
                        affordance="circle"
                        onPress={() => setSelected(produce)}
                        accessibilityLabel={`${produce.name}, ${formatINR(produce.rate)} per ${produce.unit}, ${updatedLabel(produce.updatedAt)}`}
                      />
                    );
                  })}
                </View>
              )}
            </AsyncContent>
          </>
        ) : !isCollector && profile.data ? (
          <Card>
            <EmptyState
              icon={ShieldQuestion}
              title="Register to submit collections"
              body="Registering for Van Dhan lets you hand produce to your Kendra and follow weighing and payment."
              actionLabel="Register for Van Dhan"
              onAction={() => navigation.navigate('VanDhanRegister')}
            />
          </Card>
        ) : (
          <>
            {pending.length > 0 ? (
              <Banner
                tone="sync"
                title={`${pending.length} ${pending.length === 1 ? 'collection' : 'collections'} waiting for network`}
                body="Kept on this phone. They send on their own when the signal returns."
              />
            ) : null}
            <AsyncContent
              query={collections}
              what="your collections"
              skeleton={<SkeletonList count={5} thumb={56} />}
              isEmpty={(items) => items.length === 0}
              empty={
                <Card>
                  <EmptyState
                    icon={Inbox}
                    title="No collections yet"
                    body="Every load you take to a Kendra will appear here with its reference, weight and status."
                    actionLabel="Submit your first collection"
                    onAction={() => navigation.navigate('SubmitCollection')}
                  />
                </Card>
              }
            >
              {(items) => (
                <View style={styles.list}>
                  {items.map((collection) => {
                    const look = produceLook[collection.produce.glyph];
                    const status = collectionStatus[collection.status];
                    return (
                      <ListRow
                        key={collection.id}
                        card
                        title={collection.produce.name}
                        subtitle={formatQuantity(collection.quantity, collection.produce.unit)}
                        leading={
                          <Thumbnail uri={collection.produce.imageUrl} icon={look.icon} bg={look.bg} color={look.fg} size={56} />
                        }
                        meta={<Text style={styles.meta}>Submitted on {formatDate(collection.submittedAt)}</Text>}
                        trailing={<StatusPill tone={status.tone} label={status.label} size="small" />}
                        onPress={() => navigation.navigate('CollectionDetail', { collectionId: collection.id })}
                      />
                    );
                  })}
                </View>
              )}
            </AsyncContent>

            <Card padded={false} style={styles.helpCard}>
              {vandhan ? (
                <ListRow
                  title="Your registration"
                  subtitle="Collector · Tap to view"
                  leading={<IconTile icon={UserCheck} size="medium" />}
                  divider
                  onPress={() => navigation.navigate('VanDhanRegister')}
                />
              ) : null}
              <ListRow
                title="Problem with a payment or weighing?"
                subtitle="Raise a grievance with your Kendra"
                leading={<IconTile icon={MessageSquareWarning} size="medium" />}
                divider
                onPress={() => navigation.navigate('VanDhanRaiseGrievance')}
              />
              <ListRow
                title="My grievances"
                subtitle="Track what you’ve raised"
                leading={<IconTile icon={List} size="medium" />}
                onPress={() => navigation.navigate('VanDhanGrievanceStatus')}
              />
            </Card>
          </>
        )}
      </Screen>

      {isCollector ? (
        <FloatingButton label="Submit Collection" icon={Plus} onPress={() => navigation.navigate('SubmitCollection')} />
      ) : null}

      <ProduceDetailSheet
        produce={selected}
        kendraName={profile.data?.kendra.name ?? 'your Kendra'}
        canSubmit={isCollector}
        onClose={() => setSelected(null)}
        onSubmit={(produce) => {
          setSelected(null);
          navigation.navigate('SubmitCollection', { produceId: produce.id });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    gap: theme.space.m + 2,
  },
  contentWithFab: {
    paddingBottom: 72,
  },
  kendraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    marginTop: -theme.space.s,
  },
  kendraLabel: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.color.textSecondary,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s + 2,
  },
  search: {
    flex: 1,
  },
  list: {
    gap: theme.space.m,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  meta: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  price: {
    ...theme.type.figure,
    color: theme.color.textPrimary,
  },
  helpCard: {
    paddingHorizontal: theme.space.l,
    marginTop: theme.space.s,
  },
});
