import { toast } from './toast.js';

/**
 * Initialise les déclencheurs de toasts pour la démo/documentation
 * @param {HTMLElement} container - Le conteneur dans lequel chercher les boutons
 */
export function init(container = document) {
  const btns = {
    'btnToastSuccess': () => toast.success('Enregistrement réussi !'),
    'btnToastError': () => toast.error('Une erreur est survenue.'),
    'btnToastWarning': () => toast.warning('Attention !'),
    'btnToastInfo': () => toast.info('Info message'),
    'btnToastTitle': () => toast.success({ title: 'Titre', message: 'Message' })
  };

  Object.entries(btns).forEach(([id, fn]) => {
    container.querySelector(`#${id}`)?.addEventListener('click', fn);
  });
}