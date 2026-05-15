import { AccountInfoManager } from './AccountInfoManager';
import { AccountAddressManager } from './AccountAddressManager';
import { AccountLoyaltyManager } from './AccountLoyaltyManager';

interface SectionData {
  [key: string]: unknown;
}

interface AccountConfig {
  sections?: SectionData;
  activation?: {
    active: boolean;
  };
}

/**
 * Orchestrateur principal du composant compte client.
 * Gère la navigation entre sections (informations, adresses, commandes, etc.)
 * et délègue aux sous-gestionnaires spécialisés.
 */
export class Account {
  private container: HTMLElement;
  private navLinks: NodeListOf<HTMLAnchorElement>;
  private sections: NodeListOf<HTMLElement>;
  private infoManager: AccountInfoManager;
  private addressManager: AccountAddressManager;
  private loyaltyManager: AccountLoyaltyManager;
  private config: AccountConfig;

  /**
   * @param container - Élément racine du composant account.
   * @param config - Configuration optionnelle (données des sections, état activation).
   */
  constructor(container: HTMLElement, config: AccountConfig = {}) {
    this.container = container;
    this.config = config;
    this.navLinks = container.querySelectorAll('[data-js-nav-link]');
    this.sections = container.querySelectorAll('[data-js-account-section]');
    this.infoManager = new AccountInfoManager(container);
    this.addressManager = new AccountAddressManager(container);
    this.loyaltyManager = new AccountLoyaltyManager(container);
    this.init();
  }

  /** Initialise la navigation et les sous-gestionnaires avec les données fournies. */
  private init(): void {
    this.initNavigation();
    this.infoManager.init(this.config.sections?.informations as Record<string, unknown> | undefined);
    this.addressManager.init(this.config.sections?.addresses as Record<string, unknown>[] | undefined);
    this.loyaltyManager.init(this.config.sections?.loyalty as Record<string, unknown> | undefined);
    this.initCopyButtons();
    this.handleActivation();
    this.container.dataset.initialized = 'true';
  }

  /** Attache les écouteurs de clic sur les liens de navigation latérale. */
  private initNavigation(): void {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-js-nav-link');
        if (!section) return;
        this.switchSection(section);
      });
    });
  }

  /**
   * Bascule la section active du compte client.
   * @param sectionName - Identifiant de la section (informations, addresses, orders, etc.).
   */
  public switchSection(sectionName: string): void {
    this.navLinks.forEach(l => l.classList.remove('account__nav-link--active'));
    this.sections.forEach(s => s.classList.remove('account__section--active'));

    const activeLink = this.container.querySelector<HTMLAnchorElement>(`[data-js-nav-link="${sectionName}"]`);
    const activeSection = this.container.querySelector<HTMLElement>(`[data-js-account-section="${sectionName}"]`);

    if (activeLink) activeLink.classList.add('account__nav-link--active');
    if (activeSection) activeSection.classList.add('account__section--active');
  }

  /** Attache les événements de copie sur les boutons data-js-copy-code. */
  private initCopyButtons(): void {
    const buttons = this.container.querySelectorAll<HTMLButtonElement>('[data-js-copy-code]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.querySelector<HTMLElement>('.gift-card-code');
        if (!code?.textContent) return;

        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.classList.add('gift-card-code__copy--copied');
          setTimeout(() => btn.classList.remove('gift-card-code__copy--copied'), 1500);
        });
      });
    });
  }

  /** Affiche la bannière d'activation si le compte est inactif. */
  private handleActivation(): void {
    const activationEl = this.container.querySelector<HTMLElement>('[data-js-account-activation]');
    if (!activationEl) return;

    if (this.config.activation?.active) {
      activationEl.style.display = '';
    }

    const resendBtn = activationEl.querySelector<HTMLButtonElement>('[data-js-activation-resend]');
    resendBtn?.addEventListener('click', () => {
      this.dispatch('activation:resend');
    });
  }

  /**
   * Dispatch un événement personnalisé sur le conteneur.
   * @param event - Nom de l'événement.
   * @param detail - Données optionnelles attachées à l'événement.
   */
  private dispatch(event: string, detail?: unknown): void {
    this.container.dispatchEvent(new CustomEvent(event, {
      bubbles: true,
      detail,
    }));
  }

  /**
   * Retourne l'élément racine du composant.
   * @returns L'élément HTMLElement du conteneur.
   */
  public getContainer(): HTMLElement {
    return this.container;
  }
}

/**
 * Point d'entrée pour l'initialisation du composant account.
 * Parcourt le DOM à la recherche des conteneurs account et les initialise.
 * @param container - Élément racine ou élément contenant le composant (défaut: document.body).
 * @param config - Configuration optionnelle transmise à chaque instance Account.
 */
export function init(container: HTMLElement = document.body, config?: AccountConfig): void {
  if (container.hasAttribute('data-js-account')) {
    new Account(container, config);
    return;
  }

  const accountEls = container.querySelectorAll<HTMLElement>('[data-js-account]');
  accountEls.forEach(el => new Account(el, config));
}
