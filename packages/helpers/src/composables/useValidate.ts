import { ref, computed, Ref } from 'vue';

import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { RuleItem, Rules } from 'async-validator';

type TLocale = 'ru' | 'en';

const messages = {
  required: { en: 'This field is required', ru: 'Это поле обязательное' },
  email: { en: 'This is not correct email', ru: 'Введите корректную почту' },
  letters: { en: 'Only letters', ru: 'Допустимы только буквы' },
  min: { en: 'Minimum symbols', ru: 'Минимальное количество символов' },
  max: { en: 'Maximum symbols', ru: 'Максимальное количество символов' },
};

export function useValidator<T>(
  formData: Ref<T>,
  rules: Partial<{ [fieldName in keyof T]: (RuleItem | ((locale: TLocale) => RuleItem))[] }>,
  locale: TLocale = 'ru'
) {
  const computedRules = computed(() => {
    return Object.entries(rules).reduce((acc, [key, ruleArray]) => {
      acc[key] = Array.isArray(ruleArray)
        ? ruleArray.map((rule) => (typeof rule === 'function' ? rule(locale) : rule))
        : [];

      return acc;
    }, {} as Rules);
  });

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

  return { error, errors, isValid };
}

export function required(locale: TLocale = 'ru'): RuleItem {
  return {
    required: true,
    whitespace: true,
    message: messages.required[locale],
  };
}

export function email(locale: TLocale = 'ru'): RuleItem {
  return {
    type: 'email',
    message: messages.email[locale],
  };
}

export function letters(locale: TLocale = 'ru'): RuleItem {
  return {
    validator: (_rule: object, value: string) => /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value) || value.length === 0,
    type: 'string',
    message: messages.letters[locale],
  };
}

export function min(value: number, locale: TLocale = 'ru'): RuleItem {
  return {
    min: value,
    message: `${messages.min[locale]}: ${value}`,
  };
}

export function max(value: number, locale: TLocale = 'ru'): RuleItem {
  return {
    max: value,
    message: `${messages.max[locale]}: ${value}`,
  };
}
