import { DefenderUnit, ChampionUnit } from '../core/types.js';
import { Projection25D } from './projection.js';

export class SwarmView {
  private spriteImage: HTMLImageElement | null = null;
  private isLoaded: boolean = false;

  constructor() {
    this.loadImage();
  }

  private loadImage(): void {
    if (typeof window === 'undefined') return;
    this.spriteImage = new Image();
    this.spriteImage.src = '/assets/defenders-biological-3d.png';
    this.spriteImage.onload = () => {
      this.isLoaded = true;
    };
  }

  public render(
    ctx: CanvasRenderingContext2D,
    defenders: DefenderUnit[],
    champions: ChampionUnit[],
    squadY: number,
    projection: Projection25D
  ): void {
    // Sort all units by depth (worldY) so units in back render first
    const allUnits = [
      ...defenders.map(d => ({ type: 'defender' as const, data: d, y: d.y })),
      ...champions.map(c => ({ type: 'champion' as const, data: c, y: c.y }))
    ].sort((a, b) => a.y - b.y);

    for (const item of allUnits) {
      if (item.type === 'defender') {
        this.renderDefender(ctx, item.data, squadY, projection);
      } else {
        this.renderChampion(ctx, item.data, squadY, projection);
      }
    }
  }

  private renderDefender(
    ctx: CanvasRenderingContext2D,
    unit: DefenderUnit,
    squadY: number,
    projection: Projection25D
  ): void {
    const proj = projection.project(unit.x, unit.y, squadY);
    if (!proj.visible) return;

    ctx.save();

    // 1. Soft directional 3/4 perspective ground contact shadow
    const shadowScale = proj.scale;
    const shadowR = (unit.kind === 'macrophage' ? 24 : 18) * shadowScale;
    ctx.fillStyle = 'rgba(25, 5, 20, 0.32)';
    ctx.beginPath();
    ctx.ellipse(proj.x, proj.y + 22 * shadowScale, shadowR, shadowR * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Transform for squash and stretch
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.scale * unit.squashX, proj.scale * unit.squashY);

    if (this.isLoaded && this.spriteImage) {
      // Determine frame row: 0 = neutrophil, 1 = macrophage, 2 = plasma_cell
      let row = 0;
      if (unit.kind === 'macrophage') row = 1;
      else if (unit.kind === 'plasma_cell') row = 2;

      // Determine frame column:
      // 0 = Idle Cheer, 1 = Running Stride, 2 = Attack Hug/Spear, 3 = Sleep/Defeat
      let col = 0;
      if (unit.state === 'engulfing' || unit.state === 'digesting') {
        col = 2; // The Hug Pose / Spear Thrust!
      } else if (unit.state === 'marching') {
        col = Math.sin(unit.stridePhase) > 0 ? 1 : 0;
      } else if (unit.state === 'defeated') {
        col = 3;
      }

      const frameSize = 256;
      const srcX = col * frameSize;
      const srcY = row * frameSize;
      const destSize = unit.kind === 'macrophage' ? 72 : 56;

      ctx.drawImage(
        this.spriteImage,
        srcX,
        srcY,
        frameSize,
        frameSize,
        -destSize / 2,
        -destSize / 2 - 8,
        destSize,
        destSize
      );
    }

    ctx.restore();
  }

  private renderChampion(
    ctx: CanvasRenderingContext2D,
    champ: ChampionUnit,
    squadY: number,
    projection: Projection25D
  ): void {
    const proj = projection.project(champ.x, champ.y, squadY);
    if (!proj.visible) return;

    ctx.save();

    const isTitan = champ.kind === 'titan_macrophage';
    const baseSize = isTitan ? 160 : 130; // 3x / 2.4x titan scale

    // 1. Radiant Champion Aura Ring on Ground
    ctx.save();
    const auraRadius = (isTitan ? 65 : 55) * proj.scale;
    const auraGrad = ctx.createRadialGradient(proj.x, proj.y + 35 * proj.scale, 10, proj.x, proj.y + 35 * proj.scale, auraRadius);
    auraGrad.addColorStop(0, isTitan ? 'rgba(52, 211, 153, 0.45)' : 'rgba(234, 179, 8, 0.5)');
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.ellipse(proj.x, proj.y + 35 * proj.scale, auraRadius, auraRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Transform for champion squash and stretch
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.scale * champ.squashX, proj.scale * champ.squashY);

    if (this.isLoaded && this.spriteImage) {
      const row = isTitan ? 1 : 2; // Macrophage or Plasma Queen
      const col = isTitan ? 2 : 2; // Bear hug or Spellcast pose

      const frameSize = 256;
      const srcX = col * frameSize;
      const srcY = row * frameSize;

      ctx.drawImage(
        this.spriteImage,
        srcX,
        srcY,
        frameSize,
        frameSize,
        -baseSize / 2,
        -baseSize / 2 - 12,
        baseSize,
        baseSize
      );

      // Champion golden crown / power indicator
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, -baseSize / 2 - 6, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
