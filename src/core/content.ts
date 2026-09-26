import { PatrolDef } from './types.js';

export const PATROLS: PatrolDef[] = [
  {
    id: 1,
    name: 'Patrol 1: First Hug',
    subtitle: 'Capillary Breach & Superficial Infiltration',
    clinicalContext:
      'A micro-abrasion has breached the dermal capillary bed. Standard Staphylococcus aureus cocci are colonizing the lumen. Deploy initial neutrophil squads to form chromatin NETs and engage in your first cellular hugs!',
    durationSeconds: 32,
    corridorLength: 4800,
    startingDefenders: [{ kind: 'neutrophil', count: 12 }],
    allowedMedicines: ['amoxicillin'],
    gates: [
      { y: 1200, left: { op: 'add', value: 8 }, right: { op: 'multiply', value: 2 }, amplitude: 50, speed: 1.2 },
      { y: 2600, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 12 }, amplitude: 70, speed: 1.5 },
      { y: 3800, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 16 }, amplitude: 80, speed: 1.8 }
    ],
    biofilms: [
      { y: 2000, hp: 30, reward: 'coins', rewardAmount: 25 }
    ],
    waves: [
      { timeOffset: 3, species: 's_aureus', count: 6, formation: 'cluster', spreadX: 120, depthVariance: 140, centerNormalizedX: 0.5 },
      { timeOffset: 9, species: 's_aureus', count: 10, formation: 'zigzag', spreadX: 180, depthVariance: 180, centerNormalizedX: 0.4 },
      { timeOffset: 16, species: 's_aureus', count: 14, formation: 'pincer', spreadX: 240, depthVariance: 160, centerNormalizedX: 0.6 },
      { timeOffset: 23, species: 's_aureus', count: 18, formation: 'line_staggered', spreadX: 260, depthVariance: 220, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 's_aureus',
      name: 'Staphylococcus Core Apex',
      maxHp: 220,
      radius: 46
    }
  },
  {
    id: 2,
    name: 'Patrol 2: Giant Hugger',
    subtitle: 'Deep Dermal Infiltration & Biofilm Entrapment',
    clinicalContext:
      'Extravasating into deep connective tissue, an allied giant Macrophage is trapped behind a slimy extracellular biofilm. Break the biofilm matrix with collective squad force to liberate the giant bear-hugger!',
    durationSeconds: 90,
    corridorLength: 9600,
    startingDefenders: [
      { kind: 'neutrophil', count: 14 },
      { kind: 'macrophage', count: 2 }
    ],
    allowedMedicines: ['amoxicillin'],
    gates: [
      { y: 1500, left: { op: 'add', value: 10 }, right: { op: 'multiply', value: 2 }, amplitude: 60, speed: 1.4 },
      { y: 3500, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 15 }, amplitude: 90, speed: 1.6 },
      { y: 5800, left: { op: 'add', value: 18 }, right: { op: 'multiply', value: 3 }, amplitude: 100, speed: 1.8 },
      { y: 8000, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 24 }, amplitude: 110, speed: 2.0 }
    ],
    biofilms: [
      { y: 2500, hp: 50, reward: 'macrophage', rewardAmount: 2 },
      { y: 6800, hp: 80, reward: 'coins', rewardAmount: 50 }
    ],
    waves: [
      { timeOffset: 5, species: 's_aureus', count: 12, formation: 'cluster', spreadX: 160, depthVariance: 160, centerNormalizedX: 0.5 },
      { timeOffset: 16, species: 's_aureus', count: 16, formation: 'pincer', spreadX: 240, depthVariance: 200, centerNormalizedX: 0.5 },
      { timeOffset: 30, species: 's_aureus', count: 22, formation: 'zigzag', spreadX: 260, depthVariance: 220, centerNormalizedX: 0.4 },
      { timeOffset: 48, species: 's_aureus', count: 28, formation: 'line_staggered', spreadX: 280, depthVariance: 260, centerNormalizedX: 0.6 },
      { timeOffset: 66, species: 's_aureus', count: 34, formation: 'pincer', spreadX: 300, depthVariance: 280, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 's_aureus',
      name: 'Biofilm-Shielded Staph Queen',
      maxHp: 480,
      radius: 52
    }
  },
  {
    id: 3,
    name: 'Patrol 3: Clinical Dilemma',
    subtitle: 'Encapsulated Diplococci Defense',
    clinicalContext:
      'Streptococcus pneumoniae pairs enclosed in thick anti-phagocytic polysaccharide capsules have joined the breach. Their glassy sugar shields resist non-opsonic engulfment. Fire Amoxicillin to disrupt their peptidoglycan wall assembly!',
    durationSeconds: 90,
    corridorLength: 9800,
    startingDefenders: [
      { kind: 'neutrophil', count: 16 },
      { kind: 'macrophage', count: 3 }
    ],
    allowedMedicines: ['amoxicillin'],
    gates: [
      { y: 1600, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 12 }, amplitude: 70, speed: 1.5 },
      { y: 3800, left: { op: 'add', value: 16 }, right: { op: 'multiply', value: 2 }, amplitude: 90, speed: 1.7 },
      { y: 6400, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 20 }, amplitude: 100, speed: 1.9 },
      { y: 8400, left: { op: 'add', value: 25 }, right: { op: 'multiply', value: 3 }, amplitude: 110, speed: 2.1 }
    ],
    biofilms: [
      { y: 4800, hp: 70, reward: 'macrophage', rewardAmount: 2 }
    ],
    waves: [
      { timeOffset: 6, species: 's_pneumoniae', count: 10, formation: 'cluster', spreadX: 180, depthVariance: 160, centerNormalizedX: 0.5 },
      { timeOffset: 18, species: 's_aureus', count: 16, formation: 'zigzag', spreadX: 220, depthVariance: 200, centerNormalizedX: 0.35 },
      { timeOffset: 32, species: 's_pneumoniae', count: 18, formation: 'pincer', spreadX: 260, depthVariance: 240, centerNormalizedX: 0.65 },
      { timeOffset: 50, species: 's_pneumoniae', count: 24, formation: 'cluster', spreadX: 280, depthVariance: 260, centerNormalizedX: 0.5 },
      { timeOffset: 68, species: 's_aureus', count: 30, formation: 'line_staggered', spreadX: 300, depthVariance: 280, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 's_pneumoniae',
      name: 'Diplococcus Polysaccharide Apex',
      maxHp: 580,
      radius: 54
    }
  },
  {
    id: 4,
    name: 'Patrol 4: The Resistance Pivot',
    subtitle: 'Enzymatic Inactivation & Ribosomal Defense',
    clinicalContext:
      'Emergence of Beta-Lactamase-producing S. aureus! Their emerald enzymatic auras cleave Amoxicillin molecules harmlessly. Pivot immediately to Doxycycline: charge the 30S ribosomal inhibitor to freeze them in place for cell engulfment!',
    durationSeconds: 90,
    corridorLength: 10000,
    startingDefenders: [
      { kind: 'neutrophil', count: 18 },
      { kind: 'macrophage', count: 4 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline'],
    gates: [
      { y: 1500, left: { op: 'add', value: 14 }, right: { op: 'multiply', value: 2 }, amplitude: 80, speed: 1.6 },
      { y: 3600, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 18 }, amplitude: 95, speed: 1.8 },
      { y: 6200, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 22 }, amplitude: 105, speed: 2.0 },
      { y: 8500, left: { op: 'add', value: 28 }, right: { op: 'multiply', value: 3 }, amplitude: 115, speed: 2.2 }
    ],
    biofilms: [
      { y: 4600, hp: 85, reward: 'macrophage', rewardAmount: 2 }
    ],
    waves: [
      { timeOffset: 6, species: 'beta_lactamase_s_aureus', count: 12, formation: 'cluster', spreadX: 200, depthVariance: 180, centerNormalizedX: 0.5 },
      { timeOffset: 20, species: 's_aureus', count: 18, formation: 'pincer', spreadX: 240, depthVariance: 220, centerNormalizedX: 0.5 },
      { timeOffset: 36, species: 'beta_lactamase_s_aureus', count: 22, formation: 'zigzag', spreadX: 260, depthVariance: 240, centerNormalizedX: 0.4 },
      { timeOffset: 52, species: 'beta_lactamase_s_aureus', count: 26, formation: 'cluster', spreadX: 280, depthVariance: 260, centerNormalizedX: 0.6 },
      { timeOffset: 70, species: 'doxy_resistant_s_aureus', count: 16, formation: 'line_staggered', spreadX: 300, depthVariance: 280, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'beta_lactamase_s_aureus',
      name: 'Beta-Lactamase Colossus',
      maxHp: 650,
      radius: 56
    }
  },
  {
    id: 5,
    name: 'Patrol 5: Antibody Fairies',
    subtitle: 'Humoral Surge & Plasma Cell Mobilization',
    clinicalContext:
      'Gram-negative Escherichia coli bacilli with peritrichous flagella have penetrated the vascular corridor. Recruit Plasma Cells into the squad! Build up Cytokine Surge to awaken the Plasma Fairy Queen for screen-wide antibody fireworks.',
    durationSeconds: 90,
    corridorLength: 10200,
    startingDefenders: [
      { kind: 'neutrophil', count: 16 },
      { kind: 'macrophage', count: 4 },
      { kind: 'plasma_cell', count: 4 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline'],
    gates: [
      { y: 1600, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 15 }, amplitude: 85, speed: 1.6 },
      { y: 3800, left: { op: 'add', value: 20 }, right: { op: 'multiply', value: 2 }, amplitude: 100, speed: 1.9 },
      { y: 6400, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 25 }, amplitude: 110, speed: 2.1 },
      { y: 8800, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 30 }, amplitude: 120, speed: 2.3 }
    ],
    biofilms: [
      { y: 5000, hp: 95, reward: 'plasma', rewardAmount: 3 }
    ],
    waves: [
      { timeOffset: 5, species: 'e_coli', count: 14, formation: 'cluster', spreadX: 200, depthVariance: 180, centerNormalizedX: 0.5 },
      { timeOffset: 18, species: 's_aureus', count: 20, formation: 'zigzag', spreadX: 240, depthVariance: 220, centerNormalizedX: 0.35 },
      { timeOffset: 34, species: 'e_coli', count: 24, formation: 'pincer', spreadX: 260, depthVariance: 240, centerNormalizedX: 0.65 },
      { timeOffset: 50, species: 'e_coli', count: 28, formation: 'cluster', spreadX: 290, depthVariance: 260, centerNormalizedX: 0.5 },
      { timeOffset: 68, species: 'beta_lactamase_s_aureus', count: 24, formation: 'line_staggered', spreadX: 300, depthVariance: 280, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'e_coli',
      name: 'Flagellated Coli Overlord',
      maxHp: 750,
      radius: 58
    }
  },
  {
    id: 6,
    name: 'Patrol 6: Epitope Shift',
    subtitle: 'Antigenic Variation & Surface Camouflage',
    clinicalContext:
      'Antigenic Variant S. aureus displaying crown epitope spikes evade pre-existing humoral recognition. Maximize phagocytic squad density and unleash the Titan Macrophage to steamroll through the shifting bacterial front.',
    durationSeconds: 90,
    corridorLength: 10400,
    startingDefenders: [
      { kind: 'neutrophil', count: 18 },
      { kind: 'macrophage', count: 5 },
      { kind: 'plasma_cell', count: 4 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline'],
    gates: [
      { y: 1700, left: { op: 'add', value: 16 }, right: { op: 'multiply', value: 2 }, amplitude: 90, speed: 1.7 },
      { y: 4000, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 22 }, amplitude: 105, speed: 2.0 },
      { y: 6600, left: { op: 'add', value: 26 }, right: { op: 'multiply', value: 3 }, amplitude: 115, speed: 2.2 },
      { y: 9000, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 35 }, amplitude: 125, speed: 2.4 }
    ],
    biofilms: [
      { y: 5200, hp: 110, reward: 'macrophage', rewardAmount: 3 }
    ],
    waves: [
      { timeOffset: 5, species: 'antigen_b_s_aureus', count: 16, formation: 'cluster', spreadX: 220, depthVariance: 200, centerNormalizedX: 0.5 },
      { timeOffset: 19, species: 's_pneumoniae', count: 20, formation: 'pincer', spreadX: 250, depthVariance: 220, centerNormalizedX: 0.5 },
      { timeOffset: 35, species: 'antigen_b_s_aureus', count: 26, formation: 'zigzag', spreadX: 270, depthVariance: 250, centerNormalizedX: 0.4 },
      { timeOffset: 52, species: 'doxy_resistant_s_aureus', count: 24, formation: 'cluster', spreadX: 290, depthVariance: 270, centerNormalizedX: 0.6 },
      { timeOffset: 70, species: 'antigen_b_s_aureus', count: 32, formation: 'line_staggered', spreadX: 310, depthVariance: 290, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'antigen_b_s_aureus',
      name: 'Antigen-Shifted Staph Sovereign',
      maxHp: 850,
      radius: 60
    }
  },
  {
    id: 7,
    name: 'Patrol 7: Yeast Invasion',
    subtitle: 'Fungal Dimorphism & Beta-Glucan Synthase',
    clinicalContext:
      'CRITICAL PATHOGEN SHIFT: Eukaryotic Candida albicans fungal cells have germinated invasive tubular hyphae! Bacterial antibiotics (Amoxicillin, Doxycycline) deal ZERO damage to their glucan wall. Charge Micafungin to inhibit 1,3-beta-D-glucan synthase!',
    durationSeconds: 90,
    corridorLength: 10600,
    startingDefenders: [
      { kind: 'neutrophil', count: 20 },
      { kind: 'macrophage', count: 6 },
      { kind: 'plasma_cell', count: 4 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline', 'micafungin'],
    gates: [
      { y: 1700, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 18 }, amplitude: 90, speed: 1.8 },
      { y: 4100, left: { op: 'add', value: 24 }, right: { op: 'multiply', value: 2 }, amplitude: 105, speed: 2.0 },
      { y: 6800, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 28 }, amplitude: 120, speed: 2.3 },
      { y: 9200, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 36 }, amplitude: 130, speed: 2.5 }
    ],
    biofilms: [
      { y: 5400, hp: 130, reward: 'macrophage', rewardAmount: 3 }
    ],
    waves: [
      { timeOffset: 5, species: 'candida_albicans', count: 14, formation: 'cluster', spreadX: 220, depthVariance: 200, centerNormalizedX: 0.5 },
      { timeOffset: 18, species: 's_aureus', count: 22, formation: 'zigzag', spreadX: 250, depthVariance: 220, centerNormalizedX: 0.35 },
      { timeOffset: 34, species: 'candida_albicans', count: 24, formation: 'pincer', spreadX: 270, depthVariance: 250, centerNormalizedX: 0.65 },
      { timeOffset: 51, species: 'candida_albicans', count: 28, formation: 'cluster', spreadX: 290, depthVariance: 270, centerNormalizedX: 0.5 },
      { timeOffset: 69, species: 'beta_lactamase_s_aureus', count: 26, formation: 'line_staggered', spreadX: 310, depthVariance: 290, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'candida_albicans',
      name: 'Candida Mochi Mother Matriarch',
      maxHp: 960,
      radius: 62
    }
  },
  {
    id: 8,
    name: 'Patrol 8: Immune Recall',
    subtitle: 'Secondary Anamnestic Cascade',
    clinicalContext:
      'High-velocity polymicrobial outbreak! Memory clones are reactivating across the vascular lumen. Rapid multiplier gates and coordinated medicine cycling are required to maintain the defensive perimeter.',
    durationSeconds: 90,
    corridorLength: 10800,
    startingDefenders: [
      { kind: 'neutrophil', count: 22 },
      { kind: 'macrophage', count: 7 },
      { kind: 'plasma_cell', count: 6 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline', 'micafungin'],
    gates: [
      { y: 1600, left: { op: 'add', value: 20 }, right: { op: 'multiply', value: 2 }, amplitude: 95, speed: 1.9 },
      { y: 3900, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 26 }, amplitude: 110, speed: 2.1 },
      { y: 6600, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 32 }, amplitude: 125, speed: 2.4 },
      { y: 9400, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 40 }, amplitude: 135, speed: 2.6 }
    ],
    biofilms: [
      { y: 5200, hp: 150, reward: 'plasma', rewardAmount: 4 }
    ],
    waves: [
      { timeOffset: 4, species: 'e_coli', count: 18, formation: 'cluster', spreadX: 230, depthVariance: 200, centerNormalizedX: 0.5 },
      { timeOffset: 16, species: 'doxy_resistant_s_aureus', count: 22, formation: 'pincer', spreadX: 260, depthVariance: 230, centerNormalizedX: 0.5 },
      { timeOffset: 32, species: 'candida_albicans', count: 26, formation: 'zigzag', spreadX: 280, depthVariance: 260, centerNormalizedX: 0.4 },
      { timeOffset: 49, species: 'antigen_b_s_aureus', count: 30, formation: 'cluster', spreadX: 300, depthVariance: 280, centerNormalizedX: 0.6 },
      { timeOffset: 67, species: 's_pneumoniae', count: 34, formation: 'line_staggered', spreadX: 320, depthVariance: 300, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'doxy_resistant_s_aureus',
      name: 'Chrome Efflux Titan',
      maxHp: 1100,
      radius: 64
    }
  },
  {
    id: 9,
    name: 'Patrol 9: Blue Pus Menace',
    subtitle: 'Pseudomonas Porin Barrier & Pyocyanin Sheen',
    clinicalContext:
      'Metallic teal Pseudomonas aeruginosa bacilli are producing destructive pyocyanin toxin. Their restricted porins block standard beta-lactams and tetracyclines. Charge the 4th-generation cephalosporin Cefepime to penetrate their outer defenses!',
    durationSeconds: 90,
    corridorLength: 11000,
    startingDefenders: [
      { kind: 'neutrophil', count: 24 },
      { kind: 'macrophage', count: 8 },
      { kind: 'plasma_cell', count: 6 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline', 'cefepime', 'micafungin'],
    gates: [
      { y: 1700, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 22 }, amplitude: 100, speed: 2.0 },
      { y: 4100, left: { op: 'add', value: 28 }, right: { op: 'multiply', value: 2 }, amplitude: 115, speed: 2.2 },
      { y: 6900, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 35 }, amplitude: 130, speed: 2.5 },
      { y: 9600, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 45 }, amplitude: 140, speed: 2.7 }
    ],
    biofilms: [
      { y: 5500, hp: 170, reward: 'macrophage', rewardAmount: 4 }
    ],
    waves: [
      { timeOffset: 5, species: 'pseudomonas_aeruginosa', count: 18, formation: 'cluster', spreadX: 240, depthVariance: 210, centerNormalizedX: 0.5 },
      { timeOffset: 18, species: 'e_coli', count: 24, formation: 'zigzag', spreadX: 270, depthVariance: 240, centerNormalizedX: 0.35 },
      { timeOffset: 34, species: 'pseudomonas_aeruginosa', count: 28, formation: 'pincer', spreadX: 290, depthVariance: 270, centerNormalizedX: 0.65 },
      { timeOffset: 51, species: 'candida_albicans', count: 30, formation: 'cluster', spreadX: 310, depthVariance: 290, centerNormalizedX: 0.5 },
      { timeOffset: 68, species: 'pseudomonas_aeruginosa', count: 36, formation: 'line_staggered', spreadX: 330, depthVariance: 310, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'pseudomonas_aeruginosa',
      name: 'Pyocyanin Metallic Sovereign',
      maxHp: 1250,
      radius: 66
    }
  },
  {
    id: 10,
    name: 'Patrol 10: Mosaic Monarch',
    subtitle: 'Capstone Polymicrobial Colony',
    clinicalContext:
      'The Apex Polymicrobial Stronghold: Heavily armored MRSA with PBP2a knight helmets, pyocyanin-sheened Pseudomonas, and budding Candida albicans form an immense cooperative colony. Coordinate full medicine cycling, Cytokine Surge, and swarm multiplication to triumph!',
    durationSeconds: 90,
    corridorLength: 11400,
    startingDefenders: [
      { kind: 'neutrophil', count: 25 },
      { kind: 'macrophage', count: 10 },
      { kind: 'plasma_cell', count: 8 }
    ],
    allowedMedicines: ['amoxicillin', 'doxycycline', 'cefepime', 'micafungin'],
    gates: [
      { y: 1700, left: { op: 'multiply', value: 2 }, right: { op: 'add', value: 25 }, amplitude: 105, speed: 2.1 },
      { y: 4200, left: { op: 'add', value: 30 }, right: { op: 'multiply', value: 2 }, amplitude: 120, speed: 2.4 },
      { y: 7000, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 40 }, amplitude: 135, speed: 2.6 },
      { y: 9800, left: { op: 'multiply', value: 3 }, right: { op: 'add', value: 50 }, amplitude: 145, speed: 2.8 }
    ],
    biofilms: [
      { y: 3000, hp: 120, reward: 'macrophage', rewardAmount: 3 },
      { y: 5800, hp: 200, reward: 'plasma', rewardAmount: 5 }
    ],
    waves: [
      { timeOffset: 4, species: 'mrsa', count: 18, formation: 'cluster', spreadX: 250, depthVariance: 220, centerNormalizedX: 0.5 },
      { timeOffset: 16, species: 'pseudomonas_aeruginosa', count: 24, formation: 'zigzag', spreadX: 280, depthVariance: 250, centerNormalizedX: 0.35 },
      { timeOffset: 32, species: 'candida_albicans', count: 28, formation: 'pincer', spreadX: 300, depthVariance: 270, centerNormalizedX: 0.65 },
      { timeOffset: 48, species: 'mrsa', count: 32, formation: 'cluster', spreadX: 320, depthVariance: 290, centerNormalizedX: 0.5 },
      { timeOffset: 65, species: 'pseudomonas_aeruginosa', count: 36, formation: 'line_staggered', spreadX: 340, depthVariance: 310, centerNormalizedX: 0.5 }
    ],
    boss: {
      species: 'mrsa',
      name: 'Mosaic Monarch Core Piñata',
      maxHp: 1600,
      radius: 72
    }
  }
];
