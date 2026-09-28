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
| `color.backgroundWarm` | `#FAF8F2` | Warm cream page (Services, Settings — redesign batch 2) |
| `color.backgroundCool` | `#F5F8FD` | Pale blue-white page (LPG, My Records — batches 5–6) |
| `color.complete` | `#7C3AED` | Finished-state pills: Delivered, Collected, Resolved (batch 6) |
| `color.completeTint` | `#F1EAFE` | `complete` pill background |
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

### Onboarding palette (`theme.onboarding`)

The onboarding flow has been redesigned green-on-sage (`design/screens/onboarding/`). Only onboarding
uses it for now — `OnboardingLayout` wraps the flow in `<AppearanceProvider appearance="onboarding">`,
and shared components read their colours from `useAppearance()`. The rest of the app stays blue until
its own redesign arrives; each redesign batch confirms its scope before spreading further.

| Token | Value | Used for |
|---|---|---|
| `onboarding.color.primary` | `#2F6B4B` | Filled buttons, progress fill, checkboxes, icons in badges |
| `onboarding.color.primaryPressed` | `#24553B` | Pressed primary |
| `onboarding.color.primaryTint` | `#E2EADC` | Round icon badges, country-code segment, copy buttons |
| `onboarding.color.background` | `#EEF2E8` | Sage screen background |
| `onboarding.color.surface` | `#F7F9F3` | Fields, cards, OTP boxes |
| `onboarding.color.surfaceMuted` | `#E6ECE0` | Info panels (`Card tone="info"`) |
| `onboarding.color.border` | `#D6E0D0` | Progress track, bordered Aadhaar field, unchecked boxes |
| `onboarding.color.textPrimary` | `#133A28` | Titles, values, header, back chevron |
| `onboarding.color.textSecondary` | `#7B867E` | Subtitles, hints, placeholders, "Step N of 6" |
| `onboarding.color.success` / `successTint` | `#2F6B4B` / `#DCE9D6` | Success badge |

Other keys of `onboarding.color` fall back to `color`. Also: `onboarding.type.title` 32/800 (step
titles), `onboarding.type.header` 18/500 ("Create your account"), `onboarding.radius.card` 24, and
`onboarding.shadow` (primary-coloured, 10% opacity, 16 radius, 6 offset) for raised fields, cards and
buttons. `onboarding.art.*` are decorative illustration fills only (sun, hills, trees, houses, leaves,
waves, confetti) — never UI state.

## Typography

System font throughout (`-apple-system` equivalent = React Native's default `San Francisco` on iOS,
no custom font linking needed).

| Token | Size / weight | Used for |
|---|---|---|
| `type.display` | 32 / 800 | Redesigned tab-root titles (Home greeting, Services) |
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
- `FilterChip` — pill-shaped, selected/unselected state, used in Livestock filters (the "Filters" dropdown and the pills in its sheet) and Notices tabs
- `BottomSheet` — used for produce detail (Van Dhan), the single Livestock filter sheet (species / sex / weight sections of pills)
- `TabBar` — Home / Services / Records / Notices / Ask Us, persistent across the app. A floating Liquid Glass
  pill over the screens: native iOS 26 Liquid Glass (`expo-glass-effect` `GlassView`, the see-through
  `clear` style with a faint white tint) where available, otherwise glassmorphism from
  `theme.material.liquid` (moderate blur, an almost clear fill, a thin dark edge with a corner-lit rim
  inside it — bright at the top-left and bottom-right, nearly gone between — a fainter inner bevel lit
  from the opposite corner, a soft edge band for the glass's thickness, and a crisp top sheen) — never a solid white pill; a lighter pill of glass with the same corner-lit rim marks
  the active tab (on native Liquid Glass too). Under the finger it becomes a clear droplet lifted off the
  bar (`lens*` tokens: soft shadow, bright rim, specular spot, caustic glint, shaded lower edge), swells
  out past the bar's edge (magnifying the icon beneath it), follows it when dragging across the bar,
  stretching with drag speed, and settles with a slight wobble on release. Scroll content ends with `TabBarSpacer`; pinned footers use
  `useTabBarInset()`, and `Toast` clears the bar automatically
- `ServiceHeader` — top header for every service home/registration screen, in place of the native header:
  back chevron, the service logo tile beside a bold title, and a trailing slot for the bell; no subtitle
- `LoaderScreen` — the app's initial loading view: white `theme.launch` surface, black "MARCOFED" wordmark
  (34pt bold), a 160×3pt capsule bar that fills left to right in 1.8s and fades back to empty on a loop
  (native-driven, so it moves while JS is busy at startup), and the caption "People • Produce • Prosper".
  Non-interactive
- `Toast` — bottom-anchored transient message, auto-dismisses after ~2s, no actions

Added for Onboarding / Home / Services:

- `TextField` — label, required mark, leading icon or prefix, trailing slot, error; `variant="search"` for search bars; `multiline` renders a ~3-line, top-aligned box that grows
- `SelectField` — field-styled trigger that opens a `BottomSheet` list of options
- `OtpInput` — fixed-length digit boxes over one hidden input (supports iOS one-time-code autofill);
  used by `PhoneOtp` to verify the contact number
- `Checkbox` — round checkbox with label
- `Card` — rounded surface container; tones `default` / `info` / `warning` / `danger`
- `StepProgress` — onboarding header: back chevron, step dots, "Step N of M"; an optional `title` puts a centred heading beside the chevron and moves the dots to a second row
- `QuickActionTile` — tinted icon square with label (Home quick actions)
  `muted` greys the tile, icon and label (e.g. a service the user hasn't registered for) while keeping it pressable
- `Avatar` — initials or a decorative icon in a circle
- `IconButton` — icon-only button with optional count badge
- `ProfileChip` — avatar + UID at the top of the Services, My Records, Notices and Ask Us tabs; tapping it
  opens Settings. `layout="stacked"` (Services) puts a "UID" caption over the number beside a larger avatar

Added for Van Dhan:

- `RateRow` — produce rate row: thumbnail, name + dialect, price + unit, trend badge, updated date, chevron
- `Thumbnail` — rounded image (`m` / `l` square, `banner` 16:9) with a tinted icon fallback when there's no photo
- `DetailRow` — read-only icon + label + value row (not pressable, no chevron); optional `detail` line and `trailing` slot
- `OptionCard` — selectable card (icon, title, description) for single-choice groups

Added for Livestock:

- `StockCard` — grid tile for browsable stock: thumbnail, title, subtitle, available count, location, chevron
- `PhotoCarousel` — paging horizontal carousel of 16:9 `Thumbnail`s with page dots (single fallback when there are no photos)

Added for Notices:

- None — `AudioPlayer` was removed along with notice recordings.

Added for Ask Us:

- `ExpandableRow` — question-and-answer row: wrapping title with a chevron that flips, body text shown
  below when expanded; the parent owns `expanded` (so a list can keep one open); optional `divider`

Added for Settings:

- `GlassCard` — frosted-glass card: blur, translucent surface fill, light edge and soft shadow from
  `theme.material.glass`, which is derived from existing colour tokens (opacity and elevation only,
  no new hues). Needs a tinted backdrop behind it to read as glass

Added for the onboarding redesign:

- `AppearanceProvider` / `useAppearance()` (`Appearance.tsx`) — switches shared components to a flow's
  palette and shape (today `default` or `onboarding`)
- `ConsentCard` — tickable consent statement: icon badge, title, description, rounded-square checkbox on the right
- `InfoToggle` — info badge + short question + chevron ("Why do we need this?"); the parent shows the answer
  inline (`expanded`) or in a sheet
- `KeyboardDoneBar` — iOS `InputAccessoryView` with a "Done" pill above the number pad
- `Landscape` — SVG hills/sun/houses/branch scene between onboarding content and its footer
- `OnboardingBackdrop` — SVG leaves in the top-left/bottom-left corners and pale waves behind each step
- `SuccessBadge` — SVG tick in two green rings with leaves and confetti (RegistrationComplete)

The three illustrations are SVG approximations of the raster artwork in the reference images
(no watercolour texture or blur).

Onboarding appearance of existing components: `Button` primary is taller with a soft shadow, and
disabled fades instead of turning grey; `TextField`/`SelectField` become raised pills with a round icon
badge (`shape="rounded"` gives the bordered Aadhaar box), labels are optional (`SelectField labelHidden`);
`OtpInput` boxes are sage with a caret in the active box; `StepProgress` shows a bar with a knob, and a
row of finished dots on the last step; `Checkbox` is a rounded square (`CheckboxBox` is exported);
`Card` is borderless and raised, and `tone="info"` is a flat sage panel; `Avatar` defaults to the palette;
`IconButton` has an optional `tint` circle.

### Van Dhan palette (`theme.vandhan`, batch 3)

The app palette with `primary` `#1E6B42`, `primaryPressed` `#175634`, `primaryTint` `#E6F2E7` and
`background` = `backgroundWarm`; text stays navy. `VanDhanStack` provides it through
`AppearanceProvider appearance="vandhan"`, and `TabBar`'s `accent` turns the active tab green there.
The Van Dhan price-line card deliberately stays the app blue (as in `VanDhanHome.png`).

Added for Van Dhan (batch 3): `Radio` — display-only round mark (radio in the kendra sheet; also the
multi-select mark in Livestock's filter sheets).

### Livestock palette (`theme.livestock`, batch 4)

The app palette with `primary` `#E94F6B`, `primaryPressed` `#CC3A56`, `primaryTint` `#FDE7EA` and
`background` = `backgroundWarm`; text stays navy. `livestock.art` recolours `ScenicBackdrop` in pinks.
`LivestockStack` provides it; the running banner (blue) and movement-ban `AlertCard` (red) keep their
own colours.

Added for Livestock (batch 4): `AppIcon` — renders an Ionicons name or an `mci:`-prefixed
MaterialCommunityIcons name (animal glyphs). `ListRow`, `FilterChip`, `Thumbnail`, `StockCard`,
`PhotoCarousel` and `DetailRow` accept either. `PhotoCarousel`'s active dot follows the palette.

Batch 3 extensions, all palette-aware (they follow `useAppearance()` instead of fixed blue): `FilterChip`,
`ListRow`, `StatusPill` (`info`), `StatusTracker`, `OptionCard`, `SelectField`, `BottomSheet`,
`TextField` focus. Plus: `OptionCard indicator` (tick/ring in the corner); `StatusTracker variant="guide"`
with per-step `icon` ("What happens next?"); `DetailRow stacked` (caption over a bold value, tinted icon
tile); `TextField`/`SelectField iconTinted`; `SelectField` option `description`, `sheetSubtitle`,
`optionIcon` and `confirmLabel` (card list with radios and a confirm button); `ServiceHeader` in a
redesigned appearance is transparent with a round white back button; `TabBar accent`; `BottomSheet` uses
the cream page colour in Van Dhan.

### LPG palette (`theme.lpg`, batch 5)

The app palette unchanged except `background` `#F5F8FD` (pale blue-white). `lpg.art` recolours
`ScenicBackdrop` in blues; `lpg.cylinder` colours the gas-cylinder illustration.

Added for LPG (batch 5):

- `CylinderIllustration` — red LPG cylinder among leaves on a pale cloud (LpgHome, LpgRegistration)
- `DocumentIllustration` — paper sheet with a `message` / `typing` / `alert` bubble (LPG form screens)
- `PageIntro` — subtitle text with an illustration beside it, under a native large title
- `PhotoPicker` — dashed "Tap to add photos" box using expo-image-picker (library only, JPEG), with
  removable thumbnails; `max` limits the count

Batch 5 extensions: `Button chevron` (full-width action row: icon, left-aligned label, chevron);
`DetailRow iconTinted` (tinted icon tile in the side-by-side layout); `TextField variant="inset"` (label
inside the box above the input, tinted icon tile); `SuccessBadge tone="primary"` (blue rings, leaves and
rays).

Batch 8 (Ask Us): `ExpandableRow` gains `subtitle` (always-visible summary), a leading `icon` tile
(`iconColor` / `iconBackground`) and a chevron in a tinted circle.

Batch 7 (Notices): `ListRow timestamp` (time top-right with the unread dot beneath, chevron always
shown); `IconButton selected` (toggle state for VoiceOver).

Batch 6 (Records): `StatusPill` tone `complete` (purple, finished states); `Button` variant `danger`
(red outline, destructive actions like "Cancel collection"); `ScenicBackdrop tone` (`green` / `rose` /
`blue`) overrides the appearance's colours.

Added for the Home / Services / Settings redesign (batch 2, blue palette kept):

- `SoftBackdrop` — pale blue/green circles behind Settings (existing tint tokens); `leaves` adds a sprig
- `ScenicBackdrop` — faint hills and corner leaves behind Home and Services (reuses `onboarding.art` fills at low opacity)

Batch 2 extensions: `ListRow` has `iconShape="circle"`, `leading` (e.g. an Avatar), `meta` (text before the
chevron, e.g. a date) and `tone="danger"`; `Card` has `elevated` (soft glass shadow); `IconButton` `tint`
(also used for the Services bell); `BottomSheet` lifts above the keyboard.

Extensions to existing components: `Button` has an optional `trailingIcon`; `StatusPill` has an `info`
tone and an optional leading `icon`; `ListRow` has an optional `icon`, a `titleAccessory` slot and a
`large` size; `RunningBanner` has a `tone` of `warning` (default) or `info`; `FilterChip` has an optional leading
`icon` and `iconColor`, a `trailingIcon` (e.g. a dropdown chevron) and `onRemove` (adds a ×);
`ListRow` has `divider`, `selected` (multi-select rows) and `unread` (a dot in place of the chevron,
and "Unread" at the start of its VoiceOver label); `BottomSheet` has `onDone`, which adds a
× close on the left and a "Done" action on the right of a centred title — or `showClose`, which adds a ×
to the right of a left-aligned title.
