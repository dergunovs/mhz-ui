/* eslint-disable unicorn/consistent-boolean-name */
import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue';

export interface IPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export function usePwa() {
  const isShowInstallPWA = shallowRef(false);
  const isPWACanBeInstalled = shallowRef(false);
  const installPWAPrompt = ref<IPromptEvent | undefined>();

  async function installPWA(): Promise<void> {
    if (!installPWAPrompt.value) return;

    await installPWAPrompt.value.prompt();

    setTimeout(() => {
      isShowInstallPWA.value = false;
      installPWAPrompt.value = undefined;
    }, 100);
  }

  function isInstallPromptEvent(e: Event): e is IPromptEvent {
    return !!e && 'prompt' in e;
  }

  function installHandler(event: Event) {
    if (!isInstallPromptEvent(event)) return;

    isPWACanBeInstalled.value = true;
    isShowInstallPWA.value = true;
    installPWAPrompt.value = event;
  }

  onMounted(() => {
    addEventListener('beforeinstallprompt', installHandler);
  });

  onBeforeUnmount(() => {
    removeEventListener('beforeinstallprompt', installHandler);
  });

  return {
    installPWA,
    isShowInstallPWA,
    isPWACanBeInstalled,
  };
}
