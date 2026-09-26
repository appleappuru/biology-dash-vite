import { SimulationEngine } from '../simulation/simulation.js';
import { Projection25D } from './projection.js';
import { SwarmView } from './swarm-view.js';
import { EnemyView } from './enemy-view.js';
import { GateView } from './gate-view.js';
import { CombatOverlay } from './combat-overlay.js';
import { JuiceController } from './juice.js';
import { soundEngine } from '../audio/synth.js';
import { SimulationEvent } from '../core/types.js';

export class GameSceneRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sim: SimulationEngine;
  private projection: Projection25D;

  private swarmView: SwarmView;
  private enemyView: EnemyView;
  private gateView: GateView;
  private combatOverlay: CombatOverlay;
  private juice: JuiceController;

  private bgImage: HTMLImageElement | null = null;
  private isBgLoaded: boolean = false;

  private isDragging: boolean = false;
  private lastPointerX: number = 0;
  private keysDown: Set<string> = new Set();

  private isRunning: boolean = true;
  private lastTimestamp: number = 0;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement, sim: SimulationEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.sim = sim;

    this.projection = new Projection25D(canvas.width, canvas.height);
    this.swarmView = new SwarmView();
    this.enemyView = new EnemyView();
    this.gateView = new GateView();
    this.combatOverlay = new CombatOverlay();
    this.juice = new JuiceController();

    this.loadBackground();
    this.setupSimulationEvents();
    this.setupInputHandlers();
    this.startLoop();
  }

  private loadBackground(): void {
    if (typeof window === 'undefined') return;
    this.bgImage = new Image();
    this.bgImage.src = '/assets/corridor-subtle-vascular.jpg';
    this.bgImage.onload = () => {
      this.isBgLoaded = true;
    };
  }

  private setupSimulationEvents(): void {
    this.sim.setEventListener((event: SimulationEvent) => {
      switch (event.type) {
        case 'gate_passed': {
          soundEngine.playGateMultiplierChime();
          const proj = this.projection.project(this.sim.squadX, this.sim.squadY, this.sim.squadY);
          this.juice.spawnStarBurst(proj.x, proj.y, '#38bdf8', 12);
          this.juice.addCallout(`+${event.data.multiplierAdded} CELLS!`, proj.x, proj.y - 30, '#67e8f9');
          break;
        }
        case 'biofilm_shattered': {
          soundEngine.playBiofilmCrack();
          const proj = this.projection.project(this.sim.squadX, this.sim.squadY + 40, this.sim.squadY);
          this.juice.spawnStarBurst(proj.x, proj.y, '#f472b6', 16);
          this.juice.addCallout('SHATTERED!', proj.x, proj.y - 20, '#f472b6');
          break;
        }
        case 'microbe_engulfed': {
          soundEngine.playMarimbaPop(event.data.combo);
          if (event.data.combo > 1 && event.data.combo % 4 === 0) {
            const proj = this.projection.project(event.data.x, event.data.y, this.sim.squadY);
            this.juice.addCallout(`${event.data.combo}× COMBO!`, proj.x, proj.y - 15, '#fef08a');
          }
          break;
        }
        case 'microbe_frozen': {
          this.juice.addCallout('FROZEN!', this.canvas.width * 0.5, this.canvas.height * 0.6, '#38bdf8');
          break;
        }
        case 'medicine_fired': {
          soundEngine.playMedicineWave();
          this.combatOverlay.triggerMedicineWave(event.data.medicine, event.data.squadY);
          break;
        }
        case 'cytokine_surge_triggered': {
          soundEngine.playCytokineSurgeFanfare();
          this.juice.addCallout('CYTOKINE SURGE!', this.canvas.width * 0.5, this.canvas.height * 0.45, '#fbbf24');
          break;
        }
        case 'pinata_phase_started': {
          this.juice.addCallout('COLONY CLASH!', this.canvas.width * 0.5, this.canvas.height * 0.4, '#f43f5e');
          break;
        }
        case 'pinata_exploded': {
          this.juice.triggerClampedPiñataShake(this.sim.patrol.id);
          soundEngine.playPinataFanfare();
          this.juice.triggerConfettiCelebration();
          const proj = this.projection.project(0, this.sim.squadY + 80, this.sim.squadY);
          this.juice.spawnStarBurst(proj.x, proj.y, '#fef08a', 24);
          this.juice.addCallout('VICTORY!', this.canvas.width * 0.5, this.canvas.height * 0.35, '#34d399');
          break;
        }
      }
    });
  }

  private setupInputHandlers(): void {
    // Touch / Pointer relative drag
    const onPointerDown = (e: PointerEvent) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastPointerX;
      this.lastPointerX = e.clientX;

      // Sensitivity factor for responsive corridor navigation
      const sensitivity = 0.95;
      this.sim.setTargetSquadX(this.sim.targetSquadX + dx * sensitivity);
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Keyboard controls (A / D, Left / Right)
    const onKeyDown = (e: KeyboardEvent) => {
      this.keysDown.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keysDown.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  }

  private updateKeyboardInput(dt: number): void {
    const moveSpeed = 320;
    if (this.keysDown.has('ArrowLeft') || this.keysDown.has('KeyA')) {
      this.sim.setTargetSquadX(this.sim.targetSquadX - moveSpeed * dt);
    }
    if (this.keysDown.has('ArrowRight') || this.keysDown.has('KeyD')) {
      this.sim.setTargetSquadX(this.sim.targetSquadX + moveSpeed * dt);
    }
  }

  private startLoop(): void {
    const loop = (timestamp: number) => {
      if (!this.isRunning) return;

      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
      this.lastTimestamp = timestamp;

      // Process input
      this.updateKeyboardInput(dt);

      // Tick deterministic simulation
      this.sim.tick(dt);

      // Update juice and overlays
      const shakeOffset = this.juice.update(dt);
      this.combatOverlay.update(dt);

      // Render frame
      this.render(shakeOffset);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private render(shake: { offsetX: number; offsetY: number }): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.projection.resize(width, height);

    this.ctx.save();
    this.ctx.translate(shake.offsetX, shake.offsetY);
    this.ctx.clearRect(0, 0, width, height);

    // 1. Draw vascular corridor background (scrolled with squadY)
    this.renderBackground(width, height);

    // 2. Render multiplier gates and biofilms
    this.gateView.render(this.ctx, this.sim.gates, this.sim.biofilms, this.sim.squadY, this.projection);

    // 3. Render microbes & boss piñata
    this.enemyView.render(this.ctx, this.sim.microbes, this.sim.squadY, this.projection);

    // 4. Render defender squad & champions
    this.swarmView.render(this.ctx, this.sim.defenders, this.sim.champions, this.sim.squadY, this.projection);

    // 5. Render combat overlay (antibiotic waves, missiles, callouts)
    this.combatOverlay.render(this.ctx, this.sim.squadY, this.projection, this.juice);

    this.ctx.restore();
  }

  private renderBackground(width: number, height: number): void {
    if (this.isBgLoaded && this.bgImage) {
      const scrollY = (this.sim.squadY * 0.75) % height;

      // Draw two tiled backgrounds for seamless vertical scrolling
      this.ctx.drawImage(this.bgImage, 0, scrollY, width, height);
      this.ctx.drawImage(this.bgImage, 0, scrollY - height, width, height);
    } else {
      // Fallback deep plum gradient
      const grad = this.ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#2d0a1b');
      grad.addColorStop(1, '#18030d');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.projection.resize(width, height);
  }

  public destroy(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
