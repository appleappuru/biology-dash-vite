class ProceduralSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked: boolean = false;
  private soundEnabled: boolean = true;
  private volume: number = 0.8;

  private pentatonicScale: number[] = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50, // C6
    1174.66, // D6
    1318.51  // E6
  ];

  constructor() {
    // Setup gesture unlock listeners
    const unlockHandler = () => {
      this.ensureContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isUnlocked = true;
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', unlockHandler);
      window.addEventListener('keydown', unlockHandler);
    }
  }

  public get unlocked(): boolean {
    return this.isUnlocked;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.soundEnabled ? this.volume : 0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(enabled ? this.volume : 0, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && this.soundEnabled) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Marimba Swarm Pop: short sine burst with fast exponential gain decay (60ms)
   * tuned to ascending pentatonic scale with combo counter
   */
  public playMarimbaPop(comboIndex: number = 0): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const freqIndex = comboIndex % this.pentatonicScale.length;
    const baseFreq = this.pentatonicScale[freqIndex];

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    // Subtle pitch drop simulating wooden marimba bar excitation
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.96, now + 0.06);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.065);
  }

  /**
   * Gate Multiplier Chimes: Bright dual-sine arpeggio (E5 -> B5 -> E6)
   */
  public playGateMultiplierChime(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const notes = [659.25, 987.77, 1318.51]; // E5, B5, E6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.045;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, noteTime);
      osc2.frequency.setValueAtTime(freq * 2, noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain!);

      osc1.start(noteTime);
      osc2.start(noteTime);
      osc1.stop(noteTime + 0.23);
      osc2.stop(noteTime + 0.23);
    });
  }

  /**
   * Biofilm Crack: Frequency-filtered white noise burst simulating breaking cartilage/gelatin
   */
  public playBiofilmCrack(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const bufferSize = ctx.sampleRate * 0.12; // 120ms
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
  }

  /**
   * Cytokine Surge Fanfare: Brass-like saw-wave chord crescendo with mild low-pass sweep
   */
  public playCytokineSurgeFanfare(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const chord = [261.63, 329.63, 392.00, 523.25]; // C major chord
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.45);

    const masterChordGain = ctx.createGain();
    masterChordGain.gain.setValueAtTime(0.05, now);
    masterChordGain.gain.linearRampToValueAtTime(0.42, now + 0.25);
    masterChordGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    chord.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 0.65);
    });

    filter.connect(masterChordGain);
    masterChordGain.connect(this.masterGain);
  }

  /**
   * Victory Piñata Fanfare: Triumphant ascending major arpeggio followed by shimmering chord hold
   */
  public playPinataFanfare(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 to G6
    const startTime = ctx.currentTime;

    arpeggio.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.32, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.36);
    });

    // Final triumphant sustained shimmering chord
    const chordTime = startTime + arpeggio.length * 0.07;
    const finalChord = [1046.50, 1318.51, 1567.98, 2093.00];

    finalChord.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, chordTime);

      gain.gain.setValueAtTime(0.25, chordTime);
      gain.gain.linearRampToValueAtTime(0.28, chordTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, chordTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(chordTime);
      osc.stop(chordTime + 1.25);
    });
  }

  /**
   * Medicine Wave: Chemical antibiotic wash / pulse laser
   */
  public playMedicineWave(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.28);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.28);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.33);
  }

  /**
   * Tactile button tap
   */
  public playButtonTap(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.soundEnabled || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }
}

export const soundEngine = new ProceduralSynth();
