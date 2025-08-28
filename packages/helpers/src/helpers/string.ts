export function html(strings: TemplateStringsArray, ...expressions: unknown[]): string {
  const result: string[] = [];

  for (const [i, string] of strings.entries()) {
    result.push(string);
    if (i < expressions.length) {
      result.push(String(expressions[i]));
    }
  }

  return result.join('');
}
