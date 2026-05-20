/**
 * Playground JS — Orchestrateur principal
 */
import { routes } from './routes.js';
import { escapeHtml, updateSidebarActive } from './utils.js';
import { renderMarkdown } from './markdown.js';

import { initAll } from '../packages/all/index.js';

import { initDropdown } from '../packages/dropdown/dropdown.js';
import { toast } from '../packages/toast/toast.js';
import { clipboard, initColor } from '../packages/Utils/index.ts';


// Import dynamique de tous les fichiers HTML des packages (Vite Magic)
const allHtmlFragments = import.meta.glob('../packages/**/*.html', { query: '?raw', import: 'default' });
const allMarkdownFiles = import.meta.glob(['../packages/**/*.md', '../docs/**/*.md'], { query: '?raw', import: 'default' });
const allJsFilesRaw = import.meta.glob(['../packages/**/*.js', '../packages/**/*.ts'], { query: '?raw', import: 'default' });
const allJsModules = import.meta.glob('../packages/**/*.{js,ts}');
const allTemplates = import.meta.glob('./templates/*.html', { query: '?raw', import: 'default' });
const allPages = import.meta.glob('./pages/*.html', { query: '?raw', import: 'default' });
const allSidebar = import.meta.glob('../packages/sidebar/sidebar.html', { query: '?raw', import: 'default' });

/**
 * Récupère un fragment HTML depuis les imports glob
 */
async function getAsset(path, type = 'html') {
  let glob;
  let fullPath = path;

  if (path.startsWith('templates/')) {
    glob = allTemplates;
    fullPath = `./${path}`;
  } else if (path.startsWith('pages/')) {
    glob = allPages;
    fullPath = `./${path}`;
  } else if (path.includes('../packages/')) {
    glob = type === 'md' ? allMarkdownFiles : allHtmlFragments;
    fullPath = path;
  } else {
    // Fallback pour les chemins relatifs aux packages
    glob = type === 'md' ? allMarkdownFiles : allHtmlFragments;
    fullPath = `../packages/${path}`;
  }

  if (glob[fullPath]) {
    return await glob[fullPath]();
  }

  // Cas particulier pour la sidebar
  if (path.includes('sidebar.html') && allSidebar['../packages/sidebar/sidebar.html']) {
    return await allSidebar['../packages/sidebar/sidebar.html']();
  }

  console.error(`Asset non trouvé: ${fullPath}`);
  return '';
}


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

  const blockTemplate = await getAsset('templates/template-block.html');
  let pageHtml = '';

  for (const key of componentKeys) {
    const filename = key.split('/').pop().replace('.html', '');
    const label = filename === baseFolderName ? 'Défaut' : filename.replace(`${baseFolderName}-`, '').replace(/-/g, ' ');
    const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);

    pageHtml += await wrapInBlock(key, route, displayLabel);
  }

  return pageHtml;
}

/**
 * Enveloppe un fragment HTML dans le template de bloc avec son code source (HTML + JS)
 */
async function wrapInBlock(key, route, label) {
  const folderParts = route.package.split('/').slice(1);
  const folderName = folderParts.join('/');
  const baseFolderName = folderParts.pop();

  const blockTemplate = await getAsset('templates/template-block.html');
  const rawHtml = await allHtmlFragments[key]();

  // Config: show code preview?
  const showCode = route.showCode !== false && route.zuii?.showCode !== false;
  const codeVisibleClass = showCode ? '' : 'is-hidden';

  // Check if a demo file exists for the code preview
  const demoKey = key.replace('.html', '-demo.html');
  let codeToDisplay = rawHtml;
  if (allHtmlFragments[demoKey]) {
    codeToDisplay = await allHtmlFragments[demoKey]();
  }

  // Check if a JS or TS init file exists for this fragment
  const tsInitKey = key.replace('.html', '-init.ts');
  const jsInitKey = key.replace('.html', '-init.js');
  const mainTsKey = `../packages/${folderName}/js/${baseFolderName}.ts`;
  const mainJsKey = `../packages/${folderName}/js/${baseFolderName}.js`;

  let jsContent = '';
  let jsVisibleClass = 'is-hidden';

  const potentialJsKeys = [tsInitKey, jsInitKey, mainTsKey, mainJsKey];
  for (const jsKey of potentialJsKeys) {
    if (allJsFilesRaw[jsKey]) {
      jsContent = await allJsFilesRaw[jsKey]();
      jsVisibleClass = '';
      break;
    }
  }

  const htmlDescription = route.descriptions?.html || '';
  const jsDescription = route.descriptions?.js || '';

  return blockTemplate
    .replaceAll('{{displayLabel}}', label)
    .replaceAll('{{content}}', rawHtml)
    .replaceAll('{{codeVisibleClass}}', codeVisibleClass)
    .replaceAll('{{jsContent}}', jsContent)
    .replaceAll('{{jsVisibleClass}}', jsVisibleClass)
    .replaceAll('{{htmlDescription}}', htmlDescription)
    .replaceAll('{{htmlDescVisibleClass}}', htmlDescription ? '' : 'is-hidden')
    .replaceAll('{{jsDescription}}', jsDescription)
    .replaceAll('{{jsDescVisibleClass}}', (jsContent && jsDescription) ? '' : 'is-hidden')
    .replaceAll('{{escapedContent}}', escapeHtml(codeToDisplay));
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
  let folderPath = '';
  let baseName = '';
  let pageHtml = '';
  let docHtml = '';

  if (route.isDoc) {
    // Cas spécial pour les pages de documentation pure
    try {
      const mdText = await allMarkdownFiles[route.mdPath]();
      docHtml = renderMarkdown(mdText);
    } catch (e) {
      console.error(`Erreur rendu Markdown Doc pour ${routeId}:`, e);
    }
    pageHtml = '<section class="pg-section" style="padding: 0;"></section>'; // Conteneur vide pour le layout
  } else {
    // Cas standard pour les composants
    const folderParts = route.package.split('/').slice(1);
    folderPath = folderParts.join('/');
    baseName = folderParts.pop();

    pageHtml = route.page ? await wrapInBlock(route.page, route, 'Aperçu') : await generateGenericHtml(route);

    // Récupérer et parser le Markdown si présent
    try {
      const mdPath = `../packages/${folderPath}/${baseName}.md`;
      if (allMarkdownFiles[mdPath]) {
        let mdText = await allMarkdownFiles[mdPath]();

        // Injection dynamique de code via {{CODE:filename}}
        const codeRegex = /{{CODE:([^}]+)}}/g;
        const matches = [...mdText.matchAll(codeRegex)];

        for (const match of matches) {
          const placeholder = match[0];
          const filename = match[1];
          const jsPath = `../packages/${folderPath}/${filename}`;

          if (allJsFilesRaw[jsPath]) {
            const jsCode = await allJsFilesRaw[jsPath]();
            const ext = filename.split('.').pop();
            const lang = ext === 'js' ? 'javascript' : ext;
            mdText = mdText.replace(placeholder, `\`\`\`${lang}\n${jsCode}\n\`\`\``);
          }
        }

        // Rétrocompatibilité pour {{PACKAGE_JS}}
        const jsPathDefault = `../packages/${folderPath}/${baseName}.js`;
        if (mdText.includes('{{PACKAGE_JS}}') && allJsFilesRaw[jsPathDefault]) {
          const jsCode = await allJsFilesRaw[jsPathDefault]();
          mdText = mdText.replace('{{PACKAGE_JS}}', `\`\`\`javascript\n${jsCode}\n\`\`\``);
        }

        docHtml = renderMarkdown(mdText);
      }
    } catch (e) {
      console.error(`Erreur rendu Markdown pour ${routeId}:`, e);
      console.warn(`Pas de documentation trouvée pour ${routeId}`);
    }
  }

  const paginationHtml = generatePagination(routeId);

  // 4. Injecter dans le template principal
  let pageTemplate = await getAsset('templates/template-page.html');
  const description = route.descriptions?.general || '';
  const hasDescription = !!description;

  // Gérer le bloc conditionnel simple {{#if hasDescription}}
  if (hasDescription) {
    pageTemplate = pageTemplate
      .replace('{{#if hasDescription}}', '')
      .replace('{{/if}}', '')
      .replaceAll('{{description}}', description);
  } else {
    pageTemplate = pageTemplate.replace(/{{#if hasDescription}}[\s\S]*?{{\/if}}/, '');
  }

  viewContainer.innerHTML = pageTemplate
    .replaceAll('{{routeId}}', routeId)
    .replaceAll('{{title}}', route.title)
    .replaceAll('{{package}}', route.package || '')
    .replaceAll('{{installVisibleClass}}', route.isDoc ? 'is-hidden' : '')
    .replaceAll('{{pageHtml}}', pageHtml)
    .replaceAll('{{docHtml}}', docHtml)
    .replaceAll('{{paginationHtml}}', paginationHtml);

  // 3. Injecter les modals globaux si présents
  modalsContainer.innerHTML = route.modals || '';

  // 4. Charger les [data-fetch] (uniquement pour templates custom)
  if (route.page) {
    const fetchElements = document.querySelectorAll('[data-fetch]');
    const fetchPromises = Array.from(fetchElements).map(async (el) => {
      el.innerHTML = await getAsset(el.getAttribute('data-fetch'));
    });
    await Promise.all(fetchPromises);
  }

  // 5. Initialiser les interactions
  initDropdown();
  clipboard.init(viewContainer);
  if (routeId === 'color') initColor(viewContainer);

  // 6. Charger le script spécifique au composant s'il existe
  // On vérifie d'abord dans le glob (résolu par Vite) pour éviter les 404 réseau.
  const packageBaseForScript = (route.package || '').replace('@zuii/', '');

  const initScripts = [
    `../packages/${packageBaseForScript}/${baseName}-init.ts`,
    `../packages/${packageBaseForScript}/js/${baseName}-init.ts`,
    `../packages/${packageBaseForScript}/js/${baseName}.ts`,
    `../packages/${packageBaseForScript}/${baseName}.ts`,
    `../packages/${packageBaseForScript}/js/${baseName}.js`,
    `../packages/${packageBaseForScript}/${baseName}.js`,
    `../packages/${packageBaseForScript}/${baseName}-init.js`
  ];

  for (const scriptPath of initScripts) {
    if (!allJsModules[scriptPath]) continue; // fichier inexistant → pas de requête réseau
    try {
      const componentModule = await allJsModules[scriptPath]();
      if (componentModule.init) {
        componentModule.init(viewContainer);
        break;
      }
    } catch (e) {
      console.warn(`Erreur init script ${scriptPath}:`, e);
    }
  }

  if (window.Prism) {
    viewContainer.querySelectorAll('pre.pg-code code[class*="language-"]').forEach(el => {
      Prism.highlightElement(el);
    });
    // Debug: check if tokens were generated
    viewContainer.querySelectorAll('pre.pg-code code[class*="language-"]').forEach(el => {
      const lang = el.className.replace('language-', '').split(' ')[0];
      const hasTokens = el.querySelector('.token') !== null;
      console.log(`[${lang}] tokens generated: ${hasTokens}, innerHTML length: ${el.innerHTML.length}`);
    });
  }
  if (window.lucide) window.lucide.createIcons();

  updateSidebarActive(routeId);
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
    const sidebarHtml = await getAsset('../packages/sidebar/sidebar.html');
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
  
  initTabs();
  initCollapse();
  initSidebarDropdowns();
}

/**
 * Gestion du repliage des blocs de code (Tabs)
 */
function initCollapse() {
  document.body.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-js-tabs-toggle]');
    if (!toggle) return;

    const container = toggle.closest('[data-js-tabs-container]');
    if (container) {
      const isCollapsed = container.classList.toggle('is-collapsed');
      const textEl = container.querySelector('[data-js-toggle-text]');
      if (textEl) {
        textEl.textContent = isCollapsed ? 'Afficher le code source' : 'Masquer le code source';
      }
    }
  });
}

/**
 * Gestion du changement d'onglets
 */
function initTabs() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.pg-tab-btn');
    if (!btn) return;

    const container = btn.closest('.pg-demo-block');
    const tabName = btn.getAttribute('data-tab');

    // 1. Désactiver tous les onglets du bloc
    container.querySelectorAll('.pg-tab-btn').forEach(b => b.classList.remove('is-active'));
    container.querySelectorAll('.pg-tab-pane').forEach(p => p.classList.remove('is-active'));

    // 2. Activer l'onglet sélectionné
    btn.classList.add('is-active');
    const pane = container.querySelector(`[data-tab-content="${tabName}"]`);
    if (pane) pane.classList.add('is-active');

    // 3. Auto-déplier si c'est replié
    const tabsContainer = btn.closest('[data-js-tabs-container]');
    if (tabsContainer && tabsContainer.classList.contains('is-collapsed')) {
      tabsContainer.classList.remove('is-collapsed');
      const textEl = tabsContainer.querySelector('[data-js-toggle-text]');
      if (textEl) textEl.textContent = 'Masquer le code source';
    }
  });
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

/**
 * Gestion des menus déroulants de la sidebar
 */
function initSidebarDropdowns() {
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-js-dropdown-trigger]');
    if (!trigger) return;

    const dropdown = trigger.closest('[data-js-sidebar-dropdown]');
    if (dropdown) {
      dropdown.classList.toggle('is-open');
    }
  });
}

init();

