import { describe, expect, it } from 'vitest';

import { withSetup } from '..';
import { useCalendar } from '.';

describe('useCalendar', () => {
  it('initializes with empty dates and isDatesReady as false', async () => {
    await withSetup(async () => {
      const { dateFrom, dateTo, isDatesReady } = useCalendar();

      expect(dateFrom.value).toStrictEqual(undefined);
      expect(dateTo.value).toStrictEqual(undefined);
      expect(isDatesReady.value).toStrictEqual(false);
    });
  });

  it('updates dates correctly', async () => {
    await withSetup(async () => {
      const { dateFrom, dateTo, isDatesReady, updateDates } = useCalendar();

      const dates = {
        dateFrom: new Date('2023-01-01'),
        dateTo: new Date('2023-12-31'),
      };

      updateDates(dates);

      expect(dateFrom.value).toStrictEqual(dates.dateFrom);
      expect(dateTo.value).toStrictEqual(dates.dateTo);
      expect(isDatesReady.value).toStrictEqual(true);
    });
  });
});
