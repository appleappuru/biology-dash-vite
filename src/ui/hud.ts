import { SimulationEngine } from '../simulation/simulation.js';
import { ICONS } from './icons.js';
import { soundEngine } from '../audio/synth.js';
import { saveManager } from '../storage/save.js';

export class GameHUD {
  private container: HTMLElement;
  private sim: SimulationEngine;

  private squadCountEl!: HTMLElement;
  private progressFillEl!: HTMLElement;
  private coinCountEl!: HTMLElement;
  private cytokineMeterEl!: HTMLElement;
  private cytokineBtnEl!: HTMLElement;
  private soundBtnEl!: HTMLElement;

  constructor(container: HTMLElement, sim: SimulationEngine) {
    this.container = container;
    this.sim = sim;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="hud-top-bar">
        <div class="hud-left-group">
          <div class="hud-patrol-badge">
            <span class="hud-patrol-num">P${this.sim.patrol.id}</span>
            <span class="hud-patrol-name">${this.sim.patrol.name.split(':')[1] || this.sim.patrol.name}</span>
          </div>
          <div class="hud-progress-container">
            <div class="hud-progress-fill" id="hudProgressFill"></div>
          </div>
        </div>

        <div class="hud-right-group">
          <div class="hud-coin-pill">
            <div class="hud-icon-wrap">${ICONS.coin}</div>
            <span id="hudCoinCount">0</span>
          </div>
          <button class="hud-icon-btn" id="hudSoundBtn" title="Toggle Audio">
            <div class="hud-icon-wrap" id="hudSoundIcon">${saveManager.getData().soundEnabled ? ICONS.audioOn : ICONS.audioOff}</div>
          </button>
        </div>
      </div>

      <div class="hud-floating-left">
        <div class="hud-squad-counter">
          <div class="hud-squad-num" id="hudSquadCount">${this.sim.defenders.length}</div>
          <div class="hud-squad-label">PATROL SQUAD</div>
        </div>

        <button class="hud-cytokine-btn" id="hudCytokineBtn" disabled title="Cytokine Surge">
          <div class="hud-cytokine-ring">
            <svg viewBox="0 0 60 60" width="60" height="60">
              <circle cx="30" cy="30" r="26" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.2)" stroke-width="4"/>
              <circle id="hudCytokineCircle" cx="30" cy="30" r="26" fill="none" stroke="#fbbf24" stroke-width="4"
                stroke-dasharray="163.3" stroke-dashoffset="163.3" stroke-linecap="round"
                transform="rotate(-90 30 30)"/>
            </svg>
            <div class="hud-cytokine-inner-icon">${ICONS.cytokineSurge}</div>
          </div>
          <div class="hud-cytokine-label">SURGE</div>
        </button>
      </div>
    `;

    this.squadCountEl = this.container.querySelector('#hudSquadCount')!;
    this.progressFillEl = this.container.querySelector('#hudProgressFill')!;
    this.coinCountEl = this.container.querySelector('#hudCoinCount')!;
    this.cytokineMeterEl = this.container.querySelector('#hudCytokineCircle')!;
    this.cytokineBtnEl = this.container.querySelector('#hudCytokineBtn')!;
    this.soundBtnEl = this.container.querySelector('#hudSoundBtn')!;

    this.cytokineBtnEl.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.sim.triggerCytokineSurge();
    });

    this.soundBtnEl.addEventListener('click', () => {
      soundEngine.playButtonTap();
      const enabled = saveManager.toggleSound();
      soundEngine.setSoundEnabled(enabled);
      const iconWrap = this.container.querySelector('#hudSoundIcon')!;
      iconWrap.innerHTML = enabled ? ICONS.audioOn : ICONS.audioOff;
    });
  }

  public update(): void {
    // 1. Update squad count
    const count = this.sim.defenders.length;
    this.squadCountEl.textContent = `${count}`;

    // 2. Update corridor progress
    const progress = Math.min(1.0, Math.max(0, this.sim.squadY / this.sim.patrol.corridorLength));
    this.progressFillEl.style.width = `${(progress * 100).toFixed(1)}%`;

    // 3. Update coin count
    this.coinCountEl.textContent = `${saveManager.getData().coins + this.sim.earnedCoins}`;

    // 4. Update cytokine meter
    const cytokineRatio = Math.min(1.0, this.sim.cytokineMeter / this.sim.maxCytokine);
    const circumference = 163.3; // 2 * pi * 26
    const offset = circumference * (1 - cytokineRatio);
    this.cytokineMeterEl.setAttribute('stroke-dashoffset', offset.toFixed(1));

    if (cytokineRatio >= 1.0) {
      this.cytokineBtnEl.removeAttribute('disabled');
      this.cytokineBtnEl.classList.add('ready');
    } else {
      this.cytokineBtnEl.setAttribute('disabled', 'true');
      this.cytokineBtnEl.classList.remove('ready');
    }
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}
