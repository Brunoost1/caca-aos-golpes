const NS = "cag:";

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(NS + key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(NS + key);
  }
};