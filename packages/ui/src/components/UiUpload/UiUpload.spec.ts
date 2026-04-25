import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiUpload from './UiUpload.vue';
import { LABEL, FILE, FILES } from './constants';

import { wrapperFactory } from '@/test';

const upload = dataTest('ui-upload');
const uploadLabel = dataTest('ui-upload-label');
const uploadRequired = dataTest('ui-upload-required');
const uploadText = dataTest('ui-upload-text');
const uploadAdd = dataTest('ui-upload-add');
const uploadFile = dataTest('ui-upload-file');
const uploadFileSingle = dataTest('ui-upload-file-single');
const uploadFileName = dataTest('ui-upload-file-name');
const uploadFileNameSingle = dataTest('ui-upload-file-name-single');
const uploadFileRemove = dataTest('ui-upload-file-remove');
const uploadFileRemoveSingle = dataTest('ui-upload-file-remove-single');

let wrapper: VueWrapper<InstanceType<typeof UiUpload>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiUpload, { label: LABEL, file: FILE, isSingle: true });
});

enableAutoUnmount(afterEach);

describe('UiUpload', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiUpload)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows label', async () => {
    expect(wrapper.find(uploadLabel).text()).toBe(LABEL);
  });

  it('shows required * symbol', async () => {
    expect(wrapper.find(uploadRequired).exists()).toBe(false);

    await wrapper.setProps({ isRequired: true });

    expect(wrapper.find(uploadRequired).text()).toBe('*');
  });

  it('shows error', async () => {
    expect(wrapper.find(uploadText).attributes('data-error')).toBe('false');

    await wrapper.setProps({ error: true });

    expect(wrapper.find(uploadText).attributes('data-error')).toBe('true');
  });

  it('disables add button by props', async () => {
    expect(wrapper.find(uploadAdd).attributes('isdisabled')).toBe('true');

    await wrapper.setProps({ file: undefined });

    expect(wrapper.find(uploadAdd).attributes('isdisabled')).toBe('false');

    await wrapper.setProps({ isDisabled: true });

    expect(wrapper.find(uploadAdd).attributes('isdisabled')).toBe('true');
  });

  it('shows single file', async () => {
    expect(wrapper.find(uploadFileSingle).exists()).toBe(true);
    expect(wrapper.find(uploadFileNameSingle).text()).toBe(FILE.name);
  });

  it('removes single file', async () => {
    await wrapper.find(uploadFileRemoveSingle).trigger('click');

    expect(wrapper.emitted('remove')).toHaveLength(1);
    expect(wrapper.emitted('remove')?.[0]).toEqual([FILE]);
  });

  it('shows multiple files', async () => {
    await wrapper.setProps({ file: undefined, files: FILES, isSingle: false });

    expect(wrapper.findAll(uploadFile).length).toBe(FILES.length);
    expect(wrapper.findAll(uploadFileName)[0].text()).toBe(FILES[0].name);
  });

  it('removes file from multiple files list', async () => {
    await wrapper.setProps({ file: undefined, files: FILES, isSingle: false });
    await wrapper.findAll(uploadFileRemove)[0].trigger('click');

    expect(wrapper.emitted('remove')).toHaveLength(1);
    expect(wrapper.emitted('remove')?.[0]).toEqual([FILES[0]]);
  });

  it('emits upload event by upload button click', async () => {
    await wrapper.find(upload).trigger('click');

    expect(wrapper.emitted('upload')).toHaveLength(1);
  });

  it('shows file size limit in text', async () => {
    await wrapper.setProps({ extensions: ['jpg', 'png'] });

    const text = wrapper.find(uploadText);

    expect(text.text()).toContain('Mb');
    expect(text.text()).toContain('jpg, png');
  });

  it('handles language change', async () => {
    await wrapper.setProps({ lang: 'en' });
    expect(wrapper.find(uploadFileRemoveSingle).text()).toContain('Remove');

    await wrapper.setProps({ lang: 'ru' });
    expect(wrapper.find(uploadFileRemoveSingle).text()).toContain('Убрать');
  });

  it('adds multiple files via input', async () => {
    await wrapper.setProps({ file: undefined, files: [], isSingle: false });

    const inputElement = wrapper.find('[data-test="ui-upload-input"]').element as HTMLInputElement;
    const files = [new File(['a'], 'a.jpg'), new File(['b'], 'b.png')];

    Object.defineProperty(inputElement, 'files', { value: files });

    await wrapper.find('[data-test="ui-upload-input"]').trigger('input');

    expect(wrapper.emitted('add')).toHaveLength(2);
    expect(wrapper.emitted('add')?.[0]).toEqual([files[0]]);
    expect(wrapper.emitted('add')?.[1]).toEqual([files[1]]);
  });

  it('filters files exceeding limit', async () => {
    await wrapper.setProps({ file: undefined, files: [], isSingle: false, limit: 1 });

    const inputElement = wrapper.find('[data-test="ui-upload-input"]').element as HTMLInputElement;
    const bigFile = new File(['big'], 'big.jpg');

    Object.defineProperty(bigFile, 'size', { value: 100 });
    Object.defineProperty(inputElement, 'files', { value: [bigFile] });

    await wrapper.find('[data-test="ui-upload-input"]').trigger('input');

    expect(wrapper.emitted('add')).toBeFalsy();
  });

  it('does not remove when file is undefined', async () => {
    await wrapper.setProps({ file: undefined, isSingle: true });

    expect(wrapper.find(uploadFileRemoveSingle).exists()).toBe(false);
  });

  it('hides label when not provided', async () => {
    await wrapper.setProps({ label: undefined });

    expect(wrapper.find(uploadLabel).exists()).toBe(false);
  });

  it('hides upload button when isHideUploadButton is true', async () => {
    await wrapper.setProps({ isHideUploadButton: true });

    expect(wrapper.find(upload).exists()).toBe(false);
  });

  it('uses custom upload button text', async () => {
    const customText = 'Custom Upload';

    await wrapper.setProps({ uploadButtonText: customText });

    expect(wrapper.find(upload).text()).toBe(customText);
  });
});
