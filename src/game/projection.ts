export interface ViewportConfig {
  screenWidth: number;
  screenHeight: number;
  squadScreenY: number;
  perspectiveFactor: number;
}

export class Projection25D {
  config: ViewportConfig;

  constructor(width: number = 480, height: number = 850) {
    this.config = {
      screenWidth: width,
      screenHeight: height,
      squadScreenY: height * 0.72,
      perspectiveFactor: 0.00018
    };
  }

  resize(width: number, height: number): void {
    this.config.screenWidth = width;
    this.config.screenHeight = height;
    this.config.squadScreenY = height * 0.72;
  }

  /**
   * Projects simulation coordinate (worldX, worldY) to screen coordinate (screenX, screenY, scale, depth)
   * relative to current squad anchor (squadX, squadY)
   */
  project(worldX: number, worldY: number, squadY: number): {
    x: number;
    y: number;
    scale: number;
    visible: boolean;
  } {
    const relY = worldY - squadY;
    const screenCenterY = this.config.squadScreenY;
    const screenY = screenCenterY - relY;

    // Perspective foreshortening: entities further ahead look slightly smaller
    const distanceFactor = Math.max(-200, Math.min(1200, relY));
    const depthScale = Math.max(0.68, Math.min(1.15, 1.0 - distanceFactor * this.config.perspectiveFactor));

    const screenCenterX = this.config.screenWidth * 0.5;
    const screenX = screenCenterX + worldX * depthScale;

    // Visibility test
    const isVisible = screenY >= -150 && screenY <= this.config.screenHeight + 150;

    return {
      x: screenX,
      y: screenY,
      scale: depthScale,
      visible: isVisible
    };
  }
}
