import { BpxPattern, BpxPatternColors, BpxRgbColor } from "@beetpx/beetpx";
import { g } from "../globals";

export class Mode {
  #current: "regular" | "no_coins" | "no_memories" = "regular";

  #ttl = 0;

  #ttlMax(): number {
    switch (this.#current) {
      case "no_coins":
        return 90;
      case "no_memories":
        return 150;
      default:
        // Any value, safe to use as in divisions. In theory, this code won't be reached.
        return 1;
    }
  }

  isNoCoins(): boolean {
    return this.#current === "no_coins";
  }

  isNoMemories(): boolean {
    return this.#current === "no_memories";
  }

  noMemoriesModeFramesLeft(): number {
    return this.#current === "no_memories" ? this.#ttl : 0;
  }

  startNoCoins(): void {
    this.#current = "no_coins";
    this.#ttl = this.#ttlMax();
  }

  startNoMemories(): void {
    this.#current = "no_memories";
    this.#ttl = this.#ttlMax();
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
          g.colors.bgColorModeNormal
        );
      case "no_memories":
        return BpxPatternColors.of(
          g.colors.bgColorModeNoMemories,
          g.colors.bgColorModeNormal
        );
      default:
        return g.colors.bgColorModeNormal;
    }
  }

  bgPattern(): BpxPattern {
    if (this.#current == "regular") {
      return BpxPattern.primaryOnly;
    }

    const ttlMax = this.#ttlMax();
    let ttlDistanceFromStartToEnd = Math.min(this.#ttl, ttlMax - this.#ttl);

    switch (ttlDistanceFromStartToEnd) {
      case 0:
        return BpxPattern.from(`
          ----
          ----
          -#--
          ----
        `);
      case 1:
        return BpxPattern.from(`
          -#-#
          ----
          -#-#
          ----
        `);
      case 2:
        return BpxPattern.from(`
          -#-#
          #-#-
          -#-#
          #-#-
        `);
      case 3:
        return BpxPattern.from(`
          ####
          #-#-
          ####
          #-#-
        `);
      case 4:
        return BpxPattern.from(`
          ####
          ####
          ####
          ###-
        `);
      default:
        return BpxPattern.primaryOnly;
    }
  }

  percentageLeft(): number {
    switch (this.#current) {
      case "no_coins":
        return (100 * this.#ttl) / this.#ttlMax();
      case "no_memories":
        return (100 * this.#ttl) / this.#ttlMax();
      default:
        return 0;
    }
  }

  update(callbacks: { onBackToRegularMode: () => void }): void {
    if (this.#current != "regular" && this.#ttl <= 0) {
      this.#current = "regular";
      callbacks.onBackToRegularMode();
    }
    if (this.#ttl > 0) {
      this.#ttl -= 1;
    }
  }
}
