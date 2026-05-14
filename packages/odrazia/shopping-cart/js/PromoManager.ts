import { ShoppingCart } from './shopping-cart';
import { TotalsCalculator } from './TotalsCalculator';

/**
 * Gère le cycle de vie des promotions (ajout et suppression).
 */
export class PromoManager {
  /**
   * @param cart - Instance parente du ShoppingCart.
   */
  constructor(private cart: ShoppingCart) {}

  /**
   * Initialise le formulaire de code promo et les boutons de suppression existants.
   */
  public init(): void {
    const container = this.cart.getContainer();

    // Formulaire de code promo
    const form = container.querySelector<HTMLFormElement>('[data-js-promo-form]');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector<HTMLInputElement>('input[name="code"]');
        if (input && input.value.trim()) {
          this.addPromo(input.value.trim().toUpperCase());
          input.value = '';
          this.cart.update();
        }
      });
    }

    // Délégation d'événement pour les boutons de suppression de promo
    // Couvre les boutons existants ET ceux ajoutés dynamiquement
    container.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-js-promo-delete]');
      if (btn) {
        const item = btn.closest<HTMLElement>('.cart__promo-item');
        if (item) this.handleDelete(e as MouseEvent, item);
      }
    });
  }

  /**
   * Ajoute une nouvelle promotion en clonant le template HTML.
   * @param code - Le code promotionnel à ajouter.
   */
  private addPromo(code: string): void {
    const list = this.cart.getContainer().querySelector('[data-js-promo-list]');
    const template = this.cart.getContainer().querySelector<HTMLTemplateElement>('[data-js-template-promo]');
    
    if (!list || !template) return;

    const clone = template.content.cloneNode(true) as DocumentFragment;
    const li = clone.querySelector('li')!;
    
    const codeEl = clone.querySelector('[data-js-promo-code-view]');
    const amountEl = clone.querySelector('[data-js-promo-amount-view]');
    const deleteBtn = clone.querySelector<HTMLElement>('[data-js-promo-delete]');

    if (codeEl) codeEl.textContent = code;
    if (amountEl) amountEl.textContent = '-10%';
    // Pas besoin de listener ici : la délégation dans init() couvre les items dynamiques

    list.appendChild(clone);
  }

  /**
   * Supprime une promotion du DOM et met à jour les totaux.
   * @param e - L'événement de clic.
   * @param item - L'élément de liste de la promotion à supprimer.
   */
  private handleDelete(e: MouseEvent, item: HTMLElement): void {
    e.preventDefault();
    item.remove();
    this.cart.update();
  }
}
