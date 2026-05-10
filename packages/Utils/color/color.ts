/**
 * Script spécifique au composant Color
 * Remplit automatiquement les valeurs Hexa à partir des styles calculés
 */
export function init(container = document) {
  // On attend un frame pour s'assurer que le DOM est peint et les styles calculés
  requestAnimationFrame(() => {
    const colorValues = container.querySelectorAll('.color__value');

    colorValues.forEach(span => {
      const parent = span.closest('.color');
      if (!parent) return;

      // Récupère la couleur de fond calculée par le navigateur
      const rgb = window.getComputedStyle(parent).backgroundColor;
      
      // Conversion simple RGB vers HEX
      const hex = rgbToHex(rgb);
      span.textContent = hex;
    });
  });
}

/**
 * Convertit une string rgb(r, g, b) en #RRGGBB
 */
function rgbToHex(rgb) {
  const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!parts) return rgb; // Retourne l'original si format inattendu (ex: rgba ou déjà hex)
  
  const r = parseInt(parts[1]);
  const g = parseInt(parts[2]);
  const b = parseInt(parts[3]);
  
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
