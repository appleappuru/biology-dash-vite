import { describe, it, expect } from 'vitest';
import { computePhyllotaxisOffsets } from '../src/simulation/swarm.js';
import { createMultiplierGate, checkGateCollision } from '../src/simulation/gates.js';
import { SimulationEngine } from '../src/simulation/simulation.js';
import { PATROLS } from '../src/core/content.js';

describe('Deterministic Simulation Engine', () => {
  describe('Sunflower Phyllotaxis Flocking', () => {
    it('generates non-stacking positions clamped to corridor width', () => {
      const offsets = computePhyllotaxisOffsets(80, {
        spacing: 20,
        corridorHalfWidth: 180,
        longitudinalStretch: 1.25
      });

      expect(offsets).toHaveLength(80);

      // Verify corridor clamping
      for (const pos of offsets) {
        expect(Math.abs(pos.x)).toBeLessThanOrEqual(180);
      }

      // Verify no two positions are at the exact same location
      for (let i = 0; i < offsets.length; i++) {
        for (let j = i + 1; j < offsets.length; j++) {
          const dist = Math.hypot(offsets[i].x - offsets[j].x, offsets[i].y - offsets[j].y);
          expect(dist).toBeGreaterThan(2.0); // minimum spacing maintained
        }
      }
    });
  });

  describe('Multiplier Gates Math', () => {
    it('correctly calculates add operation reinforcements', () => {
      const gate = createMultiplierGate(1000, { op: 'add', value: 15 }, { op: 'multiply', value: 2 });
      const result = checkGateCollision(gate, 990, 1010, -40, 20, 'neutrophil');

      expect(result.passed).toBe(true);
      expect(result.lane).toBe('left');
      expect(result.multiplierAdded).toBe(15);
      expect(gate.leftPassed).toBe(true);
    });

    it('correctly calculates multiply operation reinforcements', () => {
      const gate = createMultiplierGate(1000, { op: 'add', value: 10 }, { op: 'multiply', value: 3 });
      const result = checkGateCollision(gate, 990, 1010, 50, 20, 'neutrophil');

      expect(result.passed).toBe(true);
      expect(result.lane).toBe('right');
      expect(result.multiplierAdded).toBe(40); // 20 * (3 - 1) = 40 added
      expect(gate.rightPassed).toBe(true);
    });

    it('does not re-trigger gate twice', () => {
      const gate = createMultiplierGate(1000, { op: 'add', value: 10 }, { op: 'multiply', value: 2 });
      const res1 = checkGateCollision(gate, 990, 1010, -30, 10);
      expect(res1.passed).toBe(true);

      const res2 = checkGateCollision(gate, 1010, 1020, -30, 20);
      expect(res2.passed).toBe(false);
    });
  });

  describe('Combat State Machine & Pharmacological Specificity', () => {
    const defaultUpgrades = {
      extravasationSpeedLevel: 1,
      pseudopodReachLevel: 1,
      initialSquadSizeLevel: 1,
      cytokineChargeRateLevel: 1
    };

    it('transitions defender from marching to engulfing within reach*2.2', () => {
      const patrol = PATROLS[0];
      const sim = new SimulationEngine(patrol, defaultUpgrades);

      // Add a microbe right in front of squad
      sim.microbes = [
        {
          id: 'test_m1',
          species: 's_aureus',
          x: sim.squadX,
          y: sim.squadY + 40,
          hp: 100,
          maxHp: 100,
          radius: 18,
          speed: 0,
          frozenTimer: 0,
          resistanceType: 'none'
        }
      ];

      // Tick simulation
      sim.tick(0.1);

      // Defenders close to the microbe should be in engulfing state
      const engulfingDefenders = sim.defenders.filter(d => d.state === 'engulfing');
      expect(engulfingDefenders.length).toBeGreaterThan(0);
    });

    it('Amoxicillin damages S. aureus but deals 0 to Beta-Lactamase producers and Candida', () => {
      const patrol = PATROLS[3]; // Patrol 4
      const sim = new SimulationEngine(patrol, defaultUpgrades);

      sim.microbes = [
        {
          id: 'm_staph',
          species: 's_aureus',
          x: 0,
          y: sim.squadY + 100,
          hp: 100,
          maxHp: 100,
          radius: 18,
          speed: 0,
          frozenTimer: 0,
          resistanceType: 'none'
        },
        {
          id: 'm_betalactamase',
          species: 'beta_lactamase_s_aureus',
          x: 0,
          y: sim.squadY + 120,
          hp: 100,
          maxHp: 100,
          radius: 18,
          speed: 0,
          frozenTimer: 0,
          resistanceType: 'beta_lactamase'
        },
        {
          id: 'm_candida',
          species: 'candida_albicans',
          x: 0,
          y: sim.squadY + 140,
          hp: 100,
          maxHp: 100,
          radius: 22,
          speed: 0,
          frozenTimer: 0,
          resistanceType: 'fungal_wall'
        }
      ];

      sim.setActiveMedicine('amoxicillin');
      sim.fireActiveMedicine();

      const staph = sim.microbes.find(m => m.id === 'm_staph')!;
      const betaLactamase = sim.microbes.find(m => m.id === 'm_betalactamase')!;
      const candida = sim.microbes.find(m => m.id === 'm_candida')!;

      expect(staph.hp).toBeLessThan(100); // Damaged
      expect(betaLactamase.hp).toBe(100); // Cleaved by beta-lactamase enzyme
      expect(candida.hp).toBe(100); // Fungal wall immune to beta-lactams
    });

    it('Micafungin is the exclusive agent effective against fungal Candida albicans', () => {
      const patrol = PATROLS[6]; // Patrol 7
      const sim = new SimulationEngine(patrol, defaultUpgrades);

      sim.microbes = [
        {
          id: 'm_candida',
          species: 'candida_albicans',
          x: 0,
          y: sim.squadY + 100,
          hp: 200,
          maxHp: 200,
          radius: 22,
          speed: 0,
          frozenTimer: 0,
          resistanceType: 'fungal_wall'
        }
      ];

      sim.setActiveMedicine('micafungin');
      sim.fireActiveMedicine();

      const candida = sim.microbes.find(m => m.id === 'm_candida')!;
      expect(candida.hp).toBe(50); // 200 - 150 = 50
    });

    it('Doxycycline freezes bacteria for 6s but is resisted by efflux pump mutants', () => {
      const patrol = PATROLS[3];
      const sim = new SimulationEngine(patrol, defaultUpgrades);

      sim.microbes = [
        {
          id: 'm_ecoli',
          species: 'e_coli',
          x: 0,
          y: sim.squadY + 100,
          hp: 50,
          maxHp: 50,
          radius: 18,
          speed: 35,
          frozenTimer: 0,
          resistanceType: 'none'
        },
        {
          id: 'm_efflux',
          species: 'doxy_resistant_s_aureus',
          x: 0,
          y: sim.squadY + 120,
          hp: 50,
          maxHp: 50,
          radius: 18,
          speed: 35,
          frozenTimer: 0,
          resistanceType: 'efflux'
        }
      ];

      sim.setActiveMedicine('doxycycline');
      sim.fireActiveMedicine();

      const ecoli = sim.microbes.find(m => m.id === 'm_ecoli')!;
      const efflux = sim.microbes.find(m => m.id === 'm_efflux')!;

      expect(ecoli.frozenTimer).toBe(6.0); // Frozen
      expect(efflux.frozenTimer).toBe(0); // Efflux pump extruded drug
    });
  });
});
