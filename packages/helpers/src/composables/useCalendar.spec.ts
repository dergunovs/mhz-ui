import { describe, expect, it } from 'vitest';

import { withSetup } from '..';
import { useCalendar } from '.';

describe('useCalendar', () => {
  it('initializes with empty dates and isDatesReady as false', async () => {
    await withSetup(async () => {
      const { dateFrom, dateTo, isDatesReady } = useCalendar();

      expect(dateFrom.value).toStrictEqual('');
      expect(dateTo.value).toStrictEqual('');
      expect(isDatesReady.value).toStrictEqual(false);
    });
  });

  it('updates dates correctly', async () => {
    await withSetup(async () => {
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

  it('handles empty dates object', async () => {
    await withSetup(async () => {
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
