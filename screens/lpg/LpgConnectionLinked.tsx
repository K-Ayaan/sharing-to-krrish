import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailRow from '../../components/ui/DetailRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import SuccessBadge from '../../components/ui/SuccessBadge';
import { useTabBarInset } from '../../components/ui/TabBarSpacer';
import { getConnection } from '../../data/mock/mockLpg';
import type { LpgScreenProps } from '../../navigation/types';
import theme from '../../theme';

const { color } = theme.lpg;

// Reached with navigation.replace from LpgHome's registration form, so Back goes to Services
// rather than into the finished form. "Go to LPG" pops to a fresh, linked LpgHome.
export default function LpgConnectionLinked({ navigation }: LpgScreenProps<'LpgConnectionLinked'>) {
  const connection = getConnection();
  const tabBarInset = useTabBarInset();
  // No header here (LpgConnectionLinked.png), so the content clears the status bar itself.
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScenicBackdrop />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.space.l }]}>
        <View style={styles.hero}>
          <SuccessBadge tone="primary" />
          <Text accessibilityRole="header" style={styles.title}>
            LPG connection linked!
          </Text>
        </View>

        {connection ? (
          <Card>
            <DetailRow iconTinted icon="card-outline" label="LPG ID" value={connection.lpgId} divider />
            <DetailRow iconTinted icon="person-outline" label="Consumer number" value={connection.consumerNumber} />
          </Card>
        ) : null}

        <Card tone="info" style={styles.infoRow}>
          <Avatar icon="information" iconColor={theme.color.background} tint={color.primary} />
          <Text style={[styles.secondary, styles.flex]}>
            You can now book refills and track delivery status in the LPG section.
          </Text>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: theme.space.s + tabBarInset }]}>
        <Button label="Go to LPG" trailingIcon="arrow-forward" onPress={() => navigation.popTo('LpgHome')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.background,
  },
  content: {
    padding: theme.space.m,
    gap: theme.space.l,
  },
  flex: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    gap: theme.space.s,
  },
  title: {
    ...theme.type.largeTitle,
    fontWeight: '800',
    color: theme.color.textPrimary,
    textAlign: 'center',
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  footer: {
    paddingHorizontal: theme.space.m,
    paddingVertical: theme.space.s,
  },
});
