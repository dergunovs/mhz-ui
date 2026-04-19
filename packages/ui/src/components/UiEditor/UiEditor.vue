<template>
  <div :class="$style.container">
    <div :class="$style.actions">
      <button
        v-for="action in actions"
        :key="action._id"
        @click="action.method()"
        :class="$style.action"
        type="button"
        data-test="ui-editor-button"
      >
        {{ action.name }}
      </button>
    </div>

    <textarea
      v-if="isShowSource"
      :class="$style.editor"
      :value="sourceValue"
      @input="handleSourceInput"
      data-test="ui-editor-source"
      spellcheck="false"
    />
    <div
      v-else
      ref="editorRef"
      contenteditable="true"
      :class="$style.editor"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      data-test="ui-editor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue';

interface IProps {
  modelValue?: string;
}

interface IEmit {
  'update:modelValue': [value?: string];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const editorRef = ref<HTMLDivElement>();
const isShowSource = ref(false);
const sourceValue = ref('');

let isRemoteUpdate = false;
let savedSelection: { startNode: Node | null; startOffset: number; endNode: Node | null; endOffset: number } | null =
  null;

const actions = [
  { _id: 1, name: 'b', method: toggleBold },
  { _id: 2, name: 'i', method: toggleItalic },
  { _id: 3, name: 'h2', method: () => toggleHeading(2) },
  { _id: 4, name: 'h3', method: () => toggleHeading(3) },
  { _id: 5, name: '< >', method: toggleSource },
];

function saveSelection() {
  const selection = globalThis.window?.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  savedSelection = {
    startNode: range.startContainer,
    startOffset: range.startOffset,
    endNode: range.endContainer,
    endOffset: range.endOffset,
  };
}

function restoreSelection() {
  if (!savedSelection || !editorRef.value) return;

  const { startNode, startOffset, endNode, endOffset } = savedSelection;

  savedSelection = null;

  if (!startNode || !endNode) return;

  const range = document.createRange();

  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  const selection = globalThis.window?.getSelection();

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function focusEditor() {
  editorRef.value?.focus();
}

function wrapSelection(tag: string) {
  const selection = globalThis.window?.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  if (!editorRef.value?.contains(range.commonAncestorContainer)) return;

  const selectedText = range.toString();

  if (selectedText) {
    const element = document.createElement(tag);

    element.textContent = selectedText;

    range.deleteContents();
    range.insertNode(element);

    const newRange = document.createRange();

    newRange.setStartAfter(element);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    range.collapse(true);
    const element = document.createElement(tag);

    range.insertNode(element);

    const newRange = document.createRange();

    newRange.setStart(element, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

function toggleBold() {
  wrapSelection('b');
  focusEditor();
  emit('update:modelValue', editorRef.value?.innerHTML);
}

function toggleItalic() {
  wrapSelection('i');
  focusEditor();
  emit('update:modelValue', editorRef.value?.innerHTML);
}

function toggleHeading(level: 2 | 3) {
  const tag = level === 2 ? 'h2' : 'h3';

  wrapSelection(tag);
  focusEditor();
  emit('update:modelValue', editorRef.value?.innerHTML);
}

function handleInput() {
  if (isRemoteUpdate) {
    isRemoteUpdate = false;

    return;
  }

  emit('update:modelValue', editorRef.value?.innerHTML);
}

function handleFocus() {
  saveSelection();
}

function handleBlur() {
  normalizeContent();
}

function toggleSource() {
  if (isShowSource.value) {
    isShowSource.value = false;
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.innerHTML = sourceValue.value;
        editorRef.value.focus();
        emit('update:modelValue', editorRef.value.innerHTML);
      }
    });
  } else {
    if (editorRef.value) {
      sourceValue.value = editorRef.value.innerHTML;
    }
    isShowSource.value = true;
  }
}

function handleSourceInput(event: Event) {
  if (!isShowSource.value) return;

  const target = event.target as HTMLTextAreaElement;

  sourceValue.value = target.value;
  emit('update:modelValue', sourceValue.value);
}

function normalizeContent() {
  if (!editorRef.value) return;

  const editor = editorRef.value;
  const childNodes = [...editor.childNodes];
  let hasChanges = false;

  for (const node of childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const div = document.createElement('div');

      div.append(node.cloneNode(true));
      node.replaceWith(div);
      hasChanges = true;
    }
  }

  if (childNodes.length === 0) {
    editor.innerHTML = '<div><br></div>';
    hasChanges = true;
  } else if (childNodes.every((node) => node.nodeType === Node.TEXT_NODE && !node.textContent?.trim())) {
    editor.innerHTML = '<div><br></div>';
    hasChanges = true;
  }

  if (hasChanges) {
    nextTick(() => {
      restoreSelection();
      editor.focus();
    });
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorRef.value) return;

    const currentContent = editorRef.value.innerHTML;

    if (currentContent === value) return;

    isRemoteUpdate = true;
    const wasFocused = document.activeElement === editorRef.value;

    if (wasFocused) {
      saveSelection();
    }

    editorRef.value.innerHTML = value || '<div></div>';
    nextTick(() => {
      if (wasFocused) {
        restoreSelection();
      }
      if (wasFocused && editorRef.value) {
        editorRef.value.focus();
      }
    });
  }
);

onBeforeUnmount(() => {
  savedSelection = null;
});
</script>

<style module lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &:focus-within {
    border: 1px solid var(--color-primary);
  }

  &:hover {
    cursor: text;

    &:not(:focus-within) {
      border: 1px solid var(--color-gray-dark-extra);
    }
  }
}

.actions {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-bottom: 1px solid var(--color-gray);
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 8px;
  font-weight: 700;
  cursor: pointer;
  background-color: var(--color-transparent);
  border: none;
  border-radius: 8px;

  &:hover {
    background-color: var(--color-primary-light);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-transparent);
    opacity: 0.5;
  }
}

.editor {
  min-height: 100px;
  padding: 8px 16px;
  overflow-y: auto;
  font-size: 1rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  outline: none;
  border: 1px solid var(--color-gray);
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;

  :global(h2) {
    font-size: 1.5rem;
    font-weight: 700;
  }

  :global(h3) {
    font-size: 1.25rem;
    font-weight: 700;
  }

  :global(strong) {
    font-weight: 700;
  }

  :global(em) {
    font-style: italic;
  }

  :global(p) {
    margin: 0;
  }
}

:global(.dark) {
  .container {
    background-color: var(--color-gray-dark);
    border: 1px solid var(--color-gray-dark-extra);
  }

  .editor {
    color: var(--color-black);
  }
}
</style>
