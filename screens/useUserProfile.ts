import { useSyncExternalStore } from 'react';
import { getProfile, subscribeToProfile } from '../data/mock/mockUser';

/** Live profile. Every screen showing the user's name or UID reads this, so a Settings save shows at once. */
export const useUserProfile = () => useSyncExternalStore(subscribeToProfile, getProfile);
