import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const template = '<template><div></div></template>';

export function dataTest(value: string): string {
  return `[data-test="${value}"]`;
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

  const app = createApp({
    template,
    setup() {
      composable();
    },
  });

  app.use(router);
  app.mount(document.createElement('div'));
}
