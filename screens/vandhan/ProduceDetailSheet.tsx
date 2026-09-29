// Tapping a rate (vandhan-page.png ›) — the full notified rate per SDD S-10: rate, unit and
// effective date, plus where it's paid.
import { StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Clock, MapPin, Medal, Plus } from 'lucide-react-native';
import Banner from '../../components/ui/Banner';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import DetailRow from '../../components/ui/DetailRow';
import Thumbnail from '../../components/ui/Thumbnail';
import type { Produce } from '../../data/mock/mockVanDhan';
import theme from '../../theme';
import { formatDate, formatINR, updatedLabel } from '../../utils/format';
import { produceLook } from './vanDhanFormat';

export default function ProduceDetailSheet({
  produce,
  kendraName,
  canSubmit,
  onClose,
  onSubmit,
}: {
  produce: Produce | null;
  kendraName: string;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: (produce: Produce) => void;
}) {
  const look = produce ? produceLook[produce.glyph] : null;
  return (
    <BottomSheet
      visible={produce !== null}
      onClose={onClose}
      title={produce?.name}
      footer={
        produce && canSubmit ? (
          <Button label="Submit a collection" icon={Plus} onPress={() => onSubmit(produce)} />
        ) : undefined
      }
    >
      {produce && look ? (
        <>
          <View style={styles.hero}>
            <Thumbnail uri={produce.imageUrl} icon={look.icon} bg={look.bg} color={look.fg} size={64} />
            <View>
              <Text style={styles.label}>NOTIFIED RATE</Text>
              <Text style={styles.rate}>{formatINR(produce.rate)}</Text>
              <Text style={styles.unit}>per {produce.unit}</Text>
            </View>
          </View>
          <DetailRow icon={CalendarDays} label="Effective from" value={formatDate(produce.effectiveFrom)} />
          <DetailRow icon={Clock} label="Last updated" value={updatedLabel(produce.updatedAt).replace('Updated ', '')} />
          <DetailRow icon={Medal} label="Grades accepted" value={produce.grades.join(', ')} />
          <DetailRow icon={MapPin} label="Paid at" value={kendraName} divider={false} />
          <Banner
            tone="info"
            title="This is the minimum support price"
            body="Your Kendra must pay at least this rate. If you were paid less, raise a grievance."
            style={styles.banner}
          />
        </>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    marginBottom: theme.space.s,
  },
  label: {
    ...theme.type.label,
    color: theme.color.textSecondary,
  },
  rate: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  unit: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  banner: {
    marginTop: theme.space.m,
  },
});
