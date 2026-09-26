<template>
  <div :class="$style.container">
    <label :class="$style.title" data-test="ui-choice-title">{{ props.title }}</label>

    <div :class="$style.options" :data-tall="props.isTall" data-test="ui-choice-buttons">
      <div
        ref="optionsRef"
        :class="$style.scrollArea"
        :data-scrollable="props.isScrollable"
        :data-grabbing="isGrabbing"
        data-test="ui-choice-scroll"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
      >
        <button
          v-for="option in visibleOptions"
          :key="option"
          @click="updateValue(option)"
          type="button"
          :class="$style.button"
          :data-current="props.modelValue === option"
          :data-fill="!props.isInput"
          data-test="ui-choice-button"
        >
          {{ option }}
        </button>
      </div>

      <input
        v-if="props.isInput"
        type="number"
        :class="$style.input"
        :value="props.modelValue"
        @change="updateValue($event)"
        step="1"
        min="1"
        max="60"
        data-test="ui-choice-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

interface IProps {
  modelValue?: number;
  options: number[];
  title: string;
  isTall?: boolean;
  isInput?: boolean;
  isScrollable?: boolean;
}

interface IEmit {
  'update:modelValue': [options: number];
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmit>();

const MIN = 1;
const MAX = 99;
const DRAG_DISTANCE = 4;

const optionsRef = ref<HTMLElement | null>(null);
const isGrabbing = ref(false);
const startClientX = ref(0);
const startScrollLeft = ref(0);
const isDragged = ref(false);

const visibleOptions = computed(() => {
  if (!props.isScrollable) return props.options;

  const length = MAX - MIN + 1;

  return Array.from({ length }, (_, index) => MIN + index);
});

function updateValue(value: number | Event) {
  emit('update:modelValue', typeof value === 'number' ? value : Number((value.target as HTMLInputElement).value));
}

function onPointerDown(event: PointerEvent) {
  if (!props.isScrollable) return;

  isGrabbing.value = true;
  isDragged.value = false;
  startClientX.value = event.clientX;
  startScrollLeft.value = optionsRef.value?.scrollLeft ?? 0;
}

function onPointerMove(event: PointerEvent) {
  if (!props.isScrollable || !isGrabbing.value) return;

  const delta = event.clientX - startClientX.value;

  if (!isDragged.value && Math.abs(delta) > DRAG_DISTANCE) isDragged.value = true;

  if (optionsRef.value) optionsRef.value.scrollLeft = startScrollLeft.value - delta;
}

function onPointerUp() {
  isGrabbing.value = false;
}

function scrollToCurrent() {
  if (!props.isScrollable || !props.modelValue || !optionsRef.value) return;

  nextTick(() => {
    const scrollArea = optionsRef.value;
    const currentButton = scrollArea?.querySelector('[data-current="true"]') as HTMLElement | null;

    if (!scrollArea || !currentButton) return;

    const targetScroll = currentButton.offsetLeft - (scrollArea.clientWidth - currentButton.offsetWidth) / 2;

    scrollArea.scrollLeft = Math.max(0, targetScroll);
  });
}

onMounted(scrollToCurrent);

watch([() => props.modelValue, () => props.isScrollable], scrollToCurrent);
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.options {
  display: flex;
  height: 40px;
  overflow: hidden;
  cursor: default;
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &[data-tall='true'] {
    height: 52px;
  }
}

.scrollArea {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  cursor: default;

  &[data-scrollable='true'] {
    overflow-x: auto;
    scroll-behavior: smooth;
    touch-action: pan-x;
    cursor: grab;
    user-select: none;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &[data-grabbing='true'] {
    cursor: grabbing;
  }
}

.button {
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-black);
  cursor: pointer;
  background-color: var(--color-gray-light);
  border: none;

  &:hover {
    background-color: var(--color-gray);
  }

  &:first-child {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }

  &[data-fill='true'] {
    &:last-child {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
    }
  }

  &[data-current='true'] {
    color: var(--color-white);
    background-color: var(--color-accent-dark);
  }
}

.scrollArea[data-scrollable='true'] {
  .button {
    flex: 0 0 20%;
    scroll-snap-align: start;
  }
}

.input {
  min-width: 60px;
  max-width: 80px;
  font-size: 1rem;
  text-align: center;
  outline: none;
  border: none;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}

:global(.dark) {
  .options {
    border: none;
  }

  .button {
    background-color: var(--color-gray-dark);

    &:hover {
      background-color: var(--color-gray);
    }

    &[data-current='true'] {
      color: var(--color-white);
      background-color: var(--color-accent-dark);
    }
  }

  .title {
    color: var(--color-white);
  }
}
</style>
