# MARCOFED App — Claude Code instructions

React Native (Expo, TypeScript) iOS app for MARCOFED, connecting Nagaland citizens to five
cooperative services. This file is read automatically at the start of every Claude Code session in
this repo — keep it current as the app grows.

## Reference material (read before writing any screen)

- `/design/design-tokens.md` — every color, type scale, spacing/radius value, and the shared
  component inventory. Build the component inventory listed there before building any screen.
- `/design/flow.md` — the full navigation graph. This is the source of truth for React Navigation
  structure. Build the navigator shape from this file exactly; don't invent routes it doesn't list.
- `/design/screens/*.png` — the approved visual reference for every screen, named to match the
  screen names used in `flow.md` (e.g. `VanDhanHome.png`, `LpgHome.png`, `StockDetails.png`).
  Match these pixel-for-pixel where reasonable; where RN/iOS can't replicate something exactly
  (e.g. the Liquid Glass tab bar), get as close as `expo-blur`'s `BlurView` allows and note the
  gap in a comment rather than silently diverging.

## Build order

Work in this order. Don't jump ahead to screens before the layers under them exist.

1. **Scaffold** — Expo (TypeScript template), `react-navigation` (native-stack + bottom-tabs),
   `react-native-safe-area-context`, `expo-blur`, `@expo/vector-icons` (SF Symbols set on iOS).
2. **Theme** — `theme.ts` implementing every token in `design-tokens.md` exactly, exported as a
   single object. No screen may use a raw hex value or magic number — everything through `theme`.
3. **Shared components** — build the full component inventory from `design-tokens.md`
   (`Button`, `StatusTracker`, `RunningBanner`, `AlertCard`, `StatusPill`, `ListRow`, `FilterChip`,
   `BottomSheet`, `TabBar`, plus later additions recorded there) as standalone, reusable, prop-driven components in `components/ui/`.
   Do not build any of these inline inside a screen file.
4. **Navigation shell** — the root stack + tab navigator from `flow.md`, with placeholder screens
   (title text only) at every route so the whole navigation graph is tappable before any screen
   has real content.
5. **Screens, pillar by pillar** — Onboarding → Home → Services → Van Dhan → Livestock → LPG →
   Notices → Records. Build each screen against its matching file in `/design/screens/`, using
   only the shared components from step 3. If a screen seems to need something not in the
   component inventory, stop and flag it rather than building a one-off.
6. **Mock data layer** — a single `data/mock/` module per pillar (e.g. `mockVanDhanRates.ts`)
   feeding the screens. No screen fetches from a real API yet; wire against mock data with the
   same shape a real API response would have, so swapping in a live backend later is a data-layer
   change only.

## Rules that override anything a screen mockup might seem to suggest

- **No in-app voice calls, ever.** Every "call" action is `Linking.openURL('tel:...')`, handing off
  to the native iOS phone app. The only exception is `NoticeDetail`'s playback of an
  already-recorded message — that's audio playback, not a live call, and uses a simple
  `expo-audio` player.
- **No Micro-Finance routes, screens, or data in this version.** If a stray reference turns up
  from an earlier design pass, remove it rather than stub it out.
- **Livestock is buyer-only.** No listing creation, no certificate upload, no producer-facing
  fields anywhere in this app. If `/design/screens/` still contains producer-flow images from an
  earlier pass, ignore them — `flow.md`'s `LivestockStack` is the only source of truth.
- **Primary color is blue**, used consistently for every filled button and active state — this is
  what's actually in every approved screen, and takes precedence over any earlier note about navy.
- **Pillar stacks nest inside `ServicesStack`.** `VanDhanStack`, `LivestockStack` and `LpgStack` are
  nested screens of `ServicesStack`. This is the confirmed navigator shape, not an open question.
- **Home's status card has two distinct buttons.** "View Details" → `ServicesTab` → `LpgStack:RequestStatus`.
  "Book Refill" → `ServicesTab` → `LpgStack:LpgHome`, which opens `RequestRefillSheet` on arrival via
  the `openRefillSheet` param.
- **Completing a form replaces it.** A "Submit" / "Request" / "Continue" that completes a form uses
  `navigation.replace` (or `completeForm()` for multi-step forms) so back never re-enters the filled-in
  form. Full rule in `flow.md`'s cross-cutting rules.
- **No Micro-Finance chip in the Notices filter row**, even though `Notices.png` shows one. This is an
  intentional deviation from the reference image, not an oversight — don't re-add it.

## Open questions to raise with the user, not resolve unilaterally

- Any token a screen needs that isn't in `design-tokens.md` — ask rather than guess or inline it.
- `AskUsStack` has no approved screen yet — build a minimal placeholder and flag it for design,
  don't invent content.
- If any two files in `/design/screens/` conflict (e.g. two versions of the same screen), stop and
  ask which is canonical rather than picking one.

## What "done" looks like for a screen

A screen is complete when: it's built entirely from `components/ui/` primitives, it matches its
reference image in `/design/screens/`, it's wired into the navigator exactly as `flow.md`
describes, and it reads from the mock data layer rather than hardcoded content inline.
