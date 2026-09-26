/* eslint-disable unicorn/consistent-boolean-name */
import { readonly, shallowRef } from 'vue';

import { getOneYearFromNow } from '..';

const isAuthLocal = shallowRef(false);

export const isAuth = readonly(isAuthLocal);

export function setAuth(isAuthValue: boolean) {
  isAuthLocal.value = isAuthValue;
}

export function logout(url: string, deleteAuthHeader: () => void, tokenName: string) {
  deleteCookieToken(tokenName);
  deleteAuthHeader();
  location.assign(url);
}

export function getCookieToken(tokenName: string): string | undefined {
  if (!document.cookie) return;

  const cookie = document.cookie.split('; ').find((item) => item.startsWith(`${tokenName}=`));

  return cookie ? cookie.slice(`${tokenName}=`.length) : undefined;
}

export function setCookieToken(token: string, tokenName: string) {
  document.cookie = `${tokenName}=${token};Secure;SameSite=strict;expires=${getOneYearFromNow()}`;
}

export function deleteCookieToken(tokenName: string) {
  document.cookie = `${tokenName}=;expires=${new Date(0).toUTCString()}`;
}

export function useAuth() {
  function auth(token: string, setAuthHeader: (token: string) => void, tokenName: string) {
    setCookieToken(token, tokenName);
    setAuthHeader(token);
    setAuth(true);
  }

  return { auth };
}
