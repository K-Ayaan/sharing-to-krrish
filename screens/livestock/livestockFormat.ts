import type { Ionicons } from '@expo/vector-icons';
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

// Ionicons has no per-animal glyphs: paw for mammals, egg for poultry.
export const speciesIcon: Record<Species, IconName> = {
  pig: 'paw',
  cattle: 'paw',
  goat: 'paw',
  sheep: 'paw',
  poultry: 'egg',
  mithun: 'paw',
};

export const sexIcon: Record<Sex, IconName> = {
  male: 'male',
  female: 'female',
  unspecified: 'remove',
};

export const WEIGHT_ICON: IconName = 'scale-outline';

export const quantityLabel = (count: number) => `${count} available`;

export const enquiryLabels = (item: StockItem) => ({
  species: speciesName(item.species),
  sex: sexName(item.sex),
  weight: weightName(item.weightBand),
});
