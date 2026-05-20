import { marked } from 'marked';
import { escapeHtml } from './utils.js';

/**
 * Support des classes dans le Markdown : {.ma-classe}
 * Cette extension détecte le pattern {.class1 .class2} et génère un marqueur HTML temporaire.
 */
marked.use({
  renderer: {
    code({ text, lang }) {
      const langClass = lang ? `language-${lang}` : '';
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `<pre class="pg-code ${langClass}" tabindex="0"><code class="${langClass}">${escaped}</code></pre>\n`;
    }
  },
  extensions: [{
    name: 'classAttr',
    level: 'inline',
    start(src) { return src.indexOf('{'); },
    tokenizer(src) {
      const match = src.match(/^\{:?((?:\s*\.[a-z0-9_-]+)+)\s*\}/i);
      if (match) {
        const classes = match[1].trim().split(/\s+/).map(c => c.substring(1));
        return { type: 'classAttr', raw: match[0], className: classes.join(' ') };
      }
    },
    renderer(token) {
      return `<span class="js-md-class" data-class="${token.className}"></span>`;
    }
  }]
});

/**
 * Parse le Markdown et applique les classes détectées aux éléments parents.
 * @param {string} mdText - Le texte Markdown à transformer
 * @returns {string} Le HTML final avec les classes appliquées
 */
export function renderMarkdown(mdText) {
  const html = marked.parse(mdText);
  
  try {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const markers = temp.querySelectorAll('.js-md-class');
    
    markers.forEach(marker => {
      const className = marker.getAttribute('data-class');
      if (!className) return;
      
      const parent = marker.parentElement;
      if (!parent) return;

      // Si le marqueur est seul dans un paragraphe (ex: après un tableau ou un bloc)
      const isAlone = parent.tagName === 'P' && (parent.textContent.trim() === '' || parent.childNodes.length === 1);

      if (isAlone) {
        // On essaie d'appliquer la classe à l'élément précédent (ex: table, pre, etc.)
        const target = parent.previousElementSibling;
        if (target) {
          className.split(' ').filter(Boolean).forEach(c => target.classList.add(c));
          parent.remove();
        } else {
          // Sinon on l'applique au paragraphe lui-même
          className.split(' ').filter(Boolean).forEach(c => parent.classList.add(c));
          marker.remove();
        }
      } else {
        // Cas standard : on applique au parent direct (h1, p, li, etc.)
        className.split(' ').filter(Boolean).forEach(c => parent.classList.add(c));
        marker.remove();
      }
    });
    
    return temp.innerHTML;
  } catch (e) {
    console.error('renderMarkdown processing error:', e);
    return html;
  }
}
