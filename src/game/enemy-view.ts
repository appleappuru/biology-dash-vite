import { MicrobeUnit, MicrobeSpecies } from '../core/types.js';
import { Projection25D } from './projection.js';

export class EnemyView {
  private spriteImage: HTMLImageElement | null = null;
  private isLoaded: boolean = false;

  private speciesCoordMap: Record<MicrobeSpecies, { col: number; row: number }> = {
    s_aureus: { col: 0, row: 0 },
    beta_lactamase_s_aureus: { col: 1, row: 0 },
    doxy_resistant_s_aureus: { col: 2, row: 0 },
    mrsa: { col: 0, row: 1 },
    antigen_b_s_aureus: { col: 1, row: 1 },
    s_pneumoniae: { col: 2, row: 1 },
    e_coli: { col: 0, row: 2 },
    pseudomonas_aeruginosa: { col: 1, row: 2 },
    candida_albicans: { col: 2, row: 2 }
  };

  constructor() {
    this.loadImage();
  }

  private loadImage(): void {
    if (typeof window === 'undefined') return;
    this.spriteImage = new Image();
    this.spriteImage.src = '/assets/microbes-biological-3d.png';
    this.spriteImage.onload = () => {
      this.isLoaded = true;
    };
  }

  public render(
    ctx: CanvasRenderingContext2D,
    microbes: MicrobeUnit[],
    squadY: number,
    projection: Projection25D
  ): void {
    // Sort microbes by depth (worldY)
    const sorted = [...microbes].sort((a, b) => a.y - b.y);

    for (const m of sorted) {
      if (m.hp <= 0 && !m.isBossCore) continue;
      this.renderMicrobe(ctx, m, squadY, projection);
    }
  }

  private renderMicrobe(
    ctx: CanvasRenderingContext2D,
    microbe: MicrobeUnit,
    squadY: number,
    projection: Projection25D
  ): void {
    const proj = projection.project(microbe.x, microbe.y, squadY);
    if (!proj.visible) return;

    ctx.save();

    const isBoss = microbe.isBossCore;
    const baseSize = isBoss ? microbe.radius * 2.8 : microbe.radius * 2.3;

    // 1. Directional ground contact shadow
    const shadowR = (isBoss ? 55 : microbe.radius * 0.9) * proj.scale;
    ctx.fillStyle = 'rgba(20, 5, 25, 0.35)';
    ctx.beginPath();
    ctx.ellipse(proj.x, proj.y + (isBoss ? 35 : 16) * proj.scale, shadowR, shadowR * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Translate and scale
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.scale, proj.scale);

    // Subtle breathing wobble
    const wobble = Math.sin(Date.now() * 0.006 + microbe.x) * 0.05;
    ctx.scale(1 + wobble, 1 - wobble);

    if (this.isLoaded && this.spriteImage) {
      const coords = this.speciesCoordMap[microbe.species] || { col: 0, row: 0 };
      const frameSize = 128;
      const srcX = coords.col * frameSize;
      const srcY = coords.row * frameSize;

      ctx.drawImage(
        this.spriteImage,
        srcX,
        srcY,
        frameSize,
        frameSize,
        -baseSize / 2,
        -baseSize / 2 - 4,
        baseSize,
        baseSize
      );
    }

    // 3. Frozen overlay if frozen by Doxycycline
    if (microbe.frozenTimer > 0) {
      ctx.save();
      // Cyan crystalline ice aura
      ctx.fillStyle = 'rgba(165, 243, 252, 0.45)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -4, baseSize * 0.52, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ice crystal prism sparkle
      ctx.fillStyle = '#ffffff';
      [-8, 8].forEach(ix => {
        ctx.beginPath();
        ctx.moveTo(ix, -12);
        ctx.lineTo(ix + 3, -8);
        ctx.lineTo(ix, -4);
        ctx.lineTo(ix - 3, -8);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    // 4. Boss Piñata decorations & HP bar
    if (isBoss) {
      ctx.save();
      // Piñata colorful ribbons
      const ribbonColors = ['#f43f5e', '#fbbf24', '#34d399', '#38bdf8', '#c084fc'];
      for (let r = 0; r < 5; r++) {
        ctx.strokeStyle = ribbonColors[r];
        ctx.lineWidth = 3;
        const wave = Math.sin(Date.now() * 0.008 + r) * 12;
        ctx.beginPath();
        ctx.moveTo(-baseSize * 0.35 + r * 16, baseSize * 0.35);
        ctx.lineTo(-baseSize * 0.35 + r * 16 + wave, baseSize * 0.55);
        ctx.stroke();
      }

      // Candy Glass Boss HP Bar
      const hpWidth = 110;
      const hpHeight = 12;
      const hpRatio = Math.max(0, microbe.hp / microbe.maxHp);

      // HP Bar background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(-hpWidth / 2, -baseSize * 0.62, hpWidth, hpHeight, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // HP Bar fill gradient
      const fillGrad = ctx.createLinearGradient(-hpWidth / 2, 0, hpWidth / 2, 0);
      fillGrad.addColorStop(0, '#f43f5e');
      fillGrad.addColorStop(0.5, '#fbbf24');
      fillGrad.addColorStop(1, '#34d399');
      ctx.fillStyle = fillGrad;
      ctx.beginPath();
      ctx.roundRect(-hpWidth / 2 + 1.5, -baseSize * 0.62 + 1.5, (hpWidth - 3) * hpRatio, hpHeight - 3, 4);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}
