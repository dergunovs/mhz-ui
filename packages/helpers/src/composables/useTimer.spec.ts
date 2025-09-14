import { describe, expect, it, vi } from 'vitest';

import { withSetup } from '..';
import { useTimer } from '.';

const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();

Object.defineProperty(globalThis, 'setTimeout', { writable: true, value: mockSetTimeout });
Object.defineProperty(globalThis, 'clearTimeout', { writable: true, value: mockClearTimeout });

describe('useTimer', () => {
  it('initializes timer values correctly', async () => {
    await withSetup(async () => {
      const { timer, duration } = useTimer();

      expect(timer.value).toStrictEqual('00:00');
      expect(duration.value).toStrictEqual(0);
    });
  });

  it('updates time correctly', async () => {
    vi.useFakeTimers();

    await withSetup(async () => {
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

  it('handles timer overflow correctly', async () => {
    vi.useFakeTimers();

    await withSetup(async () => {
      const { timer, duration, startTimer, stopTimer } = useTimer();

      startTimer();

      vi.advanceTimersByTime(60000);

      expect(timer.value).toStrictEqual('01:00');
      expect(duration.value).toStrictEqual(60);

      stopTimer();
    });

    vi.useRealTimers();
  });

  it('handles multiple start/stop cycles', async () => {
    vi.useFakeTimers();

    await withSetup(async () => {
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
