// <ScreenHeader layout="bar" title="Van Dhan" onBack={goBack} right={<IconButton icon={Bell} … />} />
// <ScreenHeader layout="hero" title="Records" subtitle="Your service records in one place" landscape="green" right={<Avatar … />} />
import { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import theme, { type IllustrationTone, type PillarToken } from '../../theme';
import IconButton from './IconButton';
import Landscape from './Landscape';
import ServiceScene from './ServiceScene';

export type ScreenHeaderProps = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  // 'bar'     — plain back arrow + title inline (vandhan-page.png, lpg-page.png, settings.png).
  // 'inline'  — tinted circular back + title inline (record-detail.png, vandhan-submit-collection.png).
  // 'stacked' — tinted circular back on its own row, big title below (login-info.png).
  // 'hero'    — no back, large title (records.png, notices-page.png, askus-page.png, services-page.png).
  layout?: 'bar' | 'inline' | 'stacked' | 'hero';
  right?: ReactNode;
  landscape?: IllustrationTone | false;
  // A service's own scene instead of the general hills (pasture for Livestock, forest for Van Dhan…).
  // Use on that service's screens only; general screens keep `landscape`.
  scene?: PillarToken;
  // Skip the status-bar inset when the header sits inside a list that already handles it.
  safeTop?: boolean;
  style?: ViewStyle;
  // Set by <Screen>, which pins the title row and lets the scenery scroll away with the page:
  // 'bar' is the back button and title only, 'art' the illustration band on its own.
  part?: 'all' | 'bar' | 'art';
};

const TITLE_ROW_HEIGHT = 46;
// The hills band when it scrolls in the page body — kept low, and drawn without the sun and birds,
// so there's no empty sky between the title and the hills.
const SCROLLING_LANDSCAPE_HEIGHT = 52;

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  layout = 'bar',
  right,
  landscape = false,
  scene,
  safeTop = true,
  style,
  part = 'all',
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const circleBack = layout === 'inline' || layout === 'stacked';
  const big = layout === 'hero' || layout === 'stacked';

  const back = onBack ? (
    <IconButton
      icon={ArrowLeft}
      label="Back"
      variant={circleBack ? 'tinted' : 'plain'}
      onPress={onBack}
      style={circleBack ? styles.circleBack : styles.plainBack}
    />
  ) : null;

  // Only the row layouts let the title flex; in the stacked layout flex:1 inside an auto-height
  // column collapses the title to zero height.
  const titleBlock = title ? (
    <View style={layout === 'stacked' ? undefined : styles.titleBlock}>
      <Text
        accessibilityRole="header"
        numberOfLines={2}
        style={[big ? styles.titleBig : styles.title, layout === 'bar' && !subtitle && styles.titleBarAlone]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          numberOfLines={2}
          style={[big ? styles.subtitleBig : styles.subtitle, (landscape || scene) && styles.subtitleBeside]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  ) : (
    <View style={styles.titleBlock} />
  );

  const topInset = (safeTop ? insets.top : 0) + theme.space.m;
  const landscapeHeight = big ? 116 : 92;
  // Service scenes sit in a 72px band whose tallest shapes (trees, the signal mast) start ~16px in;
  // the header is sized so that band begins below the title row (44px), never behind the title,
  // back button or bell.
  const sceneHeight = 72;
  const artMinHeight = scene ? TITLE_ROW_HEIGHT + sceneHeight - 16 : landscapeHeight;
  const hasArt = Boolean(landscape || scene);

  const art = scene ? (
    <ServiceScene pillar={scene} width={width} height={sceneHeight} />
  ) : landscape ? (
    <Landscape width={width} height={landscapeHeight} tone={landscape} spread="right" />
  ) : null;

  // The scenery on its own, drawn in the page body so it scrolls with the content. It's a shorter
  // band here than when it sat behind the title, so there's no empty sky above the hills.
  if (part === 'art') {
    if (!hasArt) return null;
    return (
      <View style={styles.artBand} pointerEvents="none">
        {scene ? (
          <ServiceScene pillar={scene} width={width} height={sceneHeight} />
        ) : (
          // 'full' so the hills reach across the band instead of leaving open sky on the left.
          <Landscape
            width={width}
            height={SCROLLING_LANDSCAPE_HEIGHT}
            tone={landscape as IllustrationTone}
            spread="full"
            sun={false}
            birds={false}
          />
        )}
      </View>
    );
  }

  // The pinned row: back button and title, with no illustration behind it. Its bottom padding is
  // small because the scenery follows immediately underneath in the page body.
  if (part === 'bar') {
    return (
      <View style={[styles.container, styles.containerBar, { paddingTop: topInset }, style]}>
        {layout === 'stacked' ? (
          <>
            {back}
            <View style={styles.stackedTitle}>{titleBlock}</View>
          </>
        ) : (
          <View style={styles.row}>
            {back}
            {titleBlock}
            {right ? <View style={styles.right}>{right}</View> : null}
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topInset },
        big && styles.containerBig,
        // Tall enough for the whole illustration, so the header never clips the sun or trees.
        hasArt ? { minHeight: topInset + artMinHeight } : null,
        style,
      ]}
    >
      {art ? (
        <View style={styles.landscape} pointerEvents="none">
          {art}
        </View>
      ) : null}
      {layout === 'stacked' ? (
        <>
          {back}
          <View style={styles.stackedTitle}>{titleBlock}</View>
        </>
      ) : (
        <View style={styles.row}>
          {back}
          {titleBlock}
          {right ? <View style={styles.right}>{right}</View> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.size.screenPadding,
    paddingBottom: theme.space.l,
    overflow: 'hidden',
  },
  containerBig: {
    paddingBottom: theme.space.xl,
  },
  containerBar: {
    paddingBottom: 0,
  },
  artBand: {
    alignItems: 'flex-end',
    marginBottom: theme.space.s,
  },
  landscape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
  },
  plainBack: {
    marginLeft: -theme.space.m,
  },
  circleBack: {
    width: 44,
    height: 44,
  },
  titleBlock: {
    flex: 1,
  },
  stackedTitle: {
    marginTop: theme.space.m,
  },
  // Keeps the subtitle clear of the landscape drawn at the right (phone number verification.png).
  subtitleBeside: {
    maxWidth: '66%',
  },
  title: {
    ...theme.type.title,
    fontSize: 22,
    lineHeight: 29,
    color: theme.color.textPrimary,
  },
  titleBarAlone: {
    paddingVertical: theme.space.xs,
  },
  titleBig: {
    ...theme.type.largeTitle,
    fontSize: 28,
    lineHeight: 34,
    color: theme.color.textPrimary,
  },
  subtitle: {
    ...theme.type.body,
    fontSize: 13,
    color: theme.color.textSecondary,
    marginTop: 2,
  },
  subtitleBig: {
    ...theme.type.body,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.textSecondary,
    marginTop: theme.space.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    alignSelf: 'flex-start',
  },
});
