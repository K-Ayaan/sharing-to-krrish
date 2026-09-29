// <OptionCard title="Collector" description="…" icon={ShoppingBasket} selected={role === 'collector'} onPress={…} />
// Selectable card used for role choice (vandhan-registration.png), delivery type
// (vandhan-submit-collection.png) and one-question-at-a-time steps.
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../../theme';
import IconTile from './IconTile';
import type { IconComponent } from './icons';

export type OptionCardProps = {
  title: string;
  description?: string;
  icon?: IconComponent;
  selected: boolean;
  onPress: () => void;
  // 'check' — filled check circle (role cards). 'radio' — radio dot (delivery type, questions).
  indicator?: 'check' | 'radio';
  layout?: 'row' | 'compact';
  style?: ViewStyle;
};

export default function OptionCard({
  title,
  description,
  icon,
  selected,
  onPress,
  indicator = 'check',
  layout = 'row',
  style,
}: OptionCardProps) {
  const compact = layout === 'compact';
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={description ? `${title}. ${description}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        selected && styles.cardSelected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && !compact ? (
        <IconTile icon={icon} shape="rounded" size="xlarge" bg={theme.color.primaryTint} color={theme.color.primary} />
      ) : null}
      <View style={styles.text}>
        <View style={styles.titleRow}>
          {icon && compact ? (
            <View style={styles.compactIcon}>
              {(() => {
                const Icon = icon;
                return <Icon size={26} color={theme.color.primary} strokeWidth={1.9} />;
              })()}
            </View>
          ) : null}
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        </View>
        {description ? (
          <Text style={[styles.description, compact && styles.descriptionCompact]}>{description}</Text>
        ) : null}
      </View>
      <View style={compact ? styles.indicatorCompact : styles.indicator}>
        {indicator === 'check' ? (
          <View style={[styles.checkCircle, selected && styles.checkCircleOn]}>
            {selected ? <Check size={16} color={theme.color.onPrimary} strokeWidth={3} /> : null}
          </View>
        ) : (
          <View style={[styles.radio, selected && styles.radioOn]}>
            {selected ? <View style={styles.radioDot} /> : null}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.l,
    padding: theme.space.l,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.color.border,
    backgroundColor: theme.color.surface,
  },
  cardCompact: {
    alignItems: 'flex-start',
    gap: theme.space.s,
    padding: theme.space.m + 2,
  },
  cardSelected: {
    backgroundColor: theme.color.primarySoft,
    borderColor: theme.color.primary,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  compactIcon: {
    marginRight: 2,
  },
  title: {
    ...theme.type.headline,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  titleCompact: {
    ...theme.type.bodyStrong,
    fontSize: 13,
    flexShrink: 1,
  },
  description: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  descriptionCompact: {
    ...theme.type.caption,
    marginTop: theme.space.s,
  },
  indicator: {
    alignSelf: 'flex-start',
    paddingTop: theme.space.xs,
  },
  indicatorCompact: {
    paddingTop: 2,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: theme.color.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleOn: {
    backgroundColor: theme.color.primary,
    borderColor: theme.color.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.75,
    borderColor: theme.color.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: theme.color.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.color.primary,
  },
});
