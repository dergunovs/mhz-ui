import { describe, expect, it } from 'vitest';
import { QueryCache, QueryClient } from '@tanstack/vue-query';

import { logout } from '../composables/useAuth';

import { queryClient, vueQueryOptions } from '..';
import { handleError, deleteAuthHeader } from './api';

describe('query', () => {
  it('exports queryClient', async () => {
    const queryClientInstance = new QueryClient();

    expect(queryClientInstance).toStrictEqual(queryClient);
  });

  it('exports query options', async () => {
    const toast = { error: (text: string) => alert(text) };
    const logoutUrl = '/';
    const tokenName = 'token';

    const options = JSON.stringify(vueQueryOptions(toast, logoutUrl, tokenName));

    const optionsResult = JSON.stringify({
      queryClientConfig: {
        queryCache: new QueryCache({
          onError: (error: unknown) => {
            if ((error as { response: { status: number } }).response?.status === 403) {
              logout(logoutUrl, deleteAuthHeader, tokenName);
            }

            toast.error(handleError(error));
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            onError: (error: unknown) => {
              toast.error(handleError(error));
            },
          },
        },
      },
    });

    expect(options).toStrictEqual(optionsResult);
  });
});
