import { Component, ComponentPublicInstance } from 'vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { debounce } from 'perfect-debounce';

import { uiStubs } from './components/stubs/stubs';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type TFilteredProps<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T as K extends `$${infer _U}` ? never : K extends `on${infer _V}` ? never : K]: T[K];
};

type TComponentProps<T> = Partial<TFilteredProps<ComponentPublicInstance<T>['$props']>>;

export function wrapperFactory<T>(component: Component<T>, props?: TComponentProps<T>, slots?: { default: string }) {
  document.body.innerHTML = '<div id="app"></div>';

  return shallowMount(component, {
    global: {
      stubs: {
        ...uiStubs,
        RouterLink: { template: '<a><slot></slot></a>' },
        Teleport: { template: '<div><slot></slot></div>' },
      },
    },
    props: props as ComponentPublicInstance<T>['$props'],
    slots: slots as undefined,
    mocks: { debounce },
    attachTo: document.querySelector('#app') as HTMLElement,
  }) as VueWrapper<ComponentPublicInstance<T>>;
}
