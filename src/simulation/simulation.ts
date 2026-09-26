import {
  PatrolDef,
  DefenderUnit,
  DefenderKind,
  MicrobeUnit,
  MultiplierGate,
  BiofilmBarrier,
  ChampionUnit,
  MedicineType,
  UpgradesState,
  SimulationEvent
} from '../core/types.js';
import { updateSwarmFlocking } from './swarm.js';
import {
  createMultiplierGate,
  updateGateOscillation,
  checkGateCollision,
  updateBiofilmCollision
} from './gates.js';
import { spawnChampion, updateChampion } from './champions.js';

let unitIdCounter = 1;

export class SimulationEngine {
  patrol: PatrolDef;
  upgrades: UpgradesState;

  // Simulation time & progress
  elapsedTime: number = 0;
  squadX: number = 0;
  squadY: number = 0;
  targetSquadX: number = 0;
  baseForwardSpeed: number = 110;
  forwardSpeed: number = 110;
  corridorHalfWidth: number = 195;

  // Squad and entities
  defenders: DefenderUnit[] = [];
  microbes: MicrobeUnit[] = [];
  gates: MultiplierGate[] = [];
  biofilms: BiofilmBarrier[] = [];
  champions: ChampionUnit[] = [];

  // Cytokine surge meter (0 to 100)
  cytokineMeter: number = 0;
  maxCytokine: number = 100;
  bulletTimeRemaining: number = 0;

  // Medicine charge & state
  activeMedicine: MedicineType = 'amoxicillin';
  medicineChargeProgress: number = 0; // 0 to 1
  isChargingMedicine: boolean = false;
  medicineCooldowns: Record<MedicineType, number> = {
    amoxicillin: 0,
    doxycycline: 0,
    cefepime: 0,
    micafungin: 0
  };

  // Boss & pinata phase
  bossSpawned: boolean = false;
  bossUnit: MicrobeUnit | null = null;
  pinataPhase: boolean = false;
  isPatrolOver: boolean = false;
  patrolWon: boolean = false;
  earnedCoins: number = 0;
  comboCount: number = 0;
  comboTimer: number = 0;

  // Wave queue
  waveSpawnIndex: number = 0;

  // Event dispatch callback
  eventListener?: (event: SimulationEvent) => void;

  constructor(patrol: PatrolDef, upgrades: UpgradesState) {
    this.patrol = patrol;
    this.upgrades = upgrades;
    this.init();
  }

  setEventListener(listener: (event: SimulationEvent) => void): void {
    this.eventListener = listener;
  }

  emit(event: SimulationEvent): void {
    if (this.eventListener) {
      this.eventListener(event);
    }
  }

  init(): void {
    this.elapsedTime = 0;
    this.squadX = 0;
    this.squadY = 40;
    this.targetSquadX = 0;

    // Apply upgrade modifiers
    const speedBonus = 1 + (this.upgrades.extravasationSpeedLevel - 1) * 0.12;
    this.baseForwardSpeed = 115 * speedBonus;
    this.forwardSpeed = this.baseForwardSpeed;

    const reachBonus = (this.upgrades.pseudopodReachLevel - 1) * 4;
    const initialSizeBonus = (this.upgrades.initialSquadSizeLevel - 1) * 3;

    // Spawn starting defenders
    this.defenders = [];
    for (const startGroup of this.patrol.startingDefenders) {
      const totalCount = startGroup.count + (startGroup.kind === 'neutrophil' ? initialSizeBonus : 0);
      for (let i = 0; i < totalCount; i++) {
        this.addDefender(startGroup.kind, reachBonus);
      }
    }

    // Build gates from patrol definition
    this.gates = (this.patrol.gates || []).map(g =>
      createMultiplierGate(g.y, g.left, g.right, g.amplitude || 75, g.speed || 1.5)
    );

    // Build biofilms from patrol definition
    this.biofilms = (this.patrol.biofilms || []).map((b, idx) => ({
      id: `biofilm_${idx + 1}`,
      y: b.y,
      x: 0,
      width: 340,
      height: 60,
      hp: b.hp,
      maxHp: b.hp,
      shattered: false,
      rewardType: b.reward,
      rewardAmount: b.rewardAmount
    }));

    this.activeMedicine = this.patrol.allowedMedicines[0] || 'amoxicillin';
  }

  addDefender(kind: DefenderKind, extraReach: number = 0): DefenderUnit {
    const baseReach = kind === 'neutrophil' ? 30 : kind === 'macrophage' ? 45 : 60;
    const baseHp = kind === 'macrophage' ? 3 : 1;

    const unit: DefenderUnit = {
      id: `def_${unitIdCounter++}`,
      kind,
      x: this.squadX + (Math.random() - 0.5) * 40,
      y: this.squadY + (Math.random() - 0.5) * 40,
      targetOffsetX: 0,
      targetOffsetY: 0,
      state: 'marching',
      stateTimer: 0,
      hp: baseHp,
      maxHp: baseHp,
      reach: baseReach + extraReach,
      speed: 120,
      squashX: 1,
      squashY: 1,
      targetEnemyId: null,
      stridePhase: Math.random() * Math.PI * 2
    };

    this.defenders.push(unit);
    return unit;
  }

  setTargetSquadX(targetX: number): void {
    this.targetSquadX = Math.max(-this.corridorHalfWidth, Math.min(this.corridorHalfWidth, targetX));
  }

  startChargingMedicine(): void {
    if (this.medicineCooldowns[this.activeMedicine] > 0) return;
    this.isChargingMedicine = true;
  }

  releaseMedicine(): boolean {
    if (!this.isChargingMedicine) return false;
    this.isChargingMedicine = false;

    // If fully charged, fire the medicine wave!
    if (this.medicineChargeProgress >= 0.95) {
      this.fireActiveMedicine();
      this.medicineChargeProgress = 0;
      return true;
    }

    this.medicineChargeProgress = 0;
    return false;
  }

  setActiveMedicine(med: MedicineType): void {
    if (this.patrol.allowedMedicines.includes(med)) {
      this.activeMedicine = med;
      this.isChargingMedicine = false;
      this.medicineChargeProgress = 0;
    }
  }

  triggerCytokineSurge(): boolean {
    if (this.cytokineMeter < this.maxCytokine) return false;
    this.cytokineMeter = 0;

    // Trigger brief 0.5s bullet-time slowdown
    this.bulletTimeRemaining = 0.5;

    // Summon champion: Alternate or pick based on composition
    const kind = this.defenders.some(d => d.kind === 'plasma_cell')
      ? 'plasma_queen'
      : 'titan_macrophage';

    const champion = spawnChampion(kind, this.squadX, this.squadY, 14.0);
    this.champions.push(champion);

    this.emit({
      type: 'cytokine_surge_triggered',
      data: { kind, championId: champion.id }
    });

    this.emit({
      type: 'champion_spawned',
      data: { kind, championId: champion.id }
    });

    return true;
  }

  fireActiveMedicine(): void {
    const med = this.activeMedicine;
    this.medicineCooldowns[med] = 6.0; // 6s cooldown

    this.emit({
      type: 'medicine_fired',
      data: { medicine: med, squadY: this.squadY }
    });

    // Apply clinical pharmacology effects along the corridor
    let affectedCount = 0;

    for (const microbe of this.microbes) {
      if (microbe.hp <= 0) continue;
      // Affect microbes within range ahead of squad
      if (microbe.y >= this.squadY - 50 && microbe.y <= this.squadY + 700) {
        if (med === 'amoxicillin') {
          // Cleaves standard peptidoglycan cell walls
          // Resisted by beta-lactamase+, MRSA, and Candida (fungal)
          if (
            microbe.species === 's_aureus' ||
            microbe.species === 's_pneumoniae' ||
            microbe.species === 'doxy_resistant_s_aureus'
          ) {
            microbe.hp -= 80;
            affectedCount++;
            if (microbe.hp <= 0) this.onMicrobeKilled(microbe);
          }
        } else if (med === 'doxycycline') {
          // 30S ribosomal inhibitor: Freezes bacteria in place for 6 seconds
          // Resisted by efflux pump mutants (doxy_resistant_s_aureus) and Candida
          if (
            microbe.species !== 'doxy_resistant_s_aureus' &&
            microbe.species !== 'candida_albicans'
          ) {
            microbe.frozenTimer = 6.0;
            affectedCount++;
            this.emit({
              type: 'microbe_frozen',
              data: { microbeId: microbe.id }
            });
          }
        } else if (med === 'cefepime') {
          // 4th-gen cephalosporin: penetrates outer membrane of Gram-negatives and beta-lactamase producers
          if (
            microbe.species === 'pseudomonas_aeruginosa' ||
            microbe.species === 'e_coli' ||
            microbe.species === 'beta_lactamase_s_aureus' ||
            microbe.species === 's_aureus' ||
            microbe.species === 's_pneumoniae'
          ) {
            microbe.hp -= 120;
            affectedCount++;
            if (microbe.hp <= 0) this.onMicrobeKilled(microbe);
          }
        } else if (med === 'micafungin') {
          // Echinocandin 1,3-beta-D-glucan synthase inhibitor:
          // The ONLY agent effective against fungal Candida albicans!
          if (microbe.species === 'candida_albicans') {
            microbe.hp -= 150;
            affectedCount++;
            if (microbe.hp <= 0) this.onMicrobeKilled(microbe);
          }
        }
      }
    }
  }

  onMicrobeKilled(microbe: MicrobeUnit): void {
    this.earnedCoins += microbe.isBossCore ? 150 : 2;

    // Fill Cytokine Surge meter
    const chargeMultiplier = 1 + (this.upgrades.cytokineChargeRateLevel - 1) * 0.15;
    this.cytokineMeter = Math.min(
      this.maxCytokine,
      this.cytokineMeter + (microbe.isBossCore ? 30 : 4) * chargeMultiplier
    );

    // Increase combo
    this.comboCount++;
    this.comboTimer = 2.0;

    this.emit({
      type: 'microbe_engulfed',
      data: {
        microbeId: microbe.id,
        species: microbe.species,
        x: microbe.x,
        y: microbe.y,
        combo: this.comboCount
      }
    });
  }

  spawnMicrobeWave(waveDef: any): void {
    const { species, count, formation, spreadX, depthVariance, centerNormalizedX } = waveDef;
    const centerX = (centerNormalizedX - 0.5) * 2 * (this.corridorHalfWidth - 30);
    const baseY = this.squadY + 700;

    for (let i = 0; i < count; i++) {
      let offsetX = 0;
      let offsetY = 0;

      if (formation === 'cluster') {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (spreadX * 0.5);
        offsetX = Math.cos(angle) * dist;
        offsetY = Math.sin(angle) * (depthVariance * 0.5);
      } else if (formation === 'zigzag') {
        const side = i % 2 === 0 ? -1 : 1;
        offsetX = side * (spreadX * 0.45) + (Math.random() - 0.5) * 30;
        offsetY = (i / count) * depthVariance;
      } else if (formation === 'pincer') {
        const side = i % 2 === 0 ? -1 : 1;
        offsetX = side * (spreadX * 0.5) + (Math.random() - 0.5) * 25;
        offsetY = (Math.random() - 0.5) * depthVariance;
      } else {
        // line_staggered: staggered row/column variance, never flat horizontal!
        const step = (i / count) - 0.5;
        offsetX = step * spreadX;
        offsetY = Math.sin(i * 1.7) * (depthVariance * 0.5) + ((i % 3) * 25);
      }

      const hp = species === 'mrsa' ? 60 : species === 'candida_albicans' ? 50 : 25;
      const radius = species === 'candida_albicans' ? 24 : 18;

      this.microbes.push({
        id: `microbe_${unitIdCounter++}`,
        species,
        x: Math.max(-this.corridorHalfWidth, Math.min(this.corridorHalfWidth, centerX + offsetX)),
        y: baseY + offsetY,
        hp,
        maxHp: hp,
        radius,
        speed: 35,
        frozenTimer: 0,
        resistanceType:
          species === 'beta_lactamase_s_aureus'
            ? 'beta_lactamase'
            : species === 'doxy_resistant_s_aureus'
            ? 'efflux'
            : species === 'mrsa'
            ? 'pbp2a'
            : species === 'candida_albicans'
            ? 'fungal_wall'
            : 'none'
      });
    }
  }

  spawnBossPiñata(): void {
    if (this.bossSpawned) return;
    this.bossSpawned = true;
    this.pinataPhase = true;

    const bossDef = this.patrol.boss;
    this.bossUnit = {
      id: 'boss_colony_core',
      species: bossDef.species,
      x: 0,
      y: this.patrol.corridorLength + 80,
      hp: bossDef.maxHp,
      maxHp: bossDef.maxHp,
      radius: bossDef.radius,
      speed: 0,
      frozenTimer: 0,
      resistanceType: 'none',
      isBossCore: true
    };

    this.microbes.push(this.bossUnit);

    this.emit({
      type: 'pinata_phase_started',
      data: { bossName: bossDef.name, maxHp: bossDef.maxHp }
    });
  }

  tick(realDt: number): void {
    if (this.isPatrolOver) return;

    // Bullet time check
    let dt = realDt;
    if (this.bulletTimeRemaining > 0) {
      this.bulletTimeRemaining -= realDt;
      dt *= 0.35; // Slow-mo during surge
    }

    this.elapsedTime += dt;

    // Combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // Medicine charging & cooldowns
    for (const key of Object.keys(this.medicineCooldowns) as MedicineType[]) {
      if (this.medicineCooldowns[key] > 0) {
        this.medicineCooldowns[key] = Math.max(0, this.medicineCooldowns[key] - dt);
      }
    }

    if (this.isChargingMedicine) {
      this.medicineChargeProgress = Math.min(1.0, this.medicineChargeProgress + dt * 1.5);
    }

    // Progress squad forward unless hitting an unbroken biofilm
    let canMoveForward = true;
    for (const biofilm of this.biofilms) {
      if (!biofilm.shattered && this.squadY >= biofilm.y - 65 && this.squadY <= biofilm.y) {
        canMoveForward = false;
        break;
      }
    }

    // Piñata lock: stop at boss
    if (this.pinataPhase && this.bossUnit && this.squadY >= this.bossUnit.y - 110) {
      canMoveForward = false;
    }

    const previousSquadY = this.squadY;
    if (canMoveForward) {
      this.squadY += this.forwardSpeed * dt;
    }

    // Smooth horizontal steering
    this.squadX += (this.targetSquadX - this.squadX) * Math.min(1.0, 12.0 * dt);

    // Update Gates
    for (const gate of this.gates) {
      updateGateOscillation(gate, this.elapsedTime);

      const passResult = checkGateCollision(
        gate,
        previousSquadY,
        this.squadY,
        this.squadX,
        this.defenders.length,
        this.defenders[0]?.kind || 'neutrophil'
      );

      if (passResult.passed) {
        for (const addedGroup of passResult.newUnits) {
          for (let i = 0; i < addedGroup.count; i++) {
            this.addDefender(addedGroup.kind);
          }
        }

        this.emit({
          type: 'gate_passed',
          data: {
            gateId: gate.id,
            lane: passResult.lane,
            multiplierAdded: passResult.multiplierAdded,
            totalSquadCount: this.defenders.length
          }
        });
      }
    }

    // Update Biofilms
    for (const biofilm of this.biofilms) {
      const bioResult = updateBiofilmCollision(biofilm, this.squadY, this.defenders, dt);
      if (bioResult.shattered && bioResult.reward) {
        if (bioResult.reward.type === 'coins') {
          this.earnedCoins += bioResult.reward.amount;
        } else if (bioResult.reward.type === 'macrophage') {
          for (let i = 0; i < bioResult.reward.amount; i++) {
            this.addDefender('macrophage');
          }
        } else if (bioResult.reward.type === 'plasma') {
          for (let i = 0; i < bioResult.reward.amount; i++) {
            this.addDefender('plasma_cell');
          }
        }

        this.emit({
          type: 'biofilm_shattered',
          data: { biofilmId: biofilm.id, reward: bioResult.reward }
        });
      }
    }

    // Wave Spawning Check
    while (
      this.waveSpawnIndex < this.patrol.waves.length &&
      this.elapsedTime >= this.patrol.waves[this.waveSpawnIndex].timeOffset
    ) {
      this.spawnMicrobeWave(this.patrol.waves[this.waveSpawnIndex]);
      this.waveSpawnIndex++;
    }

    // Boss Piñata Spawn Check
    if (this.squadY >= this.patrol.corridorLength - 100 && !this.bossSpawned) {
      this.spawnBossPiñata();
    }

    // Update Champions
    for (let c = this.champions.length - 1; c >= 0; c--) {
      const champ = this.champions[c];
      const champResult = updateChampion(champ, this.squadX, this.squadY, this.microbes, dt);

      for (const killedId of champResult.killedMicrobeIds) {
        const m = this.microbes.find(micro => micro.id === killedId);
        if (m) this.onMicrobeKilled(m);
      }

      if (champ.durationLeft <= 0) {
        this.emit({
          type: 'champion_expired',
          data: { kind: champ.kind, championId: champ.id }
        });
        this.champions.splice(c, 1);
      }
    }

    // Update Defenders Flocking
    updateSwarmFlocking(this.defenders, this.squadX, this.squadY, dt, this.corridorHalfWidth);

    // Update Microbes Movement
    for (const m of this.microbes) {
      if (m.hp <= 0) continue;
      if (m.frozenTimer > 0) {
        m.frozenTimer -= dt;
      } else if (!m.isBossCore) {
        // Creep slowly toward the squad
        m.y -= m.speed * dt;
      }
    }

    // Combat & Hugging State Machine
    this.updateCombatStateMachine(dt);

    // Clean up dead microbes
    this.microbes = this.microbes.filter(m => m.hp > 0 || m.isBossCore);

    // Victory or Defeat Check
    if (this.pinataPhase && this.bossUnit && this.bossUnit.hp <= 0 && !this.patrolWon) {
      this.patrolWon = true;
      this.isPatrolOver = true;
      this.emit({
        type: 'pinata_exploded',
        data: { earnedCoins: this.earnedCoins }
      });
      this.emit({
        type: 'patrol_victory',
        data: {
          survivingDefenders: this.defenders.length,
          stars: this.calculateStars(),
          coins: this.earnedCoins
        }
      });
    } else if (this.defenders.length === 0 && !this.isPatrolOver) {
      this.isPatrolOver = true;
      this.patrolWon = false;
      this.emit({
        type: 'patrol_defeat',
        data: { distanceTraveled: Math.round(this.squadY) }
      });
    }
  }

  updateCombatStateMachine(dt: number): void {
    for (const defender of this.defenders) {
      if (defender.state === 'digesting') {
        defender.stateTimer -= dt;
        if (defender.stateTimer <= 0) {
          defender.state = 'marching';
        }
        continue;
      }

      // Check proximity to any living microbe
      let nearestDist = Infinity;
      let targetMicrobe: MicrobeUnit | null = null;
      const hugRange = defender.reach * 2.2;

      for (const m of this.microbes) {
        if (m.hp <= 0) continue;
        const dx = m.x - defender.x;
        const dy = m.y - defender.y;
        const dist = Math.hypot(dx, dy);

        if (dist < nearestDist) {
          nearestDist = dist;
          targetMicrobe = m;
        }
      }

      if (targetMicrobe && nearestDist <= hugRange) {
        // Transition to engulfing state! Immediately displays Frame 2 (The Hug Pose / Spear Thrust)
        defender.state = 'engulfing';
        defender.targetEnemyId = targetMicrobe.id;

        // Deal DPS to target
        const dps = defender.kind === 'macrophage' ? 40 : defender.kind === 'plasma_cell' ? 35 : 25;
        targetMicrobe.hp -= dps * dt;

        if (targetMicrobe.hp <= 0) {
          this.onMicrobeKilled(targetMicrobe);
          // On kill, enter 'digesting' state for 0.4s holding celebratory embrace!
          defender.state = 'digesting';
          defender.stateTimer = 0.4;
          defender.targetEnemyId = null;
        }
      } else {
        if (defender.state === 'engulfing') {
          defender.state = 'marching';
          defender.targetEnemyId = null;
        }
      }
    }
  }

  calculateStars(): number {
    const count = this.defenders.length;
    if (count >= 40) return 3;
    if (count >= 15) return 2;
    return 1;
  }
}
