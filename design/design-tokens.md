# MARCOFED App — Design Tokens

Source of truth for `theme/index.ts` in the React Native project. Every value below is confirmed.

## Color

Primary color is **blue**, used consistently as every filled button and every active/selected state
across all 11 screens. This supersedes the earlier "navy fill only" rule from the original prompts —
the mockups never followed it, so blue is now the real system.

| Token | Approx. value | Used for |
|---|---|---|
| `color.primary` | `#2E7CF6` | Filled buttons, active tab, links, selected chips |
| `color.primaryPressed` | `#1D5FD1` | Pressed/active state of primary |
| `color.primaryTint` | `#E8F0FE` | Light backgrounds behind primary-colored content (info banners, selected chip fill) |
| `color.background` | `#FFFFFF` | Screen background |
| `color.surface` | `#FFFFFF` | Card/row background |
| `color.surfaceMuted` | `#F5F6F8` | Search bars, secondary fields, inactive segment background |
| `color.border` | `#E5E7EB` | Hairlines, card borders |
| `color.textPrimary` | `#0F172A` | Titles, primary labels |
| `color.textSecondary` | `#666666` | Subtitles, helper text, timestamps |
| `color.success` | `#16A34A` | "Available," "Valid," "Delivered," "Paid" pills |
| `color.warning` | `#D97706` | "In progress," "KYC in progress" pills |
| `color.danger` | `#DC2626` | Movement-ban alert card, destructive states |
| `color.dangerTint` | `#FDECEC` | Alert card background |
| `color.warningTint` | `#FEF3E2` | Running-banner background ("Important Update") |
| `color.successTint` | `#E7F8EC` | Success pill background |
| `color.scrim` | `rgba(15, 23, 42, 0.4)` | Bottom-sheet backdrop (textPrimary at 40%) |

Per-pillar icon tints (`pillarTint`) are decorative only, not semantic — do not reuse them as status colors:

| Token | Icon | Tint |
|---|---|---|
| `pillarTint.vandhan` | `#22C55E` | `#E9F9EE` |
| `pillarTint.livestock` | `#F43F5E` | `#FDE7EA` |
| `pillarTint.lpg` | `#0EA5E9` | `#E5F6FD` |
| `pillarTint.notices` | `#8B5CF6` | `#F1EAFE` |

## Typography

System font throughout (`-apple-system` equivalent = React Native's default `San Francisco` on iOS,
no custom font linking needed).

| Token | Size / weight | Used for |
|---|---|---|
| `type.largeTitle` | 28 / 700 | Screen titles ("Van Dhan," "Services," "Notices") |
| `type.title` | 20 / 700 | Card headlines and IDs ("Registered as," "Dimapur Kendra") |
| `type.headline` | 17 / 600 | Row primary text, button labels |
| `type.body` | 15 / 400 | Descriptions, helper text |
| `type.caption` | 13 / 400 | Timestamps, meta text, field hints |

## Spacing & radius

| Token | Value |
|---|---|
| `space.xs` / `s` / `m` / `l` / `xl` | 4 / 8 / 16 / 24 / 40 |
| `radius.field` | 10 |
| `radius.card` | 16 |
| `radius.pill` | 999 (fully rounded — buttons, status chips, segmented controls) |

## Component inventory

Build these once as shared components — every screen reuses them, never redraw per-screen:

- `Button` — primary (filled blue), secondary (outline), text-link
- `StatusTracker` — horizontal step tracker, variable step count (3 steps on LPG/pickup, 4 on Livestock) — same visual component, different `steps` prop.
  `orientation="vertical"` renders a timeline (e.g. GrievanceStatus); steps take optional `detail` and `description`
- `RunningBanner` — ambient, no dismiss, used for "Important Update" / non-urgent notices
- `AlertCard` — bordered, requires an "Acknowledge" button, used for outbreak/movement-ban notices —
  visually distinct from RunningBanner (different shape, not just different color)
- `StatusPill` — small rounded label (Available / In progress / Delivered / Paid / Valid / KYC in progress)
- `ListRow` — icon + title + optional subtitle + trailing chevron or status pill
- `FilterChip` — pill-shaped, selected/unselected state, used in Livestock filters and Notices tabs
- `BottomSheet` — used for produce detail (Van Dhan), select-species/sex/weight (Livestock filters)
- `TabBar` — Home / Services / Records / Notices / Ask Us, persistent across the app
- `Toast` — bottom-anchored transient message, auto-dismisses after ~2s, no actions

Added for Onboarding / Home / Services:

- `TextField` — label, required mark, leading icon or prefix, trailing slot, error; `variant="search"` for search bars; `multiline` renders a ~3-line, top-aligned box that grows
- `SelectField` — field-styled trigger that opens a `BottomSheet` list of options
- `OtpInput` — fixed-length digit boxes over one hidden input (supports iOS one-time-code autofill)
- `Checkbox` — round checkbox with label
- `Card` — rounded surface container; tones `default` / `info` / `warning` / `danger`
- `StepProgress` — onboarding header: back chevron, step dots, "Step N of M"
- `QuickActionTile` — tinted icon square with label (Home quick actions)
- `Avatar` — initials or a decorative icon in a circle
- `IconButton` — icon-only button with optional count badge

Added for Van Dhan:

- `RateRow` — produce rate row: thumbnail, name + dialect, price + unit, trend badge, updated date, chevron
- `Thumbnail` — rounded image (`m` / `l` square, `banner` 16:9) with a tinted icon fallback when there's no photo
- `DetailRow` — read-only icon + label + value row (not pressable, no chevron); optional `detail` line and `trailing` slot
- `OptionCard` — selectable card (icon, title, description) for single-choice groups

Added for Livestock:

- `StockCard` — grid tile for browsable stock: thumbnail, title, subtitle, available count, location, chevron
- `PhotoCarousel` — paging horizontal carousel of 16:9 `Thumbnail`s with page dots (single fallback when there are no photos)

Added for Notices:

- `AudioPlayer` — play/pause control for a recorded message: idle (play, label, duration) and playing
  (pause, "Playing…", elapsed / total, progress bar). Plays `uri` with expo-audio; with no `uri` it
  simulates progress on a timer

Extensions to existing components: `Button` has an optional `trailingIcon`; `StatusPill` has an `info`
tone and an optional leading `icon`; `ListRow` has an optional `icon`, a `titleAccessory` slot and a
`large` size; `RunningBanner` has a `tone` of `warning` (default) or `info`; `FilterChip` has an optional leading
`icon` and `iconColor`, a `trailingIcon` (e.g. a dropdown chevron) and `onRemove` (adds a ×);
`ListRow` has `divider`, `selected` (multi-select rows) and `unread` (a dot in place of the chevron,
and "Unread" at the start of its VoiceOver label); `BottomSheet` has `onDone`, which adds a
× close on the left and a "Done" action on the right of a centred title.
