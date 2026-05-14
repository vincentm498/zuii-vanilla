/**
 * Classe utilitaire pour le calcul des montants du panier.
 */
export class TotalsCalculator {
  /**
   * Parcourt le panier pour calculer le sous-total, les remises et le TTC final.
   * @param container - Le conteneur DOM du panier.
   */
  static calculate(container: HTMLElement): void {
    const itemTotals = container.querySelectorAll('.cart-item__total span');
    let subTotal = 0;
    
    // Somme des totaux par ligne d'article
    itemTotals.forEach(el => {
      subTotal += parseFloat(el.textContent?.replace(',', '.') || '0');
    });

    // Calcul des promotions appliquées
    const promos = container.querySelectorAll('.cart__promo-item');
    let discount = 0;
    promos.forEach(promo => {
      const amountEl = promo.querySelector('.cart__promo-amount');
      if (amountEl) {
        const text = amountEl.textContent?.trim() || '';
        if (text.includes('%')) {
          const percent = parseFloat(text.replace('-', '').replace('%', ''));
          discount += (subTotal * percent) / 100;
        } else {
          const value = parseFloat(text.replace('-', '').replace(',', '.').replace('€', ''));
          discount += value;
        }
      }
    });

    const ttc = Math.max(0, subTotal - discount);

    // Mise à jour des éléments du résumé via attributs data-js
    const subTotalEl = container.querySelector('[data-js-total-subtotal]');
    const discountEl = container.querySelector('[data-js-total-discount]');
    const totalTtcEl = container.querySelector('[data-js-total-ttc]');

    if (subTotalEl) subTotalEl.textContent = this.format(subTotal);
    if (discountEl) discountEl.textContent = '-' + this.format(discount);
    if (totalTtcEl) totalTtcEl.textContent = this.format(ttc);
  }

  /**
   * Formate un nombre en chaîne monétaire (ex: 527,00 €).
   * @param val - Le montant numérique.
   * @returns Le montant formaté.
   */
  private static format(val: number): string {
    return val.toFixed(2).replace('.', ',') + ' €';
  }
}
