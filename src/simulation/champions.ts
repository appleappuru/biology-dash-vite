import { ChampionUnit, ChampionKind, MicrobeUnit } from '../core/types.js';

let championIdCounter = 1;

export function spawnChampion(
  kind: ChampionKind,
  squadX: number,
  squadY: number,
  duration: number = 12.0
): ChampionUnit {
  const isTitan = kind === 'titan_macrophage';
  return {
    id: `champion_${championIdCounter++}`,
    kind,
    x: squadX,
    y: squadY + (isTitan ? 25 : -35),
    targetOffsetX: 0,
    targetOffsetY: isTitan ? 35 : -40,
    durationLeft: duration,
    maxDuration: duration,
    hp: isTitan ? 500 : 250,
    reach: isTitan ? 95 : 120,
    speed: 180,
    squashX: 1,
    squashY: 1,
    actionTimer: 0
  };
}

export interface ChampionCombatResult {
  killedMicrobeIds: string[];
  antibodyProjectilesSpawned: { x: number; y: number; targetX: number; targetY: number; targetId: string }[];
  damageDealtToBoss: number;
}

export function updateChampion(
  champion: ChampionUnit,
  squadX: number,
  squadY: number,
  microbes: MicrobeUnit[],
  dt: number
): ChampionCombatResult {
  const result: ChampionCombatResult = {
    killedMicrobeIds: [],
    antibodyProjectilesSpawned: [],
    damageDealtToBoss: 0
  };

  champion.durationLeft -= dt;
  champion.actionTimer += dt;

  // Follow squad anchor smoothly
  const targetX = squadX + champion.targetOffsetX;
  const targetY = squadY + champion.targetOffsetY;
  champion.x += (targetX - champion.x) * Math.min(1.0, 10.0 * dt);
  champion.y += (targetY - champion.y) * Math.min(1.0, 10.0 * dt);

  if (champion.kind === 'titan_macrophage') {
    // Titan Macrophage steamrolls: oscillating heavy stride squash
    const stride = Math.sin(champion.actionTimer * 6.0);
    champion.squashX = 1.0 + stride * 0.12;
    champion.squashY = 1.0 - stride * 0.12;

    // Contact steamroll: any standard microbe within reach is instantly absorbed!
    for (const m of microbes) {
      if (m.hp <= 0) continue;
      const dx = m.x - champion.x;
      const dy = m.y - champion.y;
      const dist = Math.hypot(dx, dy);

      if (dist < champion.reach + m.radius) {
        if (m.isBossCore) {
          m.hp -= 200 * dt;
          result.damageDealtToBoss += 200 * dt;
          if (m.hp <= 0) result.killedMicrobeIds.push(m.id);
        } else {
          m.hp = 0;
          result.killedMicrobeIds.push(m.id);
        }
      }
    }
  } else if (champion.kind === 'plasma_queen') {
    // Floating mystic hover
    champion.squashX = 1.0 + Math.sin(champion.actionTimer * 3.5) * 0.05;
    champion.squashY = 1.0 - Math.sin(champion.actionTimer * 3.5) * 0.05;

    // Queen fires dual homing antibody fireworks every 0.35s
    if (champion.actionTimer >= 0.35) {
      champion.actionTimer = 0;

      // Find nearest living microbes
      const livingTargets = microbes
        .filter(m => m.hp > 0 && Math.abs(m.y - champion.y) < 600)
        .sort((a, b) => Math.hypot(a.x - champion.x, a.y - champion.y) - Math.hypot(b.x - champion.x, b.y - champion.y));

      for (let i = 0; i < Math.min(2, livingTargets.length); i++) {
        const target = livingTargets[i];
        result.antibodyProjectilesSpawned.push({
          x: champion.x + (i === 0 ? -24 : 24),
          y: champion.y - 10,
          targetX: target.x,
          targetY: target.y,
          targetId: target.id
        });
      }
    }
  }

  return result;
}
