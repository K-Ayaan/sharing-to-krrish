import * as SecureStore from 'expo-secure-store';
import { createSessionStore } from './sessionStore';

export const session = createSessionStore(SecureStore);
