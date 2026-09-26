import confetti from 'canvas-confetti';

export interface FloatingCallout {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  scale: number;
  color: string;
  lifetime: number;
}

export interface StarBurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

let calloutIdCounter = 1;

export class JuiceController {
  private shakeTimeRemaining: number = 0;
  private shakeIntensity: number = 0;
  private callouts: FloatingCallout[] = [];
  private particles: StarBurstParticle[] = [];

  /**
   * Strictly clamped screen shake:
   * NEVER shake screen for routine events.
   * Clamped to MAX 2.0px intensity and 0.2s duration,
   * triggered ONLY upon final Colony Piñata / Boss explosion in late patrols (Level 5+).
   */
  public triggerClampedPiñataShake(patrolId: number): void {
    if (patrolId < 5) return; // Only in late patrols (Level 5+)
    this.shakeTimeRemaining = 0.2; // 0.2s strictly clamped
    this.shakeIntensity = 2.0;    // max 2.0px strictly clamped
  }

  public update(dt: number): { offsetX: number; offsetY: number } {
    let offsetX = 0;
    let offsetY = 0;

    if (this.shakeTimeRemaining > 0) {
      this.shakeTimeRemaining -= dt;
      const decay = Math.max(0, this.shakeTimeRemaining / 0.2);
      const currentAmp = this.shakeIntensity * decay;
      offsetX = (Math.random() * 2 - 1) * currentAmp;
      offsetY = (Math.random() * 2 - 1) * currentAmp;
    }

    // Update floating callouts
    for (let i = this.callouts.length - 1; i >= 0; i--) {
      const c = this.callouts[i];
      c.lifetime -= dt;
      c.y -= 45 * dt; // float upwards
      c.scale = Math.min(1.2, c.scale + dt * 0.4);
      c.alpha = Math.max(0, c.lifetime / 1.1);

      if (c.lifetime <= 0) {
        this.callouts.splice(i, 1);
      }
    }

    // Update particles
    for (let p = this.particles.length - 1; p >= 0; p--) {
      const part = this.particles[p];
      part.life -= dt;
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vy += 80 * dt; // slight gravity
      part.alpha = Math.max(0, part.life / 0.6);

      if (part.life <= 0) {
        this.particles.splice(p, 1);
      }
    }

    return { offsetX, offsetY };
  }

  public addCallout(text: string, x: number, y: number, color: string = '#ecfdf5'): void {
    this.callouts.push({
      id: calloutIdCounter++,
      text,
      x,
      y,
      alpha: 1.0,
      scale: 0.8,
      color,
      lifetime: 1.1
    });
  }

  public spawnStarBurst(x: number, y: number, color: string = '#fef08a', count: number = 8): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 60 + Math.random() * 90;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1.0,
        life: 0.6
      });
    }
  }

  public triggerConfettiCelebration(): void {
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#f43f5e', '#a855f7', '#fbbf24', '#38bdf8']
      });
    } catch {
      // Ignore if canvas-confetti is not in DOM
    }
  }

  public getCallouts(): readonly FloatingCallout[] {
    return this.callouts;
  }

  public getParticles(): readonly StarBurstParticle[] {
    return this.particles;
  }
}
