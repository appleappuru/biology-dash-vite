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

    // -------------------------------------------------------------
    // TWO INDEPENDENT FREESTANDING PORTALS (NO SHARED CHAIN / FRAME)
    // -------------------------------------------------------------
    const portalWidth = 108;
    const portalHeight = 78;
    const laneOffset = gateWidth * 0.28; // e.g. 78px from center

    const renderIndependentPortal = (
      centerX: number,
      op: 'multiply' | 'add',
      val: number,
      passed: boolean,
      baseColor: string,
      glowColor: string,
      label: string
    ) => {
      ctx.save();
      ctx.translate(centerX, 0);
      const text = op === 'multiply' ? `×${val}` : `+${val}`;

      if (passed) {
        // Passed portal: inactive dark glass
        ctx.fillStyle = 'rgba(20, 25, 35, 0.6)';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-portalWidth / 2, -portalHeight, portalWidth, portalHeight, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, -portalHeight / 2);
        ctx.restore();
        return;
      }

      // 1. Freestanding ground pedestal shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 4, portalWidth * 0.55, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Freestanding Ground Base Pedestal
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-portalWidth / 2 - 4, -8, portalWidth + 8, 12, 6);
      ctx.fill();
      ctx.stroke();

      // 3. Glowing neon energy portal archway
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 3.5;

      // Volumetric energetic vertical gradient
      const portalGrad = ctx.createLinearGradient(0, -portalHeight, 0, 0);
      if (op === 'multiply') {
        portalGrad.addColorStop(0, 'rgba(245, 158, 11, 0.75)');
        portalGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.45)');
        portalGrad.addColorStop(1, 'rgba(180, 83, 9, 0.7)');
      } else {
        portalGrad.addColorStop(0, 'rgba(6, 182, 212, 0.75)');
        portalGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.45)');
        portalGrad.addColorStop(1, 'rgba(8, 145, 178, 0.7)');
      }
      ctx.fillStyle = portalGrad;

      ctx.beginPath();
      ctx.roundRect(-portalWidth / 2, -portalHeight, portalWidth, portalHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Clear shadow for crisp interior
      ctx.shadowBlur = 0;

      // 4. Inner glass reflection bevel
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-portalWidth / 2 + 3, -portalHeight + 3, portalWidth - 6, portalHeight - 6, 13);
      ctx.stroke();

      // 5. Curved top specular glass sheen
      const sheenGrad = ctx.createLinearGradient(0, -portalHeight + 4, 0, -portalHeight + 32);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.roundRect(-portalWidth / 2 + 5, -portalHeight + 4, portalWidth - 10, 26, 10);
      ctx.fill();

      // 6. Left & Right vertical energy side pillars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(-portalWidth / 2 + 4, -portalHeight + 12, 3, portalHeight - 24);
      ctx.fillRect(portalWidth / 2 - 7, -portalHeight + 12, 3, portalHeight - 24);

      // 7. Frosted top header badge
      const badgeW = portalWidth * 0.78;
      const badgeH = 16;
      ctx.fillStyle = 'rgba(15, 8, 20, 0.65)';
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -portalHeight + 7, badgeW, badgeH, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, -portalHeight + 7 + badgeH / 2);

      // 8. 3D Neon numeric multiplier value
      const numY = -portalHeight / 2 + 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(text, 0, numY + 2);

      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 0, numY);

      ctx.restore();
    };

    // 1. LEFT INDEPENDENT PORTAL
    const leftColor = gate.leftOp === 'multiply' ? '#c084fc' : '#38bdf8';
    const leftGlow = gate.leftOp === 'multiply' ? 'rgba(192, 132, 252, 0.8)' : 'rgba(56, 189, 248, 0.8)';
    const leftLabel = gate.leftOp === 'multiply' ? 'SWARM' : 'REINFORCE';
    renderIndependentPortal(-laneOffset, gate.leftOp, gate.leftValue, gate.leftPassed, leftColor, leftGlow, leftLabel);

    // 2. RIGHT INDEPENDENT PORTAL (with wide open gap in the middle)
    const rightColor = gate.rightOp === 'multiply' ? '#fbbf24' : '#34d399';
    const rightGlow = gate.rightOp === 'multiply' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(52, 211, 153, 0.8)';
    const rightLabel = gate.rightOp === 'multiply' ? 'CASCADE' : 'REINFORCE';
    renderIndependentPortal(laneOffset, gate.rightOp, gate.rightValue, gate.rightPassed, rightColor, rightGlow, rightLabel);

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
    const bHeight = 48; // Sleeker, more organic profile

    // 1. Organic Extracellular Slime Matrix (Wavy Bezier Web)
    const time = Date.now() * 0.003;
    ctx.save();
    const slimeGrad = ctx.createLinearGradient(-bWidth / 2, -bHeight / 2, bWidth / 2, bHeight / 2);
    slimeGrad.addColorStop(0, 'rgba(147, 51, 234, 0.65)');
    slimeGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.7)');
    slimeGrad.addColorStop(1, 'rgba(168, 85, 247, 0.65)');
    ctx.fillStyle = slimeGrad;
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-bWidth / 2, -bHeight / 2);
    // Wavy top edge
    for (let x = -bWidth / 2; x <= bWidth / 2; x += 30) {
      const wave = Math.sin(time + x * 0.05) * 6;
      ctx.lineTo(x, -bHeight / 2 + wave);
    }
    ctx.lineTo(bWidth / 2, bHeight / 2);
    // Wavy bottom edge with dripping tendrils
    for (let x = bWidth / 2; x >= -bWidth / 2; x -= 30) {
      const wave = Math.sin(time * 1.2 + x * 0.04) * 8;
      ctx.lineTo(x, bHeight / 2 + wave);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Floating viscous bubbles inside matrix
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    [[-100, -6, 8], [-40, 6, 7], [30, -5, 10], [90, 4, 8]].forEach(([bx, by, br]) => {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 2. High-Tech Floating Barrier HUD Header
    const hpRatio = Math.max(0, biofilm.hp / biofilm.maxHp);
    const hpW = 140;
    const hpH = 10;
    const plateY = -bHeight / 2 - 20;

    // Dark glass backing plate
    ctx.fillStyle = 'rgba(15, 8, 20, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-hpW / 2 - 6, plateY - 14, hpW + 12, hpH + 22, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Barrier label
    ctx.fillStyle = '#fdf2f8';
    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BIOFILM MATRIX', 0, plateY - 5);

    // Segmented HP Bar
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.beginPath();
    ctx.roundRect(-hpW / 2, plateY + 4, hpW, hpH, 4);
    ctx.fill();

    const hpGrad = ctx.createLinearGradient(-hpW / 2, 0, hpW / 2, 0);
    hpGrad.addColorStop(0, '#f43f5e');
    hpGrad.addColorStop(0.5, '#ec4899');
    hpGrad.addColorStop(1, '#a855f7');
    ctx.fillStyle = hpGrad;
    ctx.beginPath();
    ctx.roundRect(-hpW / 2 + 1, plateY + 5, Math.max(0, (hpW - 2) * hpRatio), hpH - 2, 3);
    ctx.fill();

    // Reward indicator on matrix
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rewardText = biofilm.rewardType === 'coins' ? `💰 +${biofilm.rewardAmount} COINS` : `★ FREE ${biofilm.rewardType.toUpperCase()}`;
    ctx.fillText(rewardText, 0, 2);

    ctx.restore();
  }
}
