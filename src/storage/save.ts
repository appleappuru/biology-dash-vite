import { PlayerSaveData, UpgradesState } from '../core/types.js';

const SAVE_KEY = 'biology_dash_save_v1';

const DEFAULT_UPGRADES: UpgradesState = {
  extravasationSpeedLevel: 1,
  pseudopodReachLevel: 1,
  initialSquadSizeLevel: 1,
  cytokineChargeRateLevel: 1
};

export const UPGRADE_CONFIGS = {
  extravasationSpeed: {
    name: 'Extravasation Speed',
    description: 'Increases squad tissue migration and corridor advance velocity (+12% per tier).',
    baseCost: 30,
    costMultiplier: 1.6,
    maxLevel: 5
  },
  pseudopodReach: {
    name: 'Pseudopod Reach',
    description: 'Expands cellular engulfment hug radius and NETosis spear contact area (+4px per tier).',
    baseCost: 35,
    costMultiplier: 1.6,
    maxLevel: 5
  },
  initialSquadSize: {
    name: 'Initial Squad Size',
    description: 'Deploys additional starting PMN defenders at patrol onset (+3 per tier).',
    baseCost: 40,
    costMultiplier: 1.7,
    maxLevel: 5
  },
  cytokineChargeRate: {
    name: 'Cytokine Charge Rate',
    description: 'Accelerates Cytokine Surge meter build-up from phagocytosis (+15% per tier).',
    baseCost: 50,
    costMultiplier: 1.8,
    maxLevel: 5
  }
};

export class SaveManager {
  private data: PlayerSaveData;

  constructor() {
    this.data = this.load();
  }

  public getData(): PlayerSaveData {
    return this.data;
  }

  private load(): PlayerSaveData {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.getDefaultData();
    }

    try {
      const serialized = window.localStorage.getItem(SAVE_KEY);
      if (!serialized) return this.getDefaultData();

      const parsed = JSON.parse(serialized);
      if (!parsed || parsed.version !== 1) {
        return this.getDefaultData();
      }

      return {
        version: 1,
        coins: typeof parsed.coins === 'number' ? parsed.coins : 50,
        highestUnlockedPatrol: typeof parsed.highestUnlockedPatrol === 'number' ? parsed.highestUnlockedPatrol : 1,
        patrolStars: parsed.patrolStars || {},
        upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
        audioVolume: typeof parsed.audioVolume === 'number' ? parsed.audioVolume : 0.8,
        soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true
      };
    } catch {
      return this.getDefaultData();
    }
  }

  public save(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save player state to localStorage', e);
    }
  }

  private getDefaultData(): PlayerSaveData {
    return {
      version: 1,
      coins: 60, // Starting bonus
      highestUnlockedPatrol: 1,
      patrolStars: {},
      upgrades: { ...DEFAULT_UPGRADES },
      audioVolume: 0.8,
      soundEnabled: true
    };
  }

  public addCoins(amount: number): void {
    this.data.coins += Math.max(0, amount);
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public recordPatrolResult(patrolId: number, stars: number): void {
    const existing = this.data.patrolStars[patrolId] || 0;
    if (stars > existing) {
      this.data.patrolStars[patrolId] = stars;
    }

    if (stars > 0 && patrolId >= this.data.highestUnlockedPatrol) {
      this.data.highestUnlockedPatrol = Math.min(10, patrolId + 1);
    }

    this.save();
  }

  public getUpgradeCost(key: keyof UpgradesState): number {
    const cfg =
      key === 'extravasationSpeedLevel'
        ? UPGRADE_CONFIGS.extravasationSpeed
        : key === 'pseudopodReachLevel'
        ? UPGRADE_CONFIGS.pseudopodReach
        : key === 'initialSquadSizeLevel'
        ? UPGRADE_CONFIGS.initialSquadSize
        : UPGRADE_CONFIGS.cytokineChargeRate;

    const currentLevel = this.data.upgrades[key];
    if (currentLevel >= cfg.maxLevel) return Infinity;

    return Math.round(cfg.baseCost * Math.pow(cfg.costMultiplier, currentLevel - 1));
  }

  public purchaseUpgrade(key: keyof UpgradesState): boolean {
    const cost = this.getUpgradeCost(key);
    if (cost === Infinity) return false;

    if (this.spendCoins(cost)) {
      this.data.upgrades[key]++;
      this.save();
      return true;
    }
    return false;
  }

  public toggleSound(): boolean {
    this.data.soundEnabled = !this.data.soundEnabled;
    this.save();
    return this.data.soundEnabled;
  }
}

export const saveManager = new SaveManager();
