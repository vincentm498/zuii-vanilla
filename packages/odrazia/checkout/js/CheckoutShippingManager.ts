/**
 * Gestionnaire des méthodes de livraison dans le checkout.
 * Affiche/masque les champs spécifiques (ex: point relais) selon la méthode choisie.
 */
export class CheckoutShippingManager {
  private container: HTMLElement;
  private relayField: HTMLElement | null;
  private relayPhone: HTMLInputElement | null;
  private shippingRadios: NodeListOf<HTMLInputElement>;

  /**
   * @param container - Élément racine du checkout.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.relayField = container.querySelector('[data-js-relay-field]');
    this.relayPhone = container.querySelector('[data-js-relay-phone]');
    this.shippingRadios = container.querySelectorAll('[data-js-shipping-method]');
  }

  /** Initialise les événements de changement de méthode de livraison. */
  init(): void {
    this.shippingRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        const code = radio.getAttribute('data-code');
        this.toggleRelay(code === 'mondial-relay');
      });
    });
  }

  /**
   * Affiche ou masque le champ de point relais.
   * @param show - true pour afficher le champ relais.
   */
  private toggleRelay(show: boolean): void {
    if (!this.relayField) return;
    this.relayField.style.display = show ? '' : 'none';
    if (this.relayPhone) this.relayPhone.required = show;
  }
}
