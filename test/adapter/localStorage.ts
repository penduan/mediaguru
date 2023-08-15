let map = new Map<any, any>();

global.localStorage = {
  setItem(key: string, value: string) {
    map.set(key, value); 
  },
  getItem(key: string) {
    return map.get(key);
  },
  clear() {
    map.clear();
  },

  removeItem(key: string) {
    map.delete(key);
  },
  get length() {
    return map.size;
  }
} as any;