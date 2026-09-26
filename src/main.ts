import './style.css';
import { PATROLS } from './core/content.js';
import { PatrolDef } from './core/types.js';
import { saveManager } from './storage/save.js';
import { SimulationEngine } from './simulation/simulation.js';
import { GameSceneRenderer } from './game/scene.js';
import { GameHUD } from './ui/hud.js';
import { CareKitDock } from './ui/care-kit.js';
import { ScreenManager } from './ui/screens.js';
import { ModalManager } from './ui/modals.js';
import { soundEngine } from './audio/synth.js';

class AppCoordinator {
  private screensContainer: HTMLElement;
  private modalsContainer: HTMLElement;
  private gameContainer: HTMLElement;
  private canvas: HTMLCanvasElement;
  private hudContainer: HTMLElement;
  private careKitContainer: HTMLElement;

  private screenManager: ScreenManager;
  private modalManager: ModalManager;

  private currentSim: SimulationEngine | null = null;
  private currentRenderer: GameSceneRenderer | null = null;
  private currentHUD: GameHUD | null = null;
  private currentCareKit: CareKitDock | null = null;
  private uiUpdateInterval: number | null = null;

  constructor() {
    this.screensContainer = document.getElementById('screensContainer')!;
    this.modalsContainer = document.getElementById('modalsContainer')!;
    this.gameContainer = document.getElementById('gameContainer')!;
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.hudContainer = document.getElementById('hudContainer')!;
    this.careKitContainer = document.getElementById('careKitContainer')!;

    this.modalManager = new ModalManager(this.modalsContainer, {
      onStartPatrol: (patrol) => this.startPatrol(patrol),
      onRetryPatrol: (patrol) => this.startPatrol(patrol),
      onNextPatrol: () => this.startNextPatrol(),
      onReturnToMap: () => this.openMap(),
      onOpenBarracks: () => this.openBarracks()
    });

    this.screenManager = new ScreenManager(this.screensContainer, {
      onSelectPatrol: (patrol) => this.modalManager.showBriefing(patrol),
      onOpenBarracks: () => this.openBarracks(),
      onOpenFieldGuide: () => this.openFieldGuide(),
      onOpenMap: () => this.openMap()
    });

    this.init();
  }

  private init(): void {
    // Set sound settings from save data
    const saved = saveManager.getData();
    soundEngine.setSoundEnabled(saved.soundEnabled);
    soundEngine.setVolume(saved.audioVolume);

    // Initial resize
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Show initial campaign map
    this.openMap();
  }

  private handleResize(): void {
    const rect = this.gameContainer.getBoundingClientRect();
    const width = Math.min(560, Math.max(360, rect.width || window.innerWidth));
    const height = Math.min(960, Math.max(640, rect.height || window.innerHeight));

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.currentRenderer) {
      this.currentRenderer.resize(width, height);
    }
  }

  public openMap(): void {
    this.teardownGame();
    this.screensContainer.classList.remove('hidden');
    this.gameContainer.classList.add('hidden');
    this.screenManager.showMap();
  }

  public openBarracks(): void {
    this.teardownGame();
    this.screensContainer.classList.remove('hidden');
    this.gameContainer.classList.add('hidden');
    this.screenManager.showBarracks();
  }

  public openFieldGuide(): void {
    this.teardownGame();
    this.screensContainer.classList.remove('hidden');
    this.gameContainer.classList.add('hidden');
    this.screenManager.showFieldGuide();
  }

  public startPatrol(patrol: PatrolDef): void {
    this.teardownGame();

    // Hide menus, show game
    this.screensContainer.classList.add('hidden');
    this.gameContainer.classList.remove('hidden');
    this.handleResize();

    const data = saveManager.getData();
    this.currentSim = new SimulationEngine(patrol, data.upgrades);
    this.currentRenderer = new GameSceneRenderer(this.canvas, this.currentSim);
    this.currentHUD = new GameHUD(this.hudContainer, this.currentSim);
    this.currentCareKit = new CareKitDock(this.careKitContainer, this.currentSim);

    // Hook simulation end events
    this.currentSim.setEventListener((event) => {
      if (event.type === 'patrol_victory') {
        const stars = event.data.stars;
        const coins = event.data.coins;
        saveManager.addCoins(coins);
        saveManager.recordPatrolResult(patrol.id, stars);

        setTimeout(() => {
          this.modalManager.showVictory(patrol, stars, event.data.survivingDefenders, coins);
        }, 1200);
      } else if (event.type === 'patrol_defeat') {
        setTimeout(() => {
          this.modalManager.showDefeat(patrol, event.data.distanceTraveled);
        }, 800);
      }
    });

    // Start UI update timer
    this.uiUpdateInterval = window.setInterval(() => {
      if (this.currentHUD) this.currentHUD.update();
      if (this.currentCareKit) this.currentCareKit.update();
    }, 1000 / 30);
  }

  private startNextPatrol(): void {
    if (!this.currentSim) {
      this.openMap();
      return;
    }

    const currentId = this.currentSim.patrol.id;
    const nextPatrol = PATROLS.find(p => p.id === currentId + 1);
    if (nextPatrol && nextPatrol.id <= saveManager.getData().highestUnlockedPatrol) {
      this.startPatrol(nextPatrol);
    } else {
      this.openMap();
    }
  }

  private teardownGame(): void {
    if (this.uiUpdateInterval) {
      clearInterval(this.uiUpdateInterval);
      this.uiUpdateInterval = null;
    }
    if (this.currentRenderer) {
      this.currentRenderer.destroy();
      this.currentRenderer = null;
    }
    if (this.currentHUD) {
      this.currentHUD.destroy();
      this.currentHUD = null;
    }
    if (this.currentCareKit) {
      this.currentCareKit.destroy();
      this.currentCareKit = null;
    }
    this.currentSim = null;
  }
}

// Bootstrap once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new AppCoordinator();
});
