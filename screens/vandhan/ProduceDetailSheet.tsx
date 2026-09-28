import { useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/ui/Avatar';
import BottomSheet from '../../components/ui/BottomSheet';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import { rateTrends } from '../../components/ui/RateRow';
import StatusPill from '../../components/ui/StatusPill';
import Thumbnail from '../../components/ui/Thumbnail';
import type { Produce } from '../../data/mock/mockVanDhan';
import theme from '../../theme';
import { formatDate } from '../formatDate';
import { pillarMeta } from '../pillarMeta';
import { dialectLabel, formatRate, trendTone, unitLabel, unitName } from './vanDhanFormat';

const CONTENT_MAX_HEIGHT_RATIO = 0.7;
const CONTENT_MAX_HEIGHT = Dimensions.get('window').height * CONTENT_MAX_HEIGHT_RATIO;

type ProduceDetailSheetProps = {
  produce: Produce | null;
  onClose: () => void;
};

// <ProduceDetailSheet produce={selected} onClose={() => setSelected(null)} />
export default function ProduceDetailSheet({ produce, onClose }: ProduceDetailSheetProps) {
  // Keep rendering the last produce while the sheet animates closed.
  const lastShown = useRef<Produce | null>(null);
  if (produce) lastShown.current = produce;
  const item = produce ?? lastShown.current;

  return (
    <BottomSheet visible={produce !== null} onClose={onClose} title="Produce details">
      {item ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Thumbnail
              uri={item.imageUrl}
              fallbackIcon={pillarMeta.vandhan.icon}
              iconColor={pillarMeta.vandhan.colors.icon}
              tint={pillarMeta.vandhan.colors.tint}
              size="l"
            />
            <View style={styles.flex}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.secondary}>{dialectLabel(item)}</Text>
            </View>
            <StatusPill
              label={rateTrends[item.trend].label}
              tone={trendTone[item.trend]}
              icon={rateTrends[item.trend].icon}
            />
          </View>

          <Card style={styles.rateCard}>
            <View style={styles.flex}>
              <Text style={styles.caption}>Current MSP rate</Text>
              <Text style={styles.rate}>{formatRate(item.rate.amount)}</Text>
              <Text style={styles.caption}>{unitLabel(item.rate.unit)}</Text>
            </View>
            <StatusPill label={`Updated ${formatDate(item.updatedAt)}`} icon="time-outline" />
          </Card>

          <View>
            <DetailRow icon="person" label="Dialect name" value={item.dialect.name} divider />
            <DetailRow icon="cube-outline" label="Unit" value={unitName(item.rate.unit)} divider />
            {item.unitConversion ? (
              <DetailRow
                icon="swap-horizontal"
                label="Unit conversion"
                value={item.unitConversion}
                divider
              />
            ) : null}
            <DetailRow icon="shield-checkmark" label="Quality grade" value={item.qualityGrade} divider />
            <DetailRow icon="location" label="Applicable area" value={item.applicableArea} />
          </View>

          <Card tone="info" style={styles.row}>
            <Avatar icon="information" iconColor={theme.color.background} tint={theme.vandhan.color.primary} />
            <Text style={styles.info}>
              Rates are set by the government and may be revised periodically. Please call the price
              line for the latest information.
            </Text>
          </Card>

          <Button label="Close" variant="secondary" onPress={onClose} />
        </ScrollView>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: CONTENT_MAX_HEIGHT,
  },
  content: {
    gap: theme.space.m,
    paddingBottom: theme.space.s,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  name: {
    ...theme.type.title,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  rate: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  info: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    flex: 1,
  },
});
