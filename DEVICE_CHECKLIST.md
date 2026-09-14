# MARCOFED — Device verification checklist

Nothing in this app has been run yet. It typechecks and bundles for iOS, but every item below can
only be confirmed by running it. Work top to bottom and tick each line only when it passes exactly as
written. When something fails, note what happened next to the line instead of ticking it.

## Setup

- [ ] `npm install`, then `npx expo start --ios`, opens the app in the iOS Simulator with no red error screen
- [ ] Metro shows no warnings on launch (yellow box or terminal) other than known Expo notices

**Simulator vs device.** The Simulator can't place calls and has no WhatsApp. Lines marked
**(device)** need a physical iPhone; lines marked **(simulator)** check the fallback behaviour.
**Dev build** is the default `expo start` run; **release build** is
`npx expo run:ios --configuration Release`.

**Fresh start.** Most flows assume a clean state. To reset: delete the app from the Simulator/device
(clears the stored UID) and relaunch. All mock data resets on every launch.

## Layout

- [ ] The tab bar shows five tabs (Home, Services, Records, Notices, Ask Us) above the home indicator, and the active tab's icon and label are blue
- [ ] Every built screen visually matches its image in `design/screens/` apart from the deviations recorded in `design/flow.md` — no clipped, overlapping or cut-off text
- [ ] Van Dhan, Livestock and LPG homes each show a large title, a back chevron top-left and a bell top-right
- [ ] On those three screens and the inner Van Dhan/LPG screens, the large title collapses into the navigation bar when scrolling up
- [ ] Long large titles ("Enter booking reference", "Kendra information", "Schedule a pickup") are fully readable, not truncated with "…"
- [ ] On an iPhone SE-width screen (375pt), each Van Dhan rate row shows name, dialect, price, trend badge and updated date without overlap
- [ ] The Livestock stock list shows two cards per row, and an odd last card sits in the left column at half width
- [ ] Home's five quick-action labels, including "My Records", each fit on one line
- [ ] Bottom sheets open with rounded top corners over a dimmed backdrop and never cover more than 90% of the screen
- [ ] Toasts appear above the tab bar and any footer buttons (StockDetails, RegistrationComplete), never hidden behind them, and disappear after about 2 seconds
- [ ] With the device set to Dark Mode, the app stays in its light appearance with no dark-on-dark text

## Persistence

- [ ] A fresh install opens on PhoneEntry
- [ ] Complete onboarding, tap "Go to Home", force-quit, relaunch — the app opens on Home, not onboarding
- [ ] Complete onboarding up to RegistrationComplete, force-quit **without** tapping "Go to Home", relaunch — the app opens on Home
- [ ] Dev build: long-press the UID chip on Home → "Reset onboarding?" appears → Reset returns to PhoneEntry
- [ ] After that reset, force-quit and relaunch — the app still opens on PhoneEntry
- [ ] Release build: long-pressing the UID chip on Home does nothing

## Navigation timing

- [ ] With booking open (default mock state), Home → "Book Refill" switches to the Services tab, shows LpgHome, and the "Call IOCL to book your refill" sheet then slides up by itself
- [ ] Leave the Services tab sitting on LpgHome, go to Home, tap "Book Refill" — the sheet still opens within about half a second
- [ ] Book a refill in-app (Enter booking reference → Submit), return to Home — "Book Refill" is disabled and the LPG card reads "Your LPG refill is on its way"
- [ ] With booking locked, LpgHome's primary button reads "You can book again in N days" and can't be tapped
- [ ] Set `MOCK_SCENARIO` to `'waiting'` in `data/mock/mockLpg.ts`, reload — LpgHome shows the locked button and the "Your current request" tracker, and Home's "Book Refill" is disabled

## Calls & WhatsApp

- [ ] **(simulator)** "Call price line", RequestRefillSheet "Call now", the KendraInfo call button, the PickupDetails contact row and the GrievanceStatus call button each show the Toast "Calling isn't available on this device."
- [ ] **(device)** Each of those five opens the Phone app with the expected number
- [ ] **(device)** RequestRefillSheet: tap "Call now", end or cancel the call, return to the app — the sheet has closed on its own
- [ ] **(device, WhatsApp installed)** StockDetails "WhatsApp" opens a chat to the sales number with a pre-filled message naming the stock ID
- [ ] **(simulator, or device without WhatsApp)** StockDetails "WhatsApp" shows the Toast "WhatsApp isn't installed on this device."
- [ ] **(device)** After a successful Call or WhatsApp hand-off from StockDetails, Records → Livestock shows a "Stock enquiry" row with the channel ("Phone call" or "WhatsApp") and time
- [ ] **(device)** Opening that enquiry record and tapping "View stock" shows the same StockDetails
- [ ] **(simulator)** A Call or WhatsApp tap that shows the "isn't available" Toast adds **no** Livestock record — by design
- [ ] KendraInfo "Get directions" opens Apple Maps searching for Dimapur Kendra

## Forms

- [ ] PhoneEntry: "Send OTP" stays disabled until exactly 10 digits are entered
- [ ] PhoneEntry: autofilling a number that includes +91 keeps only the last 10 digits
- [ ] OtpEntry: typing the sixth digit advances to EmailEntry without pressing anything
- [ ] **(device)** OtpEntry: the iOS SMS one-time-code suggestion appears above the keyboard and fills all six boxes
- [ ] OtpEntry: "Resend code" stays disabled while the countdown runs and becomes tappable at 00:00, and tapping it restarts the countdown and shows a Toast
- [ ] EmailEntry: "Continue" is disabled when the field is empty or not a valid email; the error text shows only after leaving the field
- [ ] ProfileDetails: the Village picker is disabled until a District is chosen, and changing District clears the chosen Village
- [ ] Consent: "I agree" stays disabled until the text has been scrolled to the bottom **and** the checkbox is ticked, and the hint below it changes from the scroll message to the tick message
- [ ] With the keyboard open, the focused field and its submit button stay visible on LogCollection, SchedulePickup, EnterBookingReference and ComplaintDetails
- [ ] The LogCollection note and ComplaintDetails description fields start about three lines tall and grow as you type; ComplaintDetails shows a live "n/300" counter
- [ ] LogCollection: "Submit collection" returns to VanDhanHome with the Toast "Collection logged", and the log appears under Records → Van Dhan
- [ ] SchedulePickup: "Request pickup" opens PickupDetails for the new pickup; Back goes to VanDhanHome, not back into the form
- [ ] EnterBookingReference: lowercase input is accepted and shown uppercase; "Submit" opens RequestStatus; Back goes to LpgHome, not back into the form
- [ ] Complaint flow: Submit opens ComplaintSubmitted; Back returns to wherever the complaint started (RequestStatus or LpgHome), never to ComplaintDetails or ComplaintCategory

## Interactions

- [ ] Bottom sheets close when dragged down past about 80pt or when the dimmed backdrop is tapped; a short drag snaps back open
- [ ] Livestock filter sheets: choices only apply after "Done"; closing with × or the backdrop discards them
- [ ] An applied Livestock filter chip: tapping its × removes only that value without opening a sheet; tapping the chip itself reopens its sheet
- [ ] "Clear all" on LivestockHome removes every applied filter and the result count returns to the full list
- [ ] ComplaintDetails: tapping "Change" returns to ComplaintCategory with the earlier choice still selected
- [ ] Notices: pulling down shows a spinner for about a second and then updates the "Last updated" time
- [ ] StockDetails: the photo carousel swipes one page at a time and the active page dot follows
- [ ] LivestockHome: tapping "Acknowledge" on the movement-ban card removes it, and it stays gone after leaving and returning to the screen
- [ ] The copy buttons on RegistrationComplete (UID) and ComplaintSubmitted (complaint ID) show a Toast, and pasting elsewhere gives that exact ID
- [ ] Opening an unread notice immediately lowers the bell badge on Home, Services, Records and all three pillar homes, and removes that row's unread dot in Notices

## Cross-tab navigation

- [ ] Leave the Services tab on LPG → RequestStatus, go to Home, tap "Book Refill" — LpgHome shows, and Back goes to Services (not to RequestStatus, and no second LpgHome)
- [ ] Leave the Services tab on Van Dhan → PickupDetails, go to Home, tap the Van Dhan quick action — VanDhanHome shows, and Back goes to Services
- [ ] Open a notice in the Notices tab, go to Home, tap the "Important Update" banner — NoticeDetail shows the banner's notice, and one Back returns to the Notices list
- [ ] Records → a pickup record → "Open in Van Dhan" shows PickupDetails for that pickup; Back goes to VanDhanHome, then Services
- [ ] Records → a refill record → "Open in LPG" shows RequestStatus for that request; Back goes to LpgHome, then Services
- [ ] Tapping the tab you're already on returns that tab to its first screen
- [ ] From any pillar home, the visible back chevron returns to Services

## Audio

- [ ] NoticeDetail for "MSP price update: Agarwood" shows the player idle: play icon, "Play recording", "0:45"
- [ ] Tapping play shows a pause icon, "Playing…", an elapsed/total time that counts up, and a filling progress bar
- [ ] Tapping pause shows "Paused" and keeps the position; tapping play resumes from there
- [ ] Letting it reach 0:45 returns the player to its idle state
- [ ] Leaving NoticeDetail mid-playback produces no console warnings about updating an unmounted component
- [ ] Once a real recording URL is set in `data/mock/mockNotices.ts`: the recording is audible with the ring/silent switch on silent, and the player resets when it finishes

Until that URL exists, the player simulates progress on a timer; no real audio has ever played.

## Accessibility (VoiceOver)

- [ ] An unread notice row is announced as "Unread, <title>, <summary>"; a read row does not say "unread"
- [ ] Each step in the "Call IOCL" sheet is announced once as "Step N: …", never as "Profile N"
- [ ] The two collection-type cards in LogCollection are announced as radio buttons with their selected state
- [ ] Rows in the Livestock filter sheets announce whether they're selected, and an applied filter chip's × is announced as "Remove <value>"
- [ ] The bell is announced as "Notifications, N unread" when there are unread notices
- [ ] Decorative icons (icon circles, thumbnail fallbacks) are not focused as separate elements
- [ ] At the largest accessibility text size, every primary action on every screen is still reachable (wrapping text is fine; hidden buttons are not)

## Formatting

- [ ] Dates show as "12 Aug 2025" and times as "10:30 AM" everywhere — never raw ISO strings or "Invalid Date"
- [ ] Van Dhan search for "tsungri" (no umlaut) finds Broom Grass
- [ ] Rupee amounts use Indian digit grouping (e.g. "₹ 12,500")
- [ ] Notices and Records day headers read "Today, …" and "Yesterday, …" for the correct local days
- [ ] Phone numbers show as "+91 98765 43210" and the IOCL number as "1800 2333 555"

---

## Before release

These are product and content gaps, not verification steps. They don't block testing, but the app
isn't shippable until each is done.

- [ ] Confirm the IOCL LPG **booking** number with IOCL — `1800 2333 555` may be an emergency helpline (`data/mock/mockLpg.ts`, `design/flow.md`)
- [ ] Replace the placeholder `+91 98765 43210` everywhere it's used: Van Dhan price line, kendra phone, pickup contact, grievance helpline, and every Livestock sales line (`data/mock/mockVanDhan.ts`, `data/mock/mockLivestock.ts`)
- [ ] Have a speaker of each language verify the produce dialect names (`data/mock/mockVanDhan.ts`)
- [ ] Replace the placeholder consent text with the approved legal copy (`consentDocument` in `data/mock/mockOnboarding.ts`)
- [ ] Supply real produce, kendra and livestock stock photos (every image is currently an icon fallback)
- [ ] Supply real notice recordings and confirm the AudioPlayer's expo-audio path plays them
- [ ] Implement real downloads for notice attachments (the download row currently only shows a Toast)
- [ ] Replace the temporary dev-only onboarding reset with a real sign-out once a Settings/profile screen exists
- [ ] Decide where ComplaintSubmitted's "View status" should go (it currently opens the related refill request; no complaint-tracking screen exists)
- [ ] Replace every module in `data/mock/` with the real API
- [ ] Design and build AskUs (currently a placeholder)
- [ ] Confirm the app name, icon, splash screen and bundle ID `in.marcofed.app`
