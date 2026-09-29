// livestock-enquiry.png — one listing: photos, price, key facts, the selling Kendra, health and
// vaccination, and Call / WhatsApp to enquire (both hand off to the phone's own apps).
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Boxes,
  ChevronRight,
  FileText,
  MapPin,
  PawPrint,
  Phone,
  ShieldCheck,
  Tag as TagIcon,
  Weight,
} from 'lucide-react-native';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ErrorState from '../../components/ui/ErrorState';
import IconButton from '../../components/ui/IconButton';
import PhotoCarousel from '../../components/ui/PhotoCarousel';
import Screen from '../../components/ui/Screen';
import SectionHeader from '../../components/ui/SectionHeader';
import { SkeletonDetail } from '../../components/ui/Skeleton';
import StatTile from '../../components/ui/StatTile';
import { WhatsAppIcon } from '../../components/ui/icons';
import { SPECIES_LABEL } from '../../data/mock/mockLivestock';
import type { LivestockScreenProps } from '../../navigation/types';
import { getListing } from '../../services/livestockService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate, formatINR, formatWeightRange } from '../../utils/format';
import { speciesIcon } from './livestockFormat';

const SEX_LABEL = { female: 'Female', male: 'Male', mixed: 'Mixed' } as const;

export default function LivestockDetail({ navigation, route }: LivestockScreenProps<'LivestockDetail'>) {
  const { listingId } = route.params;
  const insets = useSafeAreaInsets();
  const listing = useQuery(`livestock:listing:${listingId}`, () => getListing(listingId));
  const data = listing.data;

  const back = (
    <View style={[styles.back, { top: insets.top + theme.space.s }]}>
      <IconButton icon={ArrowLeft} label="Back" variant="overlay" onPress={navigation.goBack} />
    </View>
  );

  if (!data) {
    return (
      <View style={styles.root}>
        <Screen contentStyle={{ paddingTop: insets.top + 64 }}>
          {listing.error ? (
            <ErrorState error={listing.error} onRetry={listing.refetch} what="this listing" />
          ) : (
            <SkeletonDetail />
          )}
        </Screen>
        {back}
      </View>
    );
  }

  const title = `${SPECIES_LABEL[data.species]} (${data.breed.replace(/ \(.*\)/, '')})`;
  const whatsappDigits = data.seller.phone.replace(/\D/g, '');
  const whatsappText = encodeURIComponent(`Hello, I’m interested in ${title} (stock ${data.id.toUpperCase()}) on MARCOFED.`);

  return (
    <View style={styles.root}>
      <Screen
        contentStyle={styles.noPad}
        footer={
          <View style={styles.actions}>
            <Button
              label="Call"
              icon={Phone}
              onPress={() => Linking.openURL(`tel:${data.seller.phone}`)}
              accessibilityHint={`Calls ${data.seller.name}`}
              style={styles.action}
            />
            <Button
              label="WhatsApp"
              icon={WhatsAppIcon}
              variant="tonal"
              onPress={() => Linking.openURL(`https://wa.me/${whatsappDigits}?text=${whatsappText}`)}
              accessibilityHint={`Messages ${data.seller.name} on WhatsApp`}
              style={styles.action}
            />
          </View>
        }
      >
        <PhotoCarousel
          photos={data.photos}
          fallbackIcon={speciesIcon[data.species]}
          tint={theme.speciesTint[data.species]}
          height={260 + insets.top}
          accessibilityLabel={`Photos of ${title}`}
        />

        <View style={styles.body}>
          <View>
            <View style={styles.titleRow}>
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              <Text style={styles.price}>{formatINR(data.price)}</Text>
            </View>
            <Text style={styles.description}>{data.description}</Text>
          </View>

          <View style={styles.stats}>
            <StatTile icon={Weight} label="Weight" value={formatWeightRange(data.weightKg.min, data.weightKg.max)} />
            <StatTile icon={Boxes} label="Available" value={String(data.available)} />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Seller" />
            <Card
              onPress={() =>
                Linking.openURL(`geo:0,0?q=${encodeURIComponent(`${data.seller.name}, ${data.seller.district}, Nagaland`)}`)
              }
              accessibilityLabel={`${data.seller.name}, ${data.seller.district}. Open in maps`}
            >
              <View style={styles.seller}>
                <Avatar name={data.seller.name} size={46} />
                <View style={styles.flex}>
                  <Text style={styles.sellerName}>{data.seller.name}</Text>
                  <View style={styles.line}>
                    <MapPin size={13} color={theme.color.textSecondary} strokeWidth={2} />
                    <Text style={styles.muted}>{data.seller.district}, Nagaland</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={theme.color.textPrimary} strokeWidth={2} />
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Health & Vaccination" />
            <Card tone="success">
              <View style={styles.seller}>
                <View style={styles.healthIcon}>
                  <ShieldCheck size={22} color={theme.color.primary} strokeWidth={2} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.healthTitle}>
                    {data.health.vaccinated ? 'Healthy & Vaccinated' : 'Vaccination pending'}
                  </Text>
                  <Text style={styles.muted}>{data.health.vaccines}</Text>
                  <Text style={styles.muted}>Last health check: {formatDate(data.health.lastCheck)}</Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Additional Details" />
            <Card padded={false} style={styles.listCard}>
              <DetailRow icon={PawPrint} iconStyle="bare" layout="column" label="Breed" value={data.breed} />
              <DetailRow icon={TagIcon} iconStyle="bare" layout="column" label="Sex" value={SEX_LABEL[data.sex]} />
              <DetailRow icon={FileText} iconStyle="bare" layout="column" label="Purpose" value={data.purpose} />
              <DetailRow
                icon={MapPin}
                iconStyle="bare"
                layout="column"
                label="Available At"
                value={data.seller.name}
                divider={false}
              />
            </Card>
          </View>

          {data.notes ? (
            <View style={styles.section}>
              <SectionHeader title="Notes" />
              <Card>
                <View style={styles.note}>
                  <FileText size={20} color={theme.color.textSecondary} strokeWidth={1.75} />
                  <Text style={[styles.muted, styles.flex]}>{data.notes}</Text>
                </View>
              </Card>
            </View>
          ) : null}
        </View>
      </Screen>
      {back}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  back: {
    position: 'absolute',
    left: theme.space.l,
  },
  noPad: {
    paddingHorizontal: 0,
    gap: 0,
  },
  body: {
    paddingHorizontal: theme.size.screenPadding,
    paddingTop: theme.space.l,
    gap: theme.space.l,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  title: {
    ...theme.type.largeTitle,
    fontSize: 24,
    lineHeight: 31,
    color: theme.color.textPrimary,
    flex: 1,
  },
  price: {
    ...theme.type.largeTitle,
    fontSize: 22,
    lineHeight: 31,
    color: theme.pillarTint.vandhan.icon,
    fontVariant: ['tabular-nums'],
  },
  description: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  section: {
    gap: theme.space.s,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  sellerName: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.color.textPrimary,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  muted: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.textSecondary,
  },
  healthIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.color.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthTitle: {
    ...theme.type.bodyStrong,
    fontSize: 15,
    color: theme.pillarTint.vandhan.icon,
  },
  listCard: {
    paddingHorizontal: theme.space.l,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.m,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space.s,
  },
  action: {
    flex: 1,
  },
});
