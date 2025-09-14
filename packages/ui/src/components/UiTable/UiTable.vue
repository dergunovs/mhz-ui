<template>
  <div :class="$style.tableBlock" ref="tableBlock">
    <div v-if="isScrollable" :class="$style.scrollMessage">{{ MESSAGES[props.lang].tableIsScrollable }}</div>

    <table :class="$style.table" cellpadding="8" cellspacing="0" :border="0" ref="table">
      <thead>
        <tr>
          <th
            v-for="header in props.headers"
            :key="`${header.value}${header.title}`"
            :class="$style.th"
            data-test="ui-table-header"
          >
            <label :class="$style.label" :data-loading="props.isLoading" data-test="ui-table-header-label">
              <span data-test="ui-table-header-title">{{ header.title }}</span>

              <button
                v-if="header.value"
                @click="sort(header.value)"
                :class="$style.sort"
                type="button"
                :data-current="props.modelValue?.value === header.value"
                data-test="ui-table-header-sort"
              >
                <span
                  :class="$style.arrow"
                  :data-current="props.modelValue?.isAsc && props.modelValue?.value === header.value"
                  :data-loading="props.isLoading"
                  data-test="ui-table-header-sort-asc"
                >
                  ↑
                </span>
                <span
                  :class="$style.arrow"
                  :data-current="!props.modelValue?.isAsc && props.modelValue?.value === header.value"
                  :data-loading="props.isLoading"
                  data-test="ui-table-header-sort-desc"
                >
                  ↓
                </span>
              </button>
            </label>
          </th>
        </tr>
      </thead>

      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

import { TLocale } from '@/components/locales/types';
import { MESSAGES } from '@/components/locales';

interface IHeader {
  value?: string;
  title: string;
}

interface IModelValue {
  value?: string;
  isAsc: boolean;
}

interface IProps {
  headers: IHeader[];
  modelValue?: IModelValue;
  isLoading?: boolean;
  lang?: TLocale;
}

interface IEmit {
  'update:modelValue': [value: IModelValue];
  reset: [value: string];
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  lang: 'ru',
});
const emit = defineEmits<IEmit>();

const tableBlock = ref<HTMLElement>();
const table = ref<HTMLElement>();

const isScrollable = ref(false);

function checkTableSize() {
  if (tableBlock.value && table.value) {
    const tableBlockSize = Number(getComputedStyle(tableBlock.value).width.slice(0, -2));
    const tableSize = Number(getComputedStyle(table.value).width.slice(0, -2));

    isScrollable.value = tableSize - 2 > tableBlockSize;
  }
}

function sort(value: string) {
  const isValueEqual = props.modelValue?.value === value;

  if (isValueEqual) {
    emit('update:modelValue', { value, isAsc: !props.modelValue?.isAsc });
  } else {
    emit('reset', value);
  }
}

onMounted(() => {
  checkTableSize();
  window.addEventListener('resize', checkTableSize, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkTableSize, true);
});
</script>

<style module lang="scss">
.tableBlock {
  width: 100%;
  overflow-x: auto;
}

.scrollMessage {
  margin-bottom: 8px;
}

.table {
  width: 100%;
  border: 1px solid var(--color-gray);
  border-radius: 8px;

  td {
    padding: 6px 16px;
    vertical-align: top;
    border-top: 1px solid var(--color-gray);

    &[data-grow] {
      width: 100%;
    }

    &[data-no-wrap] {
      text-wrap: nowrap;
    }
  }
}

.th {
  padding: 8px 16px;
  text-align: left;
  background-color: var(--color-gray-light-extra);

  &:first-child {
    border-top-left-radius: 6px;
  }

  &:last-child {
    border-top-right-radius: 6px;
  }
}

.label {
  display: flex;
  gap: 4px;
  align-items: center;
  width: fit-content;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-black);
  text-wrap: nowrap;
  cursor: pointer;
  user-select: none;

  &[data-loading='true'] {
    color: var(--color-transparent);
  }
}

.sort {
  display: flex;
  padding: 0;
  cursor: pointer;
  background-color: var(--color-transparent);
  border: none;
}

.arrow {
  color: var(--color-black);

  &[data-loading='true'] {
    color: var(--color-transparent);
  }

  &[data-current='true']:not(&[data-loading='true']) {
    color: var(--color-primary);
  }
}

:global(.dark) {
  .table {
    border: 1px solid var(--color-gray-dark-extra);

    td {
      border: 1px solid var(--color-gray-dark-extra);
    }
  }

  .th {
    background-color: var(--color-gray-dark-extra);
  }

  .label {
    color: var(--color-white);
  }
}
</style>
