<template>
  <div :class="$style.container">
    <button
      @click="emit('update:modelValue', !props.modelValue)"
      :class="$style.titleBlock"
      type="button"
      data-test="ui-spoiler-button"
    >
      <div :class="$style.title">
        <IconArrow :data-expanded="props.modelValue" :class="$style.icon" width="16" height="16" />
        <span :class="$style.titleText" data-test="ui-spoiler-button-title">{{ props.title }}</span>
      </div>
    </button>

    <div :class="$style.spoilerWrapper" :data-expanded="props.modelValue" data-test="ui-spoiler">
      <div :class="$style.spoilerContent">
        <div :class="$style.spoilerInner">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconArrow from './icons/arrow.svg?component';

interface IProps {
  modelValue: boolean;
  title: string;
}

interface IEmit {
  'update:modelValue': [value: boolean];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.titleBlock {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0;
  background-color: var(--color-gray-light-extra);
  border: 0;
  border-radius: 4px;

  &:hover {
    background-color: var(--color-gray-light);
  }
}

.title {
  position: relative;
  z-index: 1;
  display: flex;
  flex-grow: 1;
  gap: 8px;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  background: none;
  border: none;
}

.titleText {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  font-size: 0.875rem;
  line-height: 1.2;
  color: var(--color-black);
  -webkit-box-orient: vertical;
}

.icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  transform: rotate(-90deg);
  transition: transform 300ms ease;

  &[data-expanded='true'] {
    transform: rotate(0deg);
  }
}

.spoilerWrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms ease;

  &[data-expanded='true'] {
    grid-template-rows: 1fr;
  }
}

.spoilerContent {
  overflow: hidden;
}

.spoilerInner {
  padding: 8px 0;
}

:global(.dark) {
  .titleBlock {
    color: var(--color-white);
    background-color: var(--color-gray-dark-extra);
  }

  .titleText {
    color: var(--color-white);
  }

  .spoilerInner {
    color: var(--color-white);
  }
}
</style>
