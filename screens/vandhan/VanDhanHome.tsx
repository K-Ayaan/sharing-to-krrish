import type { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import RateRow from '../../components/ui/RateRow';
import StatusPill from '../../components/ui/StatusPill';
import StatusTracker from '../../components/ui/StatusTracker';
import TextField from '../../components/ui/TextField';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { getCurrentPickup, mockVanDhanHome, type Produce } from '../../data/mock/mockVanDhan';
import type { VanDhanScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDate, isToday } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import ProduceDetailSheet from './ProduceDetailSheet';
import {
  CALL_UNAVAILABLE,
  dialectLabel,
  formatRate,
  grievanceStageMeta,
  openPhone,
  pickupSteps,
  unitLabel,
} from './vanDhanFormat';

type IconName = keyof typeof Ionicons.glyphMap;
type RateFilter = 'all' | 'up' | 'down' | 'today';

const FILTERS: { id: RateFilter; label: string; icon?: IconName; iconColor?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'up', label: 'Trending up', icon: 'trending-up', iconColor: theme.color.success },
  { id: 'down', label: 'Trending down', icon: 'trending-down', iconColor: theme.color.danger },
  { id: 'today', label: 'Updated today', icon: 'time-outline' },
];

const CONFIRMATION_MESSAGES = {
  collection_logged: 'Collection logged',
} as const;

// Unicode combining diacritical marks (U+0300–U+036F), stripped after NFD
// decomposition so "tsungri" matches "Tsüngri".
const COMBINING_MARKS = new RegExp(
  `[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`,
  'g'
);

const normalize = (text: string) => text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase();

function matchesFilters(produce: Produce, query: string, filter: RateFilter) {
  if (filter === 'up' && produce.trend !== 'up') return false;
  if (filter === 'down' && produce.trend !== 'down') return false;
  if (filter === 'today' && !isToday(produce.updatedAt)) return false;
  if (!query) return true;
  return [produce.name, produce.dialect.name, produce.dialect.language].some((field) =>
    normalize(field).includes(query)
  );
}

export default function VanDhanHome({ navigation, route }: VanDhanScreenProps<'VanDhanHome'>) {
  const { tagline, priceLine, produce, kendra, activeGrievance } = mockVanDhanHome;
  const unreadNotificationCount = useUnreadNoticeCount();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RateFilter>('all');
  const [selected, setSelected] = useState<Produce | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Pillar-home rule (flow.md): native large-title header with a visible back
  // chevron to Services; the bell lives in the header instead of the content.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="notifications-outline"
          badgeCount={unreadNotificationCount}
          accessibilityLabel="Notifications"
          onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
        />
      ),
    });
  }, [navigation, unreadNotificationCount]);

  // Re-render on focus so a pickup requested in SchedulePickup shows here on return.
  useIsFocused();
  const pickup = getCurrentPickup();

  const confirmation = route.params?.confirmation;
  useEffect(() => {
    if (!confirmation) return;
    setToast(CONFIRMATION_MESSAGES[confirmation]);
    navigation.setParams({ confirmation: undefined });
  }, [confirmation, navigation]);

  const visibleProduce = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return produce.filter((item) => matchesFilters(item, normalizedQuery, filter));
  }, [produce, query, filter]);

  const callPriceLine = async () => {
    if (!(await openPhone(priceLine.phone))) setToast(CALL_UNAVAILABLE);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.taglineRow}>
          <Text style={[styles.secondary, styles.flex]}>{tagline}</Text>
          <Thumbnail
            uri={null}
            fallbackIcon={pillarMeta.vandhan.icon}
            iconColor={pillarMeta.vandhan.colors.icon}
            tint={pillarMeta.vandhan.colors.tint}
          />
        </View>

        <Card tone="info" padded={false}>
          <ListRow
            icon="call"
            iconColor={theme.color.background}
            iconBackground={theme.color.primary}
            title="Call price line"
            subtitle={priceLine.description}
            onPress={callPriceLine}
            style={styles.tinted}
          />
        </Card>

        <TextField
          accessibilityLabel="Search produce"
          autoCorrect={false}
          icon="search"
          onChangeText={setQuery}
          placeholder="Search produce (e.g. broom grass, honey…)"
          returnKeyType="search"
          value={query}
          variant="search"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fullBleed}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((option) => (
            <FilterChip
              key={option.id}
              label={option.label}
              icon={option.icon}
              iconColor={option.iconColor}
              selected={filter === option.id}
              onPress={() => setFilter(option.id)}
            />
          ))}
        </ScrollView>

        <Card padded={false}>
          {visibleProduce.length === 0 ? (
            <Text style={styles.empty}>No produce matches your search.</Text>
          ) : (
            visibleProduce.map((item, index) => (
              <RateRow
                key={item.id}
                title={item.name}
                subtitle={dialectLabel(item)}
                price={formatRate(item.rate.amount)}
                unit={unitLabel(item.rate.unit)}
                trend={item.trend}
                updatedLabel={formatDate(item.updatedAt)}
                imageUrl={item.imageUrl}
                fallbackIcon={pillarMeta.vandhan.icon}
                fallbackIconColor={pillarMeta.vandhan.colors.icon}
                fallbackTint={pillarMeta.vandhan.colors.tint}
                divider={index < visibleProduce.length - 1}
                onPress={() => setSelected(item)}
              />
            ))
          )}
        </Card>

        <View style={styles.actions}>
          <Button
            label="Log a collection"
            icon="add-circle"
            variant="secondary"
            onPress={() => navigation.navigate('LogCollection')}
            style={styles.actionButton}
          />
          <Button
            label="Schedule a pickup"
            icon="calendar"
            variant="secondary"
            onPress={() => navigation.navigate('SchedulePickup')}
            style={styles.actionButton}
          />
        </View>

        {pickup ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Track your pickup</Text>
              <Button
                label="View details"
                variant="text"
                onPress={() => navigation.navigate('PickupDetails', { pickupId: pickup.id })}
              />
            </View>
            <StatusTracker steps={pickupSteps(pickup, 'date')} style={styles.tracker} />
          </Card>
        ) : null}

        <Card padded={false}>
          <Text style={[styles.cardTitle, styles.cardTitlePadded]}>Your Van Dhan Kendra</Text>
          <ListRow
            icon="location"
            iconColor={theme.color.textSecondary}
            iconBackground={theme.color.surfaceMuted}
            title={kendra.name}
            subtitle={`${kendra.address.line1}, ${kendra.address.line2}`}
            onPress={() => navigation.navigate('KendraInfo')}
          />
        </Card>

        {activeGrievance ? (
          <Card padded={false}>
            <Text style={[styles.cardTitle, styles.cardTitlePadded]}>Your grievance</Text>
            <ListRow
              icon="chatbubble-ellipses"
              iconColor={theme.color.warning}
              iconBackground={theme.color.warningTint}
              title={activeGrievance.id}
              subtitle={activeGrievance.subject}
              titleAccessory={
                <StatusPill
                  label={grievanceStageMeta[activeGrievance.stage].label}
                  tone={grievanceStageMeta[activeGrievance.stage].tone}
                />
              }
              onPress={() => navigation.navigate('GrievanceStatus')}
            />
          </Card>
        ) : null}
      </ScrollView>

      <ProduceDetailSheet produce={selected} onClose={() => setSelected(null)} />
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  tinted: {
    backgroundColor: theme.color.primaryTint,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  chips: {
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
  },
  empty: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    padding: theme.space.l,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: theme.space.s,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.s,
  },
  cardTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  cardTitlePadded: {
    paddingHorizontal: theme.space.m,
    paddingTop: theme.space.m,
  },
  tracker: {
    marginTop: theme.space.m,
  },
});
