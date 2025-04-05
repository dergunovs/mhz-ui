import { describe, expect, test } from 'vitest';

import { generatePassword } from './index.js';

describe('numbers', () => {
  test('gets percent diff', async () => {
    expect(generatePassword()).toBeTypeOf('string');
    expect(generatePassword()).toSatisfy((password: string) => password.length === 9);
  });
});
