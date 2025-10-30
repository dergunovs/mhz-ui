import { vi, describe, expect, it } from 'vitest';

import { isAuth, setAuth, logout, getCookieToken, setCookieToken, deleteCookieToken, useAuth, withSetup } from '..';

const tokenName = 'token';

let tokenValue = '1231231231';
const newTokenValue = '123';

vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
  tokenValue = value.split(`${tokenName}=`)[1].split(';')[0];
});

vi.spyOn(document, 'cookie', 'get').mockImplementation(() => `${tokenName}=${tokenValue}`);

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

    globalThis.location.href = SITE;

    expect(getCookieToken(tokenName)).toStrictEqual(tokenValue);
    expect(globalThis.location.href).toStrictEqual(`${SITE}/`);

    logout(URL, spyDeleteAuthHeader, tokenName);

    expect(spyDeleteAuthHeader).toBeCalledTimes(1);
    expect(globalThis.location.href).toStrictEqual(`${SITE}/${URL}`);
  });

  it('gets cookie token', async () => {
    tokenValue = '';

    expect(getCookieToken(tokenName)).toStrictEqual(tokenValue);
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

      expect(spySetAuthHeader).toBeCalledTimes(1);
      expect(spySetAuthHeader).toBeCalledWith(newTokenValue);
      expect(isAuth.value).toStrictEqual(true);
    });
  });
});
