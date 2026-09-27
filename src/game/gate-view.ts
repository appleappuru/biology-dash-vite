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

    // Outer Gate Archway Frame with metallic bevel and dark glass backplate
    ctx.save();
    ctx.fillStyle = 'rgba(15, 8, 20, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-halfWidth - 6, -gateHeight - 6, gateWidth + 12, gateHeight + 12, 18);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Helper to render a high-end arcade glass lane
    const renderLane = (
      x: number,
      width: number,
      op: 'multiply' | 'add',
      val: number,
      passed: boolean,
      baseColor: string,
      glowColor: string,
      label: string
    ) => {
      ctx.save();
      const text = op === 'multiply' ? `×${val}` : `+${val}`;

      if (passed) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(x, -gateHeight, width, gateHeight, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, -gateHeight / 2);
        ctx.restore();
        return;
      }

      // 1. Glowing outer border
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 3.5;

      // 2. High-contrast energetic glass gradient fill
      const laneGrad = ctx.createLinearGradient(x, -gateHeight, x, 0);
      if (op === 'multiply') {
        // Vibrant Amber/Gold or Royal Violet
        laneGrad.addColorStop(0, 'rgba(245, 158, 11, 0.65)');
        laneGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.4)');
        laneGrad.addColorStop(1, 'rgba(180, 83, 9, 0.65)');
      } else {
        // Electric Cyan / Teal
        laneGrad.addColorStop(0, 'rgba(6, 182, 212, 0.65)');
        laneGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.4)');
        laneGrad.addColorStop(1, 'rgba(8, 145, 178, 0.65)');
      }
      ctx.fillStyle = laneGrad;

      ctx.beginPath();
      ctx.roundRect(x, -gateHeight, width, gateHeight, 14);
      ctx.fill();
      ctx.stroke();

      // Reset shadow for crisp inner elements
      ctx.shadowBlur = 0;

      // 3. Inner glass bevel rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(x + 2, -gateHeight + 2, width - 4, gateHeight - 4, 12);
      ctx.stroke();

      // 4. Volumetric specular glass reflection (curved top sheen)
      const sheenGrad = ctx.createLinearGradient(x, -gateHeight + 3, x, -gateHeight + gateHeight * 0.45);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.roundRect(x + 4, -gateHeight + 3, width - 8, gateHeight * 0.4, 10);
      ctx.fill();

      // 5. Sleek frosted header badge pill
      const badgeW = width * 0.72;
      const badgeH = 15;
      const badgeX = x + (width - badgeW) / 2;
      const badgeY = -gateHeight + 7;
      ctx.fillStyle = 'rgba(15, 8, 20, 0.55)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 7);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, badgeX + badgeW / 2, badgeY + badgeH / 2);

      // 6. Large 3D Neon numeric multiplier value
      const valY = -gateHeight / 2 + 10;
      // Drop shadow for number
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(text, x + width / 2, valY + 2);

      // Glowing text
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x + width / 2, valY);

      ctx.restore();
    };

    // 1. LEFT LANE
    const leftColor = gate.leftOp === 'multiply' ? '#c084fc' : '#38bdf8';
    const leftGlow = gate.leftOp === 'multiply' ? 'rgba(192, 132, 252, 0.7)' : 'rgba(56, 189, 248, 0.7)';
    const leftLabel = gate.leftOp === 'multiply' ? 'SWARM' : 'REINFORCE';
    renderLane(-halfWidth + 4, laneWidth, gate.leftOp, gate.leftValue, gate.leftPassed, leftColor, leftGlow, leftLabel);

    // 2. RIGHT LANE
    const rightColor = gate.rightOp === 'multiply' ? '#fbbf24' : '#34d399';
    const rightGlow = gate.rightOp === 'multiply' ? 'rgba(251, 191, 36, 0.7)' : 'rgba(52, 211, 153, 0.7)';
    const rightLabel = gate.rightOp === 'multiply' ? 'CASCADE' : 'REINFORCE';
    renderLane(4, laneWidth, gate.rightOp, gate.rightValue, gate.rightPassed, rightColor, rightGlow, rightLabel);

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
