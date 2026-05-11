/**
 * @zuii/toast — toast.js (Bootstrap 5 Bridge)
 * Système de notifications utilisant le moteur de Bootstrap
 */

const BOOTSTRAP_BG = {
  success: 'success',
  error:   'danger',
  warning: 'warning',
  info:    'info',
  default: 'dark',
};

/**
 * Récupère ou crée le conteneur de toasts Bootstrap
 */
function getContainer(position = 'top-0 end-0') {
  // Mapping des positions simplifiées
  let posClass = position;
  if (position === 'top-right') posClass = 'top-0 end-0';
  if (position === 'top-left') posClass = 'top-0 start-0';
  if (position === 'bottom-right') posClass = 'bottom-0 end-0';
  if (position === 'bottom-left') posClass = 'bottom-0 start-0';
  if (position === 'top-center') posClass = 'top-0 start-50 translate-middle-x';
  if (position === 'bottom-center') posClass = 'bottom-0 start-50 translate-middle-x';

  const selector = `.toast-container.${posClass.split(' ').join('.')}`;
  let c = document.querySelector(selector);
  
  if (!c) {
    c = document.createElement('div');
    c.className = `toast-container position-fixed p-3 ${posClass}`;
    c.style.zIndex = '9999';
    document.body.appendChild(c);
  }
  return c;
}

/**
 * Affiche un toast Bootstrap
 * @param {string|object} message  - Texte ou { title, message, type, duration, position }
 * @param {string} type            - 'success' | 'error' | 'warning' | 'info'
 */
export function showToast(message, type = 'default', options = {}) {
  if (typeof message === 'object' && message !== null) {
    options = { ...message, ...options };
    type = options.type || type;
    message = options.message || '';
  }

  const duration = options.duration ?? 4000;
  const title = options.title ?? null;
  const bg = BOOTSTRAP_BG[type] || BOOTSTRAP_BG.default;

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${bg} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${title ? `<strong>${title}</strong><br>` : ''}
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  const c = getContainer(options.position || 'top-right');
  c.appendChild(toastEl);

  // Initialisation via l'API Bootstrap (objet global attendu)
  if (window.bootstrap) {
    const bsToast = new window.bootstrap.Toast(toastEl, {
      delay: duration,
      autohide: duration > 0
    });
    bsToast.show();
  } else {
    console.error('Bootstrap JS non trouvé. Assurez-vous que bootstrap.bundle.min.js est chargé.');
    // Fallback minimaliste si BS n'est pas chargé
    toastEl.classList.add('show');
    setTimeout(() => toastEl.remove(), duration || 3000);
  }

  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });

  return toastEl;
}

export const toast = {
  success: (msg, opts) => showToast(msg, 'success', opts),
  error:   (msg, opts) => showToast(msg, 'error',   opts),
  warning: (msg, opts) => showToast(msg, 'warning', opts),
  info:    (msg, opts) => showToast(msg, 'info',    opts),
  show:    (msg, opts) => showToast(msg, 'default', opts),
};
