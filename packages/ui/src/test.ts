import { Component, ComponentPublicInstance } from 'vue';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { debounce } from 'perfect-debounce';

import { uiStubs } from './components/stubs/stubs';

export function wrapperFactory<T>(
  component: Component<T>,
  props?: Partial<ComponentPublicInstance<T>['$props']>,
  slots?: { default: string }
) {
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
