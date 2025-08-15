import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { api, setBaseURL, setAuthHeader, deleteAuthHeader, handleError } from '.';

const TOKEN = '123123123';

describe('api', () => {
  test('exports axios', async () => {
    expect(axios).toStrictEqual(api);
  });

  test('sets base url', async () => {
    expect(axios.defaults.baseURL).toStrictEqual(undefined);

    const BASE_URL = 'site.ru';

    setBaseURL(BASE_URL);

    expect(api.defaults.baseURL).toStrictEqual(BASE_URL);
  });

  test('sets base url with empty string', async () => {
    setBaseURL('');

    expect(api.defaults.baseURL).toStrictEqual('');
  });

  test('sets auth header', async () => {
    expect(api.defaults.headers.common['Authorization']).toStrictEqual(undefined);

    setAuthHeader(TOKEN);

    expect(api.defaults.headers.common['Authorization']).toStrictEqual(`Bearer ${TOKEN}`);
  });

  test('sets auth header with empty token', async () => {
    setAuthHeader('');

    expect(api.defaults.headers.common['Authorization']).toStrictEqual(`Bearer `);
  });

  test('deletes auth header', async () => {
    setAuthHeader(TOKEN);

    expect(api.defaults.headers.common['Authorization']).toStrictEqual(`Bearer ${TOKEN}`);

    deleteAuthHeader();

    expect(api.defaults.headers.common['Authorization']).toStrictEqual(undefined);
  });

  test('handles error with axios error', async () => {
    const ERROR_TEXT = 'Текст ошибки';

    const ERROR = new api.AxiosError(
      'Error!',
      '500',
      { url: 'site.ru', headers: new api.AxiosHeaders() },
      { path: '/' },
      {
        status: 500,
        data: { message: ERROR_TEXT },
        statusText: 'Server error',
        config: { url: 'site.ru', headers: new api.AxiosHeaders() },
        headers: new api.AxiosHeaders(),
      }
    );

    const handledError = handleError(ERROR);

    expect(handledError).toStrictEqual(ERROR_TEXT);
  });

  test('handles error with non-axios error', async () => {
    const ERROR = new Error('Текст ошибки');

    const handledError = handleError(ERROR);

    expect(handledError).toStrictEqual('Error');
  });

  test('handles error with undefined error', async () => {
    const handledError = handleError(undefined);

    expect(handledError).toStrictEqual('Error');
  });

  test('handles error with null error', async () => {
    const handledError = handleError(null);

    expect(handledError).toStrictEqual('Error');
  });
});
