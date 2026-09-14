import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AudioPlayer from '../../components/ui/AudioPlayer';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import ListRow from '../../components/ui/ListRow';
import StatusPill from '../../components/ui/StatusPill';
import Toast from '../../components/ui/Toast';
import { getNotice, markNoticeRead } from '../../data/mock/mockNotices';
import type { NoticesScreenProps } from '../../navigation/types';
import theme from '../../theme';
import { formatDateTime } from '../formatDate';
import { formatFileSize, noticePillarMeta } from './noticeFormat';

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
  const { attachment, recording } = notice;

  // Placeholder: no real file handling yet — confirm the tap with a Toast only.
  const download = () => {
    if (attachment) setToast(`${attachment.fileName} downloaded`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.tagRow}>
          <Avatar icon={meta.icon} iconColor={meta.colors.icon} tint={meta.colors.tint} size="l" />
          <View style={styles.flex}>
            <Text style={styles.pillar}>{meta.label}</Text>
            <Text style={styles.caption}>{formatDateTime(notice.publishedAt)}</Text>
          </View>
          <StatusPill
            label={wasUnread ? 'Unread' : 'Read'}
            tone={wasUnread ? 'info' : 'neutral'}
            icon={wasUnread ? 'ellipse' : 'checkmark'}
          />
        </View>

        <Text accessibilityRole="header" style={styles.title}>
          {notice.title}
        </Text>

        {notice.body.map((paragraph) => (
          <Text key={paragraph} style={styles.body}>
            {paragraph}
          </Text>
        ))}

        {recording ? (
          <AudioPlayer
            durationSeconds={recording.durationSeconds}
            uri={recording.url}
            label="Play recording"
            accentColor={meta.colors.icon}
            tint={meta.colors.tint}
          />
        ) : null}

        {attachment ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional information</Text>
            <Card padded={false}>
              <ListRow
                icon="document-text"
                iconColor={theme.pillarTint.notices.icon}
                iconBackground={theme.pillarTint.notices.tint}
                title={attachment.fileName}
                subtitle={formatFileSize(attachment.sizeBytes)}
                trailing={
                  <Ionicons
                    name="download-outline"
                    size={theme.type.title.fontSize}
                    color={theme.color.primary}
                  />
                }
                onPress={download}
              />
            </Card>
          </View>
        ) : null}
      </ScrollView>
      <Toast visible={toast !== null} message={toast ?? ''} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  content: {
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
    color: theme.color.textPrimary,
  },
  caption: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  title: {
    ...theme.type.largeTitle,
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
