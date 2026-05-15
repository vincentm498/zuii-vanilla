interface AddressData {
  id?: string | number;
  name: string;
  address: string;
  addressCompl?: string;
  postcode: string;
  city: string;
  [key: string]: unknown;
}

/**
 * Gestionnaire des adresses du compte client.
 * Affiche la liste paginée, permet l'ajout, l'édition et la suppression d'adresses.
 */
export class AccountAddressManager {
  private container: HTMLElement;
  private body: HTMLElement | null;
  private emptyState: HTMLElement | null;
  private tableWrapper: HTMLElement | null;
  private rowTemplate: HTMLTemplateElement | null;
  private formTemplate: HTMLTemplateElement | null;
  private paginationEl: HTMLElement | null;
  private currentPage = 1;
  private totalPages = 1;
  private addresses: AddressData[] = [];
  private hasStaticContent = false;

  /**
   * @param container - Élément racine contenant la section adresses.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.body = container.querySelector('[data-js-addresses-body]');
    this.emptyState = container.querySelector('[data-js-addresses-empty]');
    this.tableWrapper = container.querySelector('[data-js-addresses-table]');
    this.rowTemplate = container.querySelector('[data-js-template-address-row]');
    this.formTemplate = container.querySelector('[data-js-template-address-form]');
    this.paginationEl = container.querySelector('[data-js-addresses-pagination]');
  }

  /**
   * Initialise le gestionnaire avec les données d'adresses.
   * @param data - Liste des adresses à afficher.
   */
  init(data?: AddressData[]): void {
    this.addresses = data || [];

    if (this.body && this.body.children.length > 0) {
      this.hasStaticContent = true;
      if (this.emptyState) this.emptyState.style.display = 'none';
      if (this.tableWrapper) this.tableWrapper.style.display = '';
    } else {
      this.render();
    }

    const addBtn = this.container.querySelector('[data-js-address-add]');
    addBtn?.addEventListener('click', () => this.showForm());
  }

  /** Met à jour l'affichage : tableau ou état vide selon les données. */
  private render(): void {
    if (this.addresses.length === 0) {
      if (this.emptyState) this.emptyState.style.display = '';
      if (this.tableWrapper) this.tableWrapper.style.display = 'none';
      return;
    }

    if (this.emptyState) this.emptyState.style.display = 'none';
    if (this.tableWrapper) this.tableWrapper.style.display = '';
    this.renderRows();
    this.renderPagination();
  }

  /** Génère les lignes du tableau d'adresses avec pagination. */
  private renderRows(): void {
    if (!this.body || !this.rowTemplate) return;
    this.body.innerHTML = '';

    const start = (this.currentPage - 1) * 10;
    const pageItems = this.addresses.slice(start, start + 10);

    pageItems.forEach(address => {
      const row = this.rowTemplate!.content.cloneNode(true) as DocumentFragment;

      const nameEl = row.querySelector<HTMLElement>('[data-js-address-name]');
      const fullEl = row.querySelector<HTMLElement>('[data-js-address-full]');
      const editBtn = row.querySelector<HTMLButtonElement>('[data-js-address-edit]');
      const deleteBtn = row.querySelector<HTMLButtonElement>('[data-js-address-delete]');
      const rowEl = row.querySelector<HTMLElement>('[data-js-address-row]');

      if (nameEl) nameEl.textContent = address.name;
      if (fullEl) {
        const parts = [address.address, address.addressCompl, `${address.postcode} ${address.city}`].filter(Boolean);
        fullEl.textContent = parts.join(', ');
      }

      editBtn?.addEventListener('click', () => this.editAddress(address));
      deleteBtn?.addEventListener('click', () => this.deleteAddress(address));

      if (rowEl) this.body!.appendChild(row);
    });
  }

  /** Génère les boutons de pagination. */
  private renderPagination(): void {
    if (!this.paginationEl) return;
    this.totalPages = Math.ceil(this.addresses.length / 10);

    if (this.totalPages <= 1) {
      this.paginationEl.innerHTML = '';
      return;
    }

    this.paginationEl.innerHTML = '';

    for (let i = 1; i <= this.totalPages; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn--sm ${i === this.currentPage ? 'btn--primary' : 'btn--ghost'}`;
      btn.textContent = String(i);
      btn.addEventListener('click', () => {
        this.currentPage = i;
        this.renderRows();
      });
      this.paginationEl.appendChild(btn);
    }
  }

  /**
   * Affiche le formulaire d'adresse (création ou édition).
   * @param address - Adresse à éditer (optionnel, création si omis).
   */
  private showForm(address?: AddressData): void {
    const cardBody = this.container.querySelector('[data-js-account-addresses]');
    if (!cardBody || !this.formTemplate) return;

    const existingForm = cardBody.querySelector('[data-js-address-form]');
    if (existingForm) existingForm.remove();

    const frag = this.formTemplate.content.cloneNode(true) as DocumentFragment;
    const form = frag.querySelector<HTMLFormElement>('[data-js-address-form]');

    if (!form) return;

    if (address) {
      (form.querySelector('[name="name"]') as HTMLInputElement).value = address.name;
      (form.querySelector('[name="address"]') as HTMLInputElement).value = address.address;
      (form.querySelector('[name="addressCompl"]') as HTMLInputElement).value = address.addressCompl || '';
      (form.querySelector('[name="postcode"]') as HTMLInputElement).value = address.postcode;
      (form.querySelector('[name="city"]') as HTMLInputElement).value = address.city;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data: AddressData = {
        ...(address?.id ? { id: address.id } : {}),
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        addressCompl: formData.get('addressCompl') as string,
        postcode: formData.get('postcode') as string,
        city: formData.get('city') as string,
      };

      if (address) {
        this.dispatch('address:update', data);
      } else {
        this.dispatch('address:create', data);
      }
      form.remove();
    });

    form.querySelector('[data-js-address-cancel]')?.addEventListener('click', () => form.remove());

    cardBody.prepend(form);
  }

  /**
   * Ouvre le formulaire pré-rempli pour éditer une adresse.
   * @param address - Adresse à modifier.
   */
  private editAddress(address: AddressData): void {
    this.showForm(address);
  }

  /**
   * Dispatch un événement de suppression d'adresse.
   * @param address - Adresse à supprimer.
   */
  private deleteAddress(address: AddressData): void {
    this.dispatch('address:delete', address);
  }

  /**
   * Met à jour la liste des adresses et réaffiche.
   * @param data - Nouvelle liste d'adresses.
   */
  public setAddresses(data: AddressData[]): void {
    this.addresses = data;
    this.render();
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
}
