import {
  $timer,
  BpxDrawingPattern,
  BpxPatternColors,
  BpxRgbColor,
  BpxTimer,
} from "@beetpx/beetpx";
import { g } from "../globals";

export class Mode {
  #current: "regular" | "no_coins" | "no_memories" = "regular";

  #timer: BpxTimer | null = null;

  isNoCoins(): boolean {
    return this.#current === "no_coins";
  }

  isNoMemories(): boolean {
    return this.#current === "no_memories";
  }

  noMemoriesModeFramesLeft(): number {
    return this.#current === "no_memories" ? this.#timer?.framesLeft ?? 0 : 0;
  }

  startNoCoins(): void {
    this.#current = "no_coins";
    this.#timer = $timer(90);
  }

  startNoMemories(): void {
    this.#current = "no_memories";
    this.#timer = $timer(150);
  }

  label(): string | null {
    switch (this.#current) {
      case "no_coins":
        return "cannot collect coins";
      case "no_memories":
        return "invulnerable";
      default:
        return null;
    }
  }

  progressColor(): BpxRgbColor {
    switch (this.#current) {
      case "no_coins":
        return g.colors.bgColorModeNoCoins;
      case "no_memories":
        return g.colors.bgColorModeNoMemories;
      default:
        return g.colors.bgColorModeNormal;
    }
  }

  bgColor(): BpxRgbColor | BpxPatternColors {
    switch (this.#current) {
      case "no_coins":
        return BpxPatternColors.of(
          g.colors.bgColorModeNoCoins,
          g.colors.bgColorModeNormal,
        );
      case "no_memories":
        return BpxPatternColors.of(
          g.colors.bgColorModeNoMemories,
          g.colors.bgColorModeNormal,
        );
      default:
        return g.colors.bgColorModeNormal;
    }
  }

  bgPattern(): BpxDrawingPattern {
    if (this.#current == "regular") {
      return BpxDrawingPattern.primaryOnly;
    }

    let ttlDistanceFromStartToEnd = Math.min(
      this.#timer?.t ?? 9999,
      this.#timer?.framesLeft ?? 9999,
    );

    switch (ttlDistanceFromStartToEnd) {
      case 0:
        return BpxDrawingPattern.from(`
          ----
          ----
          -#--
          ----
        `);
      case 1:
        return BpxDrawingPattern.from(`
          -#-#
          ----
          -#-#
          ----
        `);
      case 2:
        return BpxDrawingPattern.from(`
          -#-#
          #-#-
          -#-#
          #-#-
        `);
      case 3:
        return BpxDrawingPattern.from(`
          ####
          #-#-
          ####
          #-#-
        `);
      case 4:
        return BpxDrawingPattern.from(`
          ####
          ####
          ####
          ###-
        `);
      default:
        return BpxDrawingPattern.primaryOnly;
    }
  }

  percentageLeft(): number {
    switch (this.#current) {
      case "no_coins":
      case "no_memories":
        return 100 * (1 - (this.#timer?.progress ?? 1));
      default:
        return 0;
    }
  }

  update(callbacks: { onBackToRegularMode: () => void }): void {
    if (this.#timer?.hasJustFinished) {
      this.#current = "regular";
      callbacks.onBackToRegularMode();
    }
  }
}
