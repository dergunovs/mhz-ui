<template>
  <textarea
    :value="props.modelValue"
    @input="handleInput($event.target)"
    :disabled="props.isDisabled"
    :class="$style.textarea"
    rows="5"
    data-test="ui-textarea"
    aria-label="textarea"
  ></textarea>
</template>

<script setup lang="ts">
interface IProps {
  modelValue?: string;
  isDisabled?: boolean;
}

interface IEmit {
  'update:modelValue': [value: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

function handleInput(target: EventTarget | null) {
  emit('update:modelValue', (target as HTMLInputElement).value);
}
</script>

<style module lang="scss">
.textarea {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  resize: none;
  outline: none;
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &:hover {
    border: 1px solid var(--color-gray-dark-extra);
  }

  &:focus {
    border: 1px solid var(--color-primary);
  }

  &:disabled {
    color: var(--color-gray-dark-extra);
    background: var(--color-gray-light-extra);
    border-color: var(--color-transparent);
  }

  &::placeholder {
    color: var(--color-gray-dark-extra);
  }
}
</style>
