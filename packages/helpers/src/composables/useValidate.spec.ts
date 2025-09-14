import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';

import { withSetup } from '..';
import { useValidator, required, email, letters, min, max } from '.';

describe('useValidator', () => {
  it('validates required field correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required] };

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

  it('validates email field correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ email: '' });
      const rules = { email: [email] };

      formData.value = { email: '123123' };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('email')).toBe('Введите корректную почту');

      formData.value = { email: 'john@example.com' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('email')).toBeUndefined();

      formData.value = { email: 'invalid-email' };

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('email')).toBe('Введите корректную почту');
    });
  });

  it('validates letters only field correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [letters] };

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

  it('validates minimum length correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ password: '' });
      const rules = { password: [min(6)] };

      formData.value = { password: '1' };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('password')).toBe('Минимальное количество символов: 6');

      formData.value = { password: '123456' };

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('password')).toBeUndefined();
    });
  });

  it('validates maximum length correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [max(10)] };

      formData.value = { name: 'name' };

      const { isValid, error } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(true);
      expect(error('name')).toBeUndefined();

      formData.value = { name: 'Very long name' };

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('Максимальное количество символов: 10');
    });
  });

  it('validates multiple fields correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '', email: '' });
      const rules = {
        name: [required],
        email: [required, email],
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

  it('handles English error messages correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required] };

      const { isValid, error } = useValidator(formData, rules, 'en');

      await nextTick();

      expect(isValid()).toBe(false);
      expect(error('name')).toBe('This field is required');
    });
  });

  it('handles error object correctly', async () => {
    await withSetup(async () => {
      const formData = ref({ name: '' });
      const rules = { name: [required] };

      const { errors, isValid } = useValidator(formData, rules);

      await nextTick();

      expect(isValid()).toBe(false);

      expect(errors.value).toBeDefined();
      expect(errors.value?.name).toBeDefined();
    });
  });
});
