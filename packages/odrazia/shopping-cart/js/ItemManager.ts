import { ShoppingCart } from './shopping-cart';

/**
 * Gère les interactions liées aux articles du panier (quantités, suppressions).
 */
export class ItemManager {
  /**
   * @param cart - Instance parente du ShoppingCart.
   */
  constructor(private cart: ShoppingCart) {}

  /**
   * Initialise les écouteurs d'événements sur les formulaires d'articles et les boutons de step.
   */
  public init(): void {
    const container = this.cart.getContainer();
    
    // Mise à jour des quantités via formulaire
    container.querySelectorAll<HTMLFormElement>('[data-js-item-update]').forEach(form => {
      form.addEventListener('submit', (e) => this.handleUpdate(e, form));
      
      const input = form.querySelector<HTMLInputElement>('input[name="quantity"]');
      if (input) {
        let timer: any;
        input.addEventListener('input', () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }, 500);
        });
      }
    });

    // Suppression d'articles
    container.querySelectorAll<HTMLFormElement>('[data-js-item-delete]').forEach(form => {
      form.addEventListener('submit', (e) => this.handleDelete(e, form));
    });

    // Boutons de changement de quantité (+/-) - Utilisation de addEventListener pour plus de fiabilité
    container.querySelectorAll<HTMLElement>('[data-js-number-increment]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleStep(e as MouseEvent, btn, 1));
    });
    container.querySelectorAll<HTMLElement>('[data-js-number-decrement]').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleStep(e as MouseEvent, btn, -1));
    });
  }

  /**
   * Gère la soumission du formulaire de mise à jour d'un article.
   * @param e - L'événement de soumission.
   * @param form - Le formulaire concerné.
   */
  private handleUpdate(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    const item = form.closest('.cart-item');
    const input = form.querySelector<HTMLInputElement>('input[name="quantity"]');
    if (item && input) {
      const priceStr = item.querySelector('.current-price')?.textContent || '0';
      const price = parseFloat(priceStr.replace(',', '.'));
      const qty = parseInt(input.value);
      const totalEl = item.querySelector('.cart-item__total span');
      if (totalEl) {
        totalEl.textContent = (price * qty).toFixed(2).replace('.', ',') + ' €';
      }
      this.cart.update();
    }
  }

  /**
   * Gère la suppression d'un article avec une animation de fondu.
   * @param e - L'événement de soumission.
   * @param form - Le formulaire de suppression.
   */
  private handleDelete(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    const item = form.closest<HTMLElement>('.cart-item');
    if (item) {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
      setTimeout(() => {
        item.remove();
        this.cart.update();
      }, 300);
    }
  }

  /**
   * Gère le clic sur les boutons d'incrémentation/décrémentation.
   * @param e - L'événement de clic.
   * @param btn - Le bouton cliqué.
   * @param step - La valeur à ajouter (1 ou -1).
   */
  private handleStep(e: MouseEvent, btn: HTMLElement, step: number): void {
    e.preventDefault();
    const selector = btn.getAttribute(step > 0 ? 'data-js-number-increment' : 'data-js-number-decrement');
    if (selector) {
      const input = this.cart.getContainer().querySelector<HTMLInputElement>(selector);
      if (input) {
        const val = parseInt(input.value) + step;
        if (val >= 1) {
          input.value = val.toString();
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }
}
