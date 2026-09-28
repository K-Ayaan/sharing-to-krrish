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

**Test Aadhaar values (mock).** `2345 6789 0124` is already registered (signs straight in). Any other
checksum-valid number, such as `4987 0011 2230`, registers a new account. Aadhaar itself is never
OTP-verified; the contact number is, and any six-digit code works there except `000000`.

**Van Dhan and LPG start unregistered (mock).** On every launch both open their registration screen
first. For LPG, any 10–17 digit LPG ID with a 5–10 digit consumer number registers; LPG ID
`0000000000` shows the not-found error. Livestock never asks to register.

## Layout

- [ ] On iOS 26 the tab bar is native Liquid Glass (content refracts through it); on older iOS it's clearly see-through frosted glass with a bright rim and top sheen — not a solid white pill
- [ ] The tab bar is a floating rounded glass pill above the home indicator with five tabs (Home, Services, Records, Notices, Ask Us); the active tab sits in a lighter glass capsule with a blue icon and label
- [ ] Scrolling content passes visibly (blurred) behind the tab bar, and the last item on every tab screen can scroll fully clear of it
- [ ] Touching the tab bar swells the capsule under the finger; dragging slides it across tabs, and lifting selects the tab underneath. A plain tap still switches tabs, and re-tapping the current tab still pops to its root
- [ ] VoiceOver reads each tab with its selected state, and double-tap switches tabs
- [ ] Pinned footer buttons (Stock details, complaint Continue/Submit, LPG connection linked) sit above the tab bar, not behind it
- [ ] Every built screen visually matches its image in `design/screens/` apart from the deviations recorded in `design/flow.md` — no clipped, overlapping or cut-off text
- [ ] Van Dhan, Livestock and LPG homes, and the Van Dhan/LPG registration screens, show at the very top a back chevron, the service logo beside the bold title, and a bell on the right — no empty bar above the title and no subtitle under it
- [ ] On the inner Van Dhan/LPG screens, the large title collapses into the navigation bar when scrolling up
- [ ] Long large titles ("Enter booking reference", "Kendra information", "Schedule a pickup") are fully readable, not truncated with "…"
- [ ] On an iPhone SE-width screen (375pt), each Van Dhan rate row shows name, dialect, price, trend badge and updated date without overlap
- [ ] The Livestock stock list shows two cards per row, and an odd last card sits in the left column at half width
- [ ] Home's quick-action labels, including "My Records", each fit on one line
- [ ] Home always shows all five quick actions; before registering, Van Dhan and LPG are grey (grey tile, icon and label) and tapping one opens its registration screen; after registering they show in colour (return to Home to see it)
- [ ] VoiceOver reads a grey tile as "Van Dhan, not registered" / "LPG, not registered"
- [ ] Services shows All / Registered / Not registered chips: All lists every service; Registered shows Livestock plus any registered pillar; Not registered shows the rest, or "You're registered for every service." when none remain
- [ ] Bottom sheets open with rounded top corners over a dimmed backdrop and never cover more than 90% of the screen
- [ ] Toasts appear above the tab bar and any footer buttons (StockDetails, RegistrationComplete), never hidden behind them, and disappear after about 2 seconds
- [ ] With the device set to Dark Mode, the app stays in its light appearance with no dark-on-dark text
- [ ] On launch, while the session loads, a white screen shows a black "MARCOFED" centred, a thin black bar visibly filling left to right and fading out on a loop, and "People • Produce • Prosper" below; nothing on it responds to taps, and the status bar stays readable

## Persistence

- [ ] A fresh install opens on PhoneEntry ("Your contact number"), with no back chevron
- [ ] Complete onboarding, tap "Go to Home", force-quit, relaunch — the app opens on Home, not onboarding
- [ ] Complete onboarding up to RegistrationComplete, force-quit **without** tapping "Go to Home", relaunch — the app opens on Home
- [ ] Home → tap the UID chip → Settings opens with a large "Settings" title and a back chevron to Home
- [ ] Services, My Records, Notices and Ask Us → tap the avatar/UID → the Home tab becomes active with Settings open; Back returns to Home
- [ ] Settings → "Log out" shows a confirmation; "Cancel" closes it and nothing changes (still on Settings, still signed in)
- [ ] Settings → "Log out" → confirm returns to PhoneEntry, and no Back button or swipe reaches Settings or Home
- [ ] After logging out, force-quit and relaunch — the app opens on PhoneEntry
- [ ] Long-pressing the UID chip on Home does nothing special in dev or release builds (the old reset is gone)

## Navigation timing

- [ ] With booking locked, LpgHome's primary button reads "You can book again in N days" and can't be tapped
- [ ] Set `MOCK_SCENARIO` to `'waiting'` in `data/mock/mockLpg.ts`, reload — LpgHome shows the locked button and the "Your current request" tracker

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

- [ ] Every onboarding step shows "Create your account" centred beside the back chevron, with the step dots and "Step N of 6" on the row below; RegistrationComplete shows none of this
- [ ] AadhaarEntry: the number is shown grouped as "2345 6789 0124" while typing and accepts no more than 12 digits
- [ ] AadhaarEntry: leaving the field with a mistyped number (e.g. 2345 6789 0120) shows "This isn't a valid Aadhaar number…", and a number starting with 0 or 1 shows the leading-digit error
- [ ] AadhaarEntry: "Continue" stays disabled until the number is valid **and** the consent checkbox is ticked
- [ ] AadhaarEntry: "Why do we need this?" opens a sheet with four reasons, and both its × and "Close" dismiss it
- [ ] AadhaarEntry: the sheet says Aadhaar only links you to your account ("Not used for verification"), with no mention of verifying identity
- [ ] PhoneOtp: dismiss the keyboard, then tap any OTP box — the number pad opens again
- [ ] AadhaarEntry with a new checksum-valid Aadhaar (e.g. 4987 0011 2230): "Continue" goes straight to the email step — Aadhaar itself never asks for an OTP
- [ ] "Why do we need this?" on AadhaarEntry slides its sheet up smoothly (no jump) and back down on close; the UID and linked Aadhaar fit on one line on the smallest iPhone
- [ ] AadhaarEntry with the pre-registered Aadhaar 2345 6789 0124: "Continue" opens Home directly, skipping the remaining steps, and a force-quit and relaunch still opens Home
- [ ] The full Aadhaar number appears nowhere after step 3 — later steps and RegistrationComplete show only "XXXX XXXX 0124"
- [ ] Register a new Aadhaar, log out from Settings, then verify a contact number and enter the same Aadhaar again — it signs straight in instead of registering a second account
- [ ] PhoneEntry (contact number): "Continue" stays disabled until exactly 10 digits are entered
- [ ] PhoneEntry: autofilling a number that includes +91 keeps only the last 10 digits
- [ ] PhoneOtp: the subtitle shows the number just entered, e.g. "+91 98765 43210"
- [ ] PhoneOtp: entering 000000 shows "The OTP is incorrect…" in red and clears the boxes; typing a new code clears the error
- [ ] PhoneOtp: any other six digits advance to AadhaarEntry (step 3), whose back chevron returns to PhoneOtp
- [ ] PhoneOtp: "Resend OTP" stays disabled while the countdown runs, becomes tappable at 00:00, and tapping it restarts the countdown and shows a Toast
- [ ] PhoneOtp: the back chevron returns to PhoneEntry with the number still editable
- [ ] **(device)** PhoneOtp: when an SMS code arrives on this phone, the iOS one-time-code suggestion appears above the keyboard and fills all six boxes
- [ ] Signing in with an already-registered Aadhaar goes PhoneEntry → PhoneOtp → AadhaarEntry → Home; Aadhaar itself never asks for an OTP
- [ ] RegistrationComplete shows "Linked Aadhaar" as XXXX XXXX followed by the last four digits entered in step 3
- [ ] Settings shows the name, email and contact number entered during onboarding (or the demo account's, after signing in with 2345 6789 0124) in its rows; Aadhaar and MARCOFED ID are read-only
- [ ] Settings: Personal details / Email address / Contact number each open a sheet that slides up smoothly and only then raises the keyboard; closing slides it back down; "Save changes" stays disabled until the value changes and is valid
- [ ] Settings → Personal details: district and village can be changed (a new district clears the village until one is picked); saving shows "Personal details saved" and the new village appears in Schedule pickup's default address
- [ ] Settings: saving the name shows "Name saved", and changed initials appear on Home, Services, Notices and Records without reopening them
- [ ] Settings: "MARCOFED ID" copies the UID with a Toast; "Aadhaar" opens a read-only info sheet; "Help & Support" opens Ask Us
- [ ] Settings has no Notifications, Language, App theme or Privacy rows (not built yet)
- [ ] Settings sections read as frosted glass over the cream page and soft colour backdrop; the back chevron is dark
- [ ] Settings: scrolling down collapses the large "Settings" title into a solid top bar, and no card or field shows through or overlaps the title
- [ ] EmailEntry: "Continue" is disabled when the field is empty or not a valid email; the error text shows only after leaving the field
- [ ] ProfileDetails: the Village picker is disabled until a District is chosen, and changing District clears the chosen Village
- [ ] Consent: "I agree" stays disabled until the text has been scrolled to the bottom **and** the checkbox is ticked, and the hint below it changes from the scroll message to the tick message
- [ ] With the keyboard open, the focused field and its submit button stay visible on LogCollection, SchedulePickup, EnterBookingReference and ComplaintDetails
- [ ] The LogCollection note and ComplaintDetails description fields start about three lines tall and grow as you type; ComplaintDetails shows a live "n/500" counter
- [ ] LogCollection: "Submit collection" opens "Collection submitted!" with the new collection ID, produce, quantity, note, time and your kendra; Back goes to VanDhanHome (not the form), and the log appears under Records → Van Dhan
- [ ] Log a collection: choosing "Pre-logging for later" shows a required "Delivery date" (next 7 days); Submit stays disabled until one is picked, and switching back to "I'm bringing this now" hides it. The date then shows on Collection submitted and in My Records
- [ ] Log a collection: "Deliver to" starts on the registered kendra; pick a different one, submit, and Collection submitted, "View on map" and "Kendra details" all show the kendra you picked (VanDhanHome's kendra card still shows the registered one)
- [ ] Collection submitted: "View on map" opens Apple Maps at the kendra; "Kendra details" opens KendraInfo; "Log another" opens an empty form, and Back from it returns to VanDhanHome
- [ ] SchedulePickup: "Request pickup" stays disabled until produce, a quantity above 0, address and date are set; it opens PickupDetails for the new pickup (showing that produce and quantity); Back goes to VanDhanHome, not back into the form
- [ ] PickupDetails: the produce row opens the produce sheet; the address row opens Apple Maps; the contact row starts a call
- [ ] Van Dhan screens are green on a cream page with leaves/hills; the tab bar's Services tab is green while in Van Dhan and blue again elsewhere; the price-line card stays blue
- [ ] Livestock screens are rose on a cream page with pink leaves/hills; the Services tab is rose while in Livestock; the "MARCOFED livestock is subject to…" banner stays blue and the movement-ban card stays red
- [ ] LivestockHome: results default to "Sort by: Availability" (most available first); the sort sheet switches to Recently updated or Weight (light to heavy) and the label follows
- [ ] Livestock has one "Filters" dropdown: its sheet shows Species, Sex and Weight sections of pills, several pills can be on in several sections at once, and "Done" applies them all together (× discards); stock cards and the species pills show animal icons (goat keeps the paw)
- [ ] Van Dhan registration: the kendra sheet lists 5 kendras with addresses; tapping one only marks it, and "Select kendra" confirms; every produce row has a checkbox
- [ ] EnterBookingReference: lowercase input is accepted and shown uppercase; "Continue" opens RequestStatus; Back goes to LpgHome, not back into the form
- [ ] ComplaintDetails: from RequestStatus the booking reference is prefilled; the category can be changed in place; "Submit complaint" needs a description and a valid 10-digit contact number (prefilled from the profile); an invalid optional reference shows an error
- [ ] ComplaintDetails: "Tap to add photos" opens the system photo picker (rebuild the dev client first — expo-image-picker is native); up to 3 photos show as thumbnails with a remove ×; the record in My Records shows "n attached", the contact method and number
- [ ] LPG screens sit on a pale blue page with blue leaves/hills; LpgHome shows the cylinder art, a "Linked" pill and full-width action rows; the refill sheet's copy button turns into a tick for 2 seconds
- [ ] LpgConnectionLinked has no header; the blue tick badge shows; "Go to LPG" opens the dashboard and an edge swipe goes back to Services
- [ ] Complaint flow: Submit opens ComplaintSubmitted; Back returns to wherever the complaint started (RequestStatus or LpgHome), never to ComplaintDetails or ComplaintCategory
- [ ] Fresh launch: Services → Van Dhan opens the Van Dhan registration screen ("Van Dhan" beside its logo, back chevron to Services), not the rates dashboard, and Services' Van Dhan card reads "Get started"
- [ ] Fresh launch: Services → Livestock opens the Livestock stock list directly, with no registration screen
- [ ] Van Dhan registration shows no role choice (no "I only want to view"): the kendra picker and produce list show straight away, and "Register" stays disabled until a kendra and at least one produce are chosen
- [ ] After registering, Van Dhan shows the Toast "You're registered for Van Dhan" and every section; the kendra card shows the kendra chosen, and KendraInfo opens that kendra
- [ ] After registering Van Dhan, Back from Van Dhan goes to Services (never the registration form), and the Services Van Dhan card then opens Van Dhan directly
- [ ] Home's Van Dhan quick action opens Van Dhan registration before registering and Van Dhan after; "Registered as" shows "Van Dhan Producer" only once registered
- [ ] Records → Van Dhan is empty before registering, and shows collection, pickup and grievance history after
- [ ] Fresh launch: Services → LPG opens the LPG registration screen ("LPG" beside its logo, back chevron to Services), and Services' LPG card reads "Get started"
- [ ] Fresh launch: Home's LPG quick action is grey and opens LPG registration, and Home's "LPG Consumer" chip is hidden
- [ ] LPG registration: "Link connection" stays disabled until the LPG ID has at least 10 digits and the consumer number at least 5; letters can't be entered in either field
- [ ] LPG registration: LPG ID 0000000000 shows "We couldn't find an IOCL connection…" under the LPG ID field, and editing either field clears it
- [ ] LPG registration: valid details open "LPG connection linked!" showing the entered LPG ID and consumer number; Back from there goes to Services
- [ ] "Go to LPG" opens the LPG dashboard; Back goes to Services, never to the registration form; the Services LPG card then reads "Linked" and opens the dashboard directly
- [ ] After registering LPG, Home's LPG quick action is in colour and the "LPG Consumer" chip appears
- [ ] Records → LPG is empty before registering, and shows the connection's refill history after
- [ ] Every control on both registration screens is at least 44×44pt with at least 8pt between neighbouring controls (Accessibility Inspector)

## Ask Us

- [ ] Ask Us shows the UID/bell header, the "Ask Us" title, one glass "Talk to us" card with "Call Support" and the hours, then "Common questions" with its one-line explainer — nothing else
- [ ] Each FAQ is its own card with a coloured icon, the question and a short summary; tapping opens the answer under it (one open at a time) and flips the round chevron
- [ ] **(simulator)** "Call Support" shows the Toast "Calling isn't available on this device."; **(device)** it opens the Phone app with the support number
- [ ] Tapping a question expands its answer with a short animation; tapping another collapses the first; tapping an open one closes it
- [ ] Long questions wrap onto two lines rather than being cut off
- [ ] VoiceOver reads each question as a button and says whether it is expanded or collapsed
- [ ] The last question and its answer scroll clear of the floating tab bar

## Interactions

- [ ] Bottom sheets close when dragged down past about 80pt or when the dimmed backdrop is tapped; a short drag snaps back open
- [ ] Livestock filter sheets: choices only apply after "Done"; closing with × or the backdrop discards them
- [ ] An applied Livestock filter chip: tapping its × removes only that value without opening a sheet; tapping the chip itself reopens the Filters sheet
- [ ] "Clear all" on LivestockHome removes every applied filter and the result count returns to the full list
- [ ] ComplaintDetails: tapping "Change" returns to ComplaintCategory with the earlier choice still selected
- [ ] Notices: pulling down shows a spinner for about a second and then updates the "Last updated" time
- [ ] StockDetails: the photo carousel swipes one page at a time and the active page dot follows
- [ ] LivestockHome: tapping "Acknowledge" on the movement-ban card removes it, and it stays gone after leaving and returning to the screen
- [ ] The copy buttons on RegistrationComplete (UID) and ComplaintSubmitted (complaint ID) show a Toast, and pasting elsewhere gives that exact ID
- [ ] Opening an unread notice immediately lowers the bell badge on Home, Services, Records and all three pillar homes, and removes that row's unread dot in Notices

## Cross-tab navigation

- [ ] Leave the Services tab on LPG → RequestStatus, go to Home, tap the LPG quick action — LpgHome shows, and Back goes to Services (not to RequestStatus, and no second LpgHome)
- [ ] Home → "Recent activities" shows the three newest records/notices with dates; tapping a record opens it in My Records (Back → Records list), a notice opens in Notices (Back → Notices list); "View all" opens My Records
- [ ] Log a Van Dhan collection, return to Home — it appears at the top of "Recent activities"; no livestock listing ever appears there
- [ ] Leave the Services tab on Van Dhan → PickupDetails, go to Home, tap the Van Dhan quick action — VanDhanHome shows, and Back goes to Services
- [ ] Home shows no announcement banner and no tagline; the greeting reads e.g. "Good Afternoon, Abhishek", and renaming yourself in Settings updates it
- [ ] Services shows the "Services" title with no line under it and no announcement banner — the filter chips follow the title directly
- [ ] My Records, Notices and Ask Us each show their title with no line under it
- [ ] Records → a pickup record → "Open in Van Dhan" shows PickupDetails for that pickup; Back goes to VanDhanHome, then Services
- [ ] Records → a Van Dhan pickup that isn't collected → "Cancel pickup request" asks to confirm; "Keep it" changes nothing; confirming shows "Pickup request cancelled", the pill turns "Cancelled", a "Cancelled on" row appears, the tracker and the cancel button disappear
- [ ] After cancelling that pickup: the Records list shows it as "Cancelled", PickupDetails says "You cancelled this pickup on …" with no tracker, and VanDhanHome no longer tracks it
- [ ] Records → a Van Dhan collection → "Cancel collection" (red outline) works the same way, ending on "Collection cancelled" and a "Cancelled" pill
- [ ] Notices: the header bell shows the unread count; tapping it fills the bell and shows only unread notices (with the pillar chip still applied), and "You're all caught up" when none; tapping again shows all
- [ ] Notices rows show the time top-right, a blue dot under it while unread, and a chevron; NoticeDetail shows the header card, the article card and the attachment's round download button
- [ ] My Records list sits on a pale blue page with blue leaves; a delivered refill shows a purple "Delivered" pill (also Collected pickups and Resolved grievances)
- [ ] Record details take their pillar's look — green (Van Dhan), rose (Livestock), blue (LPG) page, header, icon tiles and active tab; the tab turns blue again back on the list
- [ ] Record details show a header card (tile, pillar, title, pill, tracker where there is one) and a "Details" card starting with "Category" and ending with "Submitted on"; a stock enquiry's Description is its enquiry message
- [ ] A collected pickup, a Livestock enquiry and LPG records show no cancel button
- [ ] Records → a refill record → "Open in LPG" shows RequestStatus for that request; Back goes to LpgHome, then Services
- [ ] Tapping the tab you're already on returns that tab to its first screen
- [ ] From any pillar home, the visible back chevron returns to Services

## Notices

- [ ] No notice in any pillar (Van Dhan, Livestock, LPG, General) shows a recording or play button — including "MSP price update: Agarwood"

## Accessibility (VoiceOver)

- [ ] An unread notice row is announced as "Unread, <title>, <summary>"; a read row does not say "unread"
- [ ] Each step in the "Call IOCL" sheet is announced once as "Step N: …", never as "Profile N"
- [ ] The two collection-type cards in LogCollection are announced as radio buttons with their selected state
- [ ] Pills in the Livestock Filters sheet announce whether they're selected, and an applied filter chip's × is announced as "Remove <value>"
- [ ] The bell is announced as "Notifications, N unread" when there are unread notices
- [ ] Decorative icons (icon circles, thumbnail fallbacks) are not focused as separate elements
- [ ] Each reason in the "Why do we need this?" sheet is read as one element with its title and description
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

- [ ] Integrate real Aadhaar verification through a licensed AUA/KUA partner and backend — including whatever OTP/e-KYC check that partner requires — replacing the mocks in `data/mock/mockOnboarding.ts`
- [ ] Send contact-number OTPs through a real SMS gateway, with server-side rate limiting and expiry, replacing `sendPhoneOtp`/`verifyPhoneOtp` in `data/mock/mockOnboarding.ts`
- [ ] Legal review of Aadhaar handling: consent wording, masked display, reference storage (Aadhaar Data Vault) and compliance with the Aadhaar Act, 2016 and UIDAI regulations
- [ ] Decide whether the contact phone number should be verified (it currently isn't, because it's contact-only)
- [ ] Add the Aadhaar reference images to `design/screens/onboarding/`, and retire `PhoneEntry.png` and `OtpEntry.png` or redraw PhoneEntry as the contact-number step
- [ ] Integrate the real IOCL connection lookup for LPG registration, and confirm the LPG ID and consumer-number formats (the form currently accepts 10–17 and 5–10 digits)
- [ ] Add the LPG registration and "connection linked" reference images to `design/screens/lpg/`
- [ ] Replace the proposed Van Dhan registration (producer only: kendra and produce) with the approved design
- [ ] Confirm the IOCL LPG **booking** number with IOCL — `1800 2333 555` may be an emergency helpline (`data/mock/mockLpg.ts`, `design/flow.md`)
- [ ] Replace the placeholder `+91 98765 43210` everywhere it's used: Van Dhan price line, kendra phone, pickup contact, grievance helpline, and every Livestock sales line (`data/mock/mockVanDhan.ts`, `data/mock/mockLivestock.ts`)
- [ ] Have a speaker of each language verify the produce dialect names (`data/mock/mockVanDhan.ts`)
- [ ] Replace the placeholder consent text with the approved legal copy (`consentDocument` in `data/mock/mockOnboarding.ts`)
- [ ] Supply real produce, kendra and livestock stock photos (every image is currently an icon fallback)
- [ ] Implement real downloads for notice attachments (the download row currently only shows a Toast)
- [ ] Connect Settings' profile edits and logout to the real account API (the profile is in-memory mock data today, and logout clears only the stored UID)
- [ ] Decide where ComplaintSubmitted's "View status" should go (it currently opens the related refill request; no complaint-tracking screen exists)
- [ ] Replace every module in `data/mock/` with the real API
- [ ] Replace the mock MARCOFED support number and hours in `data/mock/mockAskUs.ts`
- [ ] Get an approved AskUs reference image into `design/screens/`
- [ ] Confirm the app name, icon, splash screen and bundle ID `in.marcofed.app`
