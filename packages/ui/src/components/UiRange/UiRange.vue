<template>
  <div :class="$style.range">
    <div :class="$style.sliderContainer">
      <div :class="$style.tooltip" :style="{ left: minTooltipLeft }">
        {{ localMin }}
      </div>

      <div :class="$style.tooltip" :style="{ left: maxTooltipLeft }">
        {{ localMax }}
      </div>

      <div :class="$style.sliderTrack"></div>

      <div
        :class="$style.sliderActiveTrack"
        :style="{ left: `${minPercentage}%`, right: `${100 - maxPercentage}%` }"
      ></div>

      <input
        ref="minInputRef"
        type="range"
        :class="$style.rangeInput"
        :min="props.min"
        :max="props.max"
        :value="localMin"
        @input="handleMinInput"
        @change="handleMinChange"
        data-test="ui-range-min"
      />

      <input
        ref="maxInputRef"
        type="range"
        :class="[$style.rangeInput, $style.rangeInputMax]"
        :min="props.min"
        :max="props.max"
        :value="localMax"
        @input="handleMaxInput"
        @change="handleMaxChange"
        data-test="ui-range-max"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface IProps {
  modelValue: [number, number];
  min: number;
  max: number;
}

interface IEmit {
  'update:modelValue': [value: [number, number]];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const localMin = ref(props.modelValue[0]);
const localMax = ref(props.modelValue[1]);

const minPercentage = computed(() => ((localMin.value - props.min) / (props.max - props.min)) * 100);
const maxPercentage = computed(() => ((localMax.value - props.min) / (props.max - props.min)) * 100);

const minTooltipLeft = computed(() => `calc(${minPercentage.value}% + (${12 - minPercentage.value * 0.2}px))`);
const maxTooltipLeft = computed(() => `calc(${maxPercentage.value}% + (${12 - maxPercentage.value * 0.2}px))`);

watch(
  () => props.modelValue[0],
  (val) => {
    localMin.value = val;
  }
);

watch(
  () => props.modelValue[1],
  (val) => {
    localMax.value = val;
  }
);

function handleMinInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  localMin.value = Math.min(value, localMax.value);
}

function handleMaxInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  localMax.value = Math.max(value, localMin.value);
}

function handleMinChange() {
  emit('update:modelValue', [localMin.value, localMax.value]);
}

function handleMaxChange() {
  emit('update:modelValue', [localMin.value, localMax.value]);
}
</script>

<style module lang="scss">
:root {
  --s-height: 6px;
  --s-handle-size: 20px;
  --s-bg: var(--color-gray-light);
  --s-connect-bg: var(--color-gray-dark);
  --s-handle-bg: var(--color-primary);
  --s-handle-shadow: none;
  --s-tooltip-bg: var(--s-bg);
  --s-tooltip-color: var(--color-black);
  --s-tooltip-radius: 4px;
  --s-tooltip-px: 4px;
  --s-tooltip-arrow-size: 4px;
  --s-tooltip-distance: 2px;
}

.range {
  width: 100%;
}

.sliderContainer {
  position: relative;
  height: calc(
    var(--s-handle-size) + 2px + var(--s-tooltip-px) * 2 + var(--s-tooltip-arrow-size) + var(--s-tooltip-distance)
  );
  padding-bottom: calc(2px + var(--s-tooltip-px) + var(--s-tooltip-arrow-size) + var(--s-tooltip-distance));
}

.tooltip {
  position: absolute;
  top: calc(var(--s-handle-size) + var(--s-height) * 2);
  z-index: 20;
  padding: var(--s-tooltip-px);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--s-tooltip-color);
  white-space: nowrap;
  pointer-events: none;
  background: var(--s-tooltip-bg);
  border-radius: var(--s-tooltip-radius);
  transform: translateX(-50%);

  &::before {
    position: absolute;
    top: calc(-1 * var(--s-tooltip-arrow-size));
    left: 50%;
    content: '';
    border-color: var(--s-tooltip-bg) var(--color-transparent) var(--color-transparent);
    border-style: solid;
    border-width: var(--s-tooltip-arrow-size) var(--s-tooltip-arrow-size) 0;
    transform: translateX(-50%) rotate(180deg);
  }
}

.sliderTrack {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  width: 100%;
  height: var(--s-height);
  pointer-events: none;
  background: var(--s-bg);
  border-radius: var(--s-height);
  transform: translateY(-50%);
}

.sliderActiveTrack {
  position: absolute;
  top: 50%;
  z-index: 2;
  height: var(--s-height);
  pointer-events: none;
  background: var(--s-connect-bg);
  border-radius: var(--s-height);
  transform: translateY(-50%);
}

.rangeInput {
  position: absolute;
  top: 25%;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 0;
  margin-left: 0;
  appearance: none;
  background: transparent;
  transform: translateY(-50%);

  &::-webkit-slider-thumb {
    width: var(--s-handle-size);
    height: var(--s-handle-size);
    appearance: none;
    pointer-events: all;
    cursor: pointer;
    background: var(--s-handle-bg);
    border-radius: 50%;
    box-shadow: var(--s-handle-shadow);
  }

  &::-moz-range-thumb {
    width: var(--s-handle-size);
    height: var(--s-handle-size);
    appearance: none;
    pointer-events: all;
    cursor: pointer;
    background: var(--s-handle-bg);
    border: none;
    border-radius: 50%;
    box-shadow: var(--s-handle-shadow);
  }

  &::-webkit-slider-runnable-track {
    height: var(--s-height);
    background: transparent;
    border-radius: var(--s-height);
  }

  &::-moz-range-track {
    height: var(--s-height);
    background: transparent;
    border-radius: var(--s-height);
  }

  &:focus {
    outline: none;
  }
}

.rangeInputMax {
  &::-webkit-slider-runnable-track {
    background: transparent;
  }

  &::-moz-range-track {
    background: transparent;
  }
}
</style>
