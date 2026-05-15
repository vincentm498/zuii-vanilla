import { CheckoutAddressManager } from './CheckoutAddressManager';
import { CheckoutShippingManager } from './CheckoutShippingManager';

type StepName = 'address' | 'shipping' | 'payment' | 'validation';

/**
 * Orchestrateur principal du checkout.
 * Gère la progression entre les étapes (adresse → livraison → paiement → validation).
 */
export class Checkout {
  private container: HTMLElement;
  private steps: NodeListOf<HTMLElement>;
  private stepLinks: NodeListOf<HTMLAnchorElement>;
  private currentStep: StepName = 'address';
  private cartToggle: HTMLElement | null;
  private cartCollapse: HTMLElement | null;
  private addressManager: CheckoutAddressManager;
  private shippingManager: CheckoutShippingManager;

  /**
   * @param container - Élément racine du composant checkout.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.steps = container.querySelectorAll('[data-js-checkout-panel]');
    this.stepLinks = container.querySelectorAll('[data-js-step-link]');
    this.cartToggle = container.querySelector('[data-js-cart-toggle]');
    this.cartCollapse = container.querySelector('[data-js-cart-collapse]');
    this.addressManager = new CheckoutAddressManager(container);
    this.shippingManager = new CheckoutShippingManager(container);
    this.init();
  }

  /** Initialise la navigation entre étapes et les sous-gestionnaires. */
  private init(): void {
    this.initStepNavigation();
    this.initCartToggle();
    this.addressManager.init();
    this.shippingManager.init();

    const addressForm = this.container.querySelector<HTMLFormElement>('[data-js-address-form]');
    addressForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.goToStep('shipping');
    });

    const shippingForm = this.container.querySelector<HTMLFormElement>('[data-js-shipping-form]');
    shippingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.goToStep('payment');
    });

    const paymentForm = this.container.querySelector<HTMLFormElement>('[data-js-payment-form]');
    paymentForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.goToStep('validation');
    });

    this.container.querySelector('[data-js-back-cart]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.dispatch('checkout:back-to-cart');
    });

    this.container.querySelector('[data-js-back-address]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goToStep('address');
    });

    this.container.querySelector('[data-js-back-shipping]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.goToStep('shipping');
    });

    this.container.dataset.initialized = 'true';
  }

  /** Attache les événements de navigation par étapes. */
  private initStepNavigation(): void {
    this.stepLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const step = link.getAttribute('data-js-step-link') as StepName;
        if (step) this.goToStep(step);
      });
    });
  }

  /** Bascule l'affichage du récapitulatif du panier (mobile). */
  private initCartToggle(): void {
    this.cartToggle?.addEventListener('click', () => {
      this.cartCollapse?.classList.toggle('checkout__cart--open');
      if (this.cartToggle) {
        this.cartToggle.textContent = this.cartCollapse?.classList.contains('checkout__cart--open')
          ? 'Masquer le panier'
          : 'Voir mon panier';
      }
    });
  }

  /**
   * Navigue vers une étape du checkout.
   * @param stepName - Nom de l'étape cible.
   */
  public goToStep(stepName: StepName): void {
    this.currentStep = stepName;

    this.steps.forEach(s => s.classList.remove('checkout__panel--active'));
    this.stepLinks.forEach(l => {
      l.classList.remove('checkout__step--active');
      l.classList.remove('checkout__step--completed');
    });

    const activePanel = this.container.querySelector<HTMLElement>(`[data-js-checkout-panel="${stepName}"]`);
    if (activePanel) activePanel.classList.add('checkout__panel--active');

    const stepOrder: StepName[] = ['address', 'shipping', 'payment', 'validation'];
    const currentIndex = stepOrder.indexOf(stepName);

    stepOrder.forEach((name, index) => {
      const link = this.container.querySelector<HTMLAnchorElement>(`[data-js-step-link="${name}"]`);
      if (!link) return;

      if (name === stepName) {
        link.classList.add('checkout__step--active');
      } else if (index < currentIndex) {
        link.classList.add('checkout__step--completed');
      }
    });

    this.dispatch('checkout:step-change', { step: stepName });
  }

  /**
   * Dispatch un événement personnalisé sur le conteneur.
   * @param event - Nom de l'événement.
   * @param detail - Données optionnelles.
   */
  private dispatch(event: string, detail?: unknown): void {
    this.container.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      detail,
    }));
  }

  /**
   * Retourne l'élément racine.
   * @returns L'élément HTMLElement du conteneur.
   */
  public getContainer(): HTMLElement {
    return this.container;
  }
}

/**
 * Point d'entrée pour l'initialisation du checkout.
 * @param container - Élément racine ou conteneur du composant.
 */
export function init(container: HTMLElement = document.body): void {
  if (container.hasAttribute('data-js-checkout')) {
    new Checkout(container);
    return;
  }

  const checkoutEls = container.querySelectorAll<HTMLElement>('[data-js-checkout]');
  checkoutEls.forEach(el => new Checkout(el));
}
