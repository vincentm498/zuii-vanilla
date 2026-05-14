/**
 * ZUIi / Odrazia Auth Component
 * Gère les interactions des formulaires d'authentification.
 */

export class Auth {
  private container: HTMLElement;
  private form: HTMLFormElement | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.form = container.querySelector<HTMLFormElement>('[data-js-auth-form]');
    this.init();
  }

  private init(): void {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Marquer comme initialisé
    this.container.dataset.initialized = 'true';
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    const type = this.form?.dataset.jsAuthForm;
    console.log(`ZUII Auth: Form submitted [type=${type}]`);
    
    // Simulation simple pour le playground
    const button = this.form?.querySelector('button[type="submit"]');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Chargement...';
      button.setAttribute('disabled', 'true');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.removeAttribute('disabled');
        alert(`Formulaire "${type}" soumis avec succès (Mode Démo)`);
      }, 1000);
    }
  }
}

/**
 * Point d'entrée pour l'initialisation du composant Auth.
 */
export function init(container: HTMLElement = document.body): void {
  const authContainers = container.querySelectorAll<HTMLElement>('[data-js-auth-container]');
  authContainers.forEach(el => new Auth(el));
}
