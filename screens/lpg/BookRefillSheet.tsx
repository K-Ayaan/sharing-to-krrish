// SDD S-31 "Request a refill": choose the cylinder, see what's payable on delivery, confirm.
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IndianRupee, Truck } from 'lucide-react-native';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import OptionCard from '../../components/ui/OptionCard';
import { CYLINDER_LABEL, REFILL_PAYABLE, type CylinderType } from '../../data/mock/mockLpg';
import theme from '../../theme';
import { formatINR } from '../../utils/format';

const CYLINDER_TITLE: Record<CylinderType, string> = {
  domestic_14: 'Domestic, large',
  domestic_5: 'Domestic, small',
};

export default function BookRefillSheet({
  visible,
  defaultCylinder,
  booking,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  defaultCylinder: CylinderType;
  booking: boolean;
  onClose: () => void;
  onConfirm: (cylinder: CylinderType) => void;
}) {
  const [cylinder, setCylinder] = useState<CylinderType>(defaultCylinder);

  useEffect(() => {
    if (visible) setCylinder(defaultCylinder);
  }, [visible, defaultCylinder]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Book a refill"
      subtitle="Which cylinder?"
      footer={
        <Button label="Book refill" variant="pillar" pillarColor="lpg" loading={booking} onPress={() => onConfirm(cylinder)} />
      }
    >
      <View style={styles.options}>
        {(Object.keys(CYLINDER_LABEL) as CylinderType[]).map((type) => (
          <OptionCard
            key={type}
            layout="compact"
            indicator="radio"
            title={CYLINDER_TITLE[type]}
            description={CYLINDER_LABEL[type]}
            selected={cylinder === type}
            onPress={() => setCylinder(type)}
          />
        ))}
      </View>
      <View style={styles.info}>
        <View style={styles.line}>
          <IndianRupee size={16} color={theme.color.textSecondary} strokeWidth={2} />
          <Text style={styles.text}>
            Pay <Text style={styles.strong}>{formatINR(REFILL_PAYABLE)}</Text> on delivery
          </Text>
        </View>
        <View style={styles.line}>
          <Truck size={16} color={theme.color.textSecondary} strokeWidth={2} />
          <Text style={styles.text}>You’ll get the dispatch point, date and time by SMS once it’s arranged.</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: theme.space.s,
  },
  info: {
    marginTop: theme.space.l,
    gap: theme.space.s,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  text: {
    ...theme.type.body,
    flex: 1,
    color: theme.color.textSecondary,
  },
  strong: {
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
});
