// One place for how each service is named, described and drawn across Home, Services, Records
// and Notices. Descriptions are the copy from home.png / services-page.png.
import { HandCoins, Sprout } from 'lucide-react-native';
import { CowIcon, CylinderIcon, type IconComponent } from '../components/ui/icons';
import type { PillarKey } from '../data/mock/mockUser';
import type { IllustrationTone } from '../theme';

export type PillarMeta = {
  label: string;
  description: string;
  icon: IconComponent;
  illustration: IllustrationTone;
  // SDD S-08 "Needed before you can use it" — shown on services the person hasn't registered for.
  needed: string | null;
};

export const pillarMeta: Record<PillarKey, PillarMeta> = {
  vandhan: {
    label: 'Van Dhan',
    description: 'Sell forest produces, check prices and schedule pickups.',
    icon: Sprout,
    illustration: 'green',
    needed: null,
  },
  livestock: {
    label: 'Livestock',
    description: 'Browse MARCOFED livestock stock for purchase.',
    icon: CowIcon,
    illustration: 'peach',
    needed: 'A village council letter and a photograph',
  },
  lpg: {
    label: 'LPG',
    description: 'Track your refill requests and delivery status.',
    icon: CylinderIcon,
    illustration: 'blue',
    needed: 'Your ration card number and a photograph',
  },
  microfinance: {
    label: 'Micro-Finance',
    description: 'Apply for a loan, share documents and follow your application.',
    icon: HandCoins,
    illustration: 'gold',
    needed: 'Society membership and a bank passbook',
  },
};
