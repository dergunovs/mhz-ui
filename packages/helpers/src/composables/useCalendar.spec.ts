import { describe, expect, test } from 'vitest';

import { withSetup } from '..';
import { useCalendar } from '.';

describe('useCalendar', () => {
  test('initializes with empty dates and isDatesReady as false', async () => {
    withSetup(() => {
      const { dateFrom, dateTo, isDatesReady } = useCalendar();

      expect(dateFrom.value).toStrictEqual('');
      expect(dateTo.value).toStrictEqual('');
      expect(isDatesReady.value).toStrictEqual(false);
    });
  });

  test('updates dates correctly', async () => {
    withSetup(() => {
      const { dateFrom, dateTo, isDatesReady, updateDates } = useCalendar();

      const dates = {
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
      };

      updateDates(dates);

      expect(dateFrom.value).toStrictEqual(dates.dateFrom);
      expect(dateTo.value).toStrictEqual(dates.dateTo);
      expect(isDatesReady.value).toStrictEqual(true);
    });
  });

  test('handles empty dates object', async () => {
    withSetup(() => {
      const { dateFrom, dateTo, isDatesReady, updateDates } = useCalendar();

      const dates = {
        dateFrom: '',
        dateTo: '',
      };

      updateDates(dates);

      expect(dateFrom.value).toStrictEqual(dates.dateFrom);
      expect(dateTo.value).toStrictEqual(dates.dateTo);
      expect(isDatesReady.value).toStrictEqual(true);
    });
  });
});
