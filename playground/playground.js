/**
 * Playground JS — Orchestrateur principal
 */
import { routes } from './routes.js';
import { fetchHTML, escapeHtml, updateSidebarActive } from './utils.js';
import { marked } from 'marked';

import { initAll } from '../packages/all/index.js';

import { initDropdown } from '../packages/dropdown/dropdown.js';
import { toast } from '../packages/toast/toast.js';
import { clipboard, initColor } from '../packages/Utils/index.ts';

// Import dynamique de tous les fichiers HTML des packages (Vite Magic)
const allHtmlFragments = import.meta.glob('../packages/**/*.html', { query: '?raw', import: 'default' });

/**
 * Génère le contenu HTML générique à partir des fragments d'un package
 */
async function generateGenericHtml(route) {
  const folderName = route.package.split('/').slice(1).join('/');
  const fileKeys = Object.keys(allHtmlFragments).filter(k => k.startsWith(`../packages/${folderName}/`));

  // Config: show code preview?
  const showCode = route.showCode !== false && route.zuii?.showCode !== false;
  const codeVisibleClass = showCode ? '' : 'is-hidden';

  // Filter out demo files from the main list of blocks
  const componentKeys = fileKeys.filter(k => !k.endsWith('-demo.html'));

  // Trier : composant principal en premier
  const baseFolderName = folderName.split('/').pop();
  componentKeys.sort((a, b) => {
    const isMainA = a.endsWith(`/${baseFolderName}.html`);
    const isMainB = b.endsWith(`/${baseFolderName}.html`);
    if (isMainA) return -1;
    if (isMainB) return 1;
    return a.localeCompare(b);
  });

  const blockTemplate = await fetchHTML('templates/template-block.html');
  let pageHtml = '';

  for (const key of componentKeys) {
    const filename = key.split('/').pop().replace('.html', '');
    const label = filename === baseFolderName ? 'Défaut' : filename.replace(`${baseFolderName}-`, '').replace(/-/g, ' ');
    const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
    
    // Get the rendered HTML
    const rawHtml = await allHtmlFragments[key]();
    
    // Check if a demo file exists for the code preview
    const demoKey = key.replace('.html', '-demo.html');
    let codeToDisplay = rawHtml;
    
    if (allHtmlFragments[demoKey]) {
      codeToDisplay = await allHtmlFragments[demoKey]();
    }

    pageHtml += blockTemplate
      .replaceAll('{{displayLabel}}', displayLabel)
      .replaceAll('{{content}}', rawHtml)
      .replaceAll('{{codeVisibleClass}}', codeVisibleClass)
      .replaceAll('{{escapedContent}}', escapeHtml(codeToDisplay));
  }

  return pageHtml;
}

/**
 * Génère la barre de pagination
 */
function generatePagination(routeId) {
  const routeKeys = Object.keys(routes);
  const currentIndex = routeKeys.indexOf(routeId);
  const prevKey = routeKeys[currentIndex - 1];
  const nextKey = routeKeys[currentIndex + 1];

  let html = '<div class="pg-pagination" style="display: flex; justify-content: space-between; margin-top: 60px; padding-top: 30px; border-top: 1px solid var(--border);"> ';
  html += prevKey ? `<a href="#${prevKey}" class="btn btn--outline" style="text-decoration:none;">← ${routes[prevKey].title}</a>` : '<div></div>';
  html += nextKey ? `<a href="#${nextKey}" class="btn btn--outline" style="text-decoration:none;">${routes[nextKey].title} →</a>` : '<div></div>';
  html += '</div>';

  return html;
}

/**
 * Rendu principal d'un composant
 */
async function renderComponent(routeId) {
  const route = routes[routeId];
  const viewContainer = document.getElementById('component-view');
  const modalsContainer = document.getElementById('modals-container');

  if (!route) {
    viewContainer.innerHTML = '<section class="pg-section"><h2>Composant introuvable</h2></section>';
    return;
  }

  // 1. Déterminer le chemin du dossier pour le Markdown et le Script
  const folderParts = route.package.split('/').slice(1);
  const folderPath = folderParts.join('/');
  const baseName = folderParts.pop();

  // 2. Déterminer le HTML de la page
  const pageHtml = route.page ? await fetchHTML(route.page) : await generateGenericHtml(route);
  const paginationHtml = generatePagination(routeId);

  // 3. Récupérer et parser le Markdown si présent
  let docHtml = '';
  try {
    const mdRes = await fetch(`../packages/${folderPath}/${baseName}.md`);
    if (mdRes.ok) {
      const mdText = await mdRes.text();
      docHtml = marked.parse(mdText);
    }
  } catch (e) {
    console.warn(`Pas de documentation trouvée pour ${routeId}`);
  }

  // 4. Injecter dans le template principal
  const pageTemplate = await fetchHTML('templates/template-page.html');
  viewContainer.innerHTML = pageTemplate
    .replaceAll('{{routeId}}', routeId)
    .replaceAll('{{title}}', route.title)
    .replaceAll('{{package}}', route.package)
    .replaceAll('{{pageHtml}}', pageHtml)
    .replaceAll('{{docHtml}}', docHtml)
    .replaceAll('{{paginationHtml}}', paginationHtml);

  // 3. Injecter les modals globaux si présents
  modalsContainer.innerHTML = route.modals || '';

  // 4. Charger les [data-fetch] (uniquement pour templates custom)
  if (route.page) {
    const fetchElements = document.querySelectorAll('[data-fetch]');
    const fetchPromises = Array.from(fetchElements).map(async (el) => {
      el.innerHTML = await fetchHTML(el.getAttribute('data-fetch'));
    });
    await Promise.all(fetchPromises);
  }

  // 5. Initialiser les interactions
  initDropdown();
  initToastsListeners();
  clipboard.init(viewContainer);
  if (routeId === 'color') initColor(viewContainer);

  // 6. Charger le script spécifique au composant s'il existe

  try {
    const componentModule = await import(`../packages/${folderPath}/${baseName}.js`);
    if (componentModule.init) {
      componentModule.init(viewContainer);
    }
  } catch (e) {
    // Le script n'existe pas ou erreur au chargement, on ignore silencieusement
  }

  if (window.Prism) window.Prism.highlightAllUnder(viewContainer);
  if (window.lucide) window.lucide.createIcons();

  updateSidebarActive(routeId);
}

/**
 * Écouteurs pour les Toasts
 */
function initToastsListeners() {
  const btns = {
    'btnToastSuccess': () => toast.success('Enregistrement réussi !'),
    'btnToastError': () => toast.error('Une erreur est survenue.'),
    'btnToastWarning': () => toast.warning('Attention !'),
    'btnToastInfo': () => toast.info('Info message'),
    'btnToastTitle': () => toast.success({ title: 'Titre', message: 'Message' })
  };

  Object.entries(btns).forEach(([id, fn]) => {
    document.getElementById(id)?.addEventListener('click', fn);
  });
}

/**
 * Gestion du Dark Mode
 */
function initTheme() {
  const html = document.documentElement;

  const updateIcon = (isDark) => {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  };

  document.body.addEventListener('click', (e) => {
    const toggle = e.target.closest('#themeToggle');
    if (!toggle) return;

    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(!isDark);
  });

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    setTimeout(() => updateIcon(true), 100);
  }
}

/**
 * Initialisation Globale
 */
async function init() {
  // 1. Sidebar
  try {
    const sidebarRes = await fetch('../packages/sidebar/sidebar.html');
    const sidebarHtml = await sidebarRes.text();
    const container = document.getElementById('preview-sidebar');
    if (container) container.innerHTML = sidebarHtml;
  } catch (e) { console.error('Sidebar error:', e); }

  // 2. Modules
  initTheme();
  initSidebarToggle();

  // 3. Router init
  window.addEventListener('hashchange', () => {
    renderComponent(window.location.hash.substring(1) || 'buttons');
  });

  renderComponent(window.location.hash.substring(1) || 'buttons');
}

/**
 * Gestion de la réduction de la sidebar
 */
function initSidebarToggle() {
  document.body.addEventListener('click', (e) => {
    const toggle = e.target.closest('#sidebarToggle');
    if (!toggle) return;

    document.body.classList.toggle('is-sidebar-collapsed');

    // Sauvegarder la préférence
    const isCollapsed = document.body.classList.contains('is-sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  });

  // Restaurer l'état
  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    document.body.classList.add('is-sidebar-collapsed');
  }
}

init();

