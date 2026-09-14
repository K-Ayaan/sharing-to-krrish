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

Linear, no skipping, matches `PhoneEntry.png`, `OtpEntry.png`, `EmailEntry.png`,
`ProfileDetails.png`, `Consent.png`, `RegistrationComplete.png`.

```
PhoneEntry → OtpEntry → EmailEntry → ProfileDetails → Consent → RegistrationComplete → (replace stack with MainTabs)
```

- `Consent`'s primary button stays disabled until the ScrollView hits bottom (`onScroll` + `contentOffset` check).
- `RegistrationComplete` is the only screen that writes the UID to storage and swaps the navigator —
  no back button should return here.
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

### HomeStack — matches `Home.png`

```
Home
 ├── quick action "Van Dhan" → ServicesTab → VanDhanStack:VanDhanHome
 ├── quick action "Livestock" → ServicesTab → LivestockStack:LivestockHome
 ├── quick action "LPG" → ServicesTab → LpgStack:LpgHome
 ├── quick action "Notices" → NoticesTab:Notices
 ├── quick action "My Records" → RecordsTab:Records
 ├── notification bell → NoticesTab:Notices
 ├── "Important Update" RunningBanner → NoticesTab:NoticeDetail (`noticeId`)
 ├── "View Details" on the status card → ServicesTab → LpgStack:RequestStatus
 ├── "Book Refill" on the status card → ServicesTab → LpgStack:LpgHome, which opens
 │     RequestRefillSheet on arrival via its `openRefillSheet` param
 └── "Manage" on Registered-as card → ServicesStack:Services
```

"View Details" and "Book Refill" are two distinct buttons with two distinct destinations. The
card's state (booking open / refill on its way / next booking date) comes from `getLpgSummary()` in
`data/mock/mockLpg.ts` — the same source LpgHome renders — so Home and LPG can never disagree. Cross-tab
jumps pass `initial: false` so each nested stack keeps its root underneath: back from a pillar screen
returns to `Services`, and back from `RequestStatus` returns to `LpgHome`.

**Temporary (dev builds only):** long-pressing the UID chip on Home asks "Reset onboarding?", then
clears the stored UID and returns to `Onboarding:PhoneEntry`. It exists only for testing and must be
replaced by a real sign-out once a Settings/profile screen exists — it is not product behaviour.

### ServicesStack — matches `Services.png`

```
Services
 ├── notification bell → NoticesTab:Notices
 ├── RunningBanner → NoticesTab:NoticeDetail (`noticeId`)
 ├── Van Dhan card → VanDhanStack:VanDhanHome
 ├── Livestock card → LivestockStack:LivestockHome
 └── LPG card → LpgStack:LpgHome
```
Micro-Finance is not included in this navigator. Do not add a placeholder route for it.

**Confirmed navigator shape:** `VanDhanStack`, `LivestockStack` and `LpgStack` are screens nested
inside `ServicesStack` (header hidden on the nesting screen) — not tabs, not root routes. The tab bar
stays visible inside every pillar, and each pillar stack's first screen inherits `ServicesStack`'s
back button to `Services`.

### VanDhanStack — matches `VanDhanHome.png`, `ProduceDetailSheet.png`, `LogCollection.png`, `SchedulePickup.png`, `PickupDetails.png`, `KendraInfo.png`, `GrievanceStatus.png`

```
VanDhanHome
 ├── notification bell → NoticesTab:Notices
 ├── (produce list row tap) → ProduceDetailSheet (modal/bottom sheet, not a push)
 ├── "Call price line" → Linking.openURL(`tel:${priceLineNumber}`) — no in-app screen
 ├── "Log a collection" → LogCollection
 │     └── "Submit collection" → popTo VanDhanHome with a `confirmation` param (form leaves
 │           history); VanDhanHome shows a Toast, then clears the param
 ├── "Schedule a pickup" → SchedulePickup
 │     └── "Request pickup" → PickupDetails (replace, with the new `pickupId`)
 ├── pickup status card → PickupDetails (`pickupId` of the current pickup)
 │     └── contact row → Linking.openURL(`tel:...`)
 ├── kendra info card → KendraInfo
 │     ├── call button → Linking.openURL(`tel:...`)
 │     └── "Get directions" → Linking.openURL(Apple Maps URL) — no in-app screen
 └── grievance row (if present) → GrievanceStatus
       └── "Need help?" call button → Linking.openURL(`tel:...`)
```

### LivestockStack — matches `LivestockHome.png`, `SelectSpeciesSheet.png`, `SelectSexSheet.png`, `SelectWeightSheet.png`, `StockDetails.png` (canonical: buyer-only)

```
LivestockHome (buyer browse)
 ├── notification bell (header right) → NoticesTab:Notices
 ├── "Species" / "Sex" / "Weight" filter chips → SelectSpeciesSheet / SelectSexSheet /
 │     SelectWeightSheet (modal, multi-select with checkmarks; "Done" applies and closes)
 │     └── selected values show as removable chips on LivestockHome
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

### LpgStack — matches `LpgHome.png`, `RequestRefillSheet.png`, `EnterBookingReference.png`, `RequestStatus.png`, `ComplaintCategory.png`, `ComplaintDetails.png`, `ComplaintSubmitted.png`

```
LpgHome
 ├── notification bell (header right) → NoticesTab:Notices
 ├── "Request refill" → RequestRefillSheet (modal, instructional — 3 numbered steps)
 │     ├── "Call now" → Linking.openURL('tel:18002333555'); the sheet dismisses when the app
 │     │     becomes active again after the call
 │     └── "Cancel" → dismisses
 ├── "Enter booking reference" (shown while booking is open) → EnterBookingReference
 │     └── "Submit" → RequestStatus (replace, with the new `requestId`)
 ├── current-request card (only while a request is undelivered) → RequestStatus (`requestId`)
 ├── "Raise a complaint" → ComplaintCategory
 └── primary button state: disabled + relabeled "You can book again in N days" when
     `today < nextEligibleDate` (21 days after the last booking)

RequestStatus (`requestId`; omitted = latest request, as from Home's "View Details")
 └── "Raise a complaint" → ComplaintCategory (`requestId`)
       └── "Continue" → ComplaintDetails (`categoryId`) — a normal push between form steps
             ├── "Change" → back to ComplaintCategory (selection kept)
             └── "Submit" → ComplaintSubmitted via completeForm() — drops ComplaintCategory +
                   ComplaintDetails
                   ├── "View status" → RequestStatus
                   └── "Done" → popTo LpgHome
```

Arriving with `openRefillSheet` (Home's "Book Refill") opens `RequestRefillSheet` once the push
transition has finished — iOS can drop a Modal presented mid-transition. If booking isn't open yet,
LpgHome shows the "You can book again in N days" Toast instead of opening the sheet.

**Confirm before release:** the IOCL number `1800 2333 555` (`tel:18002333555`) may be an LPG
emergency helpline rather than a booking line. Confirm the correct booking number with IOCL before
release. The number is deliberately left unchanged until then.

### RecordsStack — matches `Records.png`, `RecordDetail-HealthCertificate.png`

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

```
Notices (pillar chips: All / Van Dhan / Livestock / LPG; grouped by day; pull-to-refresh)
 └── (row tap) → NoticeDetail (`noticeId`) — opening a notice marks it read
       ├── AudioPlayer "Play recording" → in-app playback of the attached recording (the one
       │     legitimate in-app audio case — an already-sent voice message, not a live call)
       └── attachment row → download (a Toast confirms for now; no real file handling yet)
```

**Intentional deviation from `Notices.png`:** the reference image shows a Micro-Finance chip in the
filter row. It is left out on purpose — Micro-Finance has no presence in this version. This is not
an oversight; do not re-add it from the image.

Every route into `NoticeDetail` passes a real `noticeId`: Notices rows, Home's "Important Update"
banner and Services' banner. The bells open the `Notices` list.

### AskUsStack

Not yet mocked. Placeholder screen only — do not invent content for it.

## Cross-cutting rules for the build

- Every `Linking.openURL('tel:...')` call must be preceded by the consent-style copy already
  shown in the relevant sheet (RequestRefillSheet, price line) — don't strip it out for brevity.
- No screen anywhere plays a live voice call in-app. The only in-app audio is `NoticeDetail`'s
  playback of an already-delivered recording.
- `StatusTracker` step count varies by screen — pass steps as data, don't hardcode step count
  in the component.
- **Cross-tab jumps pass `pop: true` at every nested level** (e.g. Home's "Book Refill":
  `navigate('ServicesTab', { screen: 'LpgStack', pop: true, params: { screen: 'LpgHome', pop: true, … } })`).
  In React Navigation 7, `navigate` only reuses a screen that is currently on top of its stack; if the
  target sits lower in a stack the user left mid-flow, it pushes a duplicate instead. Within a stack,
  going back to an earlier screen uses `popTo`, never `navigate`.
- **Every pillar-home screen (`VanDhanHome`, `LivestockHome`, `LpgHome`) shows a visible back chevron**
  to `Services`: native large-title header with the pillar name as the title, a chevron-only back
  button, and the notification bell as `headerRight`. Never hide the header and rely on swipe-back or
  re-tapping the Services tab — that is too hidden for a first-time user.
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
