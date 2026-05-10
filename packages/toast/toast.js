/**
 * @zuii/toast — toast.js
 * Système de notifications toast
 */

let container = null;
const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION = 'top-right';

const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
  default: '●',
};

function getContainer(position = DEFAULT_POSITION) {
  if (!container) {
    container = document.createElement('div');
    container.className = `toast-container toast-container--${position}`;
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Affiche un toast
 * @param {string|object} message  - Texte ou { title, message, type, duration, position }
 * @param {string} type            - 'success' | 'error' | 'warning' | 'info'
 * @param {object} options         - { duration, position, title }
 */
export function showToast(message, type = 'default', options = {}) {
  // Allow object as first arg: showToast({ title, message, type, duration })
  if (typeof message === 'object' && message !== null) {
    options = { ...message, ...options };
    type = options.type || type;
    message = options.message || '';
  }

  const duration = options.duration ?? DEFAULT_DURATION;
  const position = options.position ?? DEFAULT_POSITION;
  const title    = options.title ?? null;

  const c = getContainer(position);

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast${type !== 'default' ? ` toast--${type}` : ''}`;

  const icon = ICONS[type] || ICONS.default;

  toast.innerHTML = `
    <span class="toast__icon" aria-hidden="true">${icon}</span>
    <div class="toast__content">
      ${title ? `<div class="toast__title">${title}</div>` : ''}
      <div class="toast__message">${message}</div>
    </div>
    <button class="toast__close" aria-label="Fermer">✕</button>
    ${duration > 0 ? `<div class="toast__progress" style="animation-duration:${duration}ms"></div>` : ''}
  `;

  c.appendChild(toast);

  // Close button
  const closeBtn = toast.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => dismissToast(toast));

  // Auto dismiss
  let timer;
  if (duration > 0) {
    timer = setTimeout(() => dismissToast(toast), duration);
  }

  // Pause on hover
  toast.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    const progress = toast.querySelector('.toast__progress');
    if (progress) progress.style.animationPlayState = 'paused';
  });
  toast.addEventListener('mouseleave', () => {
    const progress = toast.querySelector('.toast__progress');
    if (progress) {
      progress.style.animationPlayState = 'running';
      timer = setTimeout(() => dismissToast(toast), 800);
    }
  });

  return toast;
}

function dismissToast(toast) {
  toast.classList.add('is-hiding');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
  // Fallback remove after 300ms
  setTimeout(() => toast.remove(), 300);
}

// Shorthand helpers
export const toast = {
  success: (msg, opts) => showToast(msg, 'success', opts),
  error:   (msg, opts) => showToast(msg, 'error',   opts),
  warning: (msg, opts) => showToast(msg, 'warning', opts),
  info:    (msg, opts) => showToast(msg, 'info',    opts),
  show:    (msg, opts) => showToast(msg, 'default', opts),
};

export function initToast(options = {}) {
  if (options.position) DEFAULT_POSITION;
  // Init is optional — toasts can be called directly via showToast() / toast.success()
  return toast;
}
