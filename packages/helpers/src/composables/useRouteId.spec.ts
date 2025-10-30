import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, Ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { useRouteId } from '..';

const template = { template: '<template><div></div></template>' };

async function setupit(route: string, paramName: string, isQuery = false) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/user/:id', name: 'User', component: template },
      { path: '/', name: 'Home', component: template },
    ],
  });

  let capturedId: Ref<string> | undefined;

  const component = defineComponent({
    ...template,
    setup() {
      const { id } = useRouteId(paramName, isQuery);

      capturedId = id;

      return { id };
    },
  });

  const app = createApp(component);

  app.use(router);

  router.push(route);
  await router.isReady();

  const wrapper = document.createElement('div');

  document.body.append(wrapper);
  app.mount(wrapper);

  return { capturedId };
}

describe('useRouteId', () => {
  it('returns route param id', async () => {
    const { capturedId } = await setupit('/user/123', 'id');

    expect(capturedId?.value).toBe('123');
  });

  it('returns route query id', async () => {
    const { capturedId } = await setupit('/?id=456', 'id', true);

    expect(capturedId?.value).toBe('456');
  });

  it('returns empty string when id is not found', async () => {
    const { capturedId } = await setupit('/user/123', 'nonexistent');

    expect(capturedId?.value).toBe('');
  });
});
