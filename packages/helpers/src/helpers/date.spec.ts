import { vi, describe, expect, test } from 'vitest';

import {
  addZero,
  formatDuration,
  formatDate,
  formatDateTime,
  subtractDates,
  getDatesByDayGap,
  getFirstAndLastDays,
  getOneYearFromNow,
} from '.';

describe('date', () => {
  test('adds zero to number if its less than 10', async () => {
    const SMALL_NUMBER = 9;
    const BIG_NUMBER = 10;

    expect(addZero(SMALL_NUMBER)).toStrictEqual(`0${SMALL_NUMBER}`);
    expect(addZero(BIG_NUMBER)).toStrictEqual(`${BIG_NUMBER}`);
  });

  test('formats duration', async () => {
    const DURATION_SECONDS = 9;
    const DURATION_MINUTES = 69;

    expect(formatDuration(DURATION_SECONDS)).toStrictEqual(`09 sec.`);
    expect(formatDuration(DURATION_MINUTES)).toStrictEqual(`1 min. 09 sec.`);
    expect(formatDuration()).toStrictEqual(`0`);
    expect(formatDuration(-5)).toStrictEqual(`0`);
  });

  test('formats duration with different languages', async () => {
    const DURATION = 69;

    expect(formatDuration(DURATION, 'en')).toStrictEqual(`1 min. 09 sec.`);
    expect(formatDuration(DURATION, 'ru')).toStrictEqual(`1 мин. 09 сек.`);
  });

  test('formats date', async () => {
    const DATE = new Date('2025-02-09T17:13:17.427Z');

    expect(formatDate(DATE, 'ru')).toStrictEqual(`9 февр. 2025 г.`);
    expect(formatDate(DATE, 'en')).toStrictEqual(`Feb 9, 2025`);
    expect(formatDate()).toStrictEqual(`0`);
    expect(formatDate(null)).toStrictEqual(`0`);
    expect(formatDate(undefined)).toStrictEqual(`0`);
  });

  test('formats date and time', async () => {
    const DATE = new Date('2025-02-09T17:13:17.427Z');

    expect(formatDateTime(DATE, 'ru')).toStrictEqual(`9 февр. 2025 г., 17:13`);
    expect(formatDateTime(DATE, 'en')).toStrictEqual(`Feb 9, 2025, 5:13 PM`);
    expect(formatDateTime()).toStrictEqual(`0`);
    expect(formatDateTime(null)).toStrictEqual(`0`);
    expect(formatDateTime(undefined)).toStrictEqual(`0`);
  });

  test('formats date and time with invalid date', async () => {
    const INVALID_DATE = 'invalid-date';

    expect(formatDate(INVALID_DATE)).toStrictEqual(`0`);
    expect(formatDateTime(INVALID_DATE)).toStrictEqual(`0`);
  });

  test('subtracts dates', async () => {
    const DATE_BIG = new Date('2025-02-09T17:13:17.427Z');
    const DATE_SMALL = new Date('2025-02-09T17:01:17.427Z');

    const DATE_BIG_STRING = '2025-02-09T17:13:17.427Z';
    const DATE_SMALL_STRING = '2025-02-09T17:01:17.427Z';

    expect(subtractDates(DATE_BIG, DATE_SMALL)).toStrictEqual(`12 min. 00 sec.`);
    expect(subtractDates(DATE_BIG_STRING, DATE_SMALL_STRING)).toStrictEqual(`12 min. 00 sec.`);
    expect(subtractDates(DATE_BIG, DATE_SMALL, 'en', true)).toStrictEqual(720);
    expect(subtractDates()).toStrictEqual(`0`);
    expect(subtractDates(null, DATE_SMALL)).toStrictEqual(`0`);
    expect(subtractDates(DATE_BIG, null)).toStrictEqual(`0`);
  });

  test('subtracts dates with invalid dates', async () => {
    const INVALID_DATE = 'invalid-date';

    expect(subtractDates(INVALID_DATE, INVALID_DATE)).toStrictEqual(`0`);
  });

  test('gets dates by gap', async () => {
    const GAP = 7;

    const date = new Date(2025, 0, 9, 12, 0, 0);

    vi.setSystemTime(date);

    const DAYS = {
      dateFrom: new Date('2025-01-02T12:00:00.000Z'),
      dateFromPrev: new Date('2024-12-26T11:59:59.999Z'),
      dateTo: new Date('2025-01-09T12:00:00.000Z'),
      dateToPrev: new Date('2025-01-02T11:59:59.999Z'),
    };

    expect(getDatesByDayGap(GAP)).toStrictEqual(DAYS);
  });

  test('first and last week days', async () => {
    const COUNT = 3;

    const date = new Date(2025, 0, 9, 12, 0, 0);

    vi.setSystemTime(date);

    const WEEK_DAYS = [
      {
        dateFrom: new Date('2024-12-23T00:00:00.000Z'),
        dateTo: new Date('2024-12-29T23:59:59.000Z'),
        label: '23.12 - 29.12',
      },
      {
        dateFrom: new Date('2024-12-30T00:00:00.000Z'),
        dateTo: new Date('2025-01-05T23:59:59.000Z'),
        label: '30.12 - 05.01',
      },
      {
        dateFrom: new Date('2025-01-06T00:00:00.000Z'),
        dateTo: new Date('2025-01-12T23:59:59.000Z'),
        label: '06.01 - 12.01',
      },
    ];

    expect(getFirstAndLastDays(COUNT, false)).toStrictEqual(WEEK_DAYS);
  });

  test('first and last month days', async () => {
    const COUNT = 3;

    const date = new Date(2025, 0, 9, 12, 0, 0);

    vi.setSystemTime(date);

    const MONTH_DAYS = [
      {
        dateFrom: new Date('2024-11-01T00:00:00.000Z'),
        dateTo: new Date('2024-11-30T23:59:59.000Z'),
        label: '01.11 - 30.11',
      },
      {
        dateFrom: new Date('2024-12-01T00:00:00.000Z'),
        dateTo: new Date('2024-12-31T23:59:59.000Z'),
        label: '01.12 - 31.12',
      },
      {
        dateFrom: new Date('2025-01-01T00:00:00.000Z'),
        dateTo: new Date('2025-01-31T23:59:59.000Z'),
        label: '01.01 - 31.01',
      },
    ];

    expect(getFirstAndLastDays(COUNT, true)).toStrictEqual(MONTH_DAYS);
  });

  test('gets date one year from now', async () => {
    const date = new Date(2025, 0, 9, 12, 0, 0);

    vi.setSystemTime(date);

    const expectedDate = new Date(date);

    expectedDate.setFullYear(expectedDate.getFullYear() + 1);

    expect(getOneYearFromNow()).toStrictEqual(expectedDate.toUTCString());
  });
});
