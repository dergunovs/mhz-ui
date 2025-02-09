export function dataTest(value: string): string {
  return `[data-test="${value}"]`;
}

export async function wait(time?: number): Promise<void> {
  await new Promise((r) => {
    setTimeout(r, time || 10);
  });
}
