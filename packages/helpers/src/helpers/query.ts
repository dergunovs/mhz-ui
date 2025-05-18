import { QueryCache, QueryClient, type VueQueryPluginOptions } from '@tanstack/vue-query';

import { logout } from '../composables/useAuth';
import { handleError, deleteAuthHeader } from './api';

interface IError {
  code: string;
  response: { status: number };
}

export const queryClient: QueryClient = new QueryClient();

export function vueQueryOptions(
  toast: { error: (text: string) => void },
  logoutUrl: string,
  tokenName: string
): VueQueryPluginOptions {
  return {
    queryClientConfig: {
      queryCache: new QueryCache({
        onError: (error: unknown) => {
          const isNetworkError = (error as IError).code === 'ERR_NETWORK';
          const isAuthError = [403, 401].includes((error as IError).response?.status);

          if (isNetworkError) {
            toast.error('Ошибка подключения к сети');
          } else if (isAuthError) {
            logout(logoutUrl, deleteAuthHeader, tokenName);
          } else toast.error(handleError(error));
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
  };
}

export { VueQueryPlugin, useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
export type { UseQueryReturnType, UseMutationReturnType, QueryClient } from '@tanstack/vue-query';
