# MARCOFED App — Navigation Flow

Maps directly to a React Navigation tree: one root stack containing the onboarding flow and the main
tab navigator; each tab is its own stack so pillar screens push/pop independently.

## Root

```
RootStack (no header)
├── Onboarding (shown only if no stored UID)
└── MainTabs
```

## Onboarding stack — `screens/onboarding/`

Linear, no skipping, six numbered steps (`PhoneEntry` to `Consent`) under a "Create your account"
header; `RegistrationComplete` is the outcome, not a step. Matches `PhoneEntry.png`,
`OtpEntry.png` (the `PhoneOtp` screen), `AadhaarEntry.png`, `EmailEntry.png`, `ProfileDetails.png`,
`Consent.png` and `RegistrationComplete.png` in `design/screens/onboarding/` (green-on-sage redesign).
Intentional deviations from those images: `AadhaarEntry` keeps a consent checkbox (an already-registered
Aadhaar signs in there and never reaches `Consent`); `ProfileDetails` has no date-of-birth field;
`RegistrationComplete` has no back chevron and no header, progress bar or "Step N of M" (sign-in never
reaches it, so it is not counted as a step).

```
PhoneEntry → PhoneOtp → AadhaarEntry ─┬─ Aadhaar already registered → sign in (swap to MainTabs)
                                      └─ new → EmailEntry → ProfileDetails → Consent
                                               → RegistrationComplete → (swap to MainTabs)
```

The contact number is collected and OTP-verified first, then Aadhaar is asked for. Aadhaar is not
OTP-verified, so the phone OTP is the only verification step and it comes before identity.

**Aadhaar is the identity; the phone number is contact-only.**
- Every account is mapped to an Aadhaar number. There is no OTP step: `AadhaarEntry` validates the
  number locally and looks it up through the mock in `data/mock/mockOnboarding.ts`. A real integration
  would verify through a licensed AUA/KUA backend (whatever check that partner requires).
- The full Aadhaar number never leaves `AadhaarEntry`. Navigation params, the registration draft and
  anything stored carry only a masked number (`XXXX XXXX 1234`) and an opaque `aadhaarRef`.
- `AadhaarEntry` checks for 12 digits, no leading 0 or 1, and a valid Verhoeff check digit before
  continuing. "Continue" also needs the consent checkbox.
- Entering an Aadhaar that already has an account signs the user straight in — that is how someone
  gets back into their account on a new phone.
- The contact number is verified by an SMS OTP (`PhoneEntry` → `PhoneOtp`), which only proves the number
  is reachable. No account is keyed on it and it never signs anyone in: a returning user verifies a
  contact number too, but is signed in by their Aadhaar at `AadhaarEntry`.
- Mock test values: Aadhaar `2345 6789 0124` is pre-registered (sign-in path); any other
  checksum-valid number, such as `4987 0011 2230`, registers a new account. Any six-digit contact-number
  OTP verifies except `000000`, which always fails.

- `Consent` shows each statement in `consentDocument.items` as a `ConsentCard`; "Continue" stays disabled
  until every one is ticked. None is pre-ticked.
- `RegistrationComplete` writes the UID to storage and swaps the navigator for a new account;
  `AadhaarEntry` does the same for an Aadhaar that is already registered. No back button returns to either.
- The UID lives in SecureStore (`navigation/session.ts`). `RootNavigator` reads it on launch: a stored
  UID opens `MainTabs`, no UID opens `Onboarding`. `RegistrationComplete` writes it as soon as it mounts,
  so quitting on that screen doesn't send the user through onboarding again.

## MainTabs — bottom tab bar, 5 tabs

```
MainTabs
├── HomeTab → HomeStack
├── ServicesTab → ServicesStack
├── RecordsTab → RecordsStack
├── NoticesTab → NoticesStack
└── AskUsTab → AskUsStack
```

The tab bar floats over the screens as a glass pill, so content scrolls behind it. Every tab screen's
scroll content ends with `TabBarSpacer`, and pinned footers pad by `useTabBarInset()`, so nothing is left
unreachable underneath the bar.

### HomeStack — matches `Home.png` and `Settings.png`

**Intentional deviations from `Home.png`:** no "Important Update" banner and no tagline — updates live
only in Notices, never on Home. The greeting reads "Good Morning/Afternoon/Evening, <first name>" from
the live profile. Home keeps all five quick actions (the redesign shows four without LPG), and the
reference's "Livestock listing submitted" activity is not reproduced: the app is buyer-only. Home shares
Services' warm cream page (`backgroundWarm`) and `ScenicBackdrop`.

```
Home
 ├── UID chip (tap) → Settings
 ├── quick action "Van Dhan" → ServicesTab → VanDhanStack:VanDhanHome
 ├── quick action "Livestock" → ServicesTab → LivestockStack:LivestockHome
 ├── quick action "LPG" → ServicesTab → LpgStack:LpgHome
 ├── quick action "Notices" → NoticesTab:Notices
 ├── quick action "My Records" → RecordsTab:Records
 ├── notification bell → NoticesTab:Notices
 ├── "Manage" on Registered-as card → ServicesStack:Services
 ├── Recent activities row → RecordsTab:RecordDetail (a record) or NoticesTab:NoticeDetail (a notice),
 │     with that tab's list kept underneath (`initial: false`)
 └── "View all" on Recent activities → RecordsTab:Records
```

**Recent activities** replaces the old LPG status card. It shows the three newest items across the
user's records (`screens/records/recordSource.ts`) and received notices, derived on each read in
`screens/home/recentActivity.ts`, so it always agrees with My Records and Notices. Cross-tab
jumps pass `initial: false` so each nested stack keeps its root underneath: back from a pillar screen
returns to `Services`, and back from `RequestStatus` returns to `LpgHome`.

**Quick actions grey out unregistered services.** Home's quick-action row always shows all five tiles;
Van Dhan and LPG are greyed out (`QuickActionTile muted`) until their own `isRegistered` flag is set, and
tapping a grey tile opens that service's registration screen. Livestock (ungated), Notices and My Records
are never greyed.
`Services` lists every service, with All / Registered / Not registered filter chips (Livestock counts as
registered because it never needs registration).

**Settings (tap the UID chip).** The avatar + UID chip at the top of every tab (Home, Services, My
Records, Notices, Ask Us) opens `Settings`. It sits only in HomeStack: from another tab the chip switches
to the Home tab and pushes `Settings` over Home (`navigate('HomeTab', { screen: 'Settings', initial: false })`),
so Back lands on Home. Native large-title header (chevron-only back to Home) over a warm cream page. It is a menu of rows in glass sections: the profile
card and "Personal details" edit the name, district and village, "Email address" and "Contact number"
edit those fields —
each in `ProfileEditSheet`, a bottom sheet, not a new route. "Aadhaar" opens a read-only info sheet,
"MARCOFED ID" copies the UID, "Help & Support" → `AskUsTab:AskUs`. Rows in `Settings.png` with nothing
behind them yet (Notifications, Language, App theme, Privacy & Terms) are left out until they exist.
Name, email and contact number are saved to the
live profile in `data/mock/mockUser.ts`, which Home, Services, Notices and Records read, so a save shows
everywhere at once; registration now writes the values the user entered there. Aadhaar and the UID
are read-only and never part of what Settings saves. "Log out" always opens a confirmation first:
"Cancel" changes nothing; "Log out" clears the stored UID and swaps the root navigator back to
Onboarding (`PhoneEntry`), so Settings and MainTabs can't be reached afterwards. This replaces the
earlier dev-only long-press reset, which is gone. In-memory mock state (pillar registrations, logs,
read notices, the profile) is not reset by logout — it lasts until the app restarts.

### ServicesStack — matches `Services.png` (warm cream page over `ScenicBackdrop`)

```
Services
 ├── notification bell → NoticesTab:Notices
 ├── Van Dhan card → VanDhanStack:VanDhanHome
 ├── Livestock card → LivestockStack:LivestockHome
 └── LPG card → LpgStack:LpgHome
```
Micro-Finance is not included in this navigator. Do not add a placeholder route for it.

**Intentional deviations from `Services.png`:** no subtitle under the "Services" title and no
announcement banner — updates live only in Notices.

**Confirmed navigator shape:** `VanDhanStack`, `LivestockStack` and `LpgStack` are screens nested
inside `ServicesStack` (header hidden on the nesting screen) — not tabs, not root routes. The tab bar
stays visible inside every pillar, and each pillar stack's first screen inherits `ServicesStack`'s
back button to `Services`.

### VanDhanStack — matches `VanDhanHome.png`, `VanDhanRegistration.png`, `SelectKendraSheet.png`, `ProduceDetailSheet.png`, `LogCollection.png`, `CollectionSubmitted.png`, `SchedulePickup.png`, `PickupDetails.png`, `KendraInfo.png`, `GrievanceStatus.png`

The whole stack is wrapped in `<AppearanceProvider appearance="vandhan">` (green on warm cream, redesign
batch 3), and `MainTabs` colours the active tab green while `VanDhanStack` is focused. Every screen draws
`ScenicBackdrop`; screens with a native large title keep their ScrollView first and put the backdrop
inside its content.

```
VanDhanRegistration (registration gate — shown until `isRegistered` in mockVanDhan.ts)
 ├── kendra field → select-kendra sheet (cards with address and radio; "Select kendra" confirms)
 ├── "What do you sell?" — multi-select produce cards, a checkbox on each
 └── "Register" → VanDhanHome (replace, with a confirmation Toast)

VanDhanHome (registered)
 ├── notification bell → NoticesTab:Notices
 ├── (produce list row tap) → ProduceDetailSheet (modal/bottom sheet, not a push)
 ├── "Call price line" → Linking.openURL(`tel:${priceLineNumber}`) — no in-app screen
 ├── "Log a collection" → LogCollection. Each collection picks its own kendra ("Deliver to", starting
 │     │     on the registered kendra; any kendra in `mockKendras` can be chosen) and stores its `kendraId`.
 │     │     "Pre-logging for later" also requires a "Delivery date" (same 7-day window as pickups)
 │     └── "Submit collection" → CollectionSubmitted (replace, with the new `collectionId`); Back → VanDhanHome
 │           ├── "View on map" → Linking.openURL(Apple Maps URL) for the collection's kendra
 │           ├── "Kendra details" → KendraInfo (`kendraId` of the collection; without it, the registered kendra)
 │           └── "Log another" → LogCollection (replace)
 ├── "Schedule a pickup" → SchedulePickup
 │     └── "Request pickup" → PickupDetails (replace, with the new `pickupId`). The form asks for
 │           produce and quantity (required) as well as address, date and notes
 ├── rate filters: All / Trending up / Trending down / Recently updated (rate changed in the last 7 days)
 ├── pickup status card → PickupDetails (`pickupId` of the current pickup)
 │     ├── produce row → ProduceDetailSheet
 │     ├── address row → Linking.openURL(Apple Maps URL)
 │     └── contact row → Linking.openURL(`tel:...`)
 ├── kendra info card → KendraInfo
 │     ├── call button → Linking.openURL(`tel:...`)
 │     └── "Get directions" → Linking.openURL(Apple Maps URL) — no in-app screen
 └── grievance row (if present) → GrievanceStatus
       └── "Need help?" call button → Linking.openURL(`tel:...`)
```

**Van Dhan registration gate.** Van Dhan isn't linked to a new account automatically. Everyone who
registers is a producer — there is no view-only option. `isRegistered`, the kendra and the produce
types they sell live in `mockVanDhan.ts` — no shared store. The Services Van Dhan card and Home's Van Dhan quick action open
`VanDhanRegistration` when unregistered and `VanDhanHome` when registered; `VanDhanHome` also
replaces itself with `VanDhanRegistration` if reached any other way. `VanDhanRegistration` uses the
service header ("Van Dhan" beside its logo, chevron back to Services). Registered producers get
every section: rates, the price line, Log a collection, Schedule a pickup, pickup tracking, their
chosen kendra and grievances, plus Van Dhan records. "Registered as" on Home reads "Van Dhan Producer". Mock: starts unregistered on every
launch (`VAN_DHAN_REGISTERED_AT_LAUNCH`). There is no reference image for this screen yet.

### LivestockStack — matches `LivestockHome.png`, `SelectSpeciesSheet.png`, `SelectSexSheet.png`, `SelectWeightSheet.png`, `StockDetails.png` (canonical: buyer-only). **Deviation (user's decision):** the three per-filter sheets in
`SelectSpeciesSheet.png` / `SelectSexSheet.png` / `SelectWeightSheet.png` are one `LivestockFiltersSheet`.

```
The whole stack is wrapped in `<AppearanceProvider appearance="livestock">` (rose on warm cream,
redesign batch 4), and `MainTabs` colours the active tab rose while `LivestockStack` is focused. The
reference images were supplied as one composite and cropped into the per-screen files.

LivestockHome (buyer browse)
 ├── notification bell (header right) → NoticesTab:Notices
 ├── one "Filters" dropdown chip → LivestockFiltersSheet (modal): Species, Sex and Weight sections, each
 │     a wrap of toggle pills; any number of pills in any section at once; "Clear all" resets the draft;
 │     "Done" applies everything and closes, × or the backdrop discards
 │     └── selected values show as removable chips on LivestockHome; tapping one reopens the sheet
 ├── "Sort by" chip → SortSheet (Availability — default, most first / Recently updated /
 │     Weight light to heavy; one choice, applied on tap)
 ├── (stock card tap) → StockDetails (`stockId`)
 └── "Acknowledge" on movement-ban AlertCard → dismisses card, no navigation
```
`StockDetails` has exactly two actions, equal weight: `Linking.openURL('tel:...')` and
`Linking.openURL('whatsapp://send?...')`. Both fall back to a Toast when the handler isn't available
(no phone on the simulator, WhatsApp not installed). StockDetails is enquiry-only — no order, buy,
reserve or pay language or elements. Each successful hand-off records an enquiry (stock, channel, time)
in `mockLivestock.ts`, which Records shows under Livestock; a failed hand-off records nothing.
No route exists for posting a listing, uploading a certificate, or any producer-side screen — that flow
from the earlier mockup is deprecated, do not port it into the RN app.

### LpgStack — matches `LpgHome.png`, `LpgRegistration.png`, `LpgConnectionLinked.png`, `RequestRefillSheet.png`, `EnterBookingReference.png`, `RequestStatus.png`, `ComplaintCategory.png`, `ComplaintDetails.png`, `ComplaintSubmitted.png`

The whole stack is wrapped in `<AppearanceProvider appearance="lpg">` (the app's blue on a pale
blue-white page with blue leaves and hills, redesign batch 5); the tab bar stays blue. **Deviation:** the
reference images show the LPG service header on inner screens with the title drawn in the page; inner
screens keep the native large title instead, with the subtitle and illustration in a `PageIntro` row.
`LpgConnectionLinked` has no header (as in its image).

```
LpgRegistration (registration gate — shown until `isRegistered` in mockLpg.ts)
 └── "Link connection" → LpgConnectionLinked (replace)
       └── "Go to LPG" → popTo LpgHome; Back → Services

LpgHome (registered)
 ├── notification bell (header right) → NoticesTab:Notices
 ├── "Request refill" → RequestRefillSheet (modal, instructional — 3 numbered steps)
 │     ├── "Call now" → Linking.openURL('tel:18002333555'); the sheet dismisses when the app
 │     │     becomes active again after the call
 │     └── "Cancel" → dismisses
 ├── "Enter booking reference" (shown while booking is open) → EnterBookingReference
 │     └── "Continue" → RequestStatus (replace, with the new `requestId`)
 ├── current-request card (only while a request is undelivered) → RequestStatus (`requestId`)
 ├── "Raise a complaint" → ComplaintCategory
 └── primary button state: disabled + relabeled "You can book again in N days" when
     `today < nextEligibleDate` (21 days after the last booking)

RequestStatus (`requestId`; omitted = latest request)
 └── "Raise a complaint" → ComplaintCategory (`requestId`)
       └── "Continue" → ComplaintDetails (`categoryId`) — a normal push between form steps
             │     fields: booking reference (optional; prefilled from the request), category (changeable
             │     here), description (required, 500 max), up to 3 photos (optional, system photo
             │     picker), preferred contact method (Phone call / SMS) and contact number (prefilled
             │     from the profile). Back → ComplaintCategory (selection kept)
             └── "Submit complaint" → ComplaintSubmitted via completeForm() — drops ComplaintCategory +
                   ComplaintDetails
                   ├── "View status" → RequestStatus
                   └── "Done" → popTo LpgHome
```

Arriving with `openRefillSheet` (no caller since Home's LPG card was removed; kept for later entry points) opens `RequestRefillSheet` once the push
transition has finished — iOS can drop a Modal presented mid-transition. If booking isn't open yet,
LpgHome shows the "You can book again in N days" Toast instead of opening the sheet.

**Confirm before release:** the IOCL number `1800 2333 555` (`tel:18002333555`) may be an LPG
emergency helpline rather than a booking line. Confirm the correct booking number with IOCL before
release. The number is deliberately left unchanged until then.

**LPG registration gate.** LPG isn't linked to a new account automatically. `isRegistered` plus the LPG
ID and consumer number live in `mockLpg.ts` — no shared store. The Services LPG card and Home's LPG
entry points open `LpgRegistration` when unregistered and `LpgHome` when registered; `LpgHome` also
replaces itself with `LpgRegistration` if reached any other way. `LpgRegistration` uses the service
header ("LPG" beside its logo, chevron back to Services). "Link connection" replaces the form with
`LpgConnectionLinked`, so Back never returns to the finished form. Until registered, Home's LPG card
offers only "Register for LPG", Services' LPG card says "Get started", the "LPG Consumer" chip is
hidden and there are no LPG records. Mock: starts unregistered on every launch
(`LPG_REGISTERED_AT_LAUNCH`), and LPG ID `0000000000` exercises the "connection not found" error.
Livestock has no registration gate — it stays buyer-only and enquiry-only.

### RecordsStack — matches `Records.png`, `RecordDetail-StockEnquiry.png`, `RecordDetail-RefillRequest.png`, `RecordDetail-CollectionRecord.png` (`RecordDetail-HealthCertificate.png` is the retired producer flow — no such record exists)

Redesign batch 6: the list sits on the pale blue page (`backgroundCool`, blue `ScenicBackdrop`). Each
`RecordDetail` takes its record's pillar look — `AppearanceProvider` green (Van Dhan), rose (Livestock)
or blue (LPG), with a matching header — and `MainTabs` colours the active tab the same way while it's
shown. Details keep every fact the record carries (the images show only four rows), led by "Category"
and dated "Submitted on"; a stock enquiry's Description is the message it opened with. Delivered /
Collected / Resolved use the purple `complete` status tone.

```
Records ("My Records": pillar chips All / Van Dhan / Livestock / LPG; grouped by day)
 ├── notification bell → NoticesTab:Notices
 └── (row tap) → RecordDetail (`recordId` = "<kind>:<id>") — renders per record type
       ├── Van Dhan pickup → "Open in Van Dhan" → ServicesTab → VanDhanStack:PickupDetails
       ├── Van Dhan grievance → "Open in Van Dhan" → ServicesTab → VanDhanStack:GrievanceStatus
       ├── Livestock enquiry → "View stock" → ServicesTab → LivestockStack:StockDetails
       ├── LPG refill → "Open in LPG" → ServicesTab → LpgStack:RequestStatus
       ├── LPG complaint with a linked request → ServicesTab → LpgStack:RequestStatus
       └── Van Dhan collection log → detail only (no pillar screen shows a single log)
```

**Cancelling from Records (Van Dhan only).** A Van Dhan pickup (until it is collected) and a Van Dhan
collection log can be cancelled from `RecordDetail`: a "Cancel pickup request" / "Cancel collection"
text button under the record, confirmed by an alert (destructive action, "Keep it" to back out). The
record stays in Records with a "Cancelled" pill and a "Cancelled on" row; a cancelled pickup drops its
tracker, `PickupDetails` shows it as cancelled, and `VanDhanHome` tracks the latest pickup that isn't
cancelled. Cancelled items are marked (`cancelledAt`), never deleted. Livestock enquiries and LPG
records have no cancellation — Livestock has no in-app order to cancel (it's Call/WhatsApp only).

**Records has no dataset of its own.** `screens/records/recordSource.ts` derives every record, on
each read, from the pillar mocks the rest of the app writes to: Van Dhan collection logs, pickups and
the grievance (`mockVanDhan.ts`), Livestock enquiries (`mockLivestock.ts`), and LPG refill requests and
complaints (`mockLpg.ts`). A collection
logged in `LogCollection` or a booking made in `EnterBookingReference` appears in Records immediately.

**Resolved — there is no HealthCertificate record type.** `RecordDetail-HealthCertificate.png` shows an
animal health certificate issued to an *owner* ("Owner Name", village, "Mithun (2), Cattle (3)") and
linked to a "Livestock Intake" batch — MARCOFED receiving animals from a producer. That is the
producer-side flow this buyer-only app deliberately does not port. There is no buyer-side equivalent
in the app's data either: Livestock is enquiry-only (Call and WhatsApp hand off outside the app), so
no purchase, ownership or intake ever exists in-app for a certificate to attach to. RecordDetail
therefore has no certificate template. Livestock's only records are the enquiries a buyer starts from
StockDetails — an enquiry is not a purchase, so this doesn't reopen the certificate question. Revisit only if the product later records livestock purchases in-app.

**Intentional deviations from `Records.png`:** its "Health Certificate" and "Livestock Intake" rows are
producer-side (above), and its "Loan Application" and "Repayment" rows and filter chip are
Micro-Finance. All are left out on purpose; do not re-add them from the image.

### NoticesStack — matches `Notices.png`, `NoticeDetail.png`

Redesign batch 7: both screens sit on the pale blue page (`backgroundCool`); the list has a soft blue
backdrop, NoticeDetail leaves in the notice's pillar colours. The list header now has a bell with the
unread badge: on this screen it toggles **"Unread only"** (combined with the pillar chips) instead of
navigating, since every other bell leads here. Rows show the time top-right with the unread dot beneath
it and a chevron.

```
Notices (pillar chips: All / Van Dhan / Livestock / LPG; grouped by day; pull-to-refresh)
 └── (row tap) → NoticeDetail (`noticeId`) — opening a notice marks it read
       └── attachment row → download (a Toast confirms for now; no real file handling yet)
```

**Intentional deviation from `Notices.png`:** the reference image shows a Micro-Finance chip in the
filter row. It is left out on purpose — Micro-Finance has no presence in this version. This is not
an oversight; do not re-add it from the image.

Every route into `NoticeDetail` passes a real `noticeId`; today that is only the Notices rows. The bells open the `Notices` list.

### AskUsStack — matches `AskUs.png`

```
AskUs (tab root, draws its own header like Records)
 ├── notification bell → NoticesTab:Notices
 ├── "Call Support" → Linking.openURL('tel:…') (native Phone app; Toast if the device can't call)
 └── FAQ rows expand in place (one open at a time) — no navigation
```

Redesign batch 8 (`AskUs.png`, the first approved reference): pale blue page with soft blue shapes, a
glass "Talk to us" card (call button + hours), then "Common questions" with a one-line explainer and one
card per FAQ — a coloured icon tile, the question, a one-line summary (`summary` in the mock) and a
round chevron. Still deliberately light. Data comes from `data/mock/mockAskUs.ts`;
the support number and hours there are mock values to replace before release. FAQ answers describe
only what the app does — don't add fees or approval times until there's a real source for them.

## Cross-cutting rules for the build

- **Tab root titles stand alone.** Home, Services, My Records, Notices and Ask Us show no tagline or
  subtitle line under their title, even where a reference image has one. Home's greeting is its title.

- Every `Linking.openURL('tel:...')` call must be preceded by the consent-style copy already
  shown in the relevant sheet (RequestRefillSheet, price line) — don't strip it out for brevity.
- No screen anywhere plays a live voice call in-app, and there is no in-app audio at all: notices carry
  no recordings in any pillar (removed; `AudioPlayer` and `expo-audio` are gone).
- `StatusTracker` step count varies by screen — pass steps as data, don't hardcode step count
  in the component.
- **Cross-tab jumps pass `pop: true` at every nested level** (e.g. Home's LPG quick action:
  `navigate('ServicesTab', { screen: 'LpgStack', pop: true, params: { screen: 'LpgHome', pop: true, … } })`).
  In React Navigation 7, `navigate` only reuses a screen that is currently on top of its stack; if the
  target sits lower in a stack the user left mid-flow, it pushes a duplicate instead. Within a stack,
  going back to an earlier screen uses `popTo`, never `navigate`.
- **Every service entry screen uses `ServiceHeader`** — `VanDhanHome`, `LivestockHome`, `LpgHome`,
  `VanDhanRegistration`, `LpgRegistration`, and the home/registration screens of any service added later.
  At the very top: a visible back chevron to `Services`, the service's logo tile beside its bold name, and
  the notification bell on the right. The native stack header is hidden on these routes (no empty bar
  above the title) and there is no tagline/subtitle under it. Never rely on swipe-back or re-tapping the
  Services tab alone — that is too hidden for a first-time user. Inner screens keep the native large title.
- `StatusTracker` has two orientations: `horizontal` (default) and `vertical`, a timeline used by
  `GrievanceStatus`. Steps take an optional `detail` (timestamp/meta) and, in vertical mode, a
  `description`. Reuse it for any future timeline instead of building a new one.
- Micro-Finance has zero routes in this version. If a stray reference exists anywhere, remove it.
- **Completing a form never leaves the form in history.** A "Submit", "Request" or "Continue" that
  completes a form moves on with `navigation.replace` (single-screen form) or `completeForm()` from
  `navigation/completeForm.ts` (multi-step form — drops every step), so back from the result returns
  to wherever the user was before the form began. A "Continue" between steps of a multi-step form
  (e.g. `ComplaintCategory → ComplaintDetails`) is a normal push. Onboarding is exempt: it is a linear
  wizard whose final step swaps the whole navigator.
