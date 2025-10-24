<template>
  <div :class="$style.container">
    <label :class="$style.title" data-test="ui-choice-title">{{ props.title }}</label>

    <div :class="$style.options" :data-tall="props.isTall" data-test="ui-choice-buttons">
      <button
        v-for="option in props.options"
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
interface IProps {
  modelValue?: number;
  options: number[];
  title: string;
  isTall?: boolean;
  isInput?: boolean;
}

interface IEmit {
  'update:modelValue': [options: number];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

function updateValue(value: number | Event) {
  emit('update:modelValue', typeof value === 'number' ? value : Number((value.target as HTMLInputElement).value));
}
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.options {
  display: flex;
  height: 40px;
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &[data-tall='true'] {
    height: 52px;
  }
}

.button {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-black);
  cursor: pointer;
  background-color: var(--color-gray-light);
  border: none;

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
