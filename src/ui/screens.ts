import { PATROLS } from '../core/content.js';
import { MICROBE_DOSSIER, MEDICINE_DOSSIER } from '../core/evidence.js';
import { saveManager, UPGRADE_CONFIGS } from '../storage/save.js';
import { ICONS } from './icons.js';
import { soundEngine } from '../audio/synth.js';
import { UpgradesState, PatrolDef } from '../core/types.js';

export interface ScreenCallbacks {
  onSelectPatrol: (patrol: PatrolDef) => void;
  onOpenBarracks: () => void;
  onOpenFieldGuide: () => void;
  onOpenMap: () => void;
}

export class ScreenManager {
  private container: HTMLElement;
  private callbacks: ScreenCallbacks;
  private currentScreen: 'map' | 'barracks' | 'field_guide' | 'game' = 'map';

  public get current(): 'map' | 'barracks' | 'field_guide' | 'game' {
    return this.currentScreen;
  }

  constructor(container: HTMLElement, callbacks: ScreenCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
  }

  public showMap(): void {
    this.currentScreen = 'map';
    const data = saveManager.getData();

    this.container.innerHTML = `
      <div class="screen-view map-view">
        <header class="screen-header">
          <div class="header-brand">
            <h1 class="brand-title">BIOLOGY DASH</h1>
            <p class="brand-subtitle">IMMUNE PATROL: CELLULAR CROWD WARFARE</p>
          </div>
          <div class="header-currency">
            <div class="hud-coin-pill">
              <div class="hud-icon-wrap">${ICONS.coin}</div>
              <span id="screenCoinCount">${data.coins}</span>
            </div>
          </div>
        </header>

        <main class="patrol-scroll-container">
          <div class="patrol-grid">
            ${PATROLS.map(p => {
              const isUnlocked = p.id <= data.highestUnlockedPatrol;
              const stars = data.patrolStars[p.id] || 0;

              return `
                <div class="patrol-card ${isUnlocked ? 'unlocked' : 'locked'}" data-patrol-id="${p.id}">
                  <div class="patrol-card-header">
                    <span class="patrol-tag">PATROL ${p.id}</span>
                    <div class="patrol-stars">
                      ${[1, 2, 3]
                        .map(s => `
                          <div class="star-icon-wrap">
                            ${s <= stars ? ICONS.star : ICONS.starEmpty}
                          </div>
                        `)
                        .join('')}
                    </div>
                  </div>
                  <h3 class="patrol-title">${p.name.split(':')[1] || p.name}</h3>
                  <p class="patrol-desc">${p.subtitle}</p>
                  <div class="patrol-footer">
                    <span class="patrol-len">${(p.corridorLength / 100).toFixed(0)}m Lumen</span>
                    <button class="patrol-btn ${isUnlocked ? 'primary' : 'disabled'}" ${isUnlocked ? '' : 'disabled'}>
                      ${isUnlocked ? (stars > 0 ? 'REPLAY' : 'ENGAGE') : 'LOCKED'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </main>

        <nav class="bottom-nav-dock">
          <button class="nav-tab-btn active" id="navMapBtn">
            <div class="nav-icon">${ICONS.map}</div>
            <span>CAMPAIGN</span>
          </button>
          <button class="nav-tab-btn" id="navBarracksBtn">
            <div class="nav-icon">${ICONS.barracks}</div>
            <span>BARRACKS</span>
          </button>
          <button class="nav-tab-btn" id="navFieldGuideBtn">
            <div class="nav-icon">${ICONS.fieldGuide}</div>
            <span>FIELD GUIDE</span>
          </button>
        </nav>
      </div>
    `;

    this.bindNav();

    // Bind patrol card clicks
    this.container.querySelectorAll('.patrol-card.unlocked').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.getAttribute('data-patrol-id'));
        const patrol = PATROLS.find(p => p.id === id);
        if (patrol) {
          soundEngine.playButtonTap();
          this.callbacks.onSelectPatrol(patrol);
        }
      });
    });
  }

  public showBarracks(): void {
    this.currentScreen = 'barracks';
    const data = saveManager.getData();

    const upgradeKeys: (keyof UpgradesState)[] = [
      'extravasationSpeedLevel',
      'pseudopodReachLevel',
      'initialSquadSizeLevel',
      'cytokineChargeRateLevel'
    ];

    this.container.innerHTML = `
      <div class="screen-view barracks-view">
        <header class="screen-header">
          <div class="header-brand">
            <h1 class="brand-title">SQUAD BARRACKS</h1>
            <p class="brand-subtitle">GENOMIC & CYTOSKELETAL UPGRADES</p>
          </div>
          <div class="header-currency">
            <div class="hud-coin-pill">
              <div class="hud-icon-wrap">${ICONS.coin}</div>
              <span id="barracksCoinCount">${data.coins}</span>
            </div>
          </div>
        </header>

        <main class="barracks-container">
          <div class="upgrade-list">
            ${upgradeKeys
              .map(key => {
                const cfgKey =
                  key === 'extravasationSpeedLevel'
                    ? 'extravasationSpeed'
                    : key === 'pseudopodReachLevel'
                    ? 'pseudopodReach'
                    : key === 'initialSquadSizeLevel'
                    ? 'initialSquadSize'
                    : 'cytokineChargeRate';
                const cfg = UPGRADE_CONFIGS[cfgKey];
                const level = data.upgrades[key];
                const cost = saveManager.getUpgradeCost(key);
                const isMax = level >= cfg.maxLevel;
                const canAfford = data.coins >= cost;

                return `
                  <div class="upgrade-card" data-key="${key}">
                    <div class="upgrade-info">
                      <div class="upgrade-title-row">
                        <h3 class="upgrade-title">${cfg.name}</h3>
                        <span class="upgrade-tier">TIER ${level} / ${cfg.maxLevel}</span>
                      </div>
                      <p class="upgrade-desc">${cfg.description}</p>
                      <div class="tier-pips">
                        ${Array.from({ length: cfg.maxLevel })
                          .map((_, i) => `<span class="pip ${i < level ? 'active' : ''}"></span>`)
                          .join('')}
                      </div>
                    </div>
                    <div class="upgrade-action">
                      <button class="upgrade-btn ${isMax ? 'maxed' : canAfford ? 'affordable' : 'unaffordable'}"
                        ${isMax || !canAfford ? 'disabled' : ''} data-upgrade-key="${key}">
                        ${isMax ? 'MAXED' : `
                          <div class="cost-inner">
                            <span class="hud-icon-wrap mini">${ICONS.coin}</span>
                            <span>${cost}</span>
                          </div>
                        `}
                      </button>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </main>

        <nav class="bottom-nav-dock">
          <button class="nav-tab-btn" id="navMapBtn">
            <div class="nav-icon">${ICONS.map}</div>
            <span>CAMPAIGN</span>
          </button>
          <button class="nav-tab-btn active" id="navBarracksBtn">
            <div class="nav-icon">${ICONS.barracks}</div>
            <span>BARRACKS</span>
          </button>
          <button class="nav-tab-btn" id="navFieldGuideBtn">
            <div class="nav-icon">${ICONS.fieldGuide}</div>
            <span>FIELD GUIDE</span>
          </button>
        </nav>
      </div>
    `;

    this.bindNav();

    // Bind upgrade purchases
    this.container.querySelectorAll('[data-upgrade-key]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-upgrade-key') as keyof UpgradesState;
        if (saveManager.purchaseUpgrade(key)) {
          soundEngine.playGateMultiplierChime();
          this.showBarracks(); // re-render with updated values
        }
      });
    });
  }

  public showFieldGuide(): void {
    this.currentScreen = 'field_guide';
    const pathogens = Object.values(MICROBE_DOSSIER);
    const medicines = Object.values(MEDICINE_DOSSIER);

    this.container.innerHTML = `
      <div class="screen-view field-guide-view">
        <header class="screen-header">
          <div class="header-brand">
            <h1 class="brand-title">CLINICAL FIELD GUIDE</h1>
            <p class="brand-subtitle">EVIDENCE-BASED MICROBIOLOGY & PHARMACOLOGY</p>
          </div>
        </header>

        <div class="guide-tabs">
          <button class="guide-tab-btn active" id="tabPathogens">PATHOGENS (${pathogens.length})</button>
          <button class="guide-tab-btn" id="tabMedicines">MEDICINES (${medicines.length})</button>
        </div>

        <main class="field-guide-content" id="guideContent">
          <div class="dossier-list" id="pathogenList">
            ${pathogens
              .map(p => `
                <div class="dossier-card">
                  <div class="dossier-header">
                    <div>
                      <h3 class="dossier-name">${p.displayName}</h3>
                      <span class="dossier-family">${p.taxonomicFamily}</span>
                    </div>
                    <span class="gram-badge ${p.gramStatus.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                      ${p.gramStatus}
                    </span>
                  </div>
                  <p class="dossier-morphology"><strong>Morphology:</strong> ${p.morphology}</p>
                  <div class="dossier-section">
                    <strong>Hallmarks:</strong>
                    <ul>
                      ${p.hallmarkFeatures.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="dossier-section">
                    <strong>Condition:</strong> ${p.clinicalCondition}
                  </div>
                  <div class="dossier-callout defense">
                    <strong>Molecular Defense:</strong> ${p.molecularDefense}
                  </div>
                  <div class="dossier-callout susceptibility">
                    <strong>Susceptibility:</strong> ${p.susceptibilityNote}
                  </div>
                </div>
              `)
              .join('')}
          </div>

          <div class="dossier-list hidden" id="medicineList">
            ${medicines
              .map(m => `
                <div class="dossier-card med-card">
                  <div class="dossier-header">
                    <div>
                      <h3 class="dossier-name">${m.displayName}</h3>
                      <span class="dossier-family">${m.chemicalClass}</span>
                    </div>
                  </div>
                  <div class="dossier-section">
                    <strong>Molecular Target:</strong> ${m.molecularTarget}
                  </div>
                  <div class="dossier-section">
                    <strong>Mechanism:</strong> ${m.mechanism}
                  </div>
                  <div class="dossier-section">
                    <strong>Antimicrobial Spectrum:</strong> ${m.spectrum}
                  </div>
                  <div class="dossier-callout warning">
                    <strong>Clinical Caveat:</strong> ${m.clinicalCaveat}
                  </div>
                </div>
              `)
              .join('')}
          </div>
        </main>

        <nav class="bottom-nav-dock">
          <button class="nav-tab-btn" id="navMapBtn">
            <div class="nav-icon">${ICONS.map}</div>
            <span>CAMPAIGN</span>
          </button>
          <button class="nav-tab-btn" id="navBarracksBtn">
            <div class="nav-icon">${ICONS.barracks}</div>
            <span>BARRACKS</span>
          </button>
          <button class="nav-tab-btn active" id="navFieldGuideBtn">
            <div class="nav-icon">${ICONS.fieldGuide}</div>
            <span>FIELD GUIDE</span>
          </button>
        </nav>
      </div>
    `;

    this.bindNav();

    // Tab toggle logic
    const tabPathogens = this.container.querySelector('#tabPathogens')!;
    const tabMedicines = this.container.querySelector('#tabMedicines')!;
    const pathogenList = this.container.querySelector('#pathogenList')!;
    const medicineList = this.container.querySelector('#medicineList')!;

    tabPathogens.addEventListener('click', () => {
      soundEngine.playButtonTap();
      tabPathogens.classList.add('active');
      tabMedicines.classList.remove('active');
      pathogenList.classList.remove('hidden');
      medicineList.classList.add('hidden');
    });

    tabMedicines.addEventListener('click', () => {
      soundEngine.playButtonTap();
      tabMedicines.classList.add('active');
      tabPathogens.classList.remove('active');
      medicineList.classList.remove('hidden');
      pathogenList.classList.add('hidden');
    });
  }

  private bindNav(): void {
    this.container.querySelector('#navMapBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.callbacks.onOpenMap();
    });
    this.container.querySelector('#navBarracksBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.callbacks.onOpenBarracks();
    });
    this.container.querySelector('#navFieldGuideBtn')?.addEventListener('click', () => {
      soundEngine.playButtonTap();
      this.callbacks.onOpenFieldGuide();
    });
  }

  public hide(): void {
    this.container.innerHTML = '';
  }
}
