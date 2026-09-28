import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../components/ui/Card';
import IconButton from '../../components/ui/IconButton';
import ListRow from '../../components/ui/ListRow';
import ScenicBackdrop from '../../components/ui/ScenicBackdrop';
import StatusPill from '../../components/ui/StatusPill';
import TabBarSpacer from '../../components/ui/TabBarSpacer';
import Thumbnail from '../../components/ui/Thumbnail';
import Toast from '../../components/ui/Toast';
import { getNotice, markNoticeRead, type NoticePillar } from '../../data/mock/mockNotices';
import type { NoticesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDateTime } from '../formatDate';
import { formatFileSize, noticePillarMeta } from './noticeFormat';

// Leaves in the notice's pillar colours (redesign batch 7); the page itself stays the app's blue.
const BACKDROP_TONE: Record<NoticePillar, 'green' | 'rose' | 'blue'> = {
  vandhan: 'green',
  livestock: 'rose',
  lpg: 'blue',
  general: 'blue',
};

export default function NoticeDetail({ route }: NoticesScreenProps<'NoticeDetail'>) {
  const notice = getNotice(route.params.noticeId);
  // Show the state the notice was in when opened; the list sees it as read on return.
  const [wasUnread] = useState(() => (notice ? !notice.read : false));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (notice && !notice.read) markNoticeRead(notice.id);
  }, [notice]);

  if (!notice) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} style={styles.screen}>
        <Card>
          <Text style={styles.secondary}>This notice is no longer available.</Text>
        </Card>
      </ScrollView>
    );
  }

  const meta = noticePillarMeta[notice.pillar];
  const { attachment } = notice;

  // Placeholder: no real file handling yet — confirm the tap with a Toast only.
  const download = () => {
    if (attachment) setToast(`${attachment.fileName} downloaded`);
  };

  return (
    <View style={styles.screen}>
      {/* Behind the whole page, not inside the scroll content, so it always spans the full screen
          (this header has no large title, so the ScrollView needn't be the first view). */}
      <ScenicBackdrop tone={BACKDROP_TONE[notice.pillar]} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Card elevated style={styles.tagRow}>
          <Thumbnail uri={null} fallbackIcon={meta.icon} iconColor={meta.colors.icon} tint={meta.colors.tint} size="l" />
          <View style={styles.flex}>
            <Text style={styles.pillar}>{meta.label}</Text>
            <Text style={styles.caption}>{formatDateTime(notice.publishedAt)}</Text>
          </View>
          <StatusPill
            label={wasUnread ? 'Unread' : 'Read'}
            tone={wasUnread ? 'info' : 'neutral'}
            icon={wasUnread ? 'ellipse' : 'checkmark'}
          />
        </Card>

        <Card elevated style={styles.article}>
          <Text accessibilityRole="header" style={styles.title}>
            {notice.title}
          </Text>
          {notice.body.map((paragraph) => (
            <Text key={paragraph} style={styles.body}>
              {paragraph}
            </Text>
          ))}
        </Card>

        {attachment ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional information</Text>
            <Card padded={false} elevated>
              <ListRow
                icon="document-text"
                iconColor={theme.pillarTint.notices.icon}
                iconBackground={theme.pillarTint.notices.tint}
                title={attachment.fileName}
                subtitle={formatFileSize(attachment.sizeBytes)}
                trailing={
                  <IconButton
                    icon="download-outline"
                    color={theme.color.primary}
                    tint={theme.color.primaryTint}
                    accessibilityLabel={`Download ${attachment.fileName}`}
                    onPress={download}
                  />
                }
                onPress={download}
              />
            </Card>
          </View>
        ) : null}
        <TabBarSpacer />
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.backgroundCool,
  },
  article: {
    gap: theme.space.m,
  },
  content: {
    // Fill at least the screen, so the backdrop inside the scroll content reaches the bottom.
    flexGrow: 1,
    padding: theme.space.m,
    gap: theme.space.m,
  },
  flex: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  pillar: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textSecondary,
  },
  caption: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  title: {
    ...theme.type.largeTitle,
    fontWeight: '800',
    color: theme.color.textPrimary,
  },
  body: {
    ...theme.type.body,
    fontSize: theme.type.headline.fontSize,
    color: theme.color.textPrimary,
  },
  secondary: {
    ...theme.type.body,
    color: theme.color.textSecondary,
  },
  section: {
    gap: theme.space.s,
  },
  sectionTitle: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
  },
});
