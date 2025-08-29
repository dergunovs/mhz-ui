import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiSelect from './UiSelect.vue';
import { MODEL_VALUE, OPTIONS, IS_FILTER, OPTIONS_OBJECTS } from './constants';

import { wrapperFactory } from '@/test';

const selectInput = dataTest('ui-select-input');
const selectInputFilter = dataTest('ui-select-input-filter');
const selectOptions = dataTest('ui-select-options');
const selectOption = dataTest('ui-select-option');
const selectNoResults = dataTest('ui-select-no-results');
const selectClearButton = dataTest('ui-select-clear');

let wrapper: VueWrapper<InstanceType<typeof UiSelect>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiSelect, { modelValue: MODEL_VALUE, options: OPTIONS, isFilter: IS_FILTER });
});

enableAutoUnmount(afterEach);

describe('UiSelect', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiSelect)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('toggles options on input click', async () => {
    expect(wrapper.find(selectOptions).exists()).toBe(false);

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectOptions).exists()).toBe(true);

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectOptions).exists()).toBe(false);
  });

  it('shows options', async () => {
    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.findAll(selectOption).length).toBe(OPTIONS.length);
    expect(wrapper.findAll(selectOption)[0].text()).toBe(OPTIONS[0]);
  });

  it('sets options', async () => {
    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    await wrapper.findAll(selectOption)[0].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([OPTIONS[0]]);
  });

  it('shows object options title', async () => {
    await wrapper.setProps({ options: OPTIONS_OBJECTS });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.findAll(selectOption)[0].text()).toBe(OPTIONS_OBJECTS[0].title);
  });

  it('sets object options', async () => {
    await wrapper.setProps({ options: OPTIONS_OBJECTS });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    await wrapper.findAll(selectOption)[0].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([OPTIONS_OBJECTS[0]]);
  });

  it('shows filter input in filter mode', async () => {
    await wrapper.setProps({ isFilter: true });

    expect(wrapper.find(selectInputFilter).exists()).toBe(false);

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectInputFilter).exists()).toBe(true);
  });

  it('shows computed results in filter mode', async () => {
    await wrapper.setProps({ isFilter: true });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.findAll(selectOption).length).toBe(OPTIONS.length);

    wrapper.findComponent<DefineComponent>(selectInputFilter).vm.$emit('update:modelValue', OPTIONS[1]);

    await nextTick();

    expect(wrapper.findAll(selectOption).length).toBe(
      OPTIONS.filter((option) => option.toLowerCase().includes(OPTIONS[1].toLowerCase())).length
    );
  });

  it('shows no results in filter mode', async () => {
    await wrapper.setProps({ isFilter: true });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectNoResults).exists()).toBe(false);

    wrapper.findComponent<DefineComponent>(selectInputFilter).vm.$emit('update:modelValue', '100% not in options');

    await nextTick();

    expect(wrapper.findAll(selectOption).length).toBe(0);
    expect(wrapper.find(selectNoResults).exists()).toBe(true);

    await wrapper.find(selectNoResults).trigger('click');

    expect(wrapper.find(selectOptions).exists()).toBe(false);
  });

  it('clears value when clear button is clicked', async () => {
    expect(wrapper.find(selectClearButton).exists()).toBe(false);

    await wrapper.setProps({ isClearable: true });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectClearButton).exists()).toBe(true);

    await wrapper.find(selectClearButton).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
  });

  it('disables component when isDisabled prop is true', async () => {
    expect(wrapper.find(selectOptions).exists()).toBe(false);

    await wrapper.setProps({ isDisabled: true });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.find(selectOptions).exists()).toBe(false);
  });

  it('shows placeholder text in different languages', async () => {
    await wrapper.setProps({ lang: 'en' });

    expect(wrapper.findComponent<DefineComponent>(selectInput).attributes('placeholder')).toBe('Choose');

    await wrapper.setProps({ lang: 'ru' });

    expect(wrapper.findComponent<DefineComponent>(selectInput).attributes('placeholder')).toBe('Выбрать');
  });

  it('shows filter placeholder text in different languages', async () => {
    await wrapper.setProps({ isFilter: true, lang: 'en' });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    const filterComponent = wrapper.findComponent(selectInputFilter) as VueWrapper;

    expect(filterComponent.attributes('placeholder')).toBe('Filter');
  });

  it('shows no results text in different languages', async () => {
    await wrapper.setProps({ isFilter: true, lang: 'en' });

    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    wrapper.findComponent<DefineComponent>(selectInputFilter).vm.$emit('update:modelValue', 'nonexistent');

    await nextTick();

    expect(wrapper.find(selectNoResults).text()).toBe('No results');
  });

  it('handles keyboard navigation in options', async () => {
    wrapper.findComponent<DefineComponent>(selectInput).vm.$emit('toggle');

    await nextTick();

    expect(wrapper.findAll(selectOption)[0].attributes('tabindex')).toBe('0');
  });
});
