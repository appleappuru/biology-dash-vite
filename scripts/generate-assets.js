import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  console.log('Launching browser to render high-fidelity 2.5D candy sprites & vascular background...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Create an HTML page with canvas rendering logic
  await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: transparent; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    window.renderDefenders = function() {
      const c = document.getElementById('c');
      c.width = 1024;
      c.height = 768;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 1024, 768);

      // Helper for glossy 3D spheres
      function drawCandySphere(ctx, x, y, r, baseColor, highlightColor, shadowColor) {
        ctx.save();
        // Drop shadow
        const shadowGrad = ctx.createRadialGradient(x, y + r * 0.9, r * 0.2, x, y + r * 0.9, r * 0.9);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.9, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Base sphere
        const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
        grad.addColorStop(0, highlightColor || '#ffffff');
        grad.addColorStop(0.35, baseColor);
        grad.addColorStop(0.85, shadowColor || baseColor);
        grad.addColorStop(1, 'rgba(0,0,0,0.25)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight
        ctx.lineWidth = Math.max(1.5, r * 0.08);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Glossy specular crescent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.35, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Secondary tiny glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(x + r * 0.35, y + r * 0.3, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawChibiEyes(ctx, x, y, size, mood = 'happy') {
        ctx.save();
        const eyeOffset = size * 0.35;
        const eyeRadius = size * 0.16;

        if (mood === 'sleep') {
          // Closed sleepy eyes: cute curved arcs
          ctx.strokeStyle = '#3a2042';
          ctx.lineWidth = size * 0.07;
          ctx.lineCap = 'round';
          [-eyeOffset, eyeOffset].forEach(dx => {
            ctx.beginPath();
            ctx.arc(x + dx, y, eyeRadius, 0.2 * Math.PI, 0.8 * Math.PI, false);
            ctx.stroke();
          });
        } else {
          [-eyeOffset, eyeOffset].forEach(dx => {
            const ex = x + dx;
            const ey = y;
            // Eye base
            ctx.fillStyle = '#221430';
            ctx.beginPath();
            ctx.ellipse(ex, ey, eyeRadius * 0.8, eyeRadius, 0, 0, Math.PI * 2);
            ctx.fill();
            // Primary sparkle
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ex - eyeRadius * 0.25, ey - eyeRadius * 0.35, eyeRadius * 0.38, 0, Math.PI * 2);
            ctx.fill();
            // Secondary small sparkle
            ctx.beginPath();
            ctx.arc(ex + eyeRadius * 0.2, ey + eyeRadius * 0.3, eyeRadius * 0.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Rosy cheeks
        ctx.fillStyle = 'rgba(255, 120, 160, 0.45)';
        ctx.beginPath();
        ctx.ellipse(x - eyeOffset * 1.3, y + size * 0.18, size * 0.18, size * 0.1, 0, 0, Math.PI * 2);
        ctx.ellipse(x + eyeOffset * 1.3, y + size * 0.18, size * 0.18, size * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#6e2b52';
        ctx.lineWidth = size * 0.06;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (mood === 'cheer' || mood === 'attack') {
          ctx.fillStyle = '#e84f70';
          ctx.arc(x, y + size * 0.18, size * 0.16, 0.1 * Math.PI, 0.9 * Math.PI, false);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (mood === 'sleep') {
          // cute tiny o mouth
          ctx.beginPath();
          ctx.arc(x, y + size * 0.2, size * 0.08, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.arc(x, y + size * 0.15, size * 0.12, 0.15 * Math.PI, 0.85 * Math.PI, false);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ==========================================
      // ROW 0: NEUTROPHIL (PMN) (4 columns @ 256x256)
      // ==========================================
      for (let col = 0; col < 4; col++) {
        const ox = col * 256 + 128;
        const oy = 0 * 256 + 128;
        ctx.save();

        // Ground contact shadow
        const gGrad = ctx.createRadialGradient(ox, oy + 85, 10, ox, oy + 85, 65);
        gGrad.addColorStop(0, 'rgba(40, 10, 30, 0.35)');
        gGrad.addColorStop(1, 'rgba(40, 10, 30, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.ellipse(ox, oy + 85, 60, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        let bodyY = oy;
        let squashX = 1;
        let squashY = 1;
        let mood = 'cheer';

        if (col === 1) { // Stride
          bodyY = oy - 8;
          squashX = 0.95;
          squashY = 1.05;
          mood = 'cheer';
        } else if (col === 2) { // Spear Thrust
          bodyY = oy + 4;
          squashX = 1.1;
          squashY = 0.9;
          mood = 'attack';
        } else if (col === 3) { // Curled up sleep
          bodyY = oy + 25;
          squashX = 1.25;
          squashY = 0.75;
          mood = 'sleep';
        }

        ctx.translate(ox, bodyY);
        ctx.scale(squashX, squashY);

        // Chubby white porcelain gummy body
        const bodyGrad = ctx.createRadialGradient(-18, -25, 12, 0, 0, 68);
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.3, '#fbfaff');
        bodyGrad.addColorStop(0.75, '#e4e0f4');
        bodyGrad.addColorStop(0.95, '#cbc4e8');
        bodyGrad.addColorStop(1, '#a69ccb');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 65, 62, 0, 0, Math.PI * 2);
        ctx.fill();

        // Volumetric gloss rim
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();

        // 3-Lobed purple-violet chromatin nucleus visible inside translucent cytoplasm!
        ctx.save();
        ctx.globalAlpha = 0.72;
        // Connective chromatin strands
        ctx.strokeStyle = '#6d28d9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-22, -10);
        ctx.quadraticCurveTo(-6, 2, 10, -8);
        ctx.quadraticCurveTo(8, 18, -14, 16);
        ctx.stroke();

        // Lobe 1 (top left)
        drawCandySphere(ctx, -22, -10, 14, '#7c3aed', '#c4b5fd', '#5b21b6');
        // Lobe 2 (top right)
        drawCandySphere(ctx, 14, -8, 15, '#7c3aed', '#c4b5fd', '#5b21b6');
        // Lobe 3 (bottom)
        drawCandySphere(ctx, -6, 18, 13, '#6d28d9', '#a78bfa', '#4c1d95');

        // Fine cytoplasmic granule sprinkles
        const granules = [
          [-35, -20], [-28, 25], [30, -18], [25, 20], [0, -38], [-38, 2], [32, 5], [-12, -30], [20, -32]
        ];
        granules.forEach(([gx, gy], i) => {
          ctx.fillStyle = i % 2 === 0 ? 'rgba(168, 85, 247, 0.75)' : 'rgba(236, 72, 153, 0.65)';
          ctx.beginPath();
          ctx.arc(gx, gy, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Surface gloss highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(-26, -30, 22, 10, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Cute chibi face
        if (col !== 3) {
          drawChibiEyes(ctx, 0, -5, 34, mood);
        } else {
          drawChibiEyes(ctx, 5, 2, 30, 'sleep');
        }

        // Chromatin NETosis spear
        if (col === 0) {
          // Upright idle spear
          ctx.save();
          ctx.translate(48, -15);
          ctx.rotate(0.15);
          // Shaft (twisted chromatin DNA helix style)
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(0, 50);
          ctx.lineTo(0, -65);
          ctx.stroke();
          // Spearhead
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(0, -80);
          ctx.lineTo(-12, -60);
          ctx.lineTo(12, -60);
          ctx.closePath();
          ctx.fill();
          // Sparkling tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -78, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (col === 1) {
          // Running forward spear
          ctx.save();
          ctx.translate(45, -5);
          ctx.rotate(0.35);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-10, 45);
          ctx.lineTo(15, -65);
          ctx.stroke();
          // Spearhead
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(18, -80);
          ctx.lineTo(6, -60);
          ctx.lineTo(26, -56);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (col === 2) {
          // NETosis Thrust Attack! Glowing chromatin web wrapping around spear tip!
          ctx.save();
          ctx.translate(35, 5);
          ctx.rotate(1.2);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-30, 40);
          ctx.lineTo(10, -90);
          ctx.stroke();

          // Massive glowing crystalline spearhead
          const spearGrad = ctx.createLinearGradient(0, -70, 10, -115);
          spearGrad.addColorStop(0, '#f43f5e');
          spearGrad.addColorStop(1, '#fda4af');
          ctx.fillStyle = spearGrad;
          ctx.beginPath();
          ctx.moveTo(10, -120);
          ctx.lineTo(-8, -85);
          ctx.lineTo(26, -85);
          ctx.closePath();
          ctx.fill();

          // NETosis web fibers expanding from spear tip!
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 2.5;
          for (let w = 0; w < 6; w++) {
            const angle = (w / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(10, -120);
            ctx.quadraticCurveTo(
              10 + Math.cos(angle) * 35,
              -120 + Math.sin(angle) * 35,
              10 + Math.cos(angle) * 60,
              -120 + Math.sin(angle) * 60
            );
            ctx.stroke();
          }
          // Glowing star at tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(10, -120, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (col === 3) {
          // Sleeping/defeated spear resting beside
          ctx.save();
          ctx.translate(55, 30);
          ctx.rotate(1.4);
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, 35);
          ctx.lineTo(0, -60);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // ==========================================
      // ROW 1: MACROPHAGE (4 columns @ 256x256)
      // ==========================================
      for (let col = 0; col < 4; col++) {
        const ox = col * 256 + 128;
        const oy = 1 * 256 + 128;
        ctx.save();

        // Soft ground shadow
        const gGrad = ctx.createRadialGradient(ox, oy + 90, 15, ox, oy + 90, 80);
        gGrad.addColorStop(0, 'rgba(10, 45, 30, 0.38)');
        gGrad.addColorStop(1, 'rgba(10, 45, 30, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.ellipse(ox, oy + 90, 78, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        let bodyY = oy;
        let squashX = 1;
        let squashY = 1;

        if (col === 1) { // Stride
          bodyY = oy - 6;
          squashX = 0.94;
          squashY = 1.06;
        } else if (col === 2) { // Signature Loving Bear-Hug Attack
          bodyY = oy + 5;
          squashX = 1.15;
          squashY = 0.92;
        } else if (col === 3) { // Rear view
          bodyY = oy;
        }

        ctx.translate(ox, bodyY);
        ctx.scale(squashX, squashY);

        // Undulating ruffled lamellipodia skirt
        ctx.save();
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        const skirtPoints = 16;
        for (let i = 0; i <= skirtPoints; i++) {
          const theta = (i / skirtPoints) * Math.PI * 2;
          const ruffle = Math.sin(theta * 6 + (col * 1.5)) * 9;
          const radX = 82 + ruffle;
          const radY = 74 + ruffle;
          const px = Math.cos(theta) * radX;
          const py = Math.sin(theta) * radY + 12;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.restore();

        // Giant squishy mint-green gummy protector body
        const mGrad = ctx.createRadialGradient(-25, -28, 15, 0, 0, 78);
        mGrad.addColorStop(0, '#ecfdf5');
        mGrad.addColorStop(0.3, '#a7f3d0');
        mGrad.addColorStop(0.75, '#34d399');
        mGrad.addColorStop(0.95, '#059669');
        mGrad.addColorStop(1, '#047857');

        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 75, 70, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rim highlight
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.stroke();

        // Biological hallmark: Indented kidney-shaped nucleus visible inside!
        ctx.save();
        ctx.globalAlpha = 0.75;
        // Kidney bean nucleus path
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(12, -25);
        ctx.bezierCurveTo(36, -20, 38, 22, 14, 28);
        ctx.bezierCurveTo(-2, 30, -10, 18, 0, 5);
        ctx.bezierCurveTo(8, -6, -2, -18, 12, -25);
        ctx.closePath();
        ctx.fill();
        // Inner gradient on kidney nucleus
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Internal digestive vacuoles with glossy bubble sheen
        const vacuoles = [
          [-28, -12, 12], [-32, 18, 14], [-12, -32, 9], [25, -22, 10]
        ];
        vacuoles.forEach(([vx, vy, vr], vi) => {
          ctx.fillStyle = vi % 2 === 0 ? 'rgba(254, 240, 138, 0.5)' : 'rgba(251, 113, 133, 0.45)';
          ctx.beginPath();
          ctx.arc(vx, vy, vr, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        ctx.restore();

        // Glossy candy glaze surface sheen
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(-30, -32, 28, 12, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        if (col === 0) {
          // Frame 0: 3/4 Friendly Wave
          drawChibiEyes(ctx, 0, -8, 38, 'happy');
          // Waving ruffled pseudopod arm
          ctx.save();
          ctx.fillStyle = '#34d399';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(62, -30, 24, 16, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        } else if (col === 1) {
          // Frame 1: Welcoming Stride
          drawChibiEyes(ctx, 0, -10, 38, 'happy');
          // Outstretched open arms
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.ellipse(-65, -8, 22, 15, -0.3, 0, Math.PI * 2);
          ctx.ellipse(65, -8, 22, 15, 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (col === 2) {
          // Frame 2: SIGNATURE LOVING BEAR-HUG ATTACK!
          // Wide gelatinous arms wrapped around a trapped pink invader in a loving squash!
          drawChibiEyes(ctx, 0, -15, 38, 'cheer');

          // Giant bear-hug arms closing inward
          ctx.save();
          const armGrad = ctx.createRadialGradient(0, 15, 10, 0, 15, 75);
          armGrad.addColorStop(0, '#6ee7b7');
          armGrad.addColorStop(1, '#059669');
          ctx.fillStyle = armGrad;
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#ffffff';

          // Trapped cute pink invader getting squashed happily!
          ctx.save();
          drawCandySphere(ctx, 0, 18, 26, '#ec4899', '#fbcfe8', '#be185d');
          // Squashed invader chibi dizzy spiral eyes
          ctx.strokeStyle = '#831843';
          ctx.lineWidth = 2.5;
          [-7, 7].forEach(ex => {
            ctx.beginPath();
            ctx.arc(ex, 14, 4, 0, Math.PI * 2);
            ctx.stroke();
          });
          // Invader surprised squished mouth
          ctx.beginPath();
          ctx.arc(0, 23, 4, 0, Math.PI);
          ctx.stroke();
          ctx.restore();

          // Left hug arm
          ctx.beginPath();
          ctx.ellipse(-40, 20, 36, 18, 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Right hug arm
          ctx.beginPath();
          ctx.ellipse(40, 20, 36, 18, -0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Floating loving hearts / squish particles!
          ctx.fillStyle = '#f43f5e';
          [-28, 28].forEach(hx => {
            ctx.beginPath();
            ctx.arc(hx - 3, -40, 4, 0, Math.PI * 2);
            ctx.arc(hx + 3, -40, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hx - 7, -39);
            ctx.lineTo(hx + 7, -39);
            ctx.lineTo(hx, -31);
            ctx.closePath();
            ctx.fill();
          });
          ctx.restore();
        } else if (col === 3) {
          // Frame 3: Rear 3/4 Skirt
          // Translucent back showing undulating skirt and kidney nucleus from behind
          // Cute rear little tail bump
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.ellipse(0, 15, 32, 22, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // ==========================================
      // ROW 2: PLASMA CELL (4 columns @ 256x256)
      // ==========================================
      for (let col = 0; col < 4; col++) {
        const ox = col * 256 + 128;
        const oy = 2 * 256 + 128;
        ctx.save();

        // Soft ground shadow beneath floating mystic
        const gGrad = ctx.createRadialGradient(ox, oy + 92, 10, ox, oy + 92, 55);
        gGrad.addColorStop(0, 'rgba(45, 15, 60, 0.28)');
        gGrad.addColorStop(1, 'rgba(45, 15, 60, 0)');
        ctx.fillStyle = gGrad;
        ctx.beginPath();
        ctx.ellipse(ox, oy + 92, 52, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        let bodyY = oy - 12; // Floating mystic hover
        let squashX = 1;
        let squashY = 1;

        if (col === 1) { // Swoop flight
          bodyY = oy - 20;
          squashX = 0.92;
          squashY = 1.08;
        } else if (col === 2) { // Dual IgG Antibody Spellcast
          bodyY = oy - 16;
          squashX = 1.08;
          squashY = 0.95;
        } else if (col === 3) { // Rear Halo
          bodyY = oy - 12;
        }

        ctx.translate(ox, bodyY);
        ctx.scale(squashX, squashY);

        // GLOWING PERINUCLEAR GOLGI HOF HALO RING!
        ctx.save();
        const haloGrad = ctx.createRadialGradient(0, -52, 12, 0, -52, 45);
        haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        haloGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.6)');
        haloGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.ellipse(0, -52, 45, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Golden ring stroke
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fef08a';
        ctx.stroke();
        ctx.restore();

        // Flowing violet mystic robe / cape
        ctx.save();
        const capeGrad = ctx.createLinearGradient(0, -10, 0, 68);
        capeGrad.addColorStop(0, '#8b5cf6');
        capeGrad.addColorStop(0.6, '#6d28d9');
        capeGrad.addColorStop(1, '#4c1d95');
        ctx.fillStyle = capeGrad;
        ctx.beginPath();
        ctx.moveTo(-45, -5);
        ctx.bezierCurveTo(-55, 30, -45, 65, -30, 72);
        ctx.bezierCurveTo(0, 64, 0, 64, 30, 72);
        ctx.bezierCurveTo(45, 65, 55, 30, 45, -5);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
        ctx.restore();

        // Glossy lavender porcelain figurine head/torso
        drawCandySphere(ctx, 0, -12, 48, '#c4b5fd', '#ede9fe', '#7c3aed');

        // BIOLOGICAL HALLMARK: DISTINCT CLOCK-FACE CARTWHEEL HETEROCHROMATIN NUCLEUS!
        ctx.save();
        const nX = 0;
        const nY = -12;
        const nR = 24;
        // Nucleus base circle
        ctx.fillStyle = '#4c1d95';
        ctx.beginPath();
        ctx.arc(nX, nY, nR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 8 Cartwheel radial spoke heterochromatin clumps
        ctx.fillStyle = '#2e1065';
        for (let sp = 0; sp < 8; sp++) {
          const theta = (sp / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(nX + Math.cos(theta) * (nR * 0.65), nY + Math.sin(theta) * (nR * 0.65), 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
        // Central nucleolus clump
        ctx.beginPath();
        ctx.arc(nX, nY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (col !== 3) {
          // Chibi mystic face with starry gaze
          drawChibiEyes(ctx, 0, 16, 26, col === 2 ? 'cheer' : 'happy');
        }

        // Action specifics:
        if (col === 0) {
          // Floating hover: hands held in mystical blessing
          drawCandySphere(ctx, -26, 18, 9, '#ddd6fe', '#ffffff', '#8b5cf6');
          drawCandySphere(ctx, 26, 18, 9, '#ddd6fe', '#ffffff', '#8b5cf6');
        } else if (col === 1) {
          // Swoop flight: dynamic gliding robes
          ctx.save();
          ctx.fillStyle = '#a78bfa';
          ctx.beginPath();
          ctx.ellipse(-38, 25, 14, 8, -0.5, 0, Math.PI * 2);
          ctx.ellipse(38, 25, 14, 8, 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (col === 2) {
          // DUAL Y-SHAPED IgG ANTIBODY SPELLCAST!
          // Both hands cast forward emitting twin golden glowing Y-shaped IgG antibodies
          [-48, 48].forEach((ax, idx) => {
            ctx.save();
            ctx.translate(ax, 5);
            ctx.rotate(idx === 0 ? -0.4 : 0.4);

            // Glowing golden aura
            const auraGrad = ctx.createRadialGradient(0, -25, 5, 0, -25, 35);
            auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
            auraGrad.addColorStop(0.6, 'rgba(234, 179, 8, 0.65)');
            auraGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            ctx.fillStyle = auraGrad;
            ctx.beginPath();
            ctx.arc(0, -25, 35, 0, Math.PI * 2);
            ctx.fill();

            // Y-Shaped IgG Antibody Structure
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Stem (Fc region)
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(0, -28);
            // Arms (Fab regions)
            ctx.lineTo(-16, -46);
            ctx.moveTo(0, -28);
            ctx.lineTo(16, -46);
            ctx.stroke();

            // Heavy/Light chain candy caps on antigen-binding tips
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(-16, -46, 5, 0, Math.PI * 2);
            ctx.arc(16, -46, 5, 0, Math.PI * 2);
            ctx.arc(0, -5, 5, 0, Math.PI * 2);
            ctx.fill();

            // Star glint
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -28, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
        } else if (col === 3) {
          // Rear Halo view showing trailing starry cape
          ctx.save();
          // Golden star patterns on cape
          ctx.fillStyle = '#fef08a';
          [[-15, 30], [15, 35], [0, 50]].forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }

        ctx.restore();
      }

      return c.toDataURL('image/png');
    };

    window.renderMicrobes = function() {
      const c = document.getElementById('c');
      c.width = 384;
      c.height = 384;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 384, 384);

      function drawGlossySphere(ctx, x, y, r, baseColor, hiColor, shColor) {
        ctx.save();
        const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
        grad.addColorStop(0, hiColor || '#ffffff');
        grad.addColorStop(0.35, baseColor);
        grad.addColorStop(0.85, shColor || baseColor);
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.stroke();
        // Crescent highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.ellipse(x - r * 0.3, y - r * 0.35, r * 0.3, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawMiniFace(ctx, x, y, size = 12) {
        ctx.save();
        ctx.fillStyle = '#261204';
        [-size * 0.35, size * 0.35].forEach(dx => {
          ctx.beginPath();
          ctx.arc(x + dx, y, size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = '#6e2b52';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y + size * 0.15, size * 0.18, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // (0,0): S. aureus (Luscious golden-honey grape cluster)
      {
        const ox = 0 * 128 + 64;
        const oy = 0 * 128 + 64;
        const grapes = [
          [0, 0, 16], [-14, -10, 14], [14, -10, 14], [-12, 12, 13], [12, 12, 13],
          [0, -18, 12], [0, 18, 11]
        ];
        grapes.forEach(([gx, gy, gr]) => {
          drawGlossySphere(ctx, ox + gx, oy + gy, gr, '#f59e0b', '#fef08a', '#b45309');
        });
        drawMiniFace(ctx, ox, oy, 16);
      }

      // (0,1): Beta-Lactamase+ S. aureus (Enveloped in emerald crystalline shield aura)
      {
        const ox = 1 * 128 + 64;
        const oy = 0 * 128 + 64;
        // Emerald crystalline shield aura
        ctx.save();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const theta = (i / 8) * Math.PI * 2;
          const r = 44 + (i % 2 === 0 ? 6 : -4);
          const px = ox + Math.cos(theta) * r;
          const py = oy + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        const grapes = [
          [0, 0, 15], [-13, -9, 13], [13, -9, 13], [-11, 11, 12], [11, 11, 12]
        ];
        grapes.forEach(([gx, gy, gr]) => {
          drawGlossySphere(ctx, ox + gx, oy + gy, gr, '#fbbf24', '#fef3c7', '#d97706');
        });
        drawMiniFace(ctx, ox, oy, 14);
      }

      // (0,2): Doxy-Resistant S. aureus (Amber cluster with 3D chrome efflux pumps)
      {
        const ox = 2 * 128 + 64;
        const oy = 0 * 128 + 64;
        const grapes = [
          [0, 0, 16], [-13, -10, 14], [13, -10, 14], [-12, 12, 13], [12, 12, 13]
        ];
        grapes.forEach(([gx, gy, gr]) => {
          drawGlossySphere(ctx, ox + gx, oy + gy, gr, '#d97706', '#fde68a', '#92400e');
        });
        // 3D chrome efflux pumps protruding
        [[-26, -18, -0.6], [26, -18, 0.6], [0, 28, 1.57]].forEach(([px, py, ang]) => {
          ctx.save();
          ctx.translate(ox + px, oy + py);
          ctx.rotate(ang);
          // Chrome nozzle barrel
          const chromeGrad = ctx.createLinearGradient(-6, 0, 6, 0);
          chromeGrad.addColorStop(0, '#64748b');
          chromeGrad.addColorStop(0.5, '#f8fafc');
          chromeGrad.addColorStop(1, '#334155');
          ctx.fillStyle = chromeGrad;
          ctx.fillRect(-6, -14, 12, 16);
          // Nozzle rim
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.ellipse(0, -14, 7, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        drawMiniFace(ctx, ox, oy, 14);
      }

      // (1,0): MRSA (Heavy royal-purple cluster wearing silver knight's visor)
      {
        const ox = 0 * 128 + 64;
        const oy = 1 * 128 + 64;
        const grapes = [
          [0, 0, 16], [-14, -10, 14], [14, -10, 14], [-12, 12, 13], [12, 12, 13], [0, 18, 12]
        ];
        grapes.forEach(([gx, gy, gr]) => {
          drawGlossySphere(ctx, ox + gx, oy + gy, gr, '#6b21a8', '#d8b4fe', '#4c1d95');
        });
        // Polished silver knight's visor / helmet
        ctx.save();
        const helmGrad = ctx.createLinearGradient(ox - 25, oy - 15, ox + 25, oy + 5);
        helmGrad.addColorStop(0, '#94a3b8');
        helmGrad.addColorStop(0.5, '#f1f5f9');
        helmGrad.addColorStop(1, '#475569');
        ctx.fillStyle = helmGrad;
        ctx.beginPath();
        ctx.ellipse(ox, oy - 2, 24, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Visor eye slits
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(ox - 16, oy - 4, 12, 3);
        ctx.fillRect(ox + 4, oy - 4, 12, 3);
        ctx.restore();
      }

      // (1,1): Antigen-B S. aureus (Berry-red cluster crowned with golden 3-pronged spikes)
      {
        const ox = 1 * 128 + 64;
        const oy = 1 * 128 + 64;
        // Golden 3-pronged surface epitope spikes
        for (let i = 0; i < 6; i++) {
          const theta = (i / 6) * Math.PI * 2;
          const sx = ox + Math.cos(theta) * 32;
          const sy = oy + Math.sin(theta) * 32;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(theta + Math.PI / 2);
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -12);
          ctx.lineTo(-6, -18);
          ctx.moveTo(0, -12);
          ctx.lineTo(0, -20);
          ctx.moveTo(0, -12);
          ctx.lineTo(6, -18);
          ctx.stroke();
          ctx.restore();
        }
        const grapes = [
          [0, 0, 16], [-13, -9, 14], [13, -9, 14], [-11, 11, 13], [11, 11, 13]
        ];
        grapes.forEach(([gx, gy, gr]) => {
          drawGlossySphere(ctx, ox + gx, oy + gy, gr, '#e11d48', '#fda4af', '#9f1239');
        });
        drawMiniFace(ctx, ox, oy, 14);
      }

      // (1,2): Streptococcus pneumoniae (Diplococcal pair in translucent polysaccharide capsule bubble)
      {
        const ox = 2 * 128 + 64;
        const oy = 1 * 128 + 64;
        // Translucent sugar capsule bubble
        ctx.save();
        const capGrad = ctx.createRadialGradient(ox - 10, oy - 10, 8, ox, oy, 42);
        capGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        capGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.35)');
        capGrad.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
        ctx.fillStyle = capGrad;
        ctx.beginPath();
        ctx.ellipse(ox, oy, 42, 32, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke();
        ctx.restore();

        // Diplococcal pair (two lancet-shaped spheres paired up)
        drawGlossySphere(ctx, ox - 13, oy, 15, '#3b82f6', '#bfdbfe', '#1d4ed8');
        drawGlossySphere(ctx, ox + 13, oy, 15, '#3b82f6', '#bfdbfe', '#1d4ed8');
        drawMiniFace(ctx, ox - 13, oy, 12);
        drawMiniFace(ctx, ox + 13, oy, 12);
      }

      // (2,0): Escherichia coli (Glossy crimson jellybean capsule with undulating flagellar tails)
      {
        const ox = 0 * 128 + 64;
        const oy = 2 * 128 + 64;
        // Undulating flagellar tails trailing from perimeter
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        for (let f = 0; f < 5; f++) {
          const ang = (f / 5) * Math.PI + 0.8;
          ctx.beginPath();
          ctx.moveTo(ox + Math.cos(ang) * 20, oy + Math.sin(ang) * 20);
          ctx.bezierCurveTo(
            ox + Math.cos(ang) * 35 + 8, oy + Math.sin(ang) * 35 - 5,
            ox + Math.cos(ang) * 45 - 8, oy + Math.sin(ang) * 45 + 5,
            ox + Math.cos(ang) * 55, oy + Math.sin(ang) * 55
          );
          ctx.stroke();
        }
        ctx.restore();

        // Crimson jellybean capsule
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(-0.3);
        const eGrad = ctx.createLinearGradient(-26, -14, 26, 14);
        eGrad.addColorStop(0, '#f87171');
        eGrad.addColorStop(0.5, '#dc2626');
        eGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = eGrad;
        ctx.beginPath();
        ctx.roundRect(-28, -15, 56, 30, 15);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();
        // Jellybean glossy highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-8, -8, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        drawMiniFace(ctx, 0, 0, 16);
        ctx.restore();
      }

      // (2,1): Pseudomonas aeruginosa (Teal-cyan candy capsule with metallic pyocyanin sheen & trailing flagellum)
      {
        const ox = 1 * 128 + 64;
        const oy = 2 * 128 + 64;
        // Single trailing whip flagellum
        ctx.save();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox - 24, oy + 5);
        ctx.bezierCurveTo(ox - 38, oy + 18, ox - 45, oy - 12, ox - 60, oy + 12);
        ctx.stroke();
        ctx.restore();

        // Streamlined teal-cyan capsule
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(0.25);
        const pGrad = ctx.createLinearGradient(-28, -14, 28, 14);
        pGrad.addColorStop(0, '#67e8f9');
        pGrad.addColorStop(0.4, '#06b6d4');
        pGrad.addColorStop(0.8, '#0891b2');
        pGrad.addColorStop(1, '#155e75');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(-28, -14, 56, 28, 14);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        // Metallic pyocyanin sheen
        ctx.fillStyle = 'rgba(165, 243, 252, 0.75)';
        ctx.beginPath();
        ctx.ellipse(-6, -6, 18, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        drawMiniFace(ctx, 4, 0, 15);
        ctx.restore();
      }

      // (2,2): Candida albicans (Creamy white mochi mother yeast with budding daughter & elongated germ tube)
      {
        const ox = 2 * 128 + 64;
        const oy = 2 * 128 + 64;
        // Elongated sprouting candy germ tube
        ctx.save();
        const tubeGrad = ctx.createLinearGradient(ox, oy, ox + 38, oy - 28);
        tubeGrad.addColorStop(0, '#fdf4ff');
        tubeGrad.addColorStop(1, '#f5d0fe');
        ctx.fillStyle = tubeGrad;
        ctx.beginPath();
        ctx.moveTo(ox + 8, oy - 12);
        ctx.quadraticCurveTo(ox + 22, oy - 26, ox + 45, oy - 30);
        ctx.lineTo(ox + 46, oy - 22);
        ctx.quadraticCurveTo(ox + 26, oy - 16, ox + 14, oy - 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Mother yeast oval
        drawGlossySphere(ctx, ox - 8, oy + 4, 22, '#fdf4ff', '#ffffff', '#e9d5ff');
        // Budding daughter sphere
        drawGlossySphere(ctx, ox + 18, oy + 12, 13, '#faf5ff', '#ffffff', '#e9d5ff');

        drawMiniFace(ctx, ox - 8, oy + 4, 14);
      }

      return c.toDataURL('image/png');
    };

    window.renderVascularCorridor = function() {
      const c = document.getElementById('c');
      c.width = 1024;
      c.height = 1536;
      const ctx = c.getContext('2d');

      // Deep crimson and plum microvascular lumen gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1536);
      bgGrad.addColorStop(0, '#2d0a1b');
      bgGrad.addColorStop(0.3, '#3f0c24');
      bgGrad.addColorStop(0.7, '#240614');
      bgGrad.addColorStop(1, '#18030d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1536);

      // Central glowing plasma river stream
      const plasmaGrad = ctx.createRadialGradient(512, 768, 50, 512, 768, 480);
      plasmaGrad.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
      plasmaGrad.addColorStop(0.5, 'rgba(190, 24, 93, 0.12)');
      plasmaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = plasmaGrad;
      ctx.fillRect(0, 0, 1024, 1536);

      // Endothelial cell cobblestone / vascular wall edges
      ctx.save();
      for (let side = 0; side < 2; side++) {
        const edgeX = side === 0 ? 0 : 1024;
        const width = 160;
        const wallGrad = ctx.createLinearGradient(side === 0 ? 0 : 1024, 0, side === 0 ? width : 1024 - width, 0);
        wallGrad.addColorStop(0, 'rgba(159, 18, 57, 0.6)');
        wallGrad.addColorStop(0.6, 'rgba(136, 19, 55, 0.35)');
        wallGrad.addColorStop(1, 'rgba(136, 19, 55, 0)');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(side === 0 ? 0 : 1024 - width, 0, width, 1536);

        // Cobblestone endothelium pavement cells
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.18)';
        ctx.lineWidth = 1.5;
        for (let y = 0; y < 1536; y += 48) {
          const shift = (y / 48) % 2 === 0 ? 10 : 0;
          ctx.beginPath();
          ctx.ellipse(
            side === 0 ? 40 + shift : 1024 - 40 - shift,
            y + 24,
            45, 20, 0, 0, Math.PI * 2
          );
          ctx.stroke();
        }
      }
      ctx.restore();

      // Floating background erythrocyte (red blood cell) bokehs
      const rng = (seed) => {
        let s = seed % 2147483647;
        if (s <= 0) s += 2147483646;
        return () => (s = s * 16807 % 2147483647) / 2147483647;
      };
      const rand = rng(42);

      for (let i = 0; i < 35; i++) {
        const rx = 100 + rand() * 824;
        const ry = rand() * 1536;
        const rSize = 25 + rand() * 45;
        const rot = rand() * Math.PI;
        const alpha = 0.08 + rand() * 0.18;

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(rot);
        ctx.scale(1, 0.65);

        // Biconcave disc outer donut
        const rbcGrad = ctx.createRadialGradient(0, 0, rSize * 0.2, 0, 0, rSize);
        rbcGrad.addColorStop(0, \`rgba(159, 18, 57, \${alpha * 0.3})\`);
        rbcGrad.addColorStop(0.6, \`rgba(225, 29, 72, \${alpha})\`);
        rbcGrad.addColorStop(1, \`rgba(136, 19, 55, 0)\`);
        ctx.fillStyle = rbcGrad;
        ctx.beginPath();
        ctx.arc(0, 0, rSize, 0, Math.PI * 2);
        ctx.fill();

        // Biconcave indentation ring
        ctx.strokeStyle = \`rgba(255, 228, 230, \${alpha * 0.4})\`;
        ctx.lineWidth = rSize * 0.15;
        ctx.beginPath();
        ctx.arc(0, 0, rSize * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Golden capillary flow streak particles
      ctx.save();
      for (let s = 0; s < 40; s++) {
        const sx = 180 + rand() * 664;
        const sy = rand() * 1536;
        const sLen = 30 + rand() * 60;
        const sAlpha = 0.05 + rand() * 0.15;
        const sGrad = ctx.createLinearGradient(sx, sy, sx, sy + sLen);
        sGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        sGrad.addColorStop(0.5, \`rgba(254, 240, 138, \${sAlpha})\`);
        sGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.strokeStyle = sGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + sLen);
        ctx.stroke();
      }
      ctx.restore();

      return c.toDataURL('image/jpeg', 0.92);
    };
  </script>
</body>
</html>`);

  console.log('Rendering defenders spritesheet (1024x768)...');
  const defendersBase64 = await page.evaluate(() => window.renderDefenders());
  const defendersData = defendersBase64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/assets/defenders-biological-3d.png', Buffer.from(defendersData, 'base64'));
  console.log('Saved public/assets/defenders-biological-3d.png (' + (defendersData.length * 0.75 / 1024).toFixed(1) + ' KB)');

  console.log('Rendering microbes spritesheet (384x384)...');
  const microbesBase64 = await page.evaluate(() => window.renderMicrobes());
  const microbesData = microbesBase64.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('public/assets/microbes-biological-3d.png', Buffer.from(microbesData, 'base64'));
  console.log('Saved public/assets/microbes-biological-3d.png (' + (microbesData.length * 0.75 / 1024).toFixed(1) + ' KB)');

  console.log('Rendering vascular corridor background (1024x1536)...');
  const corridorBase64 = await page.evaluate(() => window.renderVascularCorridor());
  const corridorData = corridorBase64.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync('public/assets/corridor-subtle-vascular.jpg', Buffer.from(corridorData, 'base64'));
  console.log('Saved public/assets/corridor-subtle-vascular.jpg (' + (corridorData.length * 0.75 / 1024).toFixed(1) + ' KB)');

  await browser.close();
  console.log('All visual assets generated successfully!');
}

generateAssets().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
