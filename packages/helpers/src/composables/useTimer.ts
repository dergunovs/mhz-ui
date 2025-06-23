import { computed, ref } from 'vue';

import { addZero } from '../helpers';

export function useTimer() {
  const secondsRaw = ref(0);
  const minutesRaw = ref(0);

  const timer = computed(() => `${addZero(minutesRaw.value)}:${addZero(secondsRaw.value)}`);
  const duration = computed(() => minutesRaw.value * 60 + secondsRaw.value);

  let interval: NodeJS.Timeout;

  function updateTime() {
    secondsRaw.value++;

    if (secondsRaw.value === 60) {
      minutesRaw.value++;
      secondsRaw.value = 0;
    }
  }

  function startTimer() {
    interval = setInterval(updateTime, 1000);
  }

  function stopTimer() {
    clearInterval(interval);
  }

  return { timer, duration, startTimer, stopTimer };
}
