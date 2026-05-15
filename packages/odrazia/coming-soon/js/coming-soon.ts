/**
 * Coming Soon Component
 * @section odrazia/coming-soon
 */

interface ComingSoonConfig {
  targetDate?: string;
  onSubscribe?: (email: string) => Promise<void>;
}

interface CountdownValues {
  days: HTMLElement;
  hours: HTMLElement;
  minutes: HTMLElement;
  seconds: HTMLElement;
}

/**
 * Manages the email subscription form
 */
class ComingSoonFormManager {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private feedbackEl: HTMLElement;

  constructor(form: HTMLFormElement, private onSubscribe?: (email: string) => Promise<void>) {
    this.form = form;
    this.emailInput = form.querySelector('[data-js-coming-soon-email]') as HTMLInputElement;
    this.feedbackEl = form.querySelector('[data-js-coming-soon-feedback]') as HTMLElement;

    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.emailInput.value.trim();

    if (!this.isValidEmail(email)) {
      this.showFeedback('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    this.setLoading(true);

    try {
      if (this.onSubscribe) {
        await this.onSubscribe(email);
      }
      this.showFeedback('Merci ! Vous serez notifié(e) lors du lancement.', 'success');
      this.emailInput.value = '';
    } catch (error) {
      this.showFeedback('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackEl.textContent = message;
    this.feedbackEl.className = `coming-soon__feedback coming-soon__feedback--${type}`;
  }

  private setLoading(loading: boolean): void {
    this.emailInput.disabled = loading;
    const submitBtn = this.form.querySelector('.coming-soon__submit') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = loading;
    }
  }
}

/**
 * Manages the countdown timer
 */
class ComingSoonCountdownManager {
  private targetDate: Date;
  private elements: CountdownValues;
  private intervalId: number | null = null;

  constructor(elements: CountdownValues, targetDate?: string) {
    this.elements = elements;
    this.targetDate = targetDate ? new Date(targetDate) : this.getDefaultDate();
    this.init();
  }

  private getDefaultDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  private init(): void {
    this.updateCountdown();
    this.intervalId = window.setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.stop();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.elements.days.textContent = String(days).padStart(2, '0');
    this.elements.hours.textContent = String(hours).padStart(2, '0');
    this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }

  private stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy(): void {
    this.stop();
  }
}

/**
 * Main orchestrator for the Coming Soon component
 */
class ComingSoonOrchestrator {
  private container: HTMLElement;
  private formManager: ComingSoonFormManager | null = null;
  private countdownManager: ComingSoonCountdownManager | null = null;

  constructor(container: HTMLElement, config: ComingSoonConfig = {}) {
    this.container = container;
    this.init(config);
  }

  private init(config: ComingSoonConfig): void {
    this.initForm(config);
    this.initCountdown(config);
  }

  private initForm(config: ComingSoonConfig): void {
    const form = this.container.querySelector('[data-js-coming-soon-form]') as HTMLFormElement;
    if (form) {
      this.formManager = new ComingSoonFormManager(form, config.onSubscribe);
    }
  }

  private initCountdown(config: ComingSoonConfig): void {
    const countdown = this.container.querySelector('[data-js-coming-soon-countdown]');
    if (countdown) {
      const elements: CountdownValues = {
        days: countdown.querySelector('[data-js-countdown-days]') as HTMLElement,
        hours: countdown.querySelector('[data-js-countdown-hours]') as HTMLElement,
        minutes: countdown.querySelector('[data-js-countdown-minutes]') as HTMLElement,
        seconds: countdown.querySelector('[data-js-countdown-seconds]') as HTMLElement,
      };

      if (elements.days && elements.hours && elements.minutes && elements.seconds) {
        this.countdownManager = new ComingSoonCountdownManager(elements, config.targetDate);
      }
    }
  }

  destroy(): void {
    this.countdownManager?.destroy();
  }
}

/**
 * Initialize the Coming Soon component
 * @param container - The root element containing the component
 * @param config - Optional configuration
 */
export function init(container: HTMLElement, config: ComingSoonConfig = {}): ComingSoonOrchestrator {
  return new ComingSoonOrchestrator(container, config);
}

// Auto-init for standalone usage
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-js-coming-soon]');
    if (root instanceof HTMLElement) {
      init(root);
    }
  });
}