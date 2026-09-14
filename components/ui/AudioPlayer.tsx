// <AudioPlayer durationSeconds={45} uri={recording.url} label="Play recording" />
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../../theme';

export type AudioPlayerProps = {
  /** Shown before playback starts, and used whenever the file doesn't report its own length. */
  durationSeconds: number;
  /** Recording URL. When absent, progress is simulated on a timer (no real audio yet). */
  uri?: string | null;
  label?: string;
  accentColor?: string;
  tint?: string;
  style?: ViewStyle;
};

const TICK_MS = 250;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const BUTTON_SIZE = theme.space.xl + theme.space.s;

// Plays an already-recorded message — never a live call (CLAUDE.md).
export default function AudioPlayer({ uri, ...rest }: AudioPlayerProps) {
  // Separate components so each keeps its hooks unconditional.
  return uri ? <StreamingAudioPlayer uri={uri} {...rest} /> : <SimulatedAudioPlayer {...rest} />;
}

function StreamingAudioPlayer({ uri, durationSeconds, ...view }: AudioPlayerProps & { uri: string }) {
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // Recordings should be audible even with the ringer switch on silent.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!status.didJustFinish) return;
    player.pause();
    void player.seekTo(0);
  }, [status.didJustFinish, player]);

  return (
    <PlayerView
      {...view}
      playing={status.playing}
      elapsedSeconds={status.currentTime}
      durationSeconds={status.duration > 0 ? status.duration : durationSeconds}
      onToggle={() => (status.playing ? player.pause() : player.play())}
    />
  );
}

// Fallback until notices carry real recording URLs: advances progress on a timer so the
// idle/playing/paused states are exercisable. Same pattern as Thumbnail's icon fallback.
function SimulatedAudioPlayer({ durationSeconds, ...view }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const totalMs = durationSeconds * MS_PER_SECOND;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setElapsedMs((ms) => Math.min(ms + TICK_MS, totalMs)), TICK_MS);
    return () => clearInterval(timer);
  }, [playing, totalMs]);

  useEffect(() => {
    if (playing && elapsedMs >= totalMs) {
      setPlaying(false);
      setElapsedMs(0);
    }
  }, [playing, elapsedMs, totalMs]);

  return (
    <PlayerView
      {...view}
      playing={playing}
      elapsedSeconds={elapsedMs / MS_PER_SECOND}
      durationSeconds={durationSeconds}
      onToggle={() => setPlaying((current) => !current)}
    />
  );
}

type PlayerViewProps = Omit<AudioPlayerProps, 'uri' | 'durationSeconds'> & {
  playing: boolean;
  elapsedSeconds: number;
  durationSeconds: number;
  onToggle: () => void;
};

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${minutes}:${String(seconds % SECONDS_PER_MINUTE).padStart(2, '0')}`;
}

function PlayerView({
  playing,
  elapsedSeconds,
  durationSeconds,
  onToggle,
  label = 'Play recording',
  accentColor = theme.color.primary,
  tint = theme.color.primaryTint,
  style,
}: PlayerViewProps) {
  const started = playing || elapsedSeconds > 0;
  const progress = durationSeconds > 0 ? Math.min(1, elapsedSeconds / durationSeconds) : 0;
  const status = playing ? 'Playing…' : started ? 'Paused' : label;

  return (
    <View style={[styles.card, { backgroundColor: tint }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause recording' : label}
        onPress={onToggle}
        style={({ pressed }) => [styles.button, { backgroundColor: accentColor }, pressed && styles.pressed]}
      >
        <Ionicons name={playing ? 'pause' : 'play'} size={theme.type.title.fontSize} color={theme.color.background} />
      </Pressable>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.status}>
            {status}
          </Text>
          <Text style={styles.time}>
            {started
              ? `${formatClock(elapsedSeconds)} / ${formatClock(durationSeconds)}`
              : formatClock(durationSeconds)}
          </Text>
        </View>
        {started ? (
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: Math.round(durationSeconds), now: Math.round(elapsedSeconds) }}
            style={styles.track}
          >
            <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    padding: theme.space.s + theme.space.xs,
    borderRadius: theme.radius.card,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  body: {
    flex: 1,
    gap: theme.space.s,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
  },
  status: {
    ...theme.type.headline,
    color: theme.color.textPrimary,
    flex: 1,
  },
  time: {
    ...theme.type.caption,
    color: theme.color.textSecondary,
  },
  track: {
    height: theme.space.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
  },
});
