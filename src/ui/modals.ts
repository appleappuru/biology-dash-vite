import { PatrolDef } from '../core/types.js';
import { ICONS } from './icons.js';
import { MEDICINE_DOSSIER } from '../core/evidence.js';
import { soundEngine } from '../audio/synth.js';

export interface ModalCallbacks {
  onStartPatrol: (patrol: PatrolDef) => void;
  onRetryPatrol: (patrol: PatrolDef) => void;
  onNextPatrol?: () => void;
  onReturnToMap: () => void;
  onOpenBarracks: () => void;
}

export class ModalManager {
  private container: HTMLElement;
  private callbacks: ModalCallbacks;

  constructor(container: HTMLElement, callbacks: ModalCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public showBriefing(patrol: PatrolDef): void {
    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card briefing-card">
          <div class="modal-header">
            <span class="modal-tag">CLINICAL BRIEFING & DEPLOYMENT</span>
            <h2 class="modal-title">${patrol.name}</h2>
            <p class="modal-subtitle">${patrol.subtitle}</p>
          </div>

          <div class="modal-body">
            <div class="briefing-context">
              <p>${patrol.clinicalContext}</p>
            </div>

            <div class="briefing-intel-grid">
              <div class="intel-block">
                <h4>SQUAD DEPLOYMENT</h4>
                <div class="intel-items">
                  ${patrol.startingDefenders
                    .map(d => `
                      <span class="intel-pill">
                        <strong>${d.count}×</strong> ${d.kind.toUpperCase().replace('_', ' ')}
                      </span>
                    `)
                    .join('')}
                </div>
              </div>

              <div class="intel-block">
                <h4>PRESCRIBED MEDICINES</h4>
                <div class="intel-items">
                  ${patrol.allowedMedicines
                    .map(med => {
                      const d = MEDICINE_DOSSIER[med];
                      const icon =
                        med === 'amoxicillin'
                          ? ICONS.amoxicillin
                          : med === 'doxycycline'
                          ? ICONS.doxycycline
                          : med === 'cefepime'
                          ? ICONS.cefepime
                          : ICONS.micafungin;
                      return `
                        <span class="intel-pill med">
                          <div class="hud-icon-wrap mini">${icon}</div>
                          ${d.displayName}
                        </span>
                      `;
                    })
                    .join('')}
                </div>
              </div>
            </div>

            <div class="intel-block boss-intel">
              <h4>COLONY CORE ENCOUNTER</h4>
              <p><strong>${patrol.boss.name}</strong> (${patrol.boss.maxHp} HP Piñata Core)</p>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-btn secondary" id="briefingCancelBtn">ABORT</button>
            <button class="modal-btn primary" id="briefingDeployBtn">DEPLOY SQUAD</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#briefingCancelBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      this.callbacks.onReturnToMap();
    });

    this.container.querySelector('#briefingDeployBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      this.callbacks.onStartPatrol(patrol);
    });
  }

  public showVictory(patrol: PatrolDef, stars: number, survivors: number, coinsEarned: number): void {
    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card victory-card">
          <div class="modal-header">
            <span class="modal-tag victory-tag">${patrol.name.toUpperCase()} - COMPLETE</span>
            <h2 class="modal-title victory-title">PATROL COMPLETE!</h2>
            <div class="victory-stars">
              ${[1, 2, 3]
                .map(s => `
                  <div class="victory-star-wrap ${s <= stars ? 'earned' : 'unearned'}">
                    ${s <= stars ? ICONS.star : ICONS.starEmpty}
                  </div>
                `)
                .join('')}
            </div>
          </div>

          <div class="modal-body">
            <div class="victory-stats-grid">
              <div class="stat-box">
                <span class="stat-label">SURVIVORS</span>
                <span class="stat-value">${survivors} Cells</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">COINS HARVESTED</span>
                <span class="stat-value coin-val">
                  <div class="hud-icon-wrap mini">${ICONS.coin}</div>
                  +${coinsEarned}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-btn secondary" id="victoryBarracksBtn">BARRACKS</button>
            <button class="modal-btn primary" id="victoryContinueBtn">CONTINUE</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#victoryBarracksBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      this.callbacks.onOpenBarracks();
    });

    this.container.querySelector('#victoryContinueBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      if (this.callbacks.onNextPatrol) {
        this.callbacks.onNextPatrol();
      } else {
        this.callbacks.onReturnToMap();
      }
    });
  }

  public showDefeat(patrol: PatrolDef, distanceTraveled: number): void {
    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card defeat-card">
          <div class="modal-header">
            <span class="modal-tag defeat-tag">SQUAD DEPLETED</span>
            <h2 class="modal-title defeat-title">BREACH OVERWHELMED</h2>
            <p class="modal-subtitle">Defenders perished at ${(distanceTraveled / 100).toFixed(0)}m into the lumen</p>
          </div>

          <div class="modal-body">
            <div class="defeat-tip">
              <strong>CLINICAL TACTICAL TIP:</strong>
              <p>Reinforce multipliers in early gates and cycle 30S ribosomal or beta-lactam medicines to halt high-density microbe advances!</p>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-btn secondary" id="defeatBarracksBtn">UPGRADE SQUAD</button>
            <button class="modal-btn primary" id="defeatRetryBtn">RETRY PATROL</button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#defeatBarracksBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      this.callbacks.onOpenBarracks();
    });

    this.container.querySelector('#defeatRetryBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.close();
      this.callbacks.onRetryPatrol(patrol);
    });
  }

  public close(): void {
    this.container.innerHTML = '';
  }
}
