import { createApp, defineComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const template = '<template><div></div></template>';

interface NodeWithProps {
  type: number;
  props: { type: number; name: string }[];
}

export function dataTest(value: string): string {
  return `[data-test="${value}"]`;
}

export function removeDataTest(node: NodeWithProps) {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop) => (prop.type === 6 ? prop.name !== 'data-test' : true));
  }
}

export async function wait(time?: number): Promise<void> {
  await new Promise((r) => {
    setTimeout(r, time || 10);
  });
}

export function withSetup<T>(composable: () => T) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'Home', component: { template } },
      { path: '/login', name: 'Login', component: { template } },
    ],
  });

  const component = defineComponent({
    template,
    setup() {
      composable();
    },
  });

  const app = createApp(component);

  app.use(router);

  const wrapper = document.createElement('div');

  document.body.appendChild(wrapper);

  app.mount(wrapper);
}
