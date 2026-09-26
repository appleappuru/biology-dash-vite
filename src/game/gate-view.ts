import { MultiplierGate, BiofilmBarrier } from '../core/types.js';
import { Projection25D } from './projection.js';

export class GateView {
  public render(
    ctx: CanvasRenderingContext2D,
    gates: MultiplierGate[],
    biofilms: BiofilmBarrier[],
    squadY: number,
    projection: Projection25D
  ): void {
    // Render gates
    for (const gate of gates) {
      this.renderGate(ctx, gate, squadY, projection);
    }

    // Render biofilms
    for (const biofilm of biofilms) {
      if (!biofilm.shattered) {
        this.renderBiofilm(ctx, biofilm, squadY, projection);
      }
    }
  }

  private renderGate(
    ctx: CanvasRenderingContext2D,
    gate: MultiplierGate,
    squadY: number,
    projection: Projection25D
  ): void {
    const proj = projection.project(gate.currentCenterX, gate.y, squadY);
    if (!proj.visible) return;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.scale, proj.scale);

    const gateWidth = gate.width;
    const gateHeight = 74;
    const halfWidth = gateWidth / 2;
    const laneWidth = gateWidth / 2 - 8;

    // Outer Gate Archway Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.roundRect(-halfWidth - 4, -gateHeight - 4, gateWidth + 8, gateHeight + 8, 16);
    ctx.fill();

    // 1. LEFT LANE
    const leftText = gate.leftOp === 'multiply' ? `×${gate.leftValue}` : `+${gate.leftValue}`;
    const leftColor = gate.leftOp === 'multiply' ? '#8b5cf6' : '#06b6d4';
    const leftGlow = gate.leftOp === 'multiply' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)';

    ctx.save();
    ctx.fillStyle = gate.leftPassed ? 'rgba(51, 65, 85, 0.5)' : leftGlow;
    ctx.strokeStyle = gate.leftPassed ? '#64748b' : leftColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-halfWidth + 4, -gateHeight, laneWidth, gateHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Volumetric glassy sheen on top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.roundRect(-halfWidth + 8, -gateHeight + 4, laneWidth - 8, gateHeight * 0.4, 8);
    ctx.fill();

    // Text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = leftColor;
    ctx.shadowBlur = 10;
    ctx.fillText(leftText, -halfWidth + 4 + laneWidth / 2, -gateHeight / 2 - 2);

    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 0;
    ctx.fillText(gate.leftOp === 'multiply' ? 'SWARM' : 'REINFORCE', -halfWidth + 4 + laneWidth / 2, -gateHeight + 14);
    ctx.restore();

    // 2. RIGHT LANE
    const rightText = gate.rightOp === 'multiply' ? `×${gate.rightValue}` : `+${gate.rightValue}`;
    const rightColor = gate.rightOp === 'multiply' ? '#f59e0b' : '#10b981';
    const rightGlow = gate.rightOp === 'multiply' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)';

    ctx.save();
    ctx.fillStyle = gate.rightPassed ? 'rgba(51, 65, 85, 0.5)' : rightGlow;
    ctx.strokeStyle = gate.rightPassed ? '#64748b' : rightColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(4, -gateHeight, laneWidth, gateHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Volumetric sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.roundRect(8, -gateHeight + 4, laneWidth - 8, gateHeight * 0.4, 8);
    ctx.fill();

    // Text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = rightColor;
    ctx.shadowBlur = 10;
    ctx.fillText(rightText, 4 + laneWidth / 2, -gateHeight / 2 - 2);

    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowBlur = 0;
    ctx.fillText(gate.rightOp === 'multiply' ? 'CASCADE' : 'REINFORCE', 4 + laneWidth / 2, -gateHeight + 14);
    ctx.restore();

    ctx.restore();
  }

  private renderBiofilm(
    ctx: CanvasRenderingContext2D,
    biofilm: BiofilmBarrier,
    squadY: number,
    projection: Projection25D
  ): void {
    const proj = projection.project(biofilm.x, biofilm.y, squadY);
    if (!proj.visible) return;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.scale, proj.scale);

    const bWidth = biofilm.width;
    const bHeight = biofilm.height;

    // Translucent gelatinous biofilm barrier
    const bioGrad = ctx.createLinearGradient(-bWidth / 2, -bHeight / 2, bWidth / 2, bHeight / 2);
    bioGrad.addColorStop(0, 'rgba(168, 85, 247, 0.65)');
    bioGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.75)');
    bioGrad.addColorStop(1, 'rgba(217, 70, 239, 0.65)');
    ctx.fillStyle = bioGrad;
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(-bWidth / 2, -bHeight / 2, bWidth, bHeight, 18);
    ctx.fill();
    ctx.stroke();

    // Viscous bubbles inside biofilm
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    [[-80, -10, 10], [-30, 8, 8], [40, -8, 12], [90, 6, 9]].forEach(([bx, by, br]) => {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    });

    // Biofilm HP bar
    const hpRatio = Math.max(0, biofilm.hp / biofilm.maxHp);
    const hpW = 120;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.roundRect(-hpW / 2, -bHeight / 2 - 16, hpW, 9, 4);
    ctx.fill();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(-hpW / 2 + 1, -bHeight / 2 - 15, (hpW - 2) * hpRatio, 7, 3);
    ctx.fill();

    // Reward icon text
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rewardText = biofilm.rewardType === 'coins' ? `💰 ${biofilm.rewardAmount}` : `★ FREE ${biofilm.rewardType.toUpperCase()}`;
    ctx.fillText(rewardText, 0, 0);

    ctx.restore();
  }
}
