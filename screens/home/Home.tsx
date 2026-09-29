// home.png, completed against SDD S-02: greeting, one card per registered service, today's rate
// and what needs attention, then recent activity. The top bar stays put while the page scrolls.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronRight,
  FileWarning,
  IndianRupee,
  LayoutGrid,
  Search,
  TriangleAlert,
} from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Avatar from '../../components/ui/Avatar';
import Banner from '../../components/ui/Banner';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import Landscape from '../../components/ui/Landscape';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import SearchBar from '../../components/ui/SearchBar';
import SectionHeader from '../../components/ui/SectionHeader';
import { Skeleton, SkeletonCards } from '../../components/ui/Skeleton';
import Tag from '../../components/ui/Tag';
import { CylinderIcon, type IconComponent } from '../../components/ui/icons';
import { firstNameOf, type PillarKey } from '../../data/mock/mockUser';
import type { HomeScreenProps } from '../../navigation/types';
import { getHome, PILLAR_ORDER, type TodayItem } from '../../services/homeService';
import { useIsOnline } from '../../services/network';
import { getRecentActivity } from '../../services/recordsService';
import { usePendingEntries } from '../../services/syncQueue';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate } from '../../utils/format';
import { pillarMeta } from '../pillarMeta';
import { recordIcon } from '../records/recordFormat';
import { openPillar } from '../services/openPillar';
import { rememberSearch } from './recentSearches';
import SearchResults, { type SearchTarget } from './SearchResults';

// Height of the hills behind the greeting; the greeting block is at least this tall so the whole
// illustration shows.
const GREETING_ART_HEIGHT = 124;
// Every service card is the same height — the Livestock card's proportions.
const SERVICE_CARD_HEIGHT = 100;
const TOP_BAR_HEIGHT = 48;

const TODAY_ICON: Record<TodayItem['kind'], IconComponent> = {
  rate: IndianRupee,
  alert: TriangleAlert,
  documents: FileWarning,
  refill: CylinderIcon,
};

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function Home({ navigation }: HomeScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const home = useQuery('home', getHome);
  const recent = useQuery('records:recent', () => getRecentActivity(2));
  const online = useIsOnline();
  const pending = usePendingEntries();

  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  // 0 = account chip + actions, 1 = full-width search field.
  const searchProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(searchProgress, {
      toValue: searching ? 1 : 0,
      duration: theme.motion.settle,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      // Width can't be driven natively; opacity rides along with it.
      useNativeDriver: false,
    }).start();
  }, [searching, searchProgress]);

  const closeSearch = useCallback(() => {
    setSearching(false);
    setQuery('');
  }, []);

  const refresh = async () => {
    await Promise.all([home.refresh(), recent.refresh()]);
  };

  const onSearchSelect = (target: SearchTarget) => {
    rememberSearch(query);
    closeSearch();
    if (target.type === 'pillar') {
      const registered = home.data?.pillars.find((p) => p.pillar === target.pillar)?.registered ?? false;
      openPillar(navigation, target.pillar, registered);
    } else if (target.type === 'notice') {
      navigation.navigate('NoticesTab', { screen: 'NoticeDetail', params: { noticeId: target.id }, initial: false });
    } else {
      navigation.navigate('RecordsTab', { screen: 'RecordDetail', params: { recordId: target.id }, initial: false });
    }
  };

  const profile = home.data?.profile;
  const registered = home.data?.pillars.filter((p) => p.registered) ?? [];
  const today = home.data?.today ?? [];

  // The field grows from the search button out to the full row width.
  const barWidth = width - theme.size.screenPadding * 2;
  const searchWidth = searchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.size.touch, barWidth],
  });
  const restingOpacity = searchProgress.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const topBar = (
    <View style={[styles.topBar, { paddingTop: insets.top + theme.space.s }]}>
      <View style={styles.topBarRow}>
        {/* Resting state: the chip, the search button and the bell, each in the layout flow so
            nothing sits on top of anything. */}
        <Animated.View style={[styles.restingRow, { opacity: restingOpacity }]} pointerEvents={searching ? 'none' : 'auto'}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={profile ? `${profile.name}, MARCOFED ID ${profile.uid}. Open settings` : 'Open settings'}
            onPress={() => navigation.navigate('Settings')}
            style={({ pressed }) => [styles.accountChip, pressed && styles.pressed]}
          >
            {profile ? (
              <Avatar name={profile.name} photoUri={profile.photoUri} size={40} />
            ) : (
              <Skeleton width={40} height={40} radius={20} />
            )}
            <ChevronDown size={18} color={theme.color.textPrimary} strokeWidth={2} />
          </Pressable>
          <View style={styles.actions}>
            <IconButton icon={Search} label="Search" onPress={() => setSearching(true)} />
            <IconButton
              icon={Bell}
              label="Notices"
              badge={(home.data?.unreadNotices ?? 0) > 0}
              onPress={() => navigation.navigate('NoticesTab', { screen: 'NoticesList' })}
            />
          </View>
        </Animated.View>

        {/* Opening state: the field grows out of the search button, leftwards across the row. */}
        {searching ? (
          <Animated.View style={[styles.searchSlot, { width: searchWidth }]}>
            <View style={styles.searchRow}>
              <IconButton icon={ArrowLeft} label="Close search" onPress={closeSearch} />
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Services, notices or records"
                autoFocus
                style={styles.searchField}
              />
            </View>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );

  // Searching takes over the page on a plain white sheet — earlier searches first, matches as
  // soon as there's something to match.
  if (searching) {
    return (
      <Screen inTabs header={topBar} background={theme.color.surface}>
        <SearchResults query={query} onSelect={onSearchSelect} onPickRecent={setQuery} />
      </Screen>
    );
  }

  return (
    <Screen
      inTabs
      header={topBar}
      refreshing={home.refreshing || recent.refreshing}
      onRefresh={refresh}
      contentStyle={styles.noPad}
    >
      <View style={styles.greeting}>
        <View style={styles.greetingArt} pointerEvents="none">
          <Landscape width={width} height={GREETING_ART_HEIGHT} spread="right" />
        </View>
        <Text style={styles.greetingLine}>{greetingFor(new Date())}</Text>
        {profile ? (
          <Text accessibilityRole="header" style={styles.name} numberOfLines={1}>
            {firstNameOf(profile.name)}
          </Text>
        ) : (
          <Skeleton width={140} height={34} radius={10} style={styles.nameSkeleton} />
        )}
      </View>

      <View style={styles.body}>
        {!online ? (
          <Banner tone="offline" title="You’re offline" body="Showing what was last loaded. New entries are kept on this phone." />
        ) : null}
        {pending.length > 0 ? (
          <Banner
            tone="sync"
            title={`${pending.length} ${pending.length === 1 ? 'entry' : 'entries'} waiting for network`}
            body="They send automatically. Nothing needs entering twice."
          />
        ) : null}

        <AsyncContent
          query={home}
          what="your services"
          skeleton={<SkeletonCards count={3} height={SERVICE_CARD_HEIGHT} />}
          isEmpty={() => registered.length === 0}
          empty={
            <Card>
              <EmptyState
                icon={LayoutGrid}
                title="No services yet"
                body="Register for Van Dhan, Livestock, LPG and more from Services."
                actionLabel="Browse services"
                onAction={() => navigation.navigate('ServicesTab', { screen: 'ServicesHub' })}
              />
            </Card>
          }
        >
          {() => (
            <View style={styles.cards}>
              {registered.map(({ pillar, tag }) => (
                <ServiceCard key={pillar} pillar={pillar} tag={tag} onPress={() => openPillar(navigation, pillar, true)} />
              ))}
              {registered.length < PILLAR_ORDER.length ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('ServicesTab', { screen: 'ServicesHub' })}
                  style={styles.moreServices}
                  hitSlop={8}
                >
                  <Text style={styles.moreServicesText}>Register for more services</Text>
                  <ChevronRight size={16} color={theme.pillarTint.vandhan.icon} strokeWidth={2.25} />
                </Pressable>
              ) : null}
            </View>
          )}
        </AsyncContent>

        {today.length > 0 ? (
          <>
            <SectionHeader
              title="Today"
              subtitle={`${today.length} ${today.length === 1 ? 'item' : 'items'}`}
              style={styles.sectionHeader}
            />
            <Card padded={false} style={styles.listCard}>
              {today.map((item, index) => (
                <ListRow
                  key={item.id}
                  title={item.title}
                  subtitle={item.detail}
                  leading={
                    <IconTile
                      icon={TODAY_ICON[item.kind]}
                      size="medium"
                      bg={theme.color.surfaceMuted}
                      color={theme.color.textPrimary}
                    />
                  }
                  divider={index < today.length - 1}
                  onPress={() => openPillar(navigation, item.pillar, true)}
                />
              ))}
            </Card>
          </>
        ) : null}

        <SectionHeader
          title="Recent activity"
          actionLabel="View all"
          onAction={() => navigation.navigate('RecordsTab', { screen: 'RecordsList' })}
          style={styles.sectionHeader}
        />
        <AsyncContent
          query={recent}
          what="recent activity"
          skeleton={<SkeletonCards count={1} height={120} />}
          isEmpty={(items) => items.length === 0}
          empty={
            <Card>
              <Text style={styles.noActivity}>Your submissions, bookings and requests will show here.</Text>
            </Card>
          }
        >
          {(items) => (
            <Card padded={false} style={styles.listCard}>
              {items.map((record, index) => (
                <ListRow
                  key={record.id}
                  title={record.title}
                  subtitle={`${record.subtitle} • ${record.statusLabel}`}
                  trailingTop={formatDate(record.at)}
                  leading={
                    <IconTile
                      icon={recordIcon(record)}
                      size="medium"
                      bg={theme.color.surfaceMuted}
                      color={theme.color.textPrimary}
                    />
                  }
                  divider={index < items.length - 1}
                  onPress={() =>
                    navigation.navigate('RecordsTab', {
                      screen: 'RecordDetail',
                      params: { recordId: record.id },
                      initial: false,
                    })
                  }
                />
              ))}
            </Card>
          )}
        </AsyncContent>
      </View>
    </Screen>
  );
}

function ServiceCard({ pillar, tag, onPress }: { pillar: PillarKey; tag: string | null; onPress: () => void }) {
  const meta = pillarMeta[pillar];
  return (
    <Card
      tone={pillar}
      onPress={onPress}
      padded={false}
      style={styles.serviceCard}
      accessibilityLabel={`${meta.label}. ${tag ?? ''}. ${meta.description}`}
    >
      <View style={styles.serviceRow}>
        <IconTile icon={meta.icon} pillar={pillar} shape="rounded" size="xlarge" />
        <View style={styles.serviceText}>
          <View style={styles.serviceTitleRow}>
            {/* The service's name always shows in full; it's the tag that gives way. */}
            <Text style={styles.serviceTitle}>{meta.label}</Text>
            {tag ? <Tag label={tag} pillar={pillar} style={styles.serviceTag} /> : null}
          </View>
          <Text style={styles.serviceDescription} numberOfLines={2}>
            {meta.description}
          </Text>
        </View>
        <ChevronRight size={20} color={theme.color.textPrimary} strokeWidth={2} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
    gap: 0,
  },
  topBar: {
    paddingHorizontal: theme.size.screenPadding,
    paddingBottom: theme.space.s,
  },
  topBarRow: {
    minHeight: TOP_BAR_HEIGHT,
    justifyContent: 'center',
  },
  restingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
  },
  accountChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s + 2,
    paddingRight: theme.space.m,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surfaceMuted,
  },
  pressed: {
    opacity: 0.75,
  },
  searchSlot: {
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    alignSelf: 'stretch',
  },
  searchField: {
    flex: 1,
  },
  greeting: {
    minHeight: GREETING_ART_HEIGHT,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.size.screenPadding,
    paddingTop: theme.space.s,
    paddingBottom: theme.space.l,
    overflow: 'hidden',
  },
  greetingArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  greetingLine: {
    ...theme.type.body,
    fontSize: 18,
    lineHeight: 24,
    color: theme.color.textSecondary,
  },
  name: {
    ...theme.type.display,
    fontSize: 34,
    lineHeight: 42,
    color: theme.color.textPrimary,
    maxWidth: '60%',
  },
  nameSkeleton: {
    marginTop: theme.space.s,
  },
  body: {
    paddingHorizontal: theme.size.screenPadding,
    paddingTop: theme.space.l,
    gap: theme.space.m + 2,
  },
  cards: {
    gap: theme.space.m,
  },
  serviceCard: {
    height: SERVICE_CARD_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: theme.space.l,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
  },
  serviceText: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  serviceTitle: {
    ...theme.type.headline,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
    flexShrink: 0,
  },
  serviceTag: {
    marginLeft: 'auto',
    flexShrink: 1,
  },
  serviceDescription: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  moreServices: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 2,
    paddingVertical: theme.space.xs,
  },
  moreServicesText: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.pillarTint.vandhan.icon,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: theme.space.s,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
  noActivity: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.space.l,
  },
});
