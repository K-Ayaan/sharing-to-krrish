import { daysAgo } from './dates';

export type NoticeCategory =
  | 'vandhan'
  | 'lpg'
  | 'microfinance'
  | 'livestock'
  | 'government'
  | 'weather'
  | 'meeting'
  | 'scheme';

// A paragraph is a list of runs so dates and amounts can be emphasised (notice-detail.png).
export type Paragraph = { text: string; bold?: boolean }[];

// Key facts pulled out of the body so they can be read at a glance.
export type NoticeFact = { kind: 'when' | 'where' | 'who' | 'bring'; value: string };

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  summary: string;
  issuer: string;
  publishedAt: string;
  read: boolean;
  tagline: string | null;
  facts: NoticeFact[];
  body: Paragraph[];
  attachment: { name: string; sizeLabel: string; url: string | null } | null;
};

const p = (...runs: (string | { bold: string })[]): Paragraph =>
  runs.map((run) => (typeof run === 'string' ? { text: run } : { text: run.bold, bold: true }));

export const mockNotices: Notice[] = [
  {
    id: 'nt-2041',
    category: 'vandhan',
    title: 'Van Dhan Price Update',
    summary: 'New MSP rates for bamboo and minor forest produce are now effective from 1 Oct 2026.',
    issuer: 'State Van Dhan Cell',
    publishedAt: daysAgo(0, 9, 0),
    read: false,
    tagline: 'Fair prices, paid at the source.',
    facts: [{ kind: 'when', value: 'From 1 Oct 2026' }, { kind: 'where', value: 'All 35 Kendras' }, { kind: 'who', value: 'Van Dhan gatherers' }],
    body: [
      p('Revised minimum support prices for bamboo and minor forest produce take effect from ', { bold: '1 October 2026' }, ' at all 35 Van Dhan Vikas Kendras.'),
      p('Updated rates are already listed under Van Dhan › Price Check. Produce delivered before 1 October is paid at the rate notified on the day of delivery.'),
    ],
    attachment: null,
  },
  {
    id: 'nt-2038',
    category: 'lpg',
    title: 'LPG Refill Schedule Change',
    summary: 'Revised refill allocation dates for your area. Please check the new schedule.',
    issuer: 'LPG Consumer Desk, MARCOFED',
    publishedAt: daysAgo(1, 11, 30),
    read: false,
    tagline: null,
    facts: [{ kind: 'when', value: 'Thursdays, from next week' }, { kind: 'where', value: 'Mokokchung district' }],
    body: [
      p('Dispatch to village points in Mokokchung district moves from Tuesdays to ', { bold: 'Thursdays' }, ' from next week.'),
      p('Bookings already made are not affected. You will get a message with the dispatch location, date and time once your refill is arranged.'),
    ],
    attachment: null,
  },
  {
    id: 'nt-2036',
    category: 'microfinance',
    title: 'Micro-Finance Camp',
    summary: 'A special loan application camp will be held in your block from 5–7 Oct 2026.',
    issuer: 'Micro-Finance Cell, MARCOFED',
    publishedAt: daysAgo(3, 10, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'when', value: '5–7 Oct 2026, 10 am–4 pm' }, { kind: 'where', value: 'Block office' }, { kind: 'bring', value: 'MARCOFED ID, photo, land record, passbook' }],
    body: [
      p('Officers will help members complete loan applications and check documents at the block office from ', { bold: '5 to 7 October 2026' }, ', 10 am to 4 pm.'),
      p('Bring your MARCOFED ID, a photograph, your land record and your bank passbook.'),
    ],
    attachment: null,
  },
  {
    id: 'nt-2031',
    category: 'livestock',
    title: 'Livestock Vaccination Drive',
    summary: 'Free vaccination camp for cattle, goats and poultry at your nearest veterinary centre.',
    issuer: 'AH & Veterinary Department',
    publishedAt: daysAgo(5, 9, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'when', value: '24–30 Sep 2026' }, { kind: 'where', value: 'Veterinary centres' }, { kind: 'who', value: 'Cattle, goats and poultry' }],
    body: [
      p('Free FMD, HS and poultry vaccinations at veterinary centres across the district from ', { bold: '24 to 30 September 2026' }, '.'),
      p('Vaccinations are recorded against your batch, so bring your batch reference if you have one.'),
    ],
    attachment: null,
  },
  {
    id: 'nt-2027',
    category: 'vandhan',
    title: 'Van Dhan Collection Drive in Mokokchung',
    summary: 'A collection drive at the Mokokchung Kendra to support local gatherers and ensure fair prices.',
    issuer: 'Department of Tribal Affairs',
    publishedAt: daysAgo(7, 9, 0),
    read: true,
    tagline: 'Support local livelihoods.\nStronger forests, brighter communities.',
    facts: [{ kind: 'when', value: '15–20 Sep 2026' }, { kind: 'where', value: 'Mokokchung Kendra' }, { kind: 'bring', value: 'Clean, sorted, packed produce' }],
    body: [
      p('A Van Dhan collection drive will be held at the Mokokchung Kendra from ', { bold: '15 – 20 September 2026' }, ' to support local gatherers and ensure fair prices for forest produce.'),
      p('Our team will assist with weighing, grading and documentation. Please bring your produce clean, properly sorted and packed.'),
      p('For large quantities, you may schedule a pickup through the app or contact the Kendra directly.'),
    ],
    attachment: { name: 'Collection_Drive_Guidelines.pdf', sizeLabel: '1.2 MB', url: null },
  },
  {
    id: 'nt-2024',
    category: 'government',
    title: 'District Service Camp',
    summary: 'Access multiple government services at the one-day camp in your village.',
    issuer: 'Deputy Commissioner, Mokokchung',
    publishedAt: daysAgo(8, 9, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'when', value: '27 Sep 2026' }, { kind: 'where', value: 'Ungma community hall' }],
    body: [p('A one-day service camp will be held at Ungma community hall on ', { bold: '27 September 2026' }, '. Aadhaar updates, ration card and pension services will be available.')],
    attachment: null,
  },
  {
    id: 'nt-2019',
    category: 'weather',
    title: 'Heavy Rain Alert',
    summary: 'IMD has issued a yellow alert for heavy rainfall in your district. Please take necessary precautions.',
    issuer: 'District Disaster Management Authority',
    publishedAt: daysAgo(11, 7, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'when', value: 'Next 48 hours' }, { kind: 'where', value: 'Mokokchung district' }],
    body: [p('Heavy rainfall is expected over the next 48 hours. Avoid landslide-prone roads and keep livestock and stored produce on raised ground.')],
    attachment: null,
  },
  {
    id: 'nt-2015',
    category: 'meeting',
    title: 'Gram Sabha Meeting',
    summary: 'Next Gram Sabha meeting will be held on 12 Oct 2026 at the community hall.',
    issuer: 'Village Council, Ungma',
    publishedAt: daysAgo(14, 9, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'when', value: '12 Oct 2026, 10 am' }, { kind: 'where', value: 'Community hall' }],
    body: [p('The next Gram Sabha meeting will be held on ', { bold: '12 October 2026' }, ' at 10 am in the community hall.')],
    attachment: null,
  },
  {
    id: 'nt-2010',
    category: 'scheme',
    title: 'New Scheme Launched',
    summary: 'Government has launched a new scheme to support women self-help groups.',
    issuer: 'Department of Rural Development',
    publishedAt: daysAgo(16, 9, 0),
    read: true,
    tagline: null,
    facts: [{ kind: 'who', value: 'Women self-help groups' }, { kind: 'where', value: 'Block office' }],
    body: [p('Registered women self-help groups can apply for working capital support through the block office. Details are available at your nearest Kendra.')],
    attachment: null,
  },
];
