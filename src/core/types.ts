export type DefenderKind = 'neutrophil' | 'macrophage' | 'plasma_cell';
export type ChampionKind = 'titan_macrophage' | 'plasma_queen';

export type DefenderState = 'marching' | 'engulfing' | 'digesting' | 'defeated';

export interface DefenderUnit {
  id: string;
  kind: DefenderKind;
  x: number;
  y: number;
  targetOffsetX: number;
  targetOffsetY: number;
  state: DefenderState;
  stateTimer: number; // in seconds
  hp: number;
  maxHp: number;
  reach: number; // 30 for neutrophil, 45 for macrophage, 60 for plasma
  speed: number;
  squashX: number;
  squashY: number;
  targetEnemyId: string | null;
  stridePhase: number;
}

export interface ChampionUnit {
  id: string;
  kind: ChampionKind;
  x: number;
  y: number;
  targetOffsetX: number;
  targetOffsetY: number;
  durationLeft: number;
  maxDuration: number;
  hp: number;
  reach: number;
  speed: number;
  squashX: number;
  squashY: number;
  actionTimer: number;
}

export type MicrobeSpecies =
  | 's_aureus'
  | 'beta_lactamase_s_aureus'
  | 'doxy_resistant_s_aureus'
  | 'mrsa'
  | 'antigen_b_s_aureus'
  | 's_pneumoniae'
  | 'e_coli'
  | 'pseudomonas_aeruginosa'
  | 'candida_albicans';

export interface MicrobeUnit {
  id: string;
  species: MicrobeSpecies;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  radius: number;
  speed: number;
  frozenTimer: number; // seconds remaining frozen by doxycycline
  resistanceType: 'none' | 'beta_lactamase' | 'efflux' | 'pbp2a' | 'antigen_shift' | 'fungal_wall';
  isBossCore?: boolean;
}

export type GateOp = 'add' | 'multiply';

export interface MultiplierGate {
  id: string;
  y: number; // corridor distance coordinate
  xLeft: number;
  xRight: number;
  width: number;
  leftOp: GateOp;
  leftValue: number;
  leftPassed: boolean;
  rightOp: GateOp;
  rightValue: number;
  rightPassed: boolean;
  oscillationSpeed: number; // horizontal sine wave
  oscillationAmplitude: number;
  baseCenterX: number;
  currentCenterX: number;
}

export interface BiofilmBarrier {
  id: string;
  y: number;
  x: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  shattered: boolean;
  rewardType: 'coins' | 'macrophage' | 'plasma';
  rewardAmount: number;
}

export type MedicineType = 'amoxicillin' | 'doxycycline' | 'cefepime' | 'micafungin';

export interface MedicineDef {
  id: MedicineType;
  name: string;
  mechanism: string;
  chargeTime: number; // seconds to full charge
  rechargeCooldown: number;
  color: string;
  spectrumDescription: string;
}

export interface WaveSpawnDef {
  timeOffset: number; // seconds into patrol
  species: MicrobeSpecies;
  count: number;
  formation: 'cluster' | 'zigzag' | 'pincer' | 'line_staggered';
  spreadX: number;
  depthVariance: number;
  centerNormalizedX: number; // 0 to 1
}

export interface PatrolDef {
  id: number;
  name: string;
  subtitle: string;
  clinicalContext: string;
  durationSeconds: number;
  corridorLength: number;
  startingDefenders: { kind: DefenderKind; count: number }[];
  allowedMedicines: MedicineType[];
  waves: WaveSpawnDef[];
  gates: {
    y: number;
    left: { op: GateOp; value: number };
    right: { op: GateOp; value: number };
    amplitude?: number;
    speed?: number;
  }[];
  biofilms: {
    y: number;
    hp: number;
    reward: 'coins' | 'macrophage' | 'plasma';
    rewardAmount: number;
  }[];
  boss: {
    species: MicrobeSpecies;
    name: string;
    maxHp: number;
    radius: number;
  };
}

export interface UpgradesState {
  extravasationSpeedLevel: number;
  pseudopodReachLevel: number;
  initialSquadSizeLevel: number;
  cytokineChargeRateLevel: number;
}

export interface PlayerSaveData {
  version: number;
  coins: number;
  highestUnlockedPatrol: number;
  patrolStars: Record<number, number>; // 1-3 stars
  upgrades: UpgradesState;
  audioVolume: number;
  soundEnabled: boolean;
}

export interface SimulationEvent {
  type:
    | 'gate_passed'
    | 'biofilm_shattered'
    | 'microbe_engulfed'
    | 'microbe_frozen'
    | 'medicine_fired'
    | 'cytokine_surge_triggered'
    | 'champion_spawned'
    | 'champion_expired'
    | 'pinata_phase_started'
    | 'pinata_exploded'
    | 'patrol_victory'
    | 'patrol_defeat';
  data?: any;
}
