/**
 * @zuii/clipboard
 * Utilitaire réutilisable en TypeScript pour copier du texte dans le presse-papier.
 */
import { toast } from '../../toast/toast.js';
export class Clipboard {
  private successDuration: number;

  constructor(successDuration: number = 2000) {
    this.successDuration = successDuration;
  }

  /**
   * Copie un texte dans le presse-papier de l'utilisateur.
   * @param text Le texte à copier
   * @returns true si la copie a réussi, false sinon
   */
  async copyText(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback pour les anciens navigateurs
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
      return false;
    }
  }

  /**
   * Initialise les boutons de copie dans un conteneur donné.
   * Recherche les éléments avec l'attribut `data-clipboard="texte a copier"`.
   * @param container Le conteneur DOM à scanner (document par défaut)
   */
  init(container: HTMLElement | Document = document) {
    const buttons = container.querySelectorAll<HTMLElement>('[data-clipboard]');

    buttons.forEach(btn => {
      if (btn.hasAttribute('data-clipboard-initialized')) return;
      btn.setAttribute('data-clipboard-initialized', 'true');

      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-clipboard');
        if (!text) return;

        const success = await this.copyText(text);
        if (success) {
          this.showSuccess(btn);
        }
      });
    });
  }

  private showSuccess(btn: HTMLElement) {
    const originalHtml = btn.innerHTML;
    const successMsg = btn.getAttribute('data-clipboard-success') || 'Le code a été copié dans le presse-papier';

    // Pour éviter d'écraser la taille du bouton de façon brutale, on peut définir un min-width
    const rect = btn.getBoundingClientRect();
    btn.style.minWidth = `${rect.width}px`;

    btn.classList.add('is-copied');

    // Display Toast notification
    toast.success(successMsg);

    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.classList.remove('is-copied');
      btn.style.minWidth = ''; // reset
    }, this.successDuration);
  }
}

// Instance globale prête à l'emploi
export const clipboard = new Clipboard();
