import { ItemManager } from './ItemManager';
import { PromoManager } from './PromoManager';
import { TotalsCalculator } from './TotalsCalculator';

/**
 * Orchestrateur principal du panier d'achat.
 */
export class ShoppingCart {
  private container: HTMLElement;
  private itemManager: ItemManager;
  private promoManager: PromoManager;

  constructor(container: HTMLElement) {
    this.container = container;
    this.itemManager = new ItemManager(this);
    this.promoManager = new PromoManager(this);
    this.init();
  }

  private init(): void {
    // Initialisation des gestionnaires
    this.itemManager.init();
    this.promoManager.init();
    
    // Premier calcul global
    this.update();
    
    // Marquer comme initialisé pour le debug
    this.container.dataset.initialized = 'true';
  }

  public update(): void {
    try {
      TotalsCalculator.calculate(this.container);
      this.checkEmpty();
    } catch (e) {
      console.error('ZUII Cart Update Error:', e);
    }
  }

  private checkEmpty(): void {
    const body = this.container.querySelector('.cart__body');
    // On cherche TOUS les conteneurs de contenu (pour supporter le layout V2 à deux colonnes)
    const contents = this.container.querySelectorAll<HTMLElement>('[data-js-cart-content]');
    const emptyState = this.container.querySelector<HTMLElement>('[data-js-empty-state]');
    
    if (body && body.children.length === 0 && contents.length > 0 && emptyState) {
      contents.forEach(c => c.style.display = 'none');
      emptyState.style.display = 'block';
    }
  }

  public getContainer(): HTMLElement {
    return this.container;
  }
}

/**
 * Point d'entrée pour le playground.
 */
export function init(container: HTMLElement = document.body): void {
  // Si le conteneur lui-même est un panier, on l'initialise directement
  if (container.hasAttribute('data-js-cart')) {
    new ShoppingCart(container);
    return;
  }

  // On cherche TOUS les paniers dans le conteneur (V1, V2, etc.)
  const cartEls = container.querySelectorAll<HTMLElement>('[data-js-cart]');
  cartEls.forEach(cartEl => new ShoppingCart(cartEl));
}
