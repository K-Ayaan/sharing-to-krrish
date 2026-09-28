// <AppearanceProvider appearance="onboarding">…screens…</AppearanceProvider>
// const { appearance, color } = useAppearance();
import { createContext, ReactNode, useContext } from 'react';
import theme, { Palette } from '../../theme';

export type AppearanceName = 'default' | 'onboarding' | 'vandhan' | 'livestock' | 'lpg';

export type Appearance = {
  appearance: AppearanceName;
  color: Palette;
};

const APPEARANCES: Record<AppearanceName, Appearance> = {
  default: { appearance: 'default', color: theme.color },
  onboarding: { appearance: 'onboarding', color: theme.onboarding.color },
  vandhan: { appearance: 'vandhan', color: theme.vandhan.color },
  livestock: { appearance: 'livestock', color: theme.livestock.color },
  lpg: { appearance: 'lpg', color: theme.lpg.color },
};

const AppearanceContext = createContext<Appearance>(APPEARANCES.default);

type AppearanceProviderProps = {
  appearance: AppearanceName;
  children: ReactNode;
};

// Lets a flow opt into a redesigned look (onboarding's green-on-sage, Van Dhan's green-on-cream) without every
// screen passing colours down: shared components read the palette and shape from here. Context
// reaches through Modal, so bottom sheets opened inside the flow match it too.
export function AppearanceProvider({ appearance, children }: AppearanceProviderProps) {
  return (
    <AppearanceContext.Provider value={APPEARANCES[appearance]}>{children}</AppearanceContext.Provider>
  );
}

export function useAppearance() {
  return useContext(AppearanceContext);
}

/** A redesigned service pillar (Van Dhan, Livestock, LPG): tinted page, transparent service header. */
export const isPillarAppearance = (appearance: AppearanceName) =>
  appearance === 'vandhan' || appearance === 'livestock' || appearance === 'lpg';

/** Soft coloured drop shadow used by onboarding's cards, fields and buttons. */
export const onboardingShadow = {
  shadowColor: theme.onboarding.shadow.shadowColor,
  shadowOpacity: theme.onboarding.shadow.shadowOpacity,
  shadowRadius: theme.onboarding.shadow.shadowRadius,
  shadowOffset: { width: 0, height: theme.onboarding.shadow.shadowOffsetY },
} as const;
