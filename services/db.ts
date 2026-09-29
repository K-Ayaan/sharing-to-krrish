// In-session stand-in for the SassyJinni backend: a mutable copy of data/mock so anything you
// submit (a collection, a refill booking, an acknowledgement) persists while the app is open.
// Only the service files read or write this — screens never import it.
import { clone } from './client';
import { mockAlerts, mockBatches, mockListings, type Batch, type BioAlert, type Listing } from '../data/mock/mockLivestock';
import {
  mockBookings,
  mockConnection,
  mockComplaints,
  type Booking,
  type Complaint,
  type LpgConnection,
} from '../data/mock/mockLpg';
import {
  mockApplication,
  mockDocuments,
  mockMfGrievances,
  mockRepayments,
  type LoanApplication,
  type LoanDocument,
  type MfGrievance,
  type Repayment,
} from '../data/mock/mockMicroFinance';
import { mockNotices, type Notice } from '../data/mock/mockNotices';
import { mockEvents, type ServiceEvent } from '../data/mock/mockRecords';
import { MOCK_SCENARIO, mockUser, type UserProfile } from '../data/mock/mockUser';
import {
  mockCollections,
  mockGrievances,
  mockProduce,
  type Collection,
  type Grievance,
  type Produce,
} from '../data/mock/mockVanDhan';

type Db = {
  profile: UserProfile;
  produce: Produce[];
  collections: Collection[];
  vdGrievances: Grievance[];
  listings: Listing[];
  batches: Batch[];
  alerts: BioAlert[];
  connection: LpgConnection | null;
  bookings: Booking[];
  complaints: Complaint[];
  notices: Notice[];
  events: ServiceEvent[];
  application: LoanApplication | null;
  documents: LoanDocument[];
  repayments: Repayment[];
  mfGrievances: MfGrievance[];
};

function seed(): Db {
  return {
    profile: clone(mockUser),
    produce: clone(mockProduce),
    collections: clone(mockCollections),
    vdGrievances: clone(mockGrievances),
    listings: clone(mockListings),
    batches: clone(mockBatches),
    alerts: clone(mockAlerts),
    // No LPG connection until one is registered — mockConnection is what registering returns.
    connection: null,
    bookings: clone(mockBookings),
    complaints: clone(mockComplaints),
    notices: clone(mockNotices),
    events: clone(mockEvents),
    application: clone(mockApplication),
    documents: clone(mockDocuments),
    repayments: clone(mockRepayments),
    mfGrievances: clone(mockMfGrievances),
  };
}

export const db: Db = seed();

// With nothing registered there can be no history either, or Records would list collections and
// bookings the person never made.
if (MOCK_SCENARIO === 'new') resetToNewUser();

// A brand-new person has no service history: every pillar starts unregistered and empty.
export function resetToNewUser() {
  db.collections = [];
  db.vdGrievances = [];
  db.batches = [];
  db.connection = null;
  db.bookings = [];
  db.complaints = [];
  db.events = [];
  db.application = null;
  db.documents = clone(mockDocuments).map((doc) => ({ ...doc, receivedAt: null, note: null }));
  db.repayments = [];
  db.mfGrievances = [];
}

export function nextReference(prefix: string) {
  return `${prefix}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}
