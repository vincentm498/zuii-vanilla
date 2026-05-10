/**
 * Fonctions utilitaires pour le Playground
 */


/**
 * Échappe le HTML pour utilisation dans un attribut data-*
 */
export function escapeHtml(str) {
  return str.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Met à jour l'état actif de la sidebar
 */
export function updateSidebarActive(routeId) {
  const navItems = document.querySelectorAll('.sidebar__nav-item');
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === routeId);
  });
}
