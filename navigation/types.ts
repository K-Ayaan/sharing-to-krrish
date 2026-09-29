import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

// Registration starts from the mobile number and verifies it by OTP — Aadhaar was dropped from
// onboarding on the user's instruction (23 Sep 2026). "Why do we need this?" is a bottom sheet
// inside PhoneEntry, not a route. PhoneEntry takes a number back when Edit returns to it.
export type OnboardingStackParamList = {
  PhoneEntry: { phone?: string } | undefined;
  OtpVerify: { phone: string };
  ProfileDetails: { phone: string };
  AllSet: undefined;
};

export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ServicesTab: NavigatorScreenParams<ServicesStackParamList>;
  RecordsTab: NavigatorScreenParams<RecordsStackParamList>;
  NoticesTab: NavigatorScreenParams<NoticesStackParamList>;
  AskUsTab: NavigatorScreenParams<AskUsStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export type ServicesStackParamList = {
  ServicesHub: undefined;
  VanDhan: NavigatorScreenParams<VanDhanStackParamList>;
  Livestock: NavigatorScreenParams<LivestockStackParamList>;
  Lpg: NavigatorScreenParams<LpgStackParamList>;
  MicroFinance: NavigatorScreenParams<MicroFinanceStackParamList>;
};

export type VanDhanStackParamList = {
  VanDhanHub: { tab?: 'rates' | 'collections' } | undefined;
  VanDhanRegister: undefined;
  // Pre-selects the produce when opened from a rate.
  SubmitCollection: { produceId?: string } | undefined;
  CollectionDetail: { collectionId: string };
  VanDhanRaiseGrievance: undefined;
  VanDhanGrievanceStatus: undefined;
};

// Livestock producer-intake screens (ReportStock onward) are SPEC-ONLY — see design/flow.md's
// open items. Only the buyer/browse side (LivestockBrowse, LivestockDetail) has a mockup.
export type LivestockStackParamList = {
  LivestockBrowse: undefined;
  LivestockDetail: { listingId: string };
  LivestockRegister: undefined;
  ReportStock: undefined;
  MyBatches: undefined;
  BatchDetail: { batchId?: string } | undefined;
  Certificate: { batchId?: string } | undefined;
  BiosecurityAlerts: undefined;
};

export type LpgStackParamList = {
  // { book: true } opens the Book Refill sheet on arrival.
  LpgHub: { book?: boolean } | undefined;
  LpgRegister: undefined;
  // A complaint raised from a booking arrives with that booking already chosen.
  LpgRaiseComplaint: { bookingReference?: string } | undefined;
  LpgMyComplaints: undefined;
};

// SPEC-ONLY throughout — a readiness capability, not a live lending system (SDD §4.5).
export type MicroFinanceStackParamList = {
  MicroFinanceRegister: undefined;
  MicroFinanceApply: undefined;
  MicroFinanceDocuments: undefined;
  MicroFinanceApplicationStatus: undefined;
  MicroFinanceRepayments: undefined;
  MicroFinanceRaiseGrievance: undefined;
};

export type RecordsStackParamList = {
  RecordsList: undefined;
  // "<kind>:<source id>", e.g. "collection:vdcl-4587" — see services/recordsService.ts.
  RecordDetail: { recordId: string };
};

export type NoticesStackParamList = {
  NoticesList: undefined;
  NoticeDetail: { noticeId: string };
};

export type AskUsStackParamList = {
  AskUs: undefined;
};

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>;

export type ServicesScreenProps<T extends keyof ServicesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ServicesStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>;

export type VanDhanScreenProps<T extends keyof VanDhanStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<VanDhanStackParamList, T>,
  CompositeScreenProps<
    NativeStackScreenProps<ServicesStackParamList>,
    BottomTabScreenProps<MainTabsParamList>
  >
>;

export type LivestockScreenProps<T extends keyof LivestockStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LivestockStackParamList, T>,
  CompositeScreenProps<
    NativeStackScreenProps<ServicesStackParamList>,
    BottomTabScreenProps<MainTabsParamList>
  >
>;

export type LpgScreenProps<T extends keyof LpgStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LpgStackParamList, T>,
  CompositeScreenProps<
    NativeStackScreenProps<ServicesStackParamList>,
    BottomTabScreenProps<MainTabsParamList>
  >
>;

export type MicroFinanceScreenProps<T extends keyof MicroFinanceStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MicroFinanceStackParamList, T>,
  CompositeScreenProps<
    NativeStackScreenProps<ServicesStackParamList>,
    BottomTabScreenProps<MainTabsParamList>
  >
>;

export type RecordsScreenProps<T extends keyof RecordsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RecordsStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>;

export type NoticesScreenProps<T extends keyof NoticesStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<NoticesStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>;

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
