import { toRaw } from 'vue';

export function clone<T>(obj: T): T {
  return structuredClone(toRaw(obj));
}
