/**
 * Fonctions utilitaires pour le Playground
 */

/**
 * Récupère un fragment HTML (depuis templates/ ou packages/)
 */
export async function fetchHTML(path) {
  try {
    const url = (path.startsWith('pages/') || path.startsWith('templates/')) ? path : `../packages/${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.text();
  } catch (error) {
    console.error(`Erreur au chargement de ${path}:`, error);
    return `<div style="color:red">Erreur chargement ${path}</div>`;
  }
}

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
