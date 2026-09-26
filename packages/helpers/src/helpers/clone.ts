import { toRaw } from 'vue';

function cloneSet<T>(set: Set<T>): Set<T> {
  const clonedSet = new Set<T>();

  for (const value of set) {
    clonedSet.add(deepClone(value));
  }

  return clonedSet;
}

function cloneMap<K, V>(map: Map<K, V>): Map<K, V> {
  const clonedMap = new Map<K, V>();

  for (const [key, value] of map) {
    clonedMap.set(deepClone(key), deepClone(value));
  }

  return clonedMap;
}

function cloneObject<T extends object>(obj: T): T {
  const cloned = {} as T;

  for (const symbol of Object.getOwnPropertySymbols(obj)) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, symbol);

    if (descriptor?.enumerable) {
      Object.defineProperty(cloned, symbol, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: deepClone((obj as T)[symbol as keyof T]),
      });
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    cloned[key as keyof T] = deepClone(value as T[keyof T]);
  }

  return cloned;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj as T;
  }

  if (obj instanceof Date) {
    return new Date(obj) as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (obj instanceof Set) {
    return cloneSet(obj) as T;
  }

  return obj instanceof Map ? (cloneMap(obj) as T) : cloneObject(obj);
}

export function clone<T>(obj: T): T {
  const raw = toRaw(obj);

  return deepClone(raw);
}
