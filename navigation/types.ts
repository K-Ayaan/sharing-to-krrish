import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ComplaintCategoryId } from '../data/mock/mockLpg';
import type { RegistrationDraft } from '../data/mock/mockOnboarding';

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

export type OnboardingStackParamList = {
  PhoneEntry: undefined;
  OtpEntry: { phone: string };
  EmailEntry: { phone: string };
  ProfileDetails: { phone: string; email: string };
  Consent: { draft: RegistrationDraft };
  RegistrationComplete: { uid: string };
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
};

export type ServicesStackParamList = {
  Services: undefined;
  VanDhanStack: NavigatorScreenParams<VanDhanStackParamList>;
  LivestockStack: NavigatorScreenParams<LivestockStackParamList>;
  LpgStack: NavigatorScreenParams<LpgStackParamList>;
};

export type VanDhanStackParamList = {
  // Set by LogCollection on submit; VanDhanHome shows a Toast and clears it.
  VanDhanHome: { confirmation?: 'collection_logged' } | undefined;
  LogCollection: undefined;
  SchedulePickup: undefined;
  PickupDetails: { pickupId: string };
  KendraInfo: undefined;
  GrievanceStatus: undefined;
};

export type LivestockStackParamList = {
  LivestockHome: undefined;
  StockDetails: { stockId: string };
};

export type LpgStackParamList = {
  // RequestRefillSheet is a modal, not a route, so Home reaches it via this flag.
  LpgHome: { openRefillSheet?: boolean } | undefined;
  EnterBookingReference: undefined;
  // Omitted requestId shows the latest request (Home's "View Details").
  RequestStatus: { requestId?: string } | undefined;
  ComplaintCategory: { requestId?: string } | undefined;
  ComplaintDetails: { categoryId: ComplaintCategoryId; requestId?: string };
  ComplaintSubmitted: { complaintId: string };
};

export type RecordsStackParamList = {
  Records: undefined;
  // "<kind>:<id>", e.g. "lpg_refill:REQ-2025-0412" — see screens/records/recordSource.ts.
  RecordDetail: { recordId: string };
};

export type NoticesStackParamList = {
  Notices: undefined;
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

export type RecordsScreenProps<T extends keyof RecordsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RecordsStackParamList, T>,
  BottomTabScreenProps<MainTabsParamList>
>;

export type NoticesScreenProps<T extends keyof NoticesStackParamList> =
  NativeStackScreenProps<NoticesStackParamList, T>;

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
