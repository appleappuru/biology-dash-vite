import { DefenderUnit } from '../core/types.js';

export interface SwarmFormationConfig {
  spacing: number;
  corridorHalfWidth: number;
  longitudinalStretch: number;
}

const GOLDEN_ANGLE = 2.399963229728653; // radians: Math.PI * (3 - Math.sqrt(5))

/**
 * Calculates optimal golden-angle sunflower phyllotaxis positions
 * clamped within the corridor width to prevent stacking and create a streamlined crowd.
 */
export function computePhyllotaxisOffsets(
  count: number,
  config: SwarmFormationConfig = { spacing: 20, corridorHalfWidth: 180, longitudinalStretch: 1.25 }
): { x: number; y: number }[] {
  const offsets: { x: number; y: number }[] = [];
  const { spacing, corridorHalfWidth, longitudinalStretch } = config;

  for (let i = 0; i < count; i++) {
    const theta = i * GOLDEN_ANGLE;
    const r = spacing * Math.sqrt(i + 0.6);

    let rawX = r * Math.cos(theta);
    let rawY = r * Math.sin(theta) * longitudinalStretch;

    // Clamping to corridor edges with organic soft squeeze
    if (Math.abs(rawX) > corridorHalfWidth) {
      const sign = Math.sign(rawX);
      const excess = Math.abs(rawX) - corridorHalfWidth;
      rawX = sign * (corridorHalfWidth - 4);
      // Displace longitudinally so units flow into a streamlined column rather than stacking
      rawY += Math.sign(rawY || 1) * excess * 0.8;
    }

    offsets.push({ x: rawX, y: rawY });
  }

  return offsets;
}

/**
 * Updates defender positions using spring flocking toward phyllotaxis slots
 * and updates organic bouncy squash-and-stretch.
 */
export function updateSwarmFlocking(
  defenders: DefenderUnit[],
  squadAnchorX: number,
  squadAnchorY: number,
  dt: number,
  corridorHalfWidth: number = 190
): void {
  const offsets = computePhyllotaxisOffsets(defenders.length, {
    spacing: 30,
    corridorHalfWidth,
    longitudinalStretch: 1.35
  });

  const springK = 14.0;

  for (let i = 0; i < defenders.length; i++) {
    const unit = defenders[i];
    const targetOffset = offsets[i] || { x: 0, y: 0 };
    unit.targetOffsetX = targetOffset.x;
    unit.targetOffsetY = targetOffset.y;

    const targetX = squadAnchorX + targetOffset.x;
    const targetY = squadAnchorY + targetOffset.y;

    // Smooth spring movement
    const dx = targetX - unit.x;
    const dy = targetY - unit.y;

    unit.x += dx * Math.min(1.0, springK * dt);
    unit.y += dy * Math.min(1.0, springK * dt);

    // Update stride phase for walking bounce
    unit.stridePhase += dt * (unit.state === 'marching' ? 8.5 : 4.0);

    // Squash and stretch oscillation
    if (unit.state === 'marching') {
      const bounce = Math.sin(unit.stridePhase);
      unit.squashX = 1.0 + bounce * 0.08;
      unit.squashY = 1.0 - bounce * 0.08;
    } else if (unit.state === 'engulfing') {
      // Impact hug stretch
      unit.squashX = 1.15;
      unit.squashY = 0.90;
    } else if (unit.state === 'digesting') {
      // Content satisfied bulge
      unit.squashX = 1.05;
      unit.squashY = 1.08;
    } else {
      unit.squashX = 1.0;
      unit.squashY = 1.0;
    }
  }
}
