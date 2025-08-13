import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import toast from './toast';

describe('toast', () => {
  let body: HTMLElement;

  beforeEach(() => {
    body = document.body;

    while (body.firstChild) body.removeChild(body.firstChild);

    vi.useFakeTimers();
  });

  afterEach(() => {
    const toastBlocks = document.querySelectorAll('.uiToastBlock');

    toastBlocks.forEach((block) => block.remove());

    vi.useRealTimers();
  });

  it('should create toast block when first toast is shown', () => {
    toast.success('Test message');

    const toastBlock = document.querySelector('.uiToastBlock');

    expect(toastBlock).not.toBeNull();
    expect(toastBlock?.classList.contains('uiToastBlock')).toBe(true);
  });

  it('should show success toast', () => {
    toast.success('Success message');

    const toastElement = document.querySelector('.uiToast.successToast');

    expect(toastElement).not.toBeNull();
    const icon = toastElement?.querySelector('img.uiToastIcon');

    expect(icon).not.toBeNull();
    const message = toastElement?.querySelector('.uiToastMessage');

    expect(message?.textContent).toBe('Success message');
  });

  it('should show error toast', () => {
    toast.error('Error message');

    const toastElement = document.querySelector('.uiToast.errorToast');

    expect(toastElement).not.toBeNull();
    const icon = toastElement?.querySelector('img.uiToastIcon');

    expect(icon).not.toBeNull();
  });

  it('should show info toast', () => {
    toast.info('Info message');

    const toastElement = document.querySelector('.uiToast.infoToast');

    expect(toastElement).not.toBeNull();
    const icon = toastElement?.querySelector('img.uiToastIcon');

    expect(icon).not.toBeNull();
  });

  it('should not create multiple toast blocks for same session', () => {
    toast.success('First message');
    toast.error('Second message');

    const toastBlocks = document.querySelectorAll('.uiToastBlock');

    expect(toastBlocks.length).toBe(1);
  });

  it('should remove toast after timeout', () => {
    toast.success('Test message');

    vi.advanceTimersByTime(4000);

    const toastElements = document.querySelectorAll('.uiToast');

    expect(toastElements.length).toBe(0);
  });

  it('should remove toast when toast is clicked', () => {
    toast.success('Test message');

    const toastElement = document.querySelector('.uiToast') as HTMLElement;

    toastElement.click();

    const toastElements = document.querySelectorAll('.uiToast');

    expect(toastElements.length).toBe(1);

    vi.advanceTimersByTime(200);

    const remainingToasts = document.querySelectorAll('.uiToast');

    expect(remainingToasts.length).toBe(0);
  });

  it('should remove toast block when last toast is removed', () => {
    toast.success('Test message');

    vi.advanceTimersByTime(4000);

    const toastBlocks = document.querySelectorAll('.uiToastBlock');

    expect(toastBlocks.length).toBe(0);
  });
});
