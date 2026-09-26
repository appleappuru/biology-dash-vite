import { MultiplierGate, BiofilmBarrier, DefenderUnit, DefenderKind } from '../core/types.js';

let gateIdCounter = 1;

export function createMultiplierGate(
  y: number,
  left: { op: 'add' | 'multiply'; value: number },
  right: { op: 'add' | 'multiply'; value: number },
  amplitude: number = 70,
  speed: number = 1.5,
  width: number = 280
): MultiplierGate {
  return {
    id: `gate_${gateIdCounter++}`,
    y,
    xLeft: -width / 4,
    xRight: width / 4,
    width,
    leftOp: left.op,
    leftValue: left.value,
    leftPassed: false,
    rightOp: right.op,
    rightValue: right.value,
    rightPassed: false,
    oscillationSpeed: speed,
    oscillationAmplitude: amplitude,
    baseCenterX: 0,
    currentCenterX: 0
  };
}

export function updateGateOscillation(gate: MultiplierGate, elapsedTime: number): void {
  gate.currentCenterX = gate.baseCenterX + Math.sin(elapsedTime * gate.oscillationSpeed) * gate.oscillationAmplitude;
  gate.xLeft = gate.currentCenterX - gate.width / 4;
  gate.xRight = gate.currentCenterX + gate.width / 4;
}

export interface GatePassResult {
  passed: boolean;
  lane: 'left' | 'right' | null;
  multiplierAdded: number;
  newUnits: { kind: DefenderKind; count: number }[];
}

/**
 * Checks if squad anchor crossed the gate line and calculates unit reinforcements
 */
export function checkGateCollision(
  gate: MultiplierGate,
  previousSquadY: number,
  currentSquadY: number,
  squadX: number,
  currentCount: number,
  dominantKind: DefenderKind = 'neutrophil'
): GatePassResult {
  if (gate.leftPassed || gate.rightPassed) {
    return { passed: false, lane: null, multiplierAdded: 0, newUnits: [] };
  }

  // Check if squad passed gate's Y line this tick
  if (previousSquadY < gate.y && currentSquadY >= gate.y) {
    const halfLane = gate.width / 4;
    const relX = squadX - gate.currentCenterX;

    let lane: 'left' | 'right' | null = null;
    let op: 'add' | 'multiply' = 'add';
    let val = 0;

    if (relX < 0 && relX >= -halfLane * 2) {
      lane = 'left';
      op = gate.leftOp;
      val = gate.leftValue;
      gate.leftPassed = true;
    } else if (relX >= 0 && relX <= halfLane * 2) {
      lane = 'right';
      op = gate.rightOp;
      val = gate.rightValue;
      gate.rightPassed = true;
    } else {
      // Near edge, default to closer lane
      lane = relX < 0 ? 'left' : 'right';
      if (lane === 'left') {
        op = gate.leftOp;
        val = gate.leftValue;
        gate.leftPassed = true;
      } else {
        op = gate.rightOp;
        val = gate.rightValue;
        gate.rightPassed = true;
      }
    }

    let added = 0;
    if (op === 'add') {
      added = val;
    } else if (op === 'multiply') {
      added = Math.max(0, currentCount * (val - 1));
    }

    // Clamp reinforcement count to reasonable maximum for performance (max 120 extra per gate)
    added = Math.min(120, Math.max(1, Math.round(added)));

    return {
      passed: true,
      lane,
      multiplierAdded: added,
      newUnits: [{ kind: dominantKind, count: added }]
    };
  }

  return { passed: false, lane: null, multiplierAdded: 0, newUnits: [] };
}

/**
 * Checks and updates biofilm collisions
 */
export function updateBiofilmCollision(
  biofilm: BiofilmBarrier,
  squadY: number,
  defenders: DefenderUnit[],
  dt: number
): { shattered: boolean; reward: { type: 'coins' | 'macrophage' | 'plasma'; amount: number } | null } {
  if (biofilm.shattered) return { shattered: false, reward: null };

  const squadDistance = biofilm.y - squadY;
  // If squad is in contact with biofilm
  if (squadDistance <= 50 && squadDistance >= -30) {
    // Defenders in forward attack positions deal damage to biofilm
    let squadDps = 0;
    for (const d of defenders) {
      if (d.y >= biofilm.y - 70 && d.y <= biofilm.y + 40) {
        squadDps += d.kind === 'macrophage' ? 25 : 12;
      }
    }

    biofilm.hp -= squadDps * dt;

    if (biofilm.hp <= 0) {
      biofilm.shattered = true;
      biofilm.hp = 0;
      return {
        shattered: true,
        reward: { type: biofilm.rewardType, amount: biofilm.rewardAmount }
      };
    }
  }

  return { shattered: false, reward: null };
}
