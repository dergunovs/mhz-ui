<template>
  <Teleport to="body">
    <div v-if="props.modelValue" :class="$style.backdrop" @mousedown="hide" data-test="ui-modal-backdrop">
      <dialog ref="dialogRef" :class="$style.dialog" @cancel.prevent="hide" v-bind="$attrs" data-test="ui-modal-dialog">
        <div :class="$style.modal" @mousedown.stop :data-scrollable="props.isScrollable" data-test="ui-modal">
          <div :class="$style.header">
            <UiClose @click="hide" data-test="ui-modal-close" />
          </div>

          <div :class="$style.slot" data-test="ui-modal-slot">
            <slot></slot>
          </div>

          <div v-if="props.isConfirm" :class="$style.buttons">
            <UiButton @click="handleConfirm" data-test="ui-modal-confirm">{{ MESSAGES[props.lang].confirm }}</UiButton>

            <UiButton layout="secondary" @click="hide" data-test="ui-modal-cancel">
              {{ MESSAGES[props.lang].cancel }}
            </UiButton>
          </div>
        </div>
      </dialog>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue';

import UiButton from '../UiButton/UiButton.vue';
import UiClose from '../UiClose/UiClose.vue';

import { TLocale } from '@/components/locales/types';
import { MESSAGES } from '@/components/locales';

interface IProps {
  modelValue: boolean;
  isScrollable?: boolean;
  isConfirm?: boolean;
  width?: string;
  lang?: TLocale;
}

interface IEmit {
  'update:modelValue': [value: boolean];
  confirm: [];
}

const props = withDefaults(defineProps<IProps>(), {
  width: '360',
  lang: 'ru',
});

const emit = defineEmits<IEmit>();

defineOptions({ inheritAttrs: false });

const widthComputed = computed(() => `${props.width}px`);
const dialogRef = ref<HTMLDialogElement | null>(null);

function toggleDialog() {
  nextTick(() => {
    if (dialogRef.value?.open) {
      dialogRef.value.close();
    } else {
      dialogRef.value?.showModal();
    }
  });
}

function handleConfirm() {
  emit('confirm');
  hide();
}

function hide() {
  emit('update:modelValue', false);
}

onMounted(() => {
  watch(
    () => props.modelValue,
    () => {
      toggleDialog();
    },
    { immediate: true }
  );
});
</script>

<style module lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-transparent);
}

.dialog {
  z-index: 999;
  padding: 0;
  outline: none;
  background-color: var(--color-white);
  border: none;
  border-radius: 16px;
}

.modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: v-bind(widthComputed);
  max-width: 100%;
  height: auto;
  padding: 24px;
  outline: none;
  box-shadow: 0 0 16px 0 var(--color-gray-transparent);

  &[data-scrollable='true'] {
    max-height: 64dvh;
    overflow-y: auto;
  }
}

.header {
  display: flex;
  justify-content: flex-end;
}

.buttons {
  display: flex;
  gap: 16px;
}

:global(.dark) {
  .modal {
    background-color: var(--color-black);
    box-shadow: 0 0 16px 0 var(--color-black-transparent);
  }

  .slot {
    color: var(--color-white);
  }
}
</style>
