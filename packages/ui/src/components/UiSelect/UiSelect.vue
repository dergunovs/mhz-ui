<template>
  <div :class="$style.container" ref="containerElement">
    <div :class="$style.input">
      <UiInput
        :modelValue="displayValue"
        :disabled="props.isDisabled"
        @toggle="toggleOptions"
        mode="select"
        :placeholder="MESSAGES[props.lang].choose"
        :appendIcon="isShowOptions ? IconOpened : IconClosed"
        data-test="ui-select-input"
      />

      <div v-if="props.isFilter && isShowOptions">
        <UiInput
          v-model="filterQuery"
          :disabled="props.isDisabled"
          :placeholder="MESSAGES[props.lang].filter"
          isFocus
          data-test="ui-select-input-filter"
        />
      </div>

      <button
        v-if="props.isClearable && props.modelValue"
        @click="clearValue"
        type="button"
        :class="$style.clear"
        data-test="ui-select-clear"
      >
        ×
      </button>
    </div>

    <div
      v-if="isShowOptions"
      :class="[$style.options, { [$style.optionsUp]: isOpenUp }]"
      ref="optionsElement"
      data-test="ui-select-options"
    >
      <div v-if="optionsComputed.length > 0" ref="optionsInnerElement">
        <div
          v-for="(option, index) in optionsComputed"
          :key="getOptionKey(option, index)"
          @click="() => setOption(option)"
          @keydown.enter="() => setOption(option)"
          @keydown.space="() => setOption(option)"
          @mouseenter="() => setFocusedOptionIndex(index)"
          @keydown.up.prevent="() => setFocusedOptionIndex(index - 1)"
          @keydown.down.prevent="() => setFocusedOptionIndex(index + 1)"
          @keydown.esc="toggleOptions"
          :class="$style.option"
          tabindex="0"
          ref="optionElement"
          :data-current="isCurrentOption(option)"
          data-test="ui-select-option"
        >
          {{ getOptionTitle(option) }}
        </div>
      </div>

      <div v-else @click="hideOptions" :class="$style.option" tabindex="0" data-test="ui-select-no-results">
        {{ MESSAGES[props.lang].noResults }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

import UiInput from '../UiInput/UiInput.vue';

import IconClosed from './icons/closed.svg?component';
import IconOpened from './icons/opened.svg?component';

import { TLocale } from '@/components/locales/types';
import { MESSAGES } from '@/components/locales';

interface IOption {
  _id?: string;
  title: string;
  title_en?: string;
}

interface IProps {
  modelValue?: string | number | IOption | null;
  options?: string[] | number[] | IOption[];
  isFilter?: boolean;
  isDisabled?: boolean;
  lang?: TLocale;
  isLocaleField?: boolean;
  isClearable?: boolean;
}

interface IEmit {
  'update:modelValue': [value: string | number | IOption | undefined];
  reachedBottom: [];
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  options: () => [],
  lang: 'ru',
});
const emit = defineEmits<IEmit>();

const filterQuery = ref('');
const isShowOptions = ref(false);
const isOpenUp = ref(false);

const containerElement = ref<HTMLElement>();
const optionsElement = ref<HTMLElement>();
const optionsInnerElement = ref<HTMLElement>();
const optionElement = ref<HTMLElement[]>([]);

const isObject = computed(() => {
  const firstOption = props.options?.[0];

  return firstOption !== undefined && typeof firstOption === 'object';
});

const isPrimitiveValue = (value: unknown): value is string | number => {
  return value !== null && (typeof value === 'string' || typeof value === 'number');
};

const optionsComputed = computed(() => {
  if (!props.options?.length) return [];

  const optionsArray: IOption[] = isObject.value
    ? [...(props.options as IOption[])]
    : (props.options as (string | number)[]).map((item) => ({ _id: String(item), title: String(item) }));

  return props.isFilter
    ? optionsArray.filter((option) => option.title.toLowerCase().includes(filterQuery.value.toLowerCase()))
    : optionsArray;
});

const displayValue = computed(() => {
  if (isPrimitiveValue(props.modelValue)) return props.modelValue;
  if (!props.modelValue) return '';

  const option = props.modelValue as IOption;

  return props.isLocaleField ? (option.title_en ?? '') : (option.title ?? '');
});

const getOptionKey = (option: IOption, index: number) => `${option._id || option.title}-${index}`;

const getOptionTitle = (option: IOption) => (props.isLocaleField ? option.title_en : option.title);

const isCurrentOption = (option: IOption) => {
  if (isPrimitiveValue(props.modelValue)) return props.modelValue === (option._id || option.title);
  if (props.modelValue) return props.modelValue._id === option._id;

  return false;
};

const setFocusedOptionIndex = (index: number) => {
  if (index < 0 || index >= optionsComputed.value.length || props.isFilter) return;
  optionElement.value[index]?.focus();
};

const clearValue = () => emit('update:modelValue', undefined);

const toggleOptions = () => {
  if (isShowOptions.value) {
    hideOptions();
  } else {
    showOptions();
  }
};

const checkOpenDirection = () => {
  if (!containerElement.value) return false;

  const BOTTOM_SCREEN_MARGIN = 232;

  const containerRect = containerElement.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - containerRect.bottom;
  const spaceAbove = containerRect.top;

  return spaceBelow < BOTTOM_SCREEN_MARGIN && spaceAbove > spaceBelow;
};

function hideOptions() {
  optionsElement.value?.removeEventListener('scroll', checkScroll, true);
  filterQuery.value = '';
  isShowOptions.value = false;
  isOpenUp.value = false;
}

function showOptions() {
  if (props.isDisabled) return;

  isOpenUp.value = checkOpenDirection();
  isShowOptions.value = true;

  if (!props.isFilter) {
    setTimeout(() => {
      optionsElement.value?.scrollTo(0, 0);
      setFocusedOptionIndex(0);
      optionsElement.value?.addEventListener('scroll', checkScroll, true);
    }, 100);
  }
}

function setOption(option: IOption) {
  const value = isObject.value ? option : option._id || option.title;

  emit('update:modelValue', value);
  hideOptions();
}

function checkScroll() {
  if (!optionsElement.value || !optionsInnerElement.value) return;

  const scrollPosition =
    optionsElement.value.getBoundingClientRect().y -
    optionsInnerElement.value.getBoundingClientRect().y -
    optionsInnerElement.value.scrollHeight +
    optionsElement.value.getBoundingClientRect().height;

  if (scrollPosition > -100) emit('reachedBottom');
}

onClickOutside(containerElement, hideOptions);
</script>

<style module lang="scss">
.container {
  position: relative;

  &:disabled {
    color: var(--color-gray-dark-extra);
    background: var(--color-gray-light-extra);
    border-color: var(--color-transparent);
  }
}

.input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.clear {
  width: 28px;
  height: 28px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-white);
  cursor: pointer;
  background-color: var(--color-gray-dark);
  border: none;
  border-radius: 50%;

  &:hover {
    background-color: var(--color-gray-dark-extra);
  }
}

.options {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  max-height: 200px;
  margin-top: 8px;
  overflow-y: auto;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &.optionsUp {
    bottom: 100%;
    margin-top: 0;
    margin-bottom: 8px;
  }
}

.option {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus {
    color: var(--color-white);
    background-color: var(--color-primary);
  }

  &[data-current='true'] {
    color: var(--color-black);
    background-color: var(--color-gray-light);

    &:hover,
    &:focus {
      background-color: var(--color-gray);
    }
  }
}
</style>
