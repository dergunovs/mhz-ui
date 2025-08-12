import { describe, expect, test } from 'vitest';

import { generatePassword } from '.';

describe('password', () => {
  test('generates string password', async () => {
    const password = generatePassword();

    expect(password).toBeTypeOf('string');
  });

  test('generates password with 9 symbols length', async () => {
    const password = generatePassword();

    expect(password).toSatisfy((pwd: string) => pwd.length === 9);
  });

  test('generates unique passwords', async () => {
    const password1 = generatePassword();
    const password2 = generatePassword();

    expect(password1).not.toBe(password2);
  });
});
