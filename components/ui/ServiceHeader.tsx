// <ServiceHeader title="Livestock" icon="paw" iconColor={…} tint={…} onBack={goBack} trailing={<IconButton … />} />
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';
import { isPillarAppearance, useAppearance } from './Appearance';
import IconButton from './IconButton';
import Thumbnail from './Thumbnail';

export type ServiceHeaderProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  tint: string;
  /** Omit when there is nothing to go back to. */
  onBack?: () => void;
  /** Right-hand slot, e.g. the notification bell. */
  trailing?: ReactNode;
};

const MIN_TITLE_SCALE = 0.8;

// Top of every service's home and registration screen, in place of the native header: nothing sits
// above the title, the service logo sits beside it, and there is no subtitle (flow.md).
export default function ServiceHeader({ title, icon, iconColor, tint, onBack, trailing }: ServiceHeaderProps) {
  const insets = useSafeAreaInsets();
  const { appearance, color } = useAppearance();
  // Redesigned pillars (Van Dhan, Livestock) sit on a decorative backdrop: no header fill, and the
  // back chevron is dark inside a white circle, like the bell beside it.
  const redesigned = isPillarAppearance(appearance);

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + theme.space.s },
        redesigned && styles.headerClear,
      ]}
    >
      {onBack ? (
        <IconButton
          icon="chevron-back"
          color={redesigned ? color.textPrimary : color.primary}
          tint={redesigned ? color.surface : undefined}
          accessibilityLabel="Back"
          onPress={onBack}
          style={styles.back}
        />
      ) : null}
      <Thumbnail uri={null} fallbackIcon={icon} iconColor={iconColor} tint={tint} />
      <Text
        accessibilityRole="header"
        adjustsFontSizeToFit
        minimumFontScale={MIN_TITLE_SCALE}
        numberOfLines={1}
        style={styles.title}
      >
        {title}
      </Text>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.s,
    paddingHorizontal: theme.space.m,
    paddingBottom: theme.space.s,
    backgroundColor: theme.color.background,
  },
  headerClear: {
    backgroundColor: 'transparent',
    gap: theme.space.m,
  },
  back: {
    marginLeft: -theme.space.s,
  },
  title: {
    ...theme.type.largeTitle,
    color: theme.color.textPrimary,
    flex: 1,
  },
});
