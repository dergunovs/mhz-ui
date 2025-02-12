import { createApp } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';

const template = '<template><div></div></template>';

export function dataTest(value: string): string {
  return `[data-test="${value}"]`;
}

export async function wait(time?: number): Promise<void> {
  await new Promise((r) => {
    setTimeout(r, time || 10);
  });
}

export const mockedRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template } },
    { path: '/url', name: 'Url', component: { template } },
  ],
});

export function withSetup<T>(router: Router, composable: () => T) {
  const app = createApp({
    template,
    setup() {
      composable();
    },
  });

  app.use(router);
  app.mount(document.createElement('div'));
}
