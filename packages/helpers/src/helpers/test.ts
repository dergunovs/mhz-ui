import { createApp, defineComponent } from 'vue';
import type { RootNode, TemplateChildNode, NodeTransform } from '@vue/compiler-core';
import { createRouter, createWebHistory } from 'vue-router';

const template = '<template><div></div></template>';

export function dataTest(value: string): string {
  return `[data-test="${value}"]`;
}

export const removeDataTest: NodeTransform = (node: RootNode | TemplateChildNode) => {
  if (node.type === 1 /* NodeTypes.ELEMENT */ && 'props' in node) {
    node.props = node.props.filter((prop) => (prop.type === 6 ? prop.name !== 'data-test' : true));
  }
};

export async function wait(time?: number): Promise<void> {
  await new Promise((r) => {
    setTimeout(r, time || 10);
  });
}

export async function withSetup<T>(composable: () => Promise<T>) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: { template } },
      { path: '/login', name: 'Login', component: { template } },
    ],
  });

  let composableResult: Promise<T> | undefined;

  const component = defineComponent({
    template,
    setup() {
      composableResult = composable();
    },
  });

  const app = createApp(component);

  app.use(router);

  const wrapper = document.createElement('div');

  document.body.append(wrapper);
  app.mount(wrapper);

  await composableResult;
}
