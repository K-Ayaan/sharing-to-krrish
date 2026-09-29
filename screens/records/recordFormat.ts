import {
  Building2,
  CalendarClock,
  CalendarDays,
  FileText,
  GraduationCap,
  Hash,
  IndianRupee,
  Leaf,
  MapPin,
  Medal,
  MessageSquareWarning,
  PawPrint,
  Scale,
  ShoppingBag,
  Sprout,
  Stethoscope,
  Tag,
  Target,
  Truck,
  UserRound,
} from 'lucide-react-native';
import type { StatusTone } from '../../components/ui/StatusPill';
import { CowIcon, CylinderIcon, type IconComponent } from '../../components/ui/icons';
import type { DetailIcon, RecordStatus, RecordSummary } from '../../services/recordsService';

export const detailIcon: Record<DetailIcon, IconComponent> = {
  quantity: ShoppingBag,
  product: Leaf,
  calendar: CalendarDays,
  reference: Hash,
  location: MapPin,
  grade: Medal,
  delivery: Truck,
  cylinder: CylinderIcon,
  distributor: Building2,
  amount: IndianRupee,
  purpose: Target,
  tenure: CalendarClock,
  species: PawPrint,
  weight: Scale,
  person: UserRound,
  category: Tag,
  note: FileText,
};

export function recordIcon(record: RecordSummary): IconComponent {
  switch (record.kind) {
    case 'collection':
      return Sprout;
    case 'grievance':
    case 'complaint':
      return MessageSquareWarning;
    case 'booking':
      return CylinderIcon;
    case 'batch':
      return CowIcon;
    case 'event':
      return record.pillar === 'livestock' ? Stethoscope : GraduationCap;
    case 'application':
      return FileText;
  }
}

export function recordTone(record: { status: RecordStatus; delivery?: boolean }): StatusTone {
  if (record.delivery) return 'delivery';
  switch (record.status) {
    case 'completed':
      return 'verified';
    case 'pending':
      return 'pending';
    case 'in_progress':
      return 'progress';
    case 'rejected':
      return 'rejected';
  }
}
