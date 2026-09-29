import { SPECIES_LABEL, type Listing, type Species } from '../../data/mock/mockLivestock';

export type SexFilter = 'any' | 'female' | 'male';
export type WeightFilter = 'any' | 'under10' | '10to100' | '100to300' | 'over300';
export type SortOrder = 'nearest' | 'priceLow' | 'priceHigh';

export type LivestockFilters = {
  species: Species | 'any';
  sex: SexFilter;
  weight: WeightFilter;
};

export const NO_FILTERS: LivestockFilters = { species: 'any', sex: 'any', weight: 'any' };

export const SPECIES_ORDER: Species[] = ['cow', 'buffalo', 'goat', 'pig', 'chicken', 'duck'];

export const SEX_OPTIONS: { value: SexFilter; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export const WEIGHT_OPTIONS: { value: WeightFilter; label: string; range: [number, number] }[] = [
  { value: 'any', label: 'Any weight', range: [0, Infinity] },
  { value: 'under10', label: 'Under 10 kg', range: [0, 10] },
  { value: '10to100', label: '10 – 100 kg', range: [10, 100] },
  { value: '100to300', label: '100 – 300 kg', range: [100, 300] },
  { value: 'over300', label: 'Over 300 kg', range: [300, Infinity] },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'nearest', label: 'Nearest' },
  { value: 'priceLow', label: 'Price: low to high' },
  { value: 'priceHigh', label: 'Price: high to low' },
];

export function activeFilterCount(filters: LivestockFilters) {
  return [filters.species !== 'any', filters.sex !== 'any', filters.weight !== 'any'].filter(Boolean).length;
}

export function applyFilters(
  listings: Listing[],
  filters: LivestockFilters,
  query: string,
  sort: SortOrder,
  homeDistrict: string | undefined
) {
  const q = query.trim().toLowerCase();
  const weightRange = WEIGHT_OPTIONS.find((w) => w.value === filters.weight)!.range;

  const matches = listings.filter((listing) => {
    if (listing.available <= 0) return false;
    if (filters.species !== 'any' && listing.species !== filters.species) return false;
    if (filters.sex !== 'any' && listing.sex !== filters.sex && listing.sex !== 'mixed') return false;
    // A listing matches a weight band when its weight range overlaps it.
    if (listing.weightKg.max < weightRange[0] || listing.weightKg.min > weightRange[1]) return false;
    if (!q) return true;
    return [SPECIES_LABEL[listing.species], listing.breed, listing.id, listing.district, listing.seller.name]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });

  return matches.sort((a, b) => {
    if (sort === 'priceLow') return a.price - b.price;
    if (sort === 'priceHigh') return b.price - a.price;
    // "Nearest" without GPS: the person's own district first, then alphabetical by district.
    const aHome = a.district === homeDistrict ? 0 : 1;
    const bHome = b.district === homeDistrict ? 0 : 1;
    return aHome - bHome || a.district.localeCompare(b.district);
  });
}
