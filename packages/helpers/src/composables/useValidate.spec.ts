import { describe, expect, test } from 'vitest';
import { nextTick, ref } from 'vue';

import { wait, withSetup } from '..';
import { useValidator, required, email, letters, min, max } from '.';

describe('useValidator', () => {
  test('validates required field correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required()] };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('Это поле обязательное');

      formData.value = { name: 'John' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();
    });
  });

  test('validates email field correctly', async () => {
    withSetup(async () => {
      const formData = ref({ email: '' });
      const rules = { email: [email()] };

      const { isValid, error } = useValidator(formData, rules);

      await wait(100);

      expect(isValid()).toBe(false);
      expect(error('email')).toBe('Введите корретную почту');

      formData.value = { email: 'john@example.com' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('email')).toBeUndefined();

      formData.value = { email: 'invalid-email' };

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('email')).toBe('Введите корретную почту');
    });
  });

  test('validates letters only field correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [letters()] };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();

      formData.value = { name: 'John Doe' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();

      formData.value = { name: 'John123' };

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('Допустимы только буквы');
    });
  });

  test('validates minimum length correctly', async () => {
    withSetup(async () => {
      const formData = ref({ password: '' });
      const rules = { password: [min(6)] };

      const { isValid, error } = useValidator(formData, rules);

      await wait(100);

      expect(isValid()).toBe(false);
      expect(error('password')).toBe('Минимальное количество символов: 6');

      formData.value = { password: '123456' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('password')).toBeUndefined();
    });
  });

  test('validates maximum length correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [max(10)] };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();

      formData.value = { name: 'John Doe' };

      await wait(100);

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();

      formData.value = { name: 'This is too long' };

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('Максимальное количество символов: 10');
    });
  });

  test('validates multiple fields correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '', email: '' });
      const rules = {
        name: [required()],
        email: [required(), email()],
      };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('Это поле обязательное');
      expect(error('email')).toBe('Это поле обязательное');

      formData.value = { name: 'John', email: 'john@example.com' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();
      expect(error('email')).toBeUndefined();
    });
  });

  test('handles English error messages correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required('en')] };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('This field is required');
    });
  });

  test('handles error object correctly', async () => {
    withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required()] };

      const { errors, isValid } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);

      expect(errors.value).toBeDefined();
      expect(errors.value?.name).toBeDefined();
    });
  });
});
