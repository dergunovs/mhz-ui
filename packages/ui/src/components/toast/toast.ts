import './toast.css';

import successIconUrl from './icons/success.svg?url';
import errorIconUrl from './icons/error.svg?url';
import infoIconUrl from './icons/info.svg?url';

const icons: { [key: string]: string } = {
  success: successIconUrl,
  error: errorIconUrl,
  info: infoIconUrl,
};

function success(message: string) {
  show('success', message);
}

function error(message: string) {
  show('error', message);
}

function info(message: string) {
  show('info', message);
}

function show(type: string, message: string) {
  const body = document.body;

  if (body && !body.contains(document.querySelector('.uiToastBlock'))) {
    const toastBlock = document.createElement('div');

    toastBlock.classList.add('uiToastBlock');
    body.append(toastBlock);
  }

  const toast = document.createElement('div');

  toast.classList.add('uiToast', `${type}Toast`);

  const icon = document.createElement('img');

  icon.classList.add('uiToastIcon');
  icon.src = icons[type];
  icon.width = 20;
  icon.height = 20;

  const messageBlock = document.createElement('div');

  messageBlock.innerHTML = message;
  messageBlock.classList.add('uiToastMessage');

  toast.appendChild(icon);
  toast.appendChild(messageBlock);

  const closeBtn = document.createElement('button');

  closeBtn.classList.add('uiToastClose');

  closeBtn.addEventListener('click', () => {
    toast.remove();

    if (body && !body.contains(document.querySelector('.uiToast'))) {
      document.querySelector('.uiToastBlock')?.remove();
    }
  });

  toast.appendChild(closeBtn);

  document.querySelector('.uiToastBlock')?.append(toast);

  setTimeout(() => toast.classList.add('uiToastVisible'), 200);

  setTimeout(() => {
    toast.classList.remove('uiToastVisible');

    setTimeout(() => {
      toast.remove();
      const remainingToasts = document.querySelectorAll('.uiToast');

      if (body && remainingToasts.length === 0) {
        document.querySelector('.uiToastBlock')?.remove();
      }
    }, 200);
  }, 3800);

  toast.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).classList.contains('uiToastClose')) {
      toast.classList.remove('uiToastVisible');

      setTimeout(() => {
        toast.remove();
        const remainingToasts = document.querySelectorAll('.uiToast');

        if (body && remainingToasts.length === 0) {
          document.querySelector('.uiToastBlock')?.remove();
        }
      }, 200);
    }
  });
}

const toast = { success, error, info };

export default toast;
