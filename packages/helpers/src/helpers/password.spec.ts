import { describe, expect, it } from 'vitest';

import { generatePassword } from '..';

describe('password', () => {
  it('generates string password', async () => {
    const password = generatePassword();

    expect(password).toBeTypeOf('string');
  });

  it('generates password with 9 symbols length', async () => {
    const password = generatePassword();

    expect(password).toSatisfy((pwd: string) => pwd.length === 9);
  });

  it('generates unique passwords', async () => {
    const password1 = generatePassword();
    const password2 = generatePassword();

    expect(password1).not.toBe(password2);
  });

  it('generates password with specific character set', async () => {
    const password = generatePassword();

    const allowedChars = /^[a-zA-Z0-9]+$/;

    expect(allowedChars.test(password)).toBe(true);
  });
});
