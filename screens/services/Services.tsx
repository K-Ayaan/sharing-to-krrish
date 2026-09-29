// services-page.png, completed against SDD S-08/S-09: every service with its registration state.
// Registered services open; the rest say what's needed and offer Register. Every card is the same
// height, with that service's own scene in its own colours along its foot.
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ArrowRight, Bell, ChevronRight } from 'lucide-react-native';
import AsyncContent from '../../components/ui/AsyncContent';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import IconTile from '../../components/ui/IconTile';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ui/ScreenHeader';
import ServiceScene from '../../components/ui/ServiceScene';
import { SkeletonCards } from '../../components/ui/Skeleton';
import StatusPill from '../../components/ui/StatusPill';
import type { ServicesScreenProps } from '../../navigation/types';
import { getServices, getUnreadCount, type PillarStatus } from '../../services/homeService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { pillarMeta } from '../pillarMeta';
import { openPillar } from './openPillar';

const CARD_HEIGHT = 172;
const SCENE_HEIGHT = 52;

export default function Services({ navigation }: ServicesScreenProps<'ServicesHub'>) {
  const services = useQuery('services', getServices);
  const unread = useQuery('notices:unread', getUnreadCount);

  return (
    <Screen
      inTabs
      refreshing={services.refreshing}
      onRefresh={services.refresh}
      header={
        <ScreenHeader
          layout="hero"
          title="Services"
          right={
            <IconButton
              icon={Bell}
              label="Notices"
              badge={(unread.data ?? 0) > 0}
              onPress={() => navigation.navigate('NoticesTab', { screen: 'NoticesList' })}
            />
          }
        />
      }
    >
      <AsyncContent query={services} what="services" skeleton={<SkeletonCards count={4} height={CARD_HEIGHT} />}>
        {(items) => (
          <View style={styles.list}>
            {items.map((item) => (
              <ServiceTile key={item.pillar} item={item} onOpen={() => openPillar(navigation, item.pillar, item.registered)} />
            ))}
          </View>
        )}
      </AsyncContent>
    </Screen>
  );
}

function ServiceTile({ item, onOpen }: { item: PillarStatus; onOpen: () => void }) {
  const { width } = useWindowDimensions();
  const meta = pillarMeta[item.pillar];
  const cardWidth = width - theme.size.screenPadding * 2;

  return (
    <Card
      tone={item.pillar}
      padded={false}
      onPress={onOpen}
      style={styles.card}
      accessibilityLabel={`${meta.label}. ${item.registered ? 'Registered' : 'Not registered'}. ${meta.description}`}
    >
      <View style={styles.scene} pointerEvents="none">
        <ServiceScene pillar={item.pillar} width={cardWidth} height={SCENE_HEIGHT} />
      </View>

      <View style={styles.row}>
        <IconTile icon={meta.icon} pillar={item.pillar} shape="rounded" size="xlarge" />
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {meta.label}
            </Text>
            {item.registered ? (
              <StatusPill tone="verified" label="Registered" size="small" style={styles.pill} />
            ) : null}
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {meta.description}
          </Text>
          {!item.registered && meta.needed ? (
            <Text style={styles.needed} numberOfLines={1}>
              <Text style={styles.neededLabel}>Needed: </Text>
              {meta.needed}
            </Text>
          ) : null}
        </View>
        {item.registered ? (
          <View style={styles.chevron}>
            <ChevronRight size={20} color={theme.color.textPrimary} strokeWidth={2} />
          </View>
        ) : null}
      </View>

      {!item.registered ? (
        <View style={styles.register}>
          <Button
            label="Register"
            trailingIcon={ArrowRight}
            onPress={onOpen}
            size="small"
            variant={item.pillar === 'lpg' ? 'pillar' : 'primary'}
            pillarColor={item.pillar === 'lpg' ? 'lpg' : undefined}
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.space.m,
  },
  card: {
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  scene: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.l,
    paddingHorizontal: theme.space.l,
    paddingTop: theme.space.l,
  },
  text: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.headline,
    fontSize: 17,
    lineHeight: 24,
    color: theme.color.textPrimary,
    flexShrink: 1,
  },
  pill: {
    marginLeft: 'auto',
  },
  description: {
    ...theme.type.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  needed: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  neededLabel: {
    fontWeight: '600',
    color: theme.color.textPrimary,
  },
  chevron: {
    alignSelf: 'center',
  },
  register: {
    alignSelf: 'flex-end',
    paddingRight: theme.space.l,
    paddingBottom: theme.space.m,
  },
});
