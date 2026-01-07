export const storage = {
  getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      return undefined;
    }
  },
  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      return undefined;
    }
  },
  getJson<T>(key: string, fallback: T) {
    const raw = storage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  setJson<T>(key: string, value: T) {
    storage.setItem(key, JSON.stringify(value));
  },
};
