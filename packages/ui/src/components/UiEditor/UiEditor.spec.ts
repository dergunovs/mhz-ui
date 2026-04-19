import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { nextTick } from 'vue';

import UiEditor from './UiEditor.vue';
import { MODEL_VALUE } from './constants';

import { wrapperFactory } from '@/test';

const editor = '[data-test="ui-editor"]';
const editorSource = '[data-test="ui-editor-source"]';
const editorButton = '[data-test="ui-editor-button"]';

let wrapper: VueWrapper<InstanceType<typeof UiEditor>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiEditor, { modelValue: MODEL_VALUE });
});

enableAutoUnmount(afterEach);

describe('UiEditor', () => {
  it('exists', () => {
    expect(wrapper.findComponent(UiEditor).exists()).toBe(true);
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('has editor', () => {
    expect(wrapper.find(editor).exists()).toBe(true);
  });

  it('has 5 action buttons', () => {
    expect(wrapper.findAll(editorButton).length).toBe(5);
  });

  it('has buttons with correct labels', () => {
    const buttons = wrapper.findAll(editorButton);

    expect(buttons[0].text()).toBe('b');
    expect(buttons[1].text()).toBe('i');
    expect(buttons[2].text()).toBe('h2');
    expect(buttons[3].text()).toBe('h3');
    expect(buttons[4].text()).toBe('< >');
  });

  describe('v-model', () => {
    it('editor is initially empty', () => {
      const editorElement = wrapper.find(editor);

      expect(editorElement.text()).toBe('');
    });

    it('emits update:modelValue when content changes', async () => {
      const editorElement = wrapper.find(editor);

      await editorElement.trigger('input');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('updates editor when modelValue changes externally', async () => {
      const newContent = '<h2>Updated content</h2>';

      await wrapper.setProps({ modelValue: newContent });
      await nextTick();

      expect(wrapper.find(editor).html()).toContain(newContent);
    });
  });

  describe('source mode', () => {
    it('toggles to source mode when < > button is clicked', async () => {
      const sourceButton = wrapper.findAll(editorButton)[4];

      await sourceButton.trigger('click');
      await nextTick();

      expect(wrapper.find(editorSource).exists()).toBe(true);
      expect(wrapper.find(editor).exists()).toBe(false);
    });

    it('toggles back to editor mode when < > button is clicked again', async () => {
      const sourceButton = wrapper.findAll(editorButton)[4];

      await sourceButton.trigger('click');
      await nextTick();

      expect(wrapper.find(editorSource).exists()).toBe(true);

      await sourceButton.trigger('click');
      await nextTick();

      expect(wrapper.find(editor).exists()).toBe(true);
      expect(wrapper.find(editorSource).exists()).toBe(false);
    });

    it('updates modelValue when source textarea changes', async () => {
      const sourceButton = wrapper.findAll(editorButton)[4];

      await sourceButton.trigger('click');
      await nextTick();

      const textarea = wrapper.find(editorSource);

      await textarea.setValue('<strong>Source content</strong>');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
  });

  describe('formatting buttons', () => {
    describe('bold button', () => {
      it('exists and has correct label', () => {
        const boldButton = wrapper.findAll(editorButton)[0];

        expect(boldButton.text()).toBe('b');
      });

      it('emits update:modelValue when clicked', async () => {
        const boldButton = wrapper.findAll(editorButton)[0];

        await boldButton.trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      });
    });

    describe('italic button', () => {
      it('exists and has correct label', () => {
        const italicButton = wrapper.findAll(editorButton)[1];

        expect(italicButton.text()).toBe('i');
      });

      it('emits update:modelValue when clicked', async () => {
        const italicButton = wrapper.findAll(editorButton)[1];

        await italicButton.trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      });
    });

    describe('heading buttons', () => {
      it('h2 button exists and has correct label', () => {
        const h2Button = wrapper.findAll(editorButton)[2];

        expect(h2Button.text()).toBe('h2');
      });

      it('h2 button emits update:modelValue when clicked', async () => {
        const h2Button = wrapper.findAll(editorButton)[2];

        await h2Button.trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      });

      it('h3 button exists and has correct label', () => {
        const h3Button = wrapper.findAll(editorButton)[3];

        expect(h3Button.text()).toBe('h3');
      });

      it('h3 button emits update:modelValue when clicked', async () => {
        const h3Button = wrapper.findAll(editorButton)[3];

        await h3Button.trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      });
    });
  });

  describe('editor interactions', () => {
    it('editor has contenteditable attribute', () => {
      const editorElement = wrapper.find(editor);

      expect(editorElement.attributes('contenteditable')).toBe('true');
    });

    it('editor has spellcheck disabled', () => {
      const editorElement = wrapper.find('[contenteditable="true"]');

      expect(editorElement.attributes('spellcheck')).toBeUndefined();
    });
  });
});
