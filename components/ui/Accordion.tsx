// <Accordion icon={FileText} title="How do I register for a service?" expanded={open} onToggle={…}>…</Accordion>
import { ReactNode, useEffect, useRef } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import theme from '../../theme';
import IconTile from './IconTile';
import type { IconComponent } from './icons';
import { useScrollIntoView } from './scrollIntoView';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export type AccordionProps = {
  title: string;
  icon?: IconComponent;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function Accordion({ title, icon, expanded, onToggle, children }: AccordionProps) {
  const ref = useRef<View>(null);
  const scrollIntoView = useScrollIntoView();

  // An answer that opens near the foot of the page would otherwise unfold off-screen.
  useEffect(() => {
    if (expanded) scrollIntoView(ref);
  }, [expanded, scrollIntoView]);

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={title}
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(theme.motion.base, 'easeInEaseOut', 'opacity')
          );
          onToggle();
        }}
        style={styles.header}
      >
        {icon ? <IconTile icon={icon} size="medium" /> : null}
        <Text style={styles.title}>{title}</Text>
        {expanded ? (
          <ChevronUp size={22} color={theme.color.textPrimary} strokeWidth={2} />
        ) : (
          <ChevronDown size={22} color={theme.color.textPrimary} strokeWidth={2} />
        )}
      </Pressable>
      {expanded ? <View style={[styles.body, icon && styles.bodyIndented]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.card,
    ...theme.elevation.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.m,
    minHeight: 62,
    paddingHorizontal: theme.space.l,
    paddingVertical: theme.space.m,
  },
  title: {
    flex: 1,
    ...theme.type.bodyStrong,
    fontSize: 14,
    fontWeight: '500',
    color: theme.color.textPrimary,
  },
  body: {
    paddingHorizontal: theme.space.l,
    paddingBottom: theme.space.l,
  },
  bodyIndented: {
    paddingLeft: theme.space.l + 42 + theme.space.m,
  },
});
