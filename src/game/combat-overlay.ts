import { MedicineType } from '../core/types.js';
import { Projection25D } from './projection.js';
import { JuiceController } from './juice.js';

export interface ChemicalWaveEffect {
  medicine: MedicineType;
  squadY: number;
  progress: number; // 0 to 1
  lifetime: number; // seconds
}

export interface AntibodyMissile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetId: string;
  progress: number;
}

export class CombatOverlay {
  private waves: ChemicalWaveEffect[] = [];
  private missiles: AntibodyMissile[] = [];

  public triggerMedicineWave(medicine: MedicineType, squadY: number): void {
    this.waves.push({
      medicine,
      squadY,
      progress: 0,
      lifetime: 0.75
    });
  }

  public spawnAntibodyMissile(x: number, y: number, targetX: number, targetY: number, targetId: string): void {
    this.missiles.push({
      x,
      y,
      targetX,
      targetY,
      targetId,
      progress: 0
    });
  }

  public update(dt: number): void {
    // Update waves
    for (let w = this.waves.length - 1; w >= 0; w--) {
      const wave = this.waves[w];
      wave.progress += dt / wave.lifetime;
      if (wave.progress >= 1.0) {
        this.waves.splice(w, 1);
      }
    }

    // Update missiles
    for (let m = this.missiles.length - 1; m >= 0; m--) {
      const missile = this.missiles[m];
      missile.progress += dt * 3.5; // reaches target fast
      if (missile.progress >= 1.0) {
        this.missiles.splice(m, 1);
      }
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    squadY: number,
    projection: Projection25D,
    juice: JuiceController
  ): void {
    // 1. Render chemical medicine waves
    for (const wave of this.waves) {
      this.renderWave(ctx, wave, squadY, projection);
    }

    // 2. Render antibody missiles
    for (const missile of this.missiles) {
      this.renderMissile(ctx, missile, squadY, projection);
    }

    // 3. Render juice particles
    for (const p of juice.getParticles()) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Render floating callouts
    for (const c of juice.getCallouts()) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);
      ctx.globalAlpha = c.alpha;

      // Soft pastel badge background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.beginPath();
      ctx.roundRect(-50, -14, 100, 28, 14);
      ctx.fill();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text
      ctx.fillStyle = c.color;
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.text, 0, 0);

      ctx.restore();
    }
  }

  private renderWave(
    ctx: CanvasRenderingContext2D,
    wave: ChemicalWaveEffect,
    squadY: number,
    projection: Projection25D
  ): void {
    const worldY = wave.squadY + wave.progress * 650;
    const proj = projection.project(0, worldY, squadY);
    if (!proj.visible) return;

    ctx.save();
    const alpha = Math.max(0, 1.0 - wave.progress);
    ctx.globalAlpha = alpha;

    let color = '#fbbf24';
    if (wave.medicine === 'doxycycline') color = '#38bdf8';
    else if (wave.medicine === 'cefepime') color = '#10b981';
    else if (wave.medicine === 'micafungin') color = '#e879f9';

    // Expanding chemical shockwave ring
    const ringWidth = (180 + wave.progress * 260) * proj.scale;
    const ringHeight = 28 * proj.scale;

    ctx.strokeStyle = color;
    ctx.lineWidth = 6 * (1 - wave.progress * 0.5);
    ctx.beginPath();
    ctx.ellipse(proj.x, proj.y, ringWidth, ringHeight, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Soft glowing interior wash
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * 0.25;
    ctx.fill();

    ctx.restore();
  }

  private renderMissile(
    ctx: CanvasRenderingContext2D,
    missile: AntibodyMissile,
    squadY: number,
    projection: Projection25D
  ): void {
    const curWorldX = missile.x + (missile.targetX - missile.x) * missile.progress;
    const curWorldY = missile.y + (missile.targetY - missile.y) * missile.progress;

    const proj = projection.project(curWorldX, curWorldY, squadY);
    if (!proj.visible) return;

    ctx.save();
    ctx.translate(proj.x, proj.y);

    // Glowing golden antibody star
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Golden Y-shaped IgG icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(0, 0);
    ctx.lineTo(-4, -6);
    ctx.moveTo(0, 0);
    ctx.lineTo(4, -6);
    ctx.stroke();

    ctx.restore();
  }
}
