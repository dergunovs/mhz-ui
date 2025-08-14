import { ref, computed, Ref } from 'vue';

import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { RuleItem, Rules } from 'async-validator';

export function useValidator<T>(formData: Ref<T>, rules: Partial<{ [fieldName in keyof T]: RuleItem[] | false }>) {
  const computedRules = computed(() => rules as Rules);

  const { errorFields, isFinished, pass } = useAsyncValidator(formData, computedRules, {
    validateOption: { suppressWarning: true },
  });

  const tries = ref(0);

  function isValid(): boolean {
    tries.value++;

    return pass.value && isFinished.value;
  }

  const errors = computed(() => (tries.value ? errorFields.value : undefined));

  function error(field: string): string | undefined {
    return errors.value?.[field]?.[0]?.message;
  }

  return {
    error,
    errors,
    isValid,
  };
}

export function required(lang?: string): RuleItem {
  return {
    required: true,
    whitespace: true,
    message: lang === 'en' ? 'This field is required' : 'Это поле обязательное',
  };
}

export function email(lang?: string): RuleItem {
  return {
    type: 'email',
    message: lang === 'en' ? 'This is not correct email' : 'Введите корректную почту',
  };
}

export function letters(lang?: string): RuleItem {
  return {
    validator: (_rule: object, value: string) =>
      /^[a-zA-zа-яА-ЯёЁ-]+([\s][a-zA-Zа-яА-ЯёЁ-]+)*$/.test(value) || !value.length,
    type: 'string',
    message: lang === 'en' ? 'Only letters' : 'Допустимы только буквы',
  };
}

export function min(value: number, lang?: string): RuleItem {
  return {
    min: value,
    message: lang === 'en' ? `Minimum symbols: ${value}` : `Минимальное количество символов: ${value}`,
  };
}

export function max(value: number, lang?: string): RuleItem {
  return {
    min: value,
    message: lang === 'en' ? `Maximum symbols: ${value}` : `Максимальное количество символов: ${value}`,
  };
}
