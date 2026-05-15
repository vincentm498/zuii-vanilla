/**
 * Gestionnaire des adresses dans le checkout.
 * Gère la sélection d'adresse de livraison différente de la facturation.
 */
export class CheckoutAddressManager {
  private container: HTMLElement;
  private sameAddrCheckbox: HTMLInputElement | null;
  private deliveryGroup: HTMLElement | null;

  /**
   * @param container - Élément racine du checkout.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.sameAddrCheckbox = container.querySelector('[data-js-same-address]');
    this.deliveryGroup = container.querySelector('[data-js-delivery-group]');
  }

  /** Initialise les événements de gestion d'adresses. */
  init(): void {
    this.sameAddrCheckbox?.addEventListener('change', () => {
      this.toggleDeliveryAddress();
    });

    const addBtn = this.container.querySelector('[data-js-address-add]');
    addBtn?.addEventListener('click', () => {
      this.dispatch('checkout:address-add');
    });

    const editInvoiceBtn = this.container.querySelector('[data-js-address-edit-invoice]');
    editInvoiceBtn?.addEventListener('click', () => {
      this.dispatch('checkout:address-edit', { type: 'invoice' });
    });

    const editDeliveryBtn = this.container.querySelector('[data-js-address-edit-delivery]');
    editDeliveryBtn?.addEventListener('click', () => {
      this.dispatch('checkout:address-edit', { type: 'delivery' });
    });
  }

  /** Affiche ou masque le champ d'adresse de livraison. */
  private toggleDeliveryAddress(): void {
    if (!this.deliveryGroup || !this.sameAddrCheckbox) return;
    this.deliveryGroup.style.display = this.sameAddrCheckbox.checked ? 'none' : '';
  }

  /**
   * Dispatch un événement personnalisé.
   * @param event - Nom de l'événement.
   * @param detail - Données optionnelles.
   */
  private dispatch(event: string, detail?: unknown): void {
    this.container.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      detail,
    }));
  }
}
