// Pure session logic with the storage injected, so it can be exercised without
// native modules. navigation/session.ts binds it to expo-secure-store.

export type KeyValueStorage = {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
};

export const UID_KEY = 'marcofed.uid';

export function createSessionStore(storage: KeyValueStorage) {
  return {
    /** Resolves null when nothing is stored or storage is unreadable — never rejects. */
    async readUid(): Promise<string | null> {
      try {
        const uid = await storage.getItemAsync(UID_KEY);
        return uid && uid.trim() ? uid : null;
      } catch {
        return null;
      }
    },

    async saveUid(uid: string): Promise<void> {
      await storage.setItemAsync(UID_KEY, uid);
    },

    async clear(): Promise<void> {
      await storage.deleteItemAsync(UID_KEY);
    },
  };
}

export type SessionStore = ReturnType<typeof createSessionStore>;
