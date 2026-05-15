interface CustomerData {
  lastname?: string;
  firstname?: string;
  email?: string;
  customerGroup?: { name?: string; code?: string; fields?: Array<{ code: string; name: string; value?: string; required?: boolean }> };
  birthday?: string;
  [key: string]: unknown;
}

/**
 * Gestionnaire du formulaire d'informations personnelles du compte client.
 * Peuple les champs, gère les champs personnalisés du groupe client
 * et dispatche les événements de mise à jour.
 */
export class AccountInfoManager {
  private container: HTMLElement;
  private form: HTMLFormElement | null;
  private fields: Record<string, HTMLInputElement> = {};
  private customFieldsContainer: HTMLElement | null;

  /**
   * @param container - Élément racine contenant le formulaire d'informations.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.form = container.querySelector('[data-js-info-form]');
    this.customFieldsContainer = container.querySelector('[data-js-info-custom-fields]');
  }

  /**
   * Initialise le gestionnaire : mise en cache des champs, population et events.
   * @param data - Données client optionnelles pour pré-remplir le formulaire.
   */
  init(data?: CustomerData): void {
    if (!this.form) return;
    this.cacheFields();
    this.populate(data);
    this.bindEvents();
  }

  /** Met en cache tous les champs data-js-info-field dans le dictionnaire fields. */
  private cacheFields(): void {
    const inputs = this.container.querySelectorAll<HTMLInputElement>('[data-js-info-field]');
    inputs.forEach(input => {
      const name = input.getAttribute('data-js-info-field');
      if (name) this.fields[name] = input;
    });
  }

  /**
   * Remplit les champs du formulaire avec les données client.
   * @param data - Données client.
   */
  private populate(data?: CustomerData): void {
    if (!data) return;

    if (data.lastname && this.fields.lastname) this.fields.lastname.value = data.lastname;
    if (data.firstname && this.fields.firstname) this.fields.firstname.value = data.firstname;
    if (data.email && this.fields.email) this.fields.email.value = data.email;
    if (data.customerGroup?.name && this.fields.customerGroup) this.fields.customerGroup.value = data.customerGroup.name;
    if (data.birthday && this.fields.birthday) this.fields.birthday.value = data.birthday;

    if (data.customerGroup?.fields && this.customFieldsContainer) {
      this.renderCustomFields(data.customerGroup.fields);
    }
  }

  /**
   * Génère dynamiquement les champs personnalisés du groupe client.
   * @param fields - Liste des champs personnalisés à afficher.
   */
  private renderCustomFields(fields: Array<{ code: string; name: string; value?: string; required?: boolean }>): void {
    if (!this.customFieldsContainer) return;

    fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'account-info__group';

      const label = document.createElement('label');
      label.className = 'account-info__label';
      label.htmlFor = `info-${field.code}`;
      label.textContent = field.name;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `info-${field.code}`;
      input.name = field.code;
      input.className = 'account-info__input';
      input.value = field.value || '';
      if (field.required) input.required = true;

      group.appendChild(label);
      group.appendChild(input);
      this.customFieldsContainer?.appendChild(group);
    });
  }

  /** Attache l'événement submit pour dispatcher les données du formulaire. */
  private bindEvents(): void {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.form!);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
      this.dispatch('info:update', data);
    });
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
