<template>
  <div :class="$style.chip" :data-type="props.type" data-test="ui-chip">
    <slot></slot>

    <button v-if="props.isEdit" @click="emit('edit')" type="button" :class="$style.edit" data-test="ui-chip-edit">
      <IconEdit width="18" height="18" />
    </button>

    <UiClose v-if="props.isDelete" @click="emit('delete')" isSmall isDelete data-test="ui-chip-delete" />
  </div>
</template>

<script setup lang="ts">
import UiClose from '../UiClose/UiClose.vue';

import IconEdit from './icons/edit.svg';

import { DEFAULT_TYPE } from './constants';

interface IProps {
  type?: 'default' | 'success' | 'error';
  isEdit?: boolean;
  isDelete?: boolean;
}

interface IEmit {
  edit: [];
  delete: [];
}

const props = withDefaults(defineProps<IProps>(), {
  type: DEFAULT_TYPE,
});

const emit = defineEmits<IEmit>();
</script>

<style module lang="scss">
.chip {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  min-height: 30px;
  padding: 4px 8px 3px;
  font-size: 0.875rem;
  color: var(--color-black);
  background-color: var(--color-gray-light);
  border-bottom: 1px solid var(--color-gray-dark);
  border-radius: 8px;

  &[data-type='success'] {
    color: var(--color-success-dark);
  }

  &[data-type='error'] {
    color: var(--color-error-dark);
  }
}

.edit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  color: var(--color-black);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  background: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

:global(.dark) {
  .chip {
    background-color: var(--color-gray-dark);
    border-bottom: 1px solid var(--color-gray-dark-extra);
  }
}
</style>
