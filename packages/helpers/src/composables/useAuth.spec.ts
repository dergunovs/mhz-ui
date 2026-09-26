import { vi, describe, expect, it } from 'vitest';

import { isAuth, setAuth, logout, getCookieToken, setCookieToken, deleteCookieToken, useAuth, withSetup } from '..';

const tokenName = 'token';

const tokenState = { value: '1231231231' };
const newTokenValue = '123';

vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
  tokenState.value = value.split(`${tokenName}=`, 2)[1]?.split(';', 2)[0] ?? '';
});

vi.spyOn(document, 'cookie', 'get').mockImplementation(() => `${tokenName}=${tokenState.value}`);

describe('useAuth', () => {
  it('exports is user auth', async () => {
    expect(isAuth.value).toStrictEqual(false);
  });

  it('sets auth', async () => {
    expect(isAuth.value).toStrictEqual(false);

    setAuth(true);

    expect(isAuth.value).toStrictEqual(true);

    setAuth(false);

    expect(isAuth.value).toStrictEqual(false);
  });

  it('handles logout', async () => {
    const spyDeleteAuthHeader = vi.fn();

    const SITE = 'https://site.ru';
    const URL = 'login';

    location.assign(SITE);

    expect(getCookieToken(tokenName)).toStrictEqual(tokenState.value);
    expect(location.href).toStrictEqual(`${SITE}/`);

    logout(URL, spyDeleteAuthHeader, tokenName);

    expect(spyDeleteAuthHeader).toHaveBeenCalledTimes(1);
    expect(location.href).toStrictEqual(`${SITE}/${URL}`);
  });

  it('gets cookie token', async () => {
    tokenState.value = '';

    expect(getCookieToken(tokenName)).toStrictEqual(tokenState.value);
  });

  it('returns undefined when document cookie is empty', async () => {
    const originalCookie = Object.getOwnPropertyDescriptor(document, 'cookie');

    Object.defineProperty(document, 'cookie', {
      get: () => '',
      configurable: true,
    });

    expect(getCookieToken(tokenName)).toBeUndefined();

    if (originalCookie) {
      Object.defineProperty(document, 'cookie', originalCookie);
    }
  });

  it('sets cookie token', async () => {
    setCookieToken(newTokenValue, tokenName);

    expect(getCookieToken(tokenName)).toStrictEqual(newTokenValue);
  });

  it('deletes cookie token', async () => {
    expect(getCookieToken(tokenName)).toStrictEqual(newTokenValue);

    deleteCookieToken(tokenName);

    expect(getCookieToken(tokenName)).toStrictEqual('');
  });

  it('handles auth', async () => {
    const spySetAuthHeader = vi.fn();

    await withSetup(async () => {
      const { auth } = useAuth();

      expect(getCookieToken(tokenName)).toStrictEqual('');
      expect(isAuth.value).toStrictEqual(false);

      auth(newTokenValue, spySetAuthHeader, tokenName);

      expect(getCookieToken(tokenName)).toStrictEqual(newTokenValue);

      expect(spySetAuthHeader).toHaveBeenCalledTimes(1);
      expect(spySetAuthHeader).toHaveBeenCalledWith(newTokenValue);
      expect(isAuth.value).toStrictEqual(true);
    });
  });
});
