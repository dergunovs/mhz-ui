import { toRaw } from 'vue';

function deepClone<T>(obj: T): T {
  // eslint-disable-next-line sonarjs/different-types-comparison
  if (obj === null) {
    return obj as T;
  }

  if (typeof obj !== 'object') {
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
    const clonedSet = new Set();

    obj.forEach((value) => {
      clonedSet.add(deepClone(value));
    });

    return clonedSet as T;
  }

  if (obj instanceof Map) {
    const clonedMap = new Map();

    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key), deepClone(value));
    });

    return clonedMap as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;

    Object.getOwnPropertySymbols(obj).forEach((symbol) => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, symbol);

      if (descriptor?.enumerable) {
        Object.defineProperty(cloned, symbol, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: deepClone((obj as T)[symbol as keyof T]),
        });
      }
    });

    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }

    return cloned;
  }

  return obj;
}

export function clone<T>(obj: T): T {
  const raw = toRaw(obj);

  return deepClone(raw);
}
