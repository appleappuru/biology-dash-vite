import { MicrobeSpecies, MedicineType } from './types.js';

export interface MicrobeDossier {
  species: MicrobeSpecies;
  displayName: string;
  taxonomicFamily: string;
  gramStatus: 'Gram-Positive' | 'Gram-Negative' | 'Fungal' | 'Capsular Gram-Positive';
  morphology: string;
  hallmarkFeatures: string[];
  clinicalCondition: string;
  molecularDefense: string;
  susceptibilityNote: string;
}

export interface MedicineDossier {
  id: MedicineType;
  displayName: string;
  chemicalClass: string;
  molecularTarget: string;
  mechanism: string;
  spectrum: string;
  clinicalCaveat: string;
}

export const MICROBE_DOSSIER: Record<MicrobeSpecies, MicrobeDossier> = {
  s_aureus: {
    species: 's_aureus',
    displayName: 'Staphylococcus aureus',
    taxonomicFamily: 'Staphylococcaceae',
    gramStatus: 'Gram-Positive',
    morphology: 'Golden-honey grape-like cocci clusters (0.5–1.5 μm)',
    hallmarkFeatures: [
      'Catalase-positive and coagulase-positive',
      'Surface Protein A binds IgG Fc domains in reverse orientation',
      'Dense cross-linked peptidoglycan cell wall'
    ],
    clinicalCondition: 'Superficial cutaneous abscesses, cellulitis, bacteremia, osteomyelitis',
    molecularDefense: 'Baseline thick peptidoglycan shell without acquired beta-lactamase',
    susceptibilityNote: 'Susceptible to standard beta-lactams such as Amoxicillin'
  },
  beta_lactamase_s_aureus: {
    species: 'beta_lactamase_s_aureus',
    displayName: 'Beta-Lactamase+ S. aureus',
    taxonomicFamily: 'Staphylococcaceae',
    gramStatus: 'Gram-Positive',
    morphology: 'Golden cluster surrounded by an enzymatic protective halo',
    hallmarkFeatures: [
      'Plasmid-encoded blaZ gene expression',
      'Extracellularly secreted class A serine beta-lactamase enzymes',
      'Hydrolyzes beta-lactam amide rings prior to penicillin-binding protein access'
    ],
    clinicalCondition: 'Hospital- and community-acquired penicillin-resistant pyogenic infections',
    molecularDefense: 'Enzymatic cleavage of beta-lactam rings (inactivates Amoxicillin)',
    susceptibilityNote: 'Resistant to Amoxicillin; susceptible to Doxycycline and Cefepime'
  },
  doxy_resistant_s_aureus: {
    species: 'doxy_resistant_s_aureus',
    displayName: 'Doxycycline-Resistant S. aureus',
    taxonomicFamily: 'Staphylococcaceae',
    gramStatus: 'Gram-Positive',
    morphology: 'Amber cluster displaying active transmembrane chrome efflux pumps',
    hallmarkFeatures: [
      'tet(K) / tet(M) encoded active transmembrane transporter complexes',
      'Proton-motive force driven drug extrusion pump',
      'Cytoplasmic target protection via elongation-factor homolog ribosomal binding'
    ],
    clinicalCondition: 'Complicated skin and soft-tissue infections refractory to tetracyclines',
    molecularDefense: 'Rapid active drug extrusion prevents cytoplasmic ribosomal inhibition',
    susceptibilityNote: 'Resistant to Doxycycline; susceptible to Amoxicillin and Cefepime'
  },
  mrsa: {
    species: 'mrsa',
    displayName: 'Methicillin-Resistant S. aureus (MRSA)',
    taxonomicFamily: 'Staphylococcaceae',
    gramStatus: 'Gram-Positive',
    morphology: 'Royal purple clusters protected by heavy PBP2a helmet shield',
    hallmarkFeatures: [
      'Staphylococcal cassette chromosome mec (SCCmec) integration',
      'Expression of altered transpeptidase PBP2a with low beta-lactam affinity',
      'Sustained peptidoglycan crosslinking under high beta-lactam concentration'
    ],
    clinicalCondition: 'Severe necrotizing pneumonia, catheter-associated sepsis, deep abscesses',
    molecularDefense: 'Altered target site (PBP2a) prevents beta-lactam binding',
    susceptibilityNote: 'Resistant to penicillins; requires high-potency cephalosporins or swarm phagocytosis'
  },
  antigen_b_s_aureus: {
    species: 'antigen_b_s_aureus',
    displayName: 'Antigenic Variant S. aureus',
    taxonomicFamily: 'Staphylococcaceae',
    gramStatus: 'Gram-Positive',
    morphology: 'Berry-red clusters crowned with golden three-pronged surface epitope spikes',
    hallmarkFeatures: [
      'Altered capsular polysaccharide serotype and modified wall teichoic acids',
      'Evades pre-existing circulating antibodies via epitope variation',
      'Requires innate cell engagement and broad-spectrum opsonization'
    ],
    clinicalCondition: 'Recurrent relapsing staphylococcal infections evading host memory',
    molecularDefense: 'Structural variation of surface epitopes reduces antibody recognition',
    susceptibilityNote: 'Neutralized through intensive macrophage bear-hugs and PMN spear thrusts'
  },
  s_pneumoniae: {
    species: 's_pneumoniae',
    displayName: 'Streptococcus pneumoniae',
    taxonomicFamily: 'Streptococcaceae',
    gramStatus: 'Capsular Gram-Positive',
    morphology: 'Lancet-shaped diplococcal pairs sealed inside a thick polysaccharide bubble',
    hallmarkFeatures: [
      'Thick hydrated acidic polysaccharide capsule (>100 distinct serotypes)',
      'Inhibits complement C3b deposition and prevents non-opsonic phagocytosis',
      'Alpha-hemolytic, bile soluble, optochin-sensitive'
    ],
    clinicalCondition: 'Community-acquired lobar pneumonia, acute otitis media, bacterial meningitis',
    molecularDefense: 'Antiphagocytic polysaccharide capsule shields outer cell wall from direct ingestion',
    susceptibilityNote: 'Peptidoglycan synthesis is highly susceptible to Amoxicillin'
  },
  e_coli: {
    species: 'e_coli',
    displayName: 'Escherichia coli',
    taxonomicFamily: 'Enterobacteriaceae',
    gramStatus: 'Gram-Negative',
    morphology: 'Crimson rod / capsule with undulating peritrichous flagellar tails',
    hallmarkFeatures: [
      'Bilayered cell envelope with lipopolysaccharide (LPS) endotoxin outer membrane',
      'Thin periplasmic peptidoglycan layer',
      'Peritrichous flagellar propulsion driving rapid tissue migration'
    ],
    clinicalCondition: 'Urinary tract infections, bacteremia, intra-abdominal sepsis',
    molecularDefense: 'LPS outer membrane permeability barrier against large hydrophilic molecules',
    susceptibilityNote: 'Susceptible to 4th-generation cephalosporins (Cefepime) and Doxycycline'
  },
  pseudomonas_aeruginosa: {
    species: 'pseudomonas_aeruginosa',
    displayName: 'Pseudomonas aeruginosa',
    taxonomicFamily: 'Pseudomonadaceae',
    gramStatus: 'Gram-Negative',
    morphology: 'Teal-cyan candy capsule with metallic pyocyanin sheen and polar whip flagellum',
    hallmarkFeatures: [
      'Exceptionally low outer membrane porin permeability (OprD modulation)',
      'Constitutive and inducible MexAB-OprM multidrug efflux pumps',
      'Blue-green pyocyanin redox toxin generation induces host tissue oxidative damage'
    ],
    clinicalCondition: 'Ventilator-associated pneumonia, burn wound infections, cystic fibrosis exacerbations',
    molecularDefense: 'Synergistic combination of low outer membrane porin entry and active efflux pumps',
    susceptibilityNote: 'Strictly requires zwitterionic 4th-gen cephalosporin (Cefepime) to penetrate'
  },
  candida_albicans: {
    species: 'candida_albicans',
    displayName: 'Candida albicans',
    taxonomicFamily: 'Saccharomycetaceae',
    gramStatus: 'Fungal',
    morphology: 'Oval budding mochi mother yeast with daughter bud and sprouting germ tube',
    hallmarkFeatures: [
      'Eukaryotic fungal cell architecture with ergosterol membrane and thick chitin/beta-glucan wall',
      'Dimorphic transition from round yeast to invasive hyphal germ tubes',
      'Completely lacks bacterial peptidoglycan and 70S ribosomes'
    ],
    clinicalCondition: 'Mucocutaneous candidiasis, invasive bloodstream candidiasis in immunocompromised hosts',
    molecularDefense: 'Fungal cell wall and eukaryotic ribosomes render ALL antibacterial antibiotics completely ineffective',
    susceptibilityNote: 'Exclusively susceptible to Micafungin (echinocandin glucan synthase inhibitor)'
  }
};

export const MEDICINE_DOSSIER: Record<MedicineType, MedicineDossier> = {
  amoxicillin: {
    id: 'amoxicillin',
    displayName: 'Amoxicillin',
    chemicalClass: 'Aminopenicillin (Beta-Lactam)',
    molecularTarget: 'Penicillin-Binding Proteins (PBPs / Transpeptidases)',
    mechanism: 'Covalently acylates the active site serine of transpeptidase enzymes, terminating peptidoglycan cross-linking and activating bacterial autolysins.',
    spectrum: 'High potency against wild-type Gram-positive cocci (S. aureus, S. pneumoniae) and selected Gram-negatives.',
    clinicalCaveat: 'Hydrolyzed and completely inactivated by beta-lactamase producing strains.'
  },
  doxycycline: {
    id: 'doxycycline',
    displayName: 'Doxycycline',
    chemicalClass: 'Tetracycline Class Antibiotic',
    molecularTarget: 'Bacterial 30S Ribosomal Subunit',
    mechanism: 'Reversibly binds the 30S ribosomal A-site, steric-hindering aminoacyl-tRNA docking, halting protein translation and freezing replication.',
    spectrum: 'Broad-spectrum bacteriostatic agent effective across atypical pathogens, Gram-positives, and selected Gram-negatives.',
    clinicalCaveat: 'Resisted by active efflux pump mutants (e.g. tet(K)) which pump the molecule out before ribosomal binding.'
  },
  cefepime: {
    id: 'cefepime',
    displayName: 'Cefepime',
    chemicalClass: '4th-Generation Cephalosporin',
    molecularTarget: 'Multiple Penicillin-Binding Proteins (PBP2, PBP3)',
    mechanism: 'Possesses a zwitterionic quaternary ammonium structure allowing rapid passive diffusion across outer membrane porins and high resistance to AmpC and classical beta-lactamases.',
    spectrum: 'Extended broad-spectrum coverage spanning Pseudomonas aeruginosa, enterics, and methicillin-susceptible Staphylococci.',
    clinicalCaveat: 'Does not bind modified PBP2a of MRSA with clinical efficacy and has no fungal activity.'
  },
  micafungin: {
    id: 'micafungin',
    displayName: 'Micafungin',
    chemicalClass: 'Echinocandin Class Antifungal',
    molecularTarget: '1,3-Beta-D-Glucan Synthase Complex (Fks1p / Fks2p)',
    mechanism: 'Non-competitively inhibits fungal 1,3-beta-D-glucan synthase, disrupting structural integrity of the fungal cell wall and triggering osmotic lysis.',
    spectrum: 'Fungicidal against Candida species (including C. albicans, C. glabrata) and fungistatic against Aspergillus.',
    clinicalCaveat: 'Zero activity against bacterial peptidoglycan; strictly reserved for fungal pathogens.'
  }
};
