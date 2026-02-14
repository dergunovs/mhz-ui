import { readonly, shallowRef } from 'vue';

import { getOneYearFromNow } from '..';

const isAuthLocal = shallowRef(false);

export const isAuth = readonly(isAuthLocal);

export function setAuth(auth: boolean) {
  isAuthLocal.value = auth;
}

export function logout(url: string, deleteAuthHeader: () => void, tokenName: string) {
  deleteCookieToken(tokenName);
  deleteAuthHeader();
  globalThis.location.href = url;
}

export function getCookieToken(tokenName: string): string | undefined {
  if (!document.cookie) return;

  const { [tokenName]: token } = Object.fromEntries(document.cookie.split('; ').map((v) => v.split('=')));

  return token;
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
