import { daysAgo } from './dates';
import type { PillarKey } from './mockUser';

// Service events that aren't one of the app's own transactions but still belong in the user's
// history (records.png: health camps, vaccinations, trainings logged by officers).
export type ServiceEvent = {
  id: string;
  pillar: PillarKey;
  title: string;
  provider: string;
  at: string;
  status: 'completed' | 'pending';
  location: string;
  notes: string | null;
};

export const mockEvents: ServiceEvent[] = [
  { id: 'ev-311', pillar: 'livestock', title: 'Livestock Health Camp', provider: 'Veterinary Service', at: daysAgo(14, 11, 0), status: 'completed', location: 'Ungma Veterinary Centre', notes: '3 cattle examined. No issues found.' },
  { id: 'ev-296', pillar: 'livestock', title: 'Cattle Vaccination', provider: 'Veterinary Service', at: daysAgo(22, 10, 0), status: 'completed', location: 'Ungma Veterinary Centre', notes: 'FMD and HS vaccination for 5 cattle.' },
  { id: 'ev-270', pillar: 'vandhan', title: 'Handicraft Training', provider: 'Van Dhan', at: daysAgo(51, 10, 0), status: 'completed', location: 'Mokokchung Kendra', notes: 'Two-day bamboo craft training. Certificate issued at the Kendra.' },
];
