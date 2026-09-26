<template>
  <Teleport v-if="props.modelValue && props.target" to="body">
    <div ref="tooltipRef" :class="$style.tooltip" :style="tooltipStyle" data-test="ui-tooltip">
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { TOOLTIP_GAP } from './constants';

interface IProps {
  modelValue: boolean;
  target: HTMLElement | null;
  position?: 'top' | 'bottom';
}

interface IEmit {
  'update:modelValue': [value: boolean];
}

const props = withDefaults(defineProps<IProps>(), {
  position: 'bottom',
});

const emit = defineEmits<IEmit>();

const tooltipRef = ref<HTMLDivElement | null>(null);
const tooltipStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' });

watch(
  () => [props.modelValue, props.target],
  () => {
    if (props.modelValue && props.target) {
      nextTick(updatePosition);
    }
  }
);

onMounted(() => {
  window.addEventListener('resize', closeOnWindowResize);
  window.addEventListener('scroll', closeOnScroll, { capture: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', closeOnWindowResize);
  window.removeEventListener('scroll', closeOnScroll, { capture: true });
});

function close() {
  emit('update:modelValue', false);
}

function updatePosition() {
  if (!tooltipRef.value || !props.target) return;

  const targetRect = props.target.getBoundingClientRect();
  const tooltipWidth = tooltipRef.value.offsetWidth;
  const tooltipHeight = tooltipRef.value.offsetHeight;
  const top = props.position === 'top' ? targetRect.top - tooltipHeight - TOOLTIP_GAP : targetRect.bottom + TOOLTIP_GAP;
  let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

  left = Math.max(TOOLTIP_GAP, Math.min(left, window.innerWidth - tooltipWidth - TOOLTIP_GAP));

  tooltipStyle.value = { top: `${top}px`, left: `${left}px` };
}

function closeOnWindowResize() {
  close();
}

function closeOnScroll() {
  close();
}
</script>

<style module lang="scss">
.tooltip {
  position: fixed;
  z-index: 100;
  min-width: 120px;
  max-width: 336px;
  padding: 8px 12px;
  font-size: 0.75rem;
  color: var(--color-gray-dark-extra);
  background-color: var(--color-white);
  border: 1px solid var(--color-gray);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--color-gray-transparent);
}

:global(.dark) {
  .tooltip {
    color: var(--color-white);
    background-color: var(--color-black);
    border-color: var(--color-gray-dark);
  }
}
</style>
