import { describe, it, expect, beforeEach } from 'vitest';
import { SaveManager } from '../src/storage/save.js';

describe('Player Economy & Upgrades Progression', () => {
  let saveMgr: SaveManager;

  beforeEach(() => {
    // In-memory SaveManager instance
    saveMgr = new SaveManager();
  });

  it('initializes with default starting economy and level 1 upgrades', () => {
    const data = saveMgr.getData();
    expect(data.coins).toBeGreaterThanOrEqual(50);
    expect(data.highestUnlockedPatrol).toBe(1);
    expect(data.upgrades.extravasationSpeedLevel).toBe(1);
    expect(data.upgrades.pseudopodReachLevel).toBe(1);
    expect(data.upgrades.initialSquadSizeLevel).toBe(1);
    expect(data.upgrades.cytokineChargeRateLevel).toBe(1);
  });

  it('correctly calculates exponential upgrade costs', () => {
    const costLvl1 = saveMgr.getUpgradeCost('extravasationSpeedLevel');
    expect(costLvl1).toBe(30);

    // Give enough coins and buy level 1
    saveMgr.addCoins(200);
    const bought = saveMgr.purchaseUpgrade('extravasationSpeedLevel');
    expect(bought).toBe(true);

    const data = saveMgr.getData();
    expect(data.upgrades.extravasationSpeedLevel).toBe(2);

    const costLvl2 = saveMgr.getUpgradeCost('extravasationSpeedLevel');
    expect(costLvl2).toBeGreaterThan(costLvl1);
  });

  it('rejects purchase if insufficient coins', () => {
    // Empty coins
    const data = saveMgr.getData();
    saveMgr.spendCoins(data.coins);

    const bought = saveMgr.purchaseUpgrade('pseudopodReachLevel');
    expect(bought).toBe(false);
    expect(saveMgr.getData().upgrades.pseudopodReachLevel).toBe(1);
  });

  it('unlocks subsequent patrols upon star recording', () => {
    expect(saveMgr.getData().highestUnlockedPatrol).toBe(1);

    saveMgr.recordPatrolResult(1, 3);
    expect(saveMgr.getData().highestUnlockedPatrol).toBe(2);
    expect(saveMgr.getData().patrolStars[1]).toBe(3);

    // Replay with lower star does not degrade highest star
    saveMgr.recordPatrolResult(1, 2);
    expect(saveMgr.getData().patrolStars[1]).toBe(3);
  });
});
