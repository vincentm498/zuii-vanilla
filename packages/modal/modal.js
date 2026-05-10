/**
 * @zuii/modal — modal.js
 * Gestion des événements d'ouverture/fermeture des modals
 */

export function initModal() {
  // Une seule initialisation via delegation sur le document
  document.addEventListener('click', (e) => {
    // Ouvrir via data-modal-target="#id"
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger && trigger.dataset.modalTarget) {
      const target = document.querySelector(trigger.dataset.modalTarget);
      if (target) {
        openModal(target);
      }
    }

    // Fermer via data-modal-close
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const overlay = closeBtn.closest('.modal-overlay');
      if (overlay) closeModal(overlay);
    }

    // Fermer en cliquant sur l'overlay
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('is-open')) {
      closeModal(e.target);
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openOverlay = document.querySelector('.modal-overlay.is-open');
      if (openOverlay) closeModal(openOverlay);
    }
  });
}

export function openModal(overlay) {
  if (typeof overlay === 'string') overlay = document.querySelector(overlay);
  if (!overlay) return;
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  overlay.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
}

export function closeModal(overlay) {
  if (typeof overlay === 'string') overlay = document.querySelector(overlay);
  if (!overlay) return;
  overlay.classList.remove('is-open');
  
  // Restore scroll only if no other modals are open
  if (!document.querySelector('.modal-overlay.is-open')) {
    document.body.style.overflow = '';
  }
  overlay.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
}
