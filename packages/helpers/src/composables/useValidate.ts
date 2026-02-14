import { shallowRef, computed, Ref } from 'vue';

import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { RuleItem, Rules } from 'async-validator';

import { TLocale } from '@/locales/types';
import { MESSAGES } from '@/locales';

export function useValidate<T>(
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

  const tries = shallowRef(0);

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
    message: MESSAGES[locale].fieldIsRequired,
  };
}

export function email(locale: TLocale = 'ru'): RuleItem {
  return {
    type: 'email',
    message: MESSAGES[locale].enterCorrectEmail,
  };
}

export function letters(locale: TLocale = 'ru'): RuleItem {
  return {
    validator: (_rule: object, value: string) => /^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value) || value.length === 0,
    type: 'string',
    message: MESSAGES[locale].onlyLetters,
  };
}

export function min(value: number, locale: TLocale = 'ru'): RuleItem {
  return {
    min: value,
    message: `${MESSAGES[locale].minSymbols}: ${value}`,
  };
}

export function max(value: number, locale: TLocale = 'ru'): RuleItem {
  return {
    max: value,
    message: `${MESSAGES[locale].maxSymbols}: ${value}`,
  };
}
