/**
 * @zuii/all — index.js
 * Package global qui enregistre tous les composants
 */



import { initModal } from '../modal/modal.js';
import { initDropdown } from '../dropdown/dropdown.js';
import { toast } from '../toast/toast.js';

export { initModal, openModal, closeModal } from '../modal/modal.js';
export { initDropdown, openDropdown, closeDropdown, closeAllDropdowns } from '../dropdown/dropdown.js';
export { showToast, toast } from '../toast/toast.js';

/**
 * Initialise tous les composants interactifs d'un coup
 */
export function initAll() {
  initModal();
  initDropdown();
  return { toast };
}

// Auto-init au chargement du DOM
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
}
