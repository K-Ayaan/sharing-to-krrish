import type { Ionicons } from '@expo/vector-icons';
import type { AppIconName } from '../../components/ui/AppIcon';
import {
  sexOptions,
  speciesOptions,
  weightBandOptions,
  type Option,
  type Sex,
  type Species,
  type StockItem,
  type WeightBand,
} from '../../data/mock/mockLivestock';

type IconName = keyof typeof Ionicons.glyphMap;

function nameOf<T extends string>(options: Option<T>[], id: T) {
  return options.find((option) => option.id === id)?.name ?? id;
}

export const speciesName = (id: Species) => nameOf(speciesOptions, id);
export const sexName = (id: Sex) => nameOf(sexOptions, id);
export const weightName = (id: WeightBand) => nameOf(weightBandOptions, id);

// Animal glyphs from MaterialCommunityIcons (Ionicons has none). No bundled icon set has a goat or a
// mithun: goat keeps the paw, and mithun — a bovine — uses the cow.
export const speciesIcon: Record<Species, AppIconName> = {
  pig: 'mci:pig-variant',
  cattle: 'mci:cow',
  goat: 'paw',
  sheep: 'mci:sheep',
  poultry: 'mci:bird',
  mithun: 'mci:cow',
};

export const sexIcon: Record<Sex, IconName> = {
  male: 'male',
  female: 'female',
  unspecified: 'remove',
};

export const WEIGHT_ICON: AppIconName = 'mci:weight-kilogram';

// ---- Sorting (LivestockHome's "Sort by")

export type StockSort = 'availability' | 'recent' | 'weight';

export const sortOptions: { id: StockSort; name: string }[] = [
  { id: 'availability', name: 'Availability' },
  { id: 'recent', name: 'Recently updated' },
  { id: 'weight', name: 'Weight (light to heavy)' },
];

const WEIGHT_ORDER = weightBandOptions.map((option) => option.id);

/** Most available first; newest update first; lightest weight band first. Ties keep list order. */
export function sortStock(items: StockItem[], sort: StockSort): StockItem[] {
  const sorted = [...items];
  switch (sort) {
    case 'availability':
      return sorted.sort((a, b) => b.quantityAvailable - a.quantityAvailable);
    case 'recent':
      return sorted.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    case 'weight':
      return sorted.sort((a, b) => WEIGHT_ORDER.indexOf(a.weightBand) - WEIGHT_ORDER.indexOf(b.weightBand));
  }
}

export const quantityLabel = (count: number) => `${count} available`;

export const enquiryLabels = (item: StockItem) => ({
  species: speciesName(item.species),
  sex: sexName(item.sex),
  weight: weightName(item.weightBand),
});
