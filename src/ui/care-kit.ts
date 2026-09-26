import { SimulationEngine } from '../simulation/simulation.js';
import { MedicineType } from '../core/types.js';
import { ICONS } from './icons.js';
import { MEDICINE_DOSSIER } from '../core/evidence.js';
import { soundEngine } from '../audio/synth.js';

export class CareKitDock {
  private container: HTMLElement;
  private sim: SimulationEngine;
  private medButtons: Map<MedicineType, HTMLElement> = new Map();

  constructor(container: HTMLElement, sim: SimulationEngine) {
    this.container = container;
    this.sim = sim;
    this.render();
    this.setupKeyboard();
  }

  private render(): void {
    const allowed = this.sim.patrol.allowedMedicines;

    this.container.innerHTML = `
      <div class="care-kit-dock">
        <div class="care-kit-slots">
          ${allowed
            .map(med => {
              const dossier = MEDICINE_DOSSIER[med];
              const iconSvg =
                med === 'amoxicillin'
                  ? ICONS.amoxicillin
                  : med === 'doxycycline'
                  ? ICONS.doxycycline
                  : med === 'cefepime'
                  ? ICONS.cefepime
                  : ICONS.micafungin;

              const isSelected = this.sim.activeMedicine === med;

              return `
                <div class="medicine-slot ${isSelected ? 'active-slot' : ''}" data-med="${med}">
                  <button class="med-btn" id="medBtn_${med}">
                    <svg class="med-charge-svg" viewBox="0 0 68 68">
                      <circle cx="34" cy="34" r="30" class="med-charge-bg"/>
                      <circle id="medChargeCircle_${med}" cx="34" cy="34" r="30" class="med-charge-fill"
                        stroke-dasharray="188.5" stroke-dashoffset="188.5" transform="rotate(-90 34 34)"/>
                    </svg>
                    <div class="med-icon-wrap">${iconSvg}</div>
                    <div class="med-cooldown-overlay" id="medCooldown_${med}"></div>
                  </button>
                  <div class="med-meta">
                    <span class="med-name">${dossier.displayName}</span>
                    <span class="med-hint">HOLD & RELEASE</span>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    // Bind event listeners for each slot
    allowed.forEach(med => {
      const btnEl = this.container.querySelector(`#medBtn_${med}`) as HTMLElement;
      this.medButtons.set(med, btnEl);

      const startHold = (e: Event) => {
        e.preventDefault();
        soundEngine.playButtonTap();
        this.sim.setActiveMedicine(med);
        this.updateActiveSlotStyles();
        this.sim.startChargingMedicine();
      };

      const endHold = (e: Event) => {
        e.preventDefault();
        this.sim.releaseMedicine();
      };

      btnEl.addEventListener('pointerdown', startHold);
      btnEl.addEventListener('pointerup', endHold);
      btnEl.addEventListener('pointerleave', endHold);
      btnEl.addEventListener('pointercancel', endHold);
    });
  }

  private setupKeyboard(): void {
    let spaceDown = false;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spaceDown) {
        spaceDown = true;
        this.sim.startChargingMedicine();
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.code === 'Space' && spaceDown) {
        spaceDown = false;
        this.sim.releaseMedicine();
      }
    });
  }

  private updateActiveSlotStyles(): void {
    const slots = this.container.querySelectorAll('.medicine-slot');
    slots.forEach(slot => {
      const med = slot.getAttribute('data-med');
      if (med === this.sim.activeMedicine) {
        slot.classList.add('active-slot');
      } else {
        slot.classList.remove('active-slot');
      }
    });
  }

  public update(): void {
    const allowed = this.sim.patrol.allowedMedicines;
    const circumference = 188.5; // 2 * pi * 30

    allowed.forEach(med => {
      const chargeCircle = this.container.querySelector(`#medChargeCircle_${med}`);
      const cooldownEl = this.container.querySelector(`#medCooldown_${med}`) as HTMLElement;

      // Update cooldown overlay
      const cd = this.sim.medicineCooldowns[med];
      if (cooldownEl) {
        if (cd > 0) {
          cooldownEl.style.height = `${Math.min(100, (cd / 6.0) * 100)}%`;
        } else {
          cooldownEl.style.height = '0%';
        }
      }

      // Update charge ring if this is the active charging medicine
      if (chargeCircle) {
        if (this.sim.activeMedicine === med && this.sim.isChargingMedicine) {
          const offset = circumference * (1 - this.sim.medicineChargeProgress);
          chargeCircle.setAttribute('stroke-dashoffset', offset.toFixed(1));
          if (this.sim.medicineChargeProgress >= 0.95) {
            chargeCircle.classList.add('ready');
          } else {
            chargeCircle.classList.remove('ready');
          }
        } else {
          chargeCircle.setAttribute('stroke-dashoffset', `${circumference}`);
          chargeCircle.classList.remove('ready');
        }
      }
    });
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}
