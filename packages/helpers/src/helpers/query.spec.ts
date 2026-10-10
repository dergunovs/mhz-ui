import { describe, expect, it, vi } from 'vitest';
import { QueryCache, QueryClient } from '@tanstack/vue-query';

import { queryClient, vueQueryOptions } from '..';

interface IQueryOptions {
  queryClientConfig: {
    queryCache: QueryCache;
    defaultOptions: {
      queries: object;
      mutations: {
        onError: (error: unknown) => void;
      };
    };
  };
}

describe('query', () => {
  it('exports queryClient', async () => {
    const queryClientInstance = new QueryClient();

    expect(queryClientInstance).toStrictEqual(queryClient);
  });

  it('exports query options', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/';
    const tokenName = 'token';

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;

    expect(options).toStrictEqual({
      queryClientConfig: {
        queryCache: expect.any(QueryCache),
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            onError: expect.any(Function),
          },
        },
      },
    });
  });

  it('handles network error in query cache', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/logout';
    const tokenName = 'token';

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;
    const onError = (
      options.queryClientConfig.queryCache as QueryCache & { config: { onError: (error: unknown) => void } }
    ).config.onError;

    const networkError = { code: 'ERR_NETWORK' };

    onError(networkError);

    expect(toast.error).toHaveBeenCalledWith('Ошибка подключения к сети');
  });

  it('handles auth error 401 in query cache', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/logout';
    const tokenName = 'token';

    let capturedHref = '';

    vi.spyOn(location, 'href', 'set').mockImplementation((value) => {
      capturedHref = value;
    });

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;
    const onError = (
      options.queryClientConfig.queryCache as QueryCache & { config: { onError: (error: unknown) => void } }
    ).config.onError;

    const authError = { code: 'OTHER', response: { status: 401 } };

    onError(authError);

    expect(capturedHref).toBe('/logout');
  });

  it('handles auth error 403 in query cache', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/logout';
    const tokenName = 'token';

    let capturedHref = '';

    vi.spyOn(location, 'href', 'set').mockImplementation((value) => {
      capturedHref = value;
    });

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;
    const onError = (
      options.queryClientConfig.queryCache as QueryCache & { config: { onError: (error: unknown) => void } }
    ).config.onError;

    const authError = { code: 'OTHER', response: { status: 403 } };

    onError(authError);

    expect(capturedHref).toBe('/logout');
  });

  it('handles generic error in query cache', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/logout';
    const tokenName = 'token';

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;
    const onError = (
      options.queryClientConfig.queryCache as QueryCache & { config: { onError: (error: unknown) => void } }
    ).config.onError;

    const genericError = new Error('Something went wrong');

    onError(genericError);

    expect(toast.error).toHaveBeenCalled();
  });

  it('handles error in mutation', async () => {
    const toast = { error: vi.fn() };
    const logoutUrl = '/logout';
    const tokenName = 'token';

    const options = vueQueryOptions(toast, logoutUrl, tokenName) as unknown as IQueryOptions;
    const mutationOnError = options.queryClientConfig.defaultOptions.mutations.onError;

    const genericError = new Error('Mutation failed');

    mutationOnError(genericError);

    expect(toast.error).toHaveBeenCalled();
  });
});
