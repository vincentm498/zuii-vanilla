interface LoyaltyData {
  total: number;
  minAmount: number;
}

/**
 * Gestionnaire du bloc de fidélité (points de fidélité).
 * Affiche les points, la barre de progression et le bouton d'utilisation.
 */
export class AccountLoyaltyManager {
  private container: HTMLElement;
  private pointsEl: HTMLElement | null;
  private barEl: HTMLElement | null;
  private goalEl: HTMLElement | null;
  private redeemBtn: HTMLElement | null;

  /**
   * @param container - Élément racine contenant le bloc fidélité.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.pointsEl = container.querySelector('[data-js-loyalty-points]');
    this.barEl = container.querySelector('[data-js-loyalty-bar]');
    this.goalEl = container.querySelector('[data-js-loyalty-goal]');
    this.redeemBtn = container.querySelector('[data-js-loyalty-redeem]');
  }

  /**
   * Initialise l'affichage des points de fidélité.
   * @param data - Données de fidélité (total points, montant minimum).
   */
  init(data?: LoyaltyData): void {
    if (!data) return;

    const points = Math.floor(data.total);
    const minAmount = data.minAmount;
    const percent = Math.min((points / minAmount) * 100, 100);

    if (this.pointsEl) {
      this.pointsEl.textContent = `${points} points`;
    }

    if (this.barEl) {
      this.barEl.style.width = `${percent}%`;
    }

    if (points >= minAmount) {
      if (this.goalEl) this.goalEl.style.display = 'none';
      if (this.redeemBtn) this.redeemBtn.style.display = '';
    } else {
      if (this.goalEl) {
        this.goalEl.textContent = `${minAmount} points minimum pour convertir en bon d'achat`;
      }
    }

    this.redeemBtn?.addEventListener('click', () => {
      this.dispatch('loyalty:redeem');
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
