export function createTempId(): string {
  return `temp-${crypto.randomUUID()}`;
}

export function deleteTempId<T extends { _id?: string }>(array: T[], isDeleteAllIds?: boolean): T[] {
  if (!array || array.length === 0) return [];

  return array.map((obj) => {
    if (isDeleteAllIds || obj._id?.includes('temp-')) {
      delete obj._id;

      return obj;
    }

    return obj;
  });
}
