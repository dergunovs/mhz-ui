import { describe, expect, test, vi } from 'vitest';

import { withSetup } from '..';
import { useTimer } from '.';

const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();

Object.defineProperty(global, 'setTimeout', { writable: true, value: mockSetTimeout });
Object.defineProperty(global, 'clearTimeout', { writable: true, value: mockClearTimeout });

describe('useTimer', () => {
  test('initializes timer values correctly', async () => {
    withSetup(() => {
      const { timer, duration } = useTimer();

      expect(timer.value).toStrictEqual('00:00');
      expect(duration.value).toStrictEqual(0);
    });
  });

  test('updates time correctly', async () => {
    vi.useFakeTimers();

    withSetup(() => {
      const { timer, duration, startTimer, stopTimer } = useTimer();

      startTimer();

      vi.advanceTimersByTime(1000);

      expect(timer.value).toStrictEqual('00:01');
      expect(duration.value).toStrictEqual(1);

      vi.advanceTimersByTime(59000);

      expect(timer.value).toStrictEqual('01:00');
      expect(duration.value).toStrictEqual(60);

      stopTimer();
    });

    vi.useRealTimers();
  });

  test('handles timer overflow correctly', async () => {
    vi.useFakeTimers();

    withSetup(() => {
      const { timer, duration, startTimer, stopTimer } = useTimer();

      startTimer();

      vi.advanceTimersByTime(60000);

      expect(timer.value).toStrictEqual('01:00');
      expect(duration.value).toStrictEqual(60);

      stopTimer();
    });

    vi.useRealTimers();
  });

  test('handles multiple start/stop cycles', async () => {
    vi.useFakeTimers();

    withSetup(() => {
      const { timer, duration, startTimer, stopTimer } = useTimer();

      startTimer();

      vi.advanceTimersByTime(1000);

      expect(timer.value).toStrictEqual('00:01');
      expect(duration.value).toStrictEqual(1);

      stopTimer();

      vi.advanceTimersByTime(1000);

      expect(timer.value).toStrictEqual('00:01');
      expect(duration.value).toStrictEqual(1);

      startTimer();

      vi.advanceTimersByTime(1000);

      expect(timer.value).toStrictEqual('00:02');
      expect(duration.value).toStrictEqual(2);

      stopTimer();
    });

    vi.useRealTimers();
  });
});
