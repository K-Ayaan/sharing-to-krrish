// Results for Home's inline search (home.png, top right): services, notices and records by name.
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, Clock, SearchX, X } from 'lucide-react-native';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import ListRow from '../../components/ui/ListRow';
import { SkeletonList } from '../../components/ui/Skeleton';
import type { PillarKey } from '../../data/mock/mockUser';
import { PILLAR_ORDER } from '../../services/homeService';
import { getNotices } from '../../services/noticesService';
import { getRecords } from '../../services/recordsService';
import { useQuery } from '../../services/useQuery';
import theme from '../../theme';
import { formatDate } from '../../utils/format';
import { pillarMeta } from '../pillarMeta';
import { recordIcon } from '../records/recordFormat';
import { clearSearches, forgetSearch, useRecentSearches } from './recentSearches';

export type SearchTarget =
  | { type: 'pillar'; pillar: PillarKey }
  | { type: 'notice'; id: string }
  | { type: 'record'; id: string };

const MAX_PER_GROUP = 5;

// Search rows carry no pillar colour — the icon is there to say what kind of thing it is.
const NEUTRAL = { bg: theme.color.surfaceMuted, color: theme.color.textPrimary };

export default function SearchResults({
  query,
  onSelect,
  onPickRecent,
}: {
  query: string;
  onSelect: (target: SearchTarget) => void;
  // Tapping one of the earlier searches puts it back in the field.
  onPickRecent: (term: string) => void;
}) {
  const recents = useRecentSearches();
  const notices = useQuery('notices', getNotices);
  const records = useQuery('records', getRecords);
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;
    const match = (...fields: string[]) => fields.some((field) => field.toLowerCase().includes(q));
    return {
      pillars: PILLAR_ORDER.filter((p) => match(pillarMeta[p].label, pillarMeta[p].description)),
      notices: (notices.data ?? []).filter((n) => match(n.title, n.summary)).slice(0, MAX_PER_GROUP),
      records: (records.data ?? []).filter((r) => match(r.title, r.subtitle)).slice(0, MAX_PER_GROUP),
    };
  }, [q, notices.data, records.data]);

  if (!q) {
    if (recents.length === 0) {
      return <Text style={styles.hint}>Search for a service, a notice or one of your records.</Text>;
    }
    return (
      <View>
        <View style={styles.recentHead}>
          <Text style={styles.groupLabel}>RECENT SEARCHES</Text>
          <Pressable accessibilityRole="button" onPress={clearSearches} hitSlop={8}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        </View>
        {recents.map((term) => (
          <ListRow
            key={term}
            title={term}
            leading={<IconTile icon={Clock} size="small" {...NEUTRAL} />}
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${term}`}
                onPress={() => forgetSearch(term)}
                hitSlop={10}
              >
                <X size={16} color={theme.color.textTertiary} strokeWidth={2} />
              </Pressable>
            }
            onPress={() => onPickRecent(term)}
          />
        ))}
      </View>
    );
  }
  if (!notices.data || !records.data) {
    return <SkeletonList count={4} thumb={36} lines={2} />;
  }
  if (!results || results.pillars.length + results.notices.length + results.records.length === 0) {
    return (
      <View style={styles.empty}>
        <SearchX size={28} color={theme.color.textTertiary} strokeWidth={1.75} />
        <Text style={styles.hint}>Nothing matches “{query.trim()}”.</Text>
      </View>
    );
  }

  return (
    <View style={styles.groups}>
      {results.pillars.length > 0 ? (
        <View>
          <Text style={styles.groupLabel}>SERVICES</Text>
          <Card padded={false} style={styles.card}>
            {results.pillars.map((pillar, index) => (
              <ListRow
                key={pillar}
                title={pillarMeta[pillar].label}
                subtitle={pillarMeta[pillar].description}
                leading={<IconTile icon={pillarMeta[pillar].icon} size="small" {...NEUTRAL} />}
                divider={index < results.pillars.length - 1}
                onPress={() => onSelect({ type: 'pillar', pillar })}
              />
            ))}
          </Card>
        </View>
      ) : null}
      {results.notices.length > 0 ? (
        <View>
          <Text style={styles.groupLabel}>NOTICES</Text>
          <Card padded={false} style={styles.card}>
            {results.notices.map((notice, index) => (
              <ListRow
                key={notice.id}
                title={notice.title}
                subtitle={formatDate(notice.publishedAt)}
                leading={<IconTile icon={Bell} size="small" {...NEUTRAL} />}
                divider={index < results.notices.length - 1}
                onPress={() => onSelect({ type: 'notice', id: notice.id })}
              />
            ))}
          </Card>
        </View>
      ) : null}
      {results.records.length > 0 ? (
        <View>
          <Text style={styles.groupLabel}>RECORDS</Text>
          <Card padded={false} style={styles.card}>
            {results.records.map((record, index) => (
              <ListRow
                key={record.id}
                title={record.title}
                subtitle={`${record.subtitle} · ${formatDate(record.at)}`}
                leading={<IconTile icon={recordIcon(record)} size="small" {...NEUTRAL} />}
                divider={index < results.records.length - 1}
                onPress={() => onSelect({ type: 'record', id: record.id })}
              />
            ))}
          </Card>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: theme.space.l,
  },
  groupLabel: {
    ...theme.type.label,
    color: theme.color.textSecondary,
    marginBottom: theme.space.xs,
  },
  card: {
    paddingHorizontal: theme.space.l,
  },
  hint: {
    ...theme.type.body,
    color: theme.color.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.space.xl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: theme.space.xl,
  },
  recentHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clear: {
    ...theme.type.body,
    fontSize: 13,
    fontWeight: '500',
    color: theme.pillarTint.vandhan.icon,
  },
});
