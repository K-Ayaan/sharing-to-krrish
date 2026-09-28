import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AlertCard from '../../components/ui/AlertCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FilterChip from '../../components/ui/FilterChip';
import IconButton from '../../components/ui/IconButton';
import RunningBanner from '../../components/ui/RunningBanner';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import ServiceHeader from '../../components/ui/ServiceHeader';
import StockCard from '../../components/ui/StockCard';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import TextField from '../../components/ui/TextField';
import {
  acknowledgeAlert,
  getActiveAlerts,
  mockLivestockHome,
  type StockItem,
} from '../../data/mock/mockLivestock';
import type { LivestockScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { useUnreadNoticeCount } from '../useUnreadNoticeCount';
import {
  quantityLabel,
  sexName,
  sortOptions,
  sortStock,
  speciesIcon,
  speciesName,
  weightName,
  type StockSort,
} from './livestockFormat';
import LivestockFiltersSheet, { NO_FILTERS, filterCount, type LivestockFilters } from './LivestockFiltersSheet';
import SortSheet from './SortSheet';

type SheetName = 'filters' | 'sort';

const { color } = theme.livestock;

const COLUMNS = 2;

const chipLabel = (base: string, count: number) => (count > 0 ? `${base} (${count})` : base);

const without = <T,>(values: T[], value: T) => values.filter((item) => item !== value);

export default function LivestockHome({ navigation }: LivestockScreenProps<'LivestockHome'>) {
  const { banner, stock } = mockLivestockHome;
  const unreadNotificationCount = useUnreadNoticeCount();
  const [alerts, setAlerts] = useState(getActiveAlerts);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<LivestockFilters>(NO_FILTERS);
  const { species, sexes, weights } = filters;
  const [sort, setSort] = useState<StockSort>('availability');
  const [sheet, setSheet] = useState<SheetName | null>(null);

  const acknowledge = async (id: string) => {
    await acknowledgeAlert(id);
    setAlerts(getActiveAlerts());
  };

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = stock.filter(
      (item) =>
        (species.length === 0 || species.includes(item.species)) &&
        (sexes.length === 0 || sexes.includes(item.sex)) &&
        (weights.length === 0 || weights.includes(item.weightBand)) &&
        (!normalizedQuery ||
          [item.id, speciesName(item.species), item.centre.name].some((field) =>
            field.toLowerCase().includes(normalizedQuery)
          ))
    );
    return sortStock(matching, sort);
  }, [stock, query, species, sexes, weights, sort]);

  const rows = useMemo(() => {
    const grouped: StockItem[][] = [];
    for (let index = 0; index < results.length; index += COLUMNS) {
      grouped.push(results.slice(index, index + COLUMNS));
    }
    return grouped;
  }, [results]);

  const appliedChips = [
    ...species.map((id) => ({
      key: `species-${id}`,
      label: speciesName(id),
      remove: () => setFilters((current) => ({ ...current, species: without(current.species, id) })),
    })),
    ...sexes.map((id) => ({
      key: `sex-${id}`,
      label: sexName(id),
      remove: () => setFilters((current) => ({ ...current, sexes: without(current.sexes, id) })),
    })),
    ...weights.map((id) => ({
      key: `weight-${id}`,
      label: weightName(id),
      remove: () => setFilters((current) => ({ ...current, weights: without(current.weights, id) })),
    })),
  ];

  const clearFilters = () => setFilters(NO_FILTERS);
  const activeFilters = filterCount(filters);

  const closeSheet = () => setSheet(null);

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ServiceHeader
        title={pillarMeta.livestock.label}
        icon={pillarMeta.livestock.icon}
        iconColor={pillarMeta.livestock.colors.icon}
        tint={pillarMeta.livestock.colors.tint}
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        trailing={
          <IconButton
            icon="notifications-outline"
            badgeCount={unreadNotificationCount}
            accessibilityLabel="Notifications"
            tint={color.surface}
            onPress={() => navigation.navigate('NoticesTab', { screen: 'Notices', pop: true })}
          />
        }
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <RunningBanner tone="info" icon="megaphone" text={banner.text} style={styles.fullBleed} />

        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            title={alert.title}
            body={alert.body}
            onAcknowledge={() => acknowledge(alert.id)}
          />
        ))}

        <TextField
          accessibilityLabel="Search stock"
          autoCorrect={false}
          icon="search"
          onChangeText={setQuery}
          placeholder="Search by species, stock ID or kendra…"
          returnKeyType="search"
          value={query}
          variant="search"
        />

        {/* One dropdown for every filter: species, sex and weight are sections of pills in one sheet. */}
        <View style={styles.chipRow}>
          <FilterChip
            label={chipLabel('Filters', activeFilters)}
            icon="options-outline"
            iconColor={color.primary}
            trailingIcon="chevron-down"
            selected={activeFilters > 0}
            onPress={() => setSheet('filters')}
          />
        </View>

        {appliedChips.length > 0 ? (
          <View style={styles.chipRow}>
            {appliedChips.map((chip) => (
              <FilterChip
                key={chip.key}
                label={chip.label}
                selected
                onPress={() => setSheet('filters')}
                onRemove={chip.remove}
              />
            ))}
            <Button label="Clear all" variant="text" onPress={clearFilters} />
          </View>
        ) : null}

        <View style={styles.resultsRow}>
          <Text style={styles.resultCount}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
          <FilterChip
            label={`Sort by: ${sortOptions.find((option) => option.id === sort)?.name ?? ''}`}
            icon="swap-vertical"
            iconColor={color.textPrimary}
            trailingIcon="chevron-down"
            selected={false}
            onPress={() => setSheet('sort')}
          />
        </View>

        {results.length === 0 ? (
          <Card>
            <Text style={styles.empty}>No stock matches these filters.</Text>
          </Card>
        ) : (
          rows.map((row) => (
            <View key={row.map((item) => item.id).join('|')} style={styles.gridRow}>
              {row.map((item) => (
                <StockCard
                  key={item.id}
                  title={speciesName(item.species)}
                  subtitle={`${sexName(item.sex)} · ${weightName(item.weightBand)}`}
                  quantityLabel={quantityLabel(item.quantityAvailable)}
                  locationLabel={item.centre.name}
                  imageUrl={item.photos[0]?.url ?? null}
                  fallbackIcon={speciesIcon[item.species]}
                  fallbackIconColor={pillarMeta.livestock.colors.icon}
                  fallbackTint={pillarMeta.livestock.colors.tint}
                  onPress={() => navigation.navigate('StockDetails', { stockId: item.id })}
                />
              ))}
              {row.length < COLUMNS ? <View style={styles.flex} /> : null}
            </View>
          ))
        )}
        <TabBarSpacer />
      </ScrollView>

      <LivestockFiltersSheet
        visible={sheet === 'filters'}
        value={filters}
        onApply={(next) => {
          setFilters(next);
          closeSheet();
        }}
        onClose={closeSheet}
      />
      <SortSheet visible={sheet === 'sort'} selected={sort} onSelect={setSort} onClose={closeSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.s,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  fullBleed: {
    marginHorizontal: -theme.space.m,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.space.s,
  },
  resultCount: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
  empty: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
});
