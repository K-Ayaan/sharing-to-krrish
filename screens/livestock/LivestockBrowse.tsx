// livestock-page.png — MARCOFED's livestock available to buy, searchable by species, breed or
// Kendra, with filters and sorting. Buying is the whole of Livestock in this app; the producer
// side (report stock, batches, certificates) is not part of registration.
import { useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Bell, MapPin, Phone, SearchX, SlidersHorizontal, UserCheck, Weight } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import SearchBar from '../../components/ui/SearchBar';
import SelectField from '../../components/ui/SelectField';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import Tag from '../../components/ui/Tag';
import { SPECIES_LABEL, type Listing } from '../../data/mock/mockLivestock';
import type { LivestockScreenProps } from '../../navigation/types';
import { getUnreadCount } from '../../services/homeService';
import { getListings } from '../../services/livestockService';
import { useQuery } from '../../services/useQuery';
import { getProfile } from '../../services/userService';
import theme from '../../theme';
import { formatINR, formatWeightRange } from '../../utils/format';
import FilterSheet, { type FilterSection } from './FilterSheet';
import {
  activeFilterCount,
  applyFilters,
  NO_FILTERS,
  SORT_OPTIONS,
  type LivestockFilters,
  type SortOrder,
} from './livestockFilters';
import { speciesIcon } from './livestockFormat';

export default function LivestockBrowse({ navigation }: LivestockScreenProps<'LivestockBrowse'>) {
  const { width } = useWindowDimensions();
  const listings = useQuery('livestock:listings', getListings);
  const profile = useQuery('profile', getProfile);
  const unread = useQuery('notices:unread', getUnreadCount);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<LivestockFilters>(NO_FILTERS);
  const [sort, setSort] = useState<SortOrder>('nearest');
  const [sheet, setSheet] = useState<FilterSection | null>(null);

  const results = useMemo(
    () => applyFilters(listings.data ?? [], filters, query, sort, profile.data?.district),
    [listings.data, filters, query, sort, profile.data?.district]
  );

  const registered = profile.data?.registrations.livestock != null;
  const filterCount = activeFilterCount(filters);
  const columnWidth = (width - theme.size.screenPadding * 2 - theme.space.m) / 2;

  return (
    <Screen
      inTabs
      refreshing={listings.refreshing}
      onRefresh={listings.refresh}
      header={
        <ScreenHeader
          layout="bar"
          title="Livestock"
          scene="livestock"
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
      contentStyle={styles.content}
    >
      <View style={styles.searchRow}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by species, breed or Kendra" style={styles.search} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={filterCount ? `Filters, ${filterCount} active` : 'Filters'}
          onPress={() => setSheet('all')}
          style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
        >
          <SlidersHorizontal size={20} color={theme.color.primary} strokeWidth={2} />
          {filterCount ? (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{filterCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* No species/sex/weight chips here: the filter button beside the search field already opens
          all three, and the same choice offered twice only confuses. */}
      <View style={styles.resultsRow}>
        <Text style={styles.results} accessibilityLiveRegion="polite">
          {listings.data ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ' '}
        </Text>
        <View style={styles.sort}>
          <Text style={styles.sortLabel}>Sort by</Text>
          <SelectField<SortOrder>
            appearance="chip"
            label="Sort by"
            sheetTitle="Sort by"
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </View>
      </View>

      <AsyncContent
        query={listings}
        what="livestock"
        skeleton={<SkeletonGrid count={4} />}
        isEmpty={() => results.length === 0}
        empty={
          <EmptyState
            icon={SearchX}
            title="Nothing matches"
            body="Try another species or weight, or clear the filters to see everything available."
            actionLabel={filterCount || query ? 'Clear filters' : undefined}
            onAction={
              filterCount || query
                ? () => {
                    setFilters(NO_FILTERS);
                    setQuery('');
                  }
                : undefined
            }
          />
        }
      >
        {() => (
          <View style={styles.grid}>
            {results.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                width={columnWidth}
                onOpen={() => navigation.navigate('LivestockDetail', { listingId: listing.id })}
              />
            ))}
          </View>
        )}
      </AsyncContent>


      {registered ? (
        <Card padded={false} style={[styles.listCard, styles.registration]}>
          <ListRow
            title="Your registration"
            subtitle="Buyer · Tap to view"
            leading={<IconTile icon={UserCheck} pillar="livestock" size="medium" />}
            onPress={() => navigation.navigate('LivestockRegister')}
          />
        </Card>
      ) : null}

      <FilterSheet section={sheet} filters={filters} onApply={setFilters} onClose={() => setSheet(null)} />
    </Screen>
  );
}

function ListingCard({ listing, width, onOpen }: { listing: Listing; width: number; onOpen: () => void }) {
  const tint = theme.speciesTint[listing.species];
  const Icon = speciesIcon[listing.species];
  const title = SPECIES_LABEL[listing.species];

  return (
    <Card
      padded={false}
      onPress={onOpen}
      style={[styles.listing, { width }]}
      accessibilityLabel={`${title}, ${listing.breed}, ${listing.district}, ${formatINR(listing.price)}, ${listing.available} available`}
    >
      <View style={[styles.listingArt, { backgroundColor: tint.bg }]}>
        <Icon size={56} color={tint.fg} />
        <View style={styles.available}>
          <Tag label={`Available: ${listing.available}`} pillar="vandhan" variant="surface" />
        </View>
      </View>
      <View style={styles.listingBody}>
        <Text numberOfLines={1} style={styles.listingTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.listingMeta}>
          {listing.breed}
        </Text>
        <View style={styles.listingLine}>
          <MapPin size={12} color={theme.color.textSecondary} strokeWidth={2} />
          <Text numberOfLines={1} style={[styles.listingMeta, styles.shrink]}>
            {listing.district}, Nagaland
          </Text>
        </View>
        <View style={styles.listingLine}>
          <Weight size={12} color={theme.color.textSecondary} strokeWidth={2} />
          <Text style={styles.listingMeta}>{formatWeightRange(listing.weightKg.min, listing.weightKg.max)}</Text>
        </View>
        <Text style={styles.price}>{formatINR(listing.price)}</Text>
      </View>
      <Button
        label="Enquire"
        icon={Phone}
        variant="tonal"
        size="small"
        onPress={() => Linking.openURL(`tel:${listing.seller.phone}`)}
        accessibilityHint={`Calls ${listing.seller.name}`}
        style={styles.enquire}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.space.m,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  search: {
    flex: 1,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.field,
    backgroundColor: theme.color.primarySoft,
    borderWidth: 1,
    borderColor: theme.pillarTint.vandhan.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  filterCount: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    ...theme.type.label,
    fontWeight: '700',
    color: theme.color.onPrimary,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  results: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  sortLabel: {
    ...theme.type.caption,
    fontSize: 13,
    color: theme.color.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.m,
  },
  listing: {
    padding: theme.space.s,
  },
  listingArt: {
    height: 92,
    borderRadius: theme.radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  available: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  listingBody: {
    paddingHorizontal: theme.space.xs,
    paddingTop: theme.space.s,
  },
  listingTitle: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  listingMeta: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  listingLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  shrink: {
    flexShrink: 1,
  },
  price: {
    ...theme.type.figure,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
    marginTop: theme.space.xs,
  },
  enquire: {
    marginTop: theme.space.s,
  },
  registration: {
    marginTop: theme.space.s,
  },
  producerHeader: {
    marginTop: theme.space.m,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
});
