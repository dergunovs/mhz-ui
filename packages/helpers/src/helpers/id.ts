export function createTempId(): string {
  return `temp-${crypto.randomUUID()}`;
}

export function deleteTempId<T extends { _id?: string }>(array: T[], isDeleteAllIds?: boolean): T[] {
  return array.map((obj) => {
    if (isDeleteAllIds || obj._id?.includes('temp-')) {
      delete obj._id;

      return obj;
    } else return obj;
  });
}
