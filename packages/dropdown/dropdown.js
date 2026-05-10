/**
 * @zuii/dropdown — dropdown.js
 * Gestion des événements d'ouverture/fermeture des dropdowns
 */

export function initDropdown() {
  // Toggle dropdown on trigger click
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-dropdown-trigger]');

    if (trigger) {
      const dropdown = trigger.closest('.dropdown');
      if (!dropdown) return;
      const isOpen = dropdown.classList.contains('is-open');

      // Close all open dropdowns first
      closeAllDropdowns();

      // Toggle current
      if (!isOpen) openDropdown(dropdown);
      return;
    }

    // Click outside → close all
    if (!e.target.closest('.dropdown.is-open')) {
      closeAllDropdowns();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  // Close when an item is clicked (unless data-keep-open)
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown__item');
    if (item && !item.dataset.keepOpen) {
      const dropdown = item.closest('.dropdown');
      if (dropdown) closeDropdown(dropdown);
    }
  });
}

export function openDropdown(dropdown) {
  if (typeof dropdown === 'string') dropdown = document.querySelector(dropdown);
  if (!dropdown) return;
  dropdown.classList.add('is-open');
  dropdown.dispatchEvent(new CustomEvent('dropdown:open', { bubbles: true }));
}

export function closeDropdown(dropdown) {
  if (typeof dropdown === 'string') dropdown = document.querySelector(dropdown);
  if (!dropdown) return;
  dropdown.classList.remove('is-open');
  dropdown.dispatchEvent(new CustomEvent('dropdown:close', { bubbles: true }));
}

export function closeAllDropdowns() {
  document.querySelectorAll('.dropdown.is-open').forEach(closeDropdown);
}
