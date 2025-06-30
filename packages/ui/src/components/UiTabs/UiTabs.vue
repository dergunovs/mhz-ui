<template>
  <div :class="$style.tabs" data-test="ui-tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.value"
      @click="emit('update:modelValue', tab.value)"
      :class="$style.tab"
      type="button"
      :data-active="props.modelValue === tab.value"
      data-test="ui-tab"
    >
      {{ tab.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface ITab {
  title: string;
  value: string;
}

interface IProps {
  tabs: ITab[];
  modelValue: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style module lang="scss">
.tabs {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--color-primary);
}

.tab {
  padding: 10px 6px;
  font-size: 0.75rem;
  cursor: pointer;
  background-color: var(--color-gray-light);
  border: 0;

  &:hover {
    background-color: var(--color-gray);
  }

  &[data-active='true'] {
    color: var(--color-white);
    background-color: var(--color-primary);
  }
}
</style>
